import { ASSETS } from '../config/assets';

/**
 * All sound is synthesised with the Web Audio API: an original, laid-back
 * 70s/80s style groove (electric piano, bass, drums, a little lead) plus the
 * sound effects (tape click, VCR clunk, CRT static...). No media files needed.
 *
 * Browsers only allow audio after a user gesture, so nothing plays until
 * `unlock()` is called from the first click/key press.
 */
export type SoundName = 'cassetteClick' | 'vhsInsert' | 'tvStatic' | 'buttonClick' | 'crtPowerOn' | 'vhsRewind';

const BPM = 98;
const STEP = 60 / BPM / 4; // one 16th note
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

/** Two bars per chord: Am7, D9, Fmaj7, E7. */
const CHORDS = [
  { notes: [57, 60, 64, 67], bass: 45 },
  { notes: [54, 60, 64, 69], bass: 38 },
  { notes: [53, 57, 60, 64], bass: 41 },
  { notes: [52, 56, 59, 62], bass: 40 },
];
/** A short answering phrase in the second bar of every chord: [step, note, length in steps]. */
const LEAD: [number, number, number][][] = [
  [[0, 76, 3], [4, 74, 2], [6, 72, 2], [8, 69, 4], [12, 72, 3]],
  [[0, 74, 3], [4, 76, 2], [6, 78, 2], [8, 81, 6]],
  [[0, 77, 3], [4, 76, 2], [6, 72, 2], [8, 69, 6]],
  [[0, 71, 2], [2, 74, 2], [4, 76, 2], [6, 80, 4], [12, 76, 3]],
];
const KEYS_STEPS = [0, 6, 10];
const BASS: [number, number][] = [ // [step, semitone offset from the root]
  [0, 0], [3, 0], [6, 7], [8, 12], [10, 7], [13, 0], [14, 10],
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private noise!: AudioBuffer;
  private enabled: boolean;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private fileMusic: HTMLAudioElement | null = null;

  constructor() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('sound');
    } catch {
      /* storage blocked */
    }
    this.enabled = saved !== '0';
  }

  isEnabled() {
    return this.enabled;
  }

  /** Call from a user gesture. Creates the audio graph and starts the music if sound is on. */
  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.buildGraph(this.ctx);
      this.master.gain.value = this.enabled ? 0.9 : 0;
    }
    void this.ctx.resume();
    if (this.enabled) this.startMusic();
  }

  /** master -> compressor -> speakers; music through a warm low-pass; effects on their own bus. */
  private buildGraph(ctx: BaseAudioContext) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master = ctx.createGain();
    this.master.connect(comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.22;
    const warm = ctx.createBiquadFilter();
    warm.type = 'lowpass';
    warm.frequency.value = 5200;
    this.musicBus.connect(warm).connect(this.master);
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.5;
    this.sfxBus.connect(this.master);
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  /**
   * Render the soundtrack offline (used to put the site's own music and effects on a
   * promo video, frame-accurately): music for `seconds`, effects at the given times,
   * music ducking on/off at the given times, and a fade-out at the end.
   */
  async renderOffline(seconds: number, cues: [SoundName, number][], ducks: [boolean, number][] = []) {
    const saved = { ctx: this.ctx, master: this.master, musicBus: this.musicBus, sfxBus: this.sfxBus, noise: this.noise, enabled: this.enabled };
    const off = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100);
    this.ctx = off as unknown as AudioContext;
    this.enabled = true;
    this.buildGraph(off);
    this.master.gain.setValueAtTime(0.9, 0);
    for (let t = 0.05, step = 0; t < seconds; t += STEP, step = (step + 1) % 128) this.playStep(step, t);
    for (const [on, at] of ducks) this.musicBus.gain.setTargetAtTime(on ? 0.1 : 0.22, at, 0.4);
    for (const [name, at] of cues) this.play(name, at);
    this.master.gain.setValueAtTime(0.9, Math.max(0, seconds - 2.2));
    this.master.gain.linearRampToValueAtTime(0.0001, seconds);
    try {
      return await off.startRendering();
    } finally {
      Object.assign(this, saved);
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem('sound', on ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (!this.ctx) {
      if (on) this.unlock();
      return;
    }
    this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.08);
    if (on) this.startMusic();
    else this.stopMusic();
  }

  /** Music a little quieter while a tape is playing on the TV. */
  duck(on: boolean) {
    if (!this.ctx) return;
    this.musicBus.gain.setTargetAtTime(on ? 0.1 : 0.22, this.ctx.currentTime, 0.4);
    if (this.fileMusic) this.fileMusic.volume = on ? 0.15 : 0.35;
  }

  // ------------------------------------------------------------- music

  private startMusic() {
    if (ASSETS.audio.musicFile) {
      this.fileMusic ??= Object.assign(new Audio(ASSETS.audio.musicFile), { loop: true, volume: 0.35 });
      this.fileMusic.play().catch(() => undefined);
      return;
    }
    if (this.timer || !this.ctx) return;
    this.nextTime = this.ctx.currentTime + 0.1;
    this.step = 0;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  private stopMusic() {
    this.fileMusic?.pause();
    window.clearInterval(this.timer);
    this.timer = 0;
  }

  /** Look-ahead scheduler: queue every 16th note that starts in the next 150 ms. */
  private schedule() {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.15) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step = (this.step + 1) % (16 * 8);
    }
  }

  private playStep(step: number, t: number) {
    const bar = Math.floor(step / 16);
    const s = step % 16;
    const chord = CHORDS[Math.floor(bar / 2)];
    // drums: kick, snare on 2 and 4, swung hats
    if (s === 0 || s === 8 || (s === 10 && bar % 2 === 1)) this.kick(t);
    if (s === 4 || s === 12) this.snare(t);
    if (s % 2 === 0) this.hat(t + (s % 4 === 2 ? STEP * 0.12 : 0), s === 14 ? 0.18 : 0.04);
    // bass
    for (const [bs, off] of BASS) if (bs === s) this.bass(midi(chord.bass + off), t, STEP * 1.6);
    // electric piano comping
    if (KEYS_STEPS.includes(s)) chord.notes.forEach((n) => this.keys(midi(n), t, STEP * (s === 0 ? 5 : 3)));
    // lead answers in the second bar of each chord
    if (bar % 2 === 1) for (const [ls, n, len] of LEAD[Math.floor(bar / 2)]) if (ls === s) this.lead(midi(n), t, STEP * len);
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  private keys(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    this.env(g, t, 0.07, 0.006, dur + 0.25);
    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = f;
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = f * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    o1.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.musicBus);
    for (const o of [o1, o2]) {
      o.start(t);
      o.stop(t + dur + 0.3);
    }
  }

  private bass(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    const g = ctx.createGain();
    this.env(g, t, 0.5, 0.008, dur);
    o.connect(lp).connect(g).connect(this.musicBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private lead(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.5;
    const vibAmt = ctx.createGain();
    vibAmt.gain.value = f * 0.006;
    vib.connect(vibAmt).connect(o.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.linearRampToValueAtTime(2200, t + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.03);
    g.gain.setValueAtTime(0.06, t + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
    o.connect(lp).connect(g).connect(this.musicBus);
    for (const x of [o, vib]) {
      x.start(t);
      x.stop(t + dur + 0.2);
    }
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    this.env(g, t, 0.9, 0.002, 0.22);
    o.connect(g).connect(this.musicBus);
    o.start(t);
    o.stop(t + 0.3);
  }

  private noiseHit(t: number, type: BiquadFilterType, freq: number, peak: number, decay: number, bus: GainNode) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ctx.createGain();
    this.env(g, t, peak, 0.002, decay);
    src.connect(f).connect(g).connect(bus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + decay + 0.05);
  }

  private snare(t: number) {
    this.noiseHit(t, 'bandpass', 1900, 0.35, 0.16, this.musicBus);
  }

  private hat(t: number, decay: number) {
    this.noiseHit(t, 'highpass', 7500, 0.12, decay, this.musicBus);
  }

  // ------------------------------------------------------------- effects

  play(name: SoundName, at?: number) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = at ?? ctx.currentTime + 0.01;
    switch (name) {
      case 'cassetteClick':
      case 'buttonClick':
        this.noiseHit(t, 'highpass', 3000, 0.5, 0.03, this.sfxBus);
        break;
      case 'vhsInsert': {
        // plastic slide + mechanical clunk
        this.noiseHit(t, 'bandpass', 900, 0.25, 0.35, this.sfxBus);
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(90, t + 0.38);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.5);
        const g = ctx.createGain();
        this.env(g, t + 0.38, 0.8, 0.003, 0.18);
        o.connect(g).connect(this.sfxBus);
        o.start(t + 0.38);
        o.stop(t + 0.6);
        this.noiseHit(t + 0.38, 'lowpass', 1200, 0.5, 0.08, this.sfxBus);
        break;
      }
      case 'tvStatic':
        this.noiseHit(t, 'bandpass', 3500, 0.28, 1.4, this.sfxBus);
        break;
      case 'crtPowerOn': {
        const o = ctx.createOscillator();
        o.frequency.value = 7800;
        const g = ctx.createGain();
        this.env(g, t, 0.05, 0.02, 0.6);
        o.connect(g).connect(this.sfxBus);
        o.start(t);
        o.stop(t + 0.7);
        this.noiseHit(t, 'lowpass', 400, 0.6, 0.12, this.sfxBus);
        break;
      }
      case 'vhsRewind': {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(200, t);
        o.frequency.exponentialRampToValueAtTime(900, t + 0.5);
        const lp = ctx.createBiquadFilter();
        lp.frequency.value = 1500;
        const g = ctx.createGain();
        this.env(g, t, 0.08, 0.05, 0.5);
        o.connect(lp).connect(g).connect(this.sfxBus);
        o.start(t);
        o.stop(t + 0.6);
        break;
      }
    }
  }
}

export const sfx = new AudioEngine();

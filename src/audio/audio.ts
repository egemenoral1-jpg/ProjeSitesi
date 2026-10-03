import { ASSETS, type SoundName } from '../config/assets';

/**
 * Optional sound effects. Off by default: nothing is requested or played until
 * the visitor presses the sound toggle (a user gesture), so browsers never
 * block it. Missing files fail silently.
 */
class Sfx {
  private enabled = false;
  private cache = new Map<SoundName, HTMLAudioElement>();
  private ambience: HTMLAudioElement | null = null;

  isEnabled() {
    return this.enabled;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem('sfx', on ? '1' : '0');
    } catch {
      /* storage may be unavailable */
    }
    if (on) {
      this.ambience ??= this.make('ambience', true);
      this.ambience?.play().catch(() => undefined);
    } else {
      this.ambience?.pause();
    }
  }

  private make(name: SoundName, loop = false) {
    try {
      const a = new Audio(ASSETS.audio[name]);
      a.loop = loop;
      a.volume = loop ? 0.25 : 0.6;
      a.addEventListener('error', () => undefined);
      return a;
    } catch {
      return null;
    }
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    let a = this.cache.get(name);
    if (!a) {
      const made = this.make(name);
      if (!made) return;
      a = made;
      this.cache.set(name, a);
    }
    a.currentTime = 0;
    a.play().catch(() => undefined);
  }
}

export const sfx = new Sfx();

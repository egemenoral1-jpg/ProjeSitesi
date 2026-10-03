import * as THREE from 'three';

export type TVPhase = 'off' | 'black' | 'static' | 'noise' | 'glitch' | 'tracking' | 'project' | 'shutdown';

/**
 * The picture on the CRT, drawn on a small canvas every few frames.
 * 'off' is the idle state: grey snow, like a TV with no tape in.
 */
export class ScreenTexture {
  readonly texture: THREE.CanvasTexture;
  private readonly c: HTMLCanvasElement;
  private readonly g: CanvasRenderingContext2D;
  private readonly noise: ImageData;
  private readonly px: Uint32Array;
  phase: TVPhase = 'off';
  private phaseStart = 0;
  private last = 0;

  constructor() {
    this.c = document.createElement('canvas');
    this.c.width = 256;
    this.c.height = 192;
    this.g = this.c.getContext('2d')!;
    this.noise = this.g.createImageData(256, 192);
    this.px = new Uint32Array(this.noise.data.buffer);
    this.texture = new THREE.CanvasTexture(this.c);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.magFilter = THREE.NearestFilter;
  }

  setPhase(p: TVPhase) {
    this.phase = p;
    this.phaseStart = performance.now();
    this.last = 0;
  }

  /** Brightness of the picture, used to drive the glow light in the room. */
  brightness() {
    switch (this.phase) {
      case 'off':
        return 0.55;
      case 'black':
        return 0.05;
      case 'static':
        return 0.85;
      case 'noise':
      case 'glitch':
        return 0.7;
      case 'tracking':
      case 'project':
        return 0.5;
      default:
        return 0.3;
    }
  }

  update(now: number) {
    if (now - this.last < 45) return; // ~22 fps is plenty for analog snow
    this.last = now;
    const { g } = this;
    const t = (now - this.phaseStart) / 1000;
    switch (this.phase) {
      case 'off':
        this.snow(0.62, 0, 0);
        break;
      case 'black':
        g.fillStyle = '#000';
        g.fillRect(0, 0, 256, 192);
        if (t < 0.12) {
          g.fillStyle = `rgba(255,255,255,${0.7 - t * 5})`;
          g.fillRect(0, 0, 256, 192);
        }
        break;
      case 'static':
        this.snow(1, 0, 0);
        break;
      case 'noise':
        this.snow(0.75, 40, 1);
        this.tears(4);
        break;
      case 'glitch':
        this.snow(0.5, 70, 0.6);
        this.bars();
        this.tears(7);
        break;
      case 'tracking':
        g.fillStyle = '#07211d';
        g.fillRect(0, 0, 256, 192);
        this.band(t);
        this.tears(2);
        break;
      case 'project':
        g.fillStyle = '#06191a';
        g.fillRect(0, 0, 256, 192);
        break;
      case 'shutdown': {
        g.fillStyle = '#000';
        g.fillRect(0, 0, 256, 192);
        const p = Math.min(1, t / 0.5);
        const h = Math.max(1, 192 * (1 - p) * (1 - p) * 0.9);
        const w = p < 0.6 ? 256 : 256 * (1 - (p - 0.6) / 0.4);
        g.fillStyle = '#e9fff6';
        g.fillRect(128 - w / 2, 96 - h / 2, w, h);
        break;
      }
    }
    this.texture.needsUpdate = true;
  }

  private snow(level: number, tintB: number, jitter: number) {
    const { px } = this;
    for (let i = 0; i < px.length; i++) {
      const v = (Math.random() * 255 * level) | 0;
      const b = Math.min(255, v + tintB);
      px[i] = 0xff000000 | (b << 16) | (v << 8) | v;
    }
    this.g.putImageData(this.noise, jitter ? ((Math.random() - 0.5) * 8) | 0 : 0, 0);
  }

  private tears(n: number) {
    const { g } = this;
    for (let i = 0; i < n; i++) {
      const y = Math.random() * 192;
      g.drawImage(this.c, 0, y, 256, 6, (Math.random() - 0.5) * 30, y, 256, 6);
    }
  }

  private bars() {
    const { g } = this;
    const colors = ['rgba(255,40,80,.35)', 'rgba(40,200,255,.35)', 'rgba(255,240,80,.3)'];
    for (let i = 0; i < 3; i++) {
      g.fillStyle = colors[i];
      g.fillRect(0, Math.random() * 192, 256, 8 + Math.random() * 20);
    }
  }

  private band(t: number) {
    const { g } = this;
    const y = ((t * 140) % 260) - 30;
    const grad = g.createLinearGradient(0, y - 20, 0, y + 20);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, y - 20, 256, 40);
  }
}

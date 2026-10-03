import * as THREE from 'three';
import { ASSETS } from '../config/assets';

/** Canvas-drawn textures, so the room needs no image files. */

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function toTexture(c: HTMLCanvasElement, repeat?: [number, number]) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

/** Deterministic pseudo random so textures look the same on every load. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export async function loadFonts() {
  if (!document.fonts) return;
  await Promise.race([
    Promise.all([document.fonts.load(`64px "${ASSETS.fonts.label}"`), document.fonts.load(`32px "${ASSETS.fonts.tv}"`)]),
    new Promise((r) => setTimeout(r, 2500)),
  ]).catch(() => undefined);
}

/** Purple wallpaper with soft vertical stripes and a little grain. */
export function wallpaperTexture() {
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#5f4f86';
  g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) {
    g.fillStyle = 'rgba(255,255,255,0.035)';
    g.fillRect(x, 0, 30, 512);
    g.fillStyle = 'rgba(0,0,0,0.05)';
    g.fillRect(x + 30, 0, 2, 512);
  }
  const r = rng(7);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},${0.025 * r()})`;
    g.fillRect(r() * 512, r() * 512, 2, 2);
  }
  return toTexture(c, [6, 3]);
}

/** Warm wood with grain lines, for the table. */
export function woodTexture() {
  const [c, g] = canvas(1024, 256);
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#c58d55');
  grad.addColorStop(1, '#b27a45');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 256);
  const r = rng(11);
  for (let i = 0; i < 70; i++) {
    const y = r() * 256;
    g.strokeStyle = `rgba(90,50,20,${0.08 + r() * 0.14})`;
    g.lineWidth = 1 + r() * 2.5;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x / (80 + r() * 60) + i) * (3 + r() * 5));
    g.stroke();
  }
  return toTexture(c, [2, 1]);
}

/** Dark floor boards. */
export function floorTexture() {
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#3b2c27';
  g.fillRect(0, 0, 512, 512);
  const r = rng(3);
  for (let y = 0; y < 512; y += 64) {
    g.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.03})`;
    g.fillRect(0, y, 512, 60);
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.fillRect(0, y + 60, 512, 4);
    const cut = r() * 512;
    g.fillRect(cut, y, 3, 64);
  }
  return toTexture(c, [8, 8]);
}

/** Front (label side) of a cassette: black plastic with the coloured label and hand-lettered title. */
export function tapeLabelTexture(label: string, color: string) {
  const W = 1040;
  const H = 200;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#18181d';
  g.fillRect(0, 0, W, H);
  const pad = 34;
  const lx = pad;
  const ly = 24;
  const lw = W - pad * 2;
  const lh = H - 52;
  g.fillStyle = color;
  roundRect(g, lx, ly, lw, lh, 14);
  g.fill();
  g.lineWidth = 9;
  g.strokeStyle = '#111114';
  g.stroke();
  // subtle paper highlight
  g.fillStyle = 'rgba(255,255,255,0.12)';
  roundRect(g, lx + 8, ly + 8, lw - 16, 16, 8);
  g.fill();

  const font = ASSETS.fonts.label;
  let size = 112;
  g.font = `${size}px "${font}", Impact, sans-serif`;
  while (g.measureText(label).width > lw - 70 && size > 40) {
    size -= 4;
    g.font = `${size}px "${font}", Impact, sans-serif`;
  }
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const tx = W / 2;
  const ty = ly + lh / 2 + 4;
  g.lineJoin = 'round';
  g.fillStyle = '#111114';
  g.fillText(label, tx + 5, ty + 7); // drop shadow
  g.lineWidth = size * 0.16;
  g.strokeStyle = '#111114';
  g.strokeText(label, tx, ty);
  g.fillStyle = '#ffffff';
  g.fillText(label, tx, ty);
  return toTexture(c);
}

/** Top of a cassette: two reel windows and a small paper label, like a real VHS. */
export function tapeTopTexture() {
  const W = 1040;
  const H = 600;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#232329';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#1b1b20';
  g.fillRect(0, H * 0.82, W, H * 0.18);
  const win = (x: number) => {
    g.fillStyle = '#0d0d10';
    roundRect(g, x, 120, 300, 230, 110);
    g.fill();
    g.fillStyle = '#d9d9df';
    g.beginPath();
    g.ellipse(x + 150, 235, 70, 70, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#3a3a42';
    g.beginPath();
    g.ellipse(x + 150, 235, 26, 26, 0, 0, Math.PI * 2);
    g.fill();
  };
  win(70);
  win(W - 370);
  g.fillStyle = '#ececf0';
  roundRect(g, 405, 90, 230, 300, 10);
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    g.beginPath();
    g.moveTo(430, 140 + i * 40);
    g.lineTo(610, 140 + i * 40);
    g.stroke();
  }
  return toTexture(c);
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

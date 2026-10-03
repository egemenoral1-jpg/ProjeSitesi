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

/** Flat cream wall paint with a very faint brush texture. */
export function wallTexture() {
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#f8e7cb';
  g.fillRect(0, 0, 512, 512);
  const r = rng(7);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '170,120,60'},${0.03 * r()})`;
    g.fillRect(r() * 512, r() * 512, 2 + r() * 40, 1 + r() * 3);
  }
  return toTexture(c, [4, 2]);
}

/** Warm wood with grain lines, for the TV cabinet. */
export function woodTexture() {
  const [c, g] = canvas(1024, 256);
  g.fillStyle = '#9a6640';
  g.fillRect(0, 0, 1024, 256);
  const r = rng(11);
  for (let i = 0; i < 46; i++) {
    const y = r() * 256;
    g.strokeStyle = `rgba(70,38,16,${0.1 + r() * 0.16})`;
    g.lineWidth = 1 + r() * 2.5;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x / (80 + r() * 60) + i) * (3 + r() * 5));
    g.stroke();
  }
  return toTexture(c, [1, 1]);
}

/** Pale green carpet like the show's living room. */
export function carpetTexture() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#a9c48a';
  g.fillRect(0, 0, 256, 256);
  const r = rng(3);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? '255,255,240' : '60,90,40'},${0.05 + r() * 0.06})`;
    g.fillRect(r() * 256, r() * 256, 1.5, 1.5);
  }
  return toTexture(c, [10, 10]);
}

/** The framed drawing on the wall: a quick pencil sketch of a bird in a top hat. */
export function pictureTexture() {
  const [c, g] = canvas(320, 400);
  g.fillStyle = '#fbfaf4';
  g.fillRect(0, 0, 320, 400);
  g.strokeStyle = '#3a3a46';
  g.lineWidth = 4;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  // top hat
  g.strokeRect(122, 70, 76, 70);
  g.beginPath();
  g.moveTo(96, 140);
  g.lineTo(224, 140);
  g.stroke();
  // round head and big eyes
  g.beginPath();
  g.ellipse(160, 200, 62, 56, 0, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(140, 190, 12, 0, Math.PI * 2);
  g.arc(184, 190, 12, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#3a3a46';
  g.beginPath();
  g.arc(143, 192, 4, 0, Math.PI * 2);
  g.arc(187, 192, 4, 0, Math.PI * 2);
  g.fill();
  // beak and a big moustache-like smile
  g.beginPath();
  g.moveTo(160, 205);
  g.lineTo(150, 232);
  g.lineTo(172, 232);
  g.closePath();
  g.stroke();
  // body, lollipop
  g.beginPath();
  g.moveTo(130, 252);
  g.quadraticCurveTo(160, 360, 190, 252);
  g.moveTo(205, 270);
  g.lineTo(245, 230);
  g.stroke();
  g.beginPath();
  g.arc(252, 222, 14, 0, Math.PI * 2);
  g.stroke();
  g.font = '22px "Chewy", sans-serif';
  g.fillText('E.O.', 250, 380);
  return toTexture(c);
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

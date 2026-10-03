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

/**
 * The framed drawing on the wall: a pencil sketch of Pops from Regular Show -
 * big round lollipop head, tall top hat, curly moustache, bow tie and suit.
 */
export function pictureTexture() {
  const [c, g] = canvas(320, 400);
  g.fillStyle = '#fbfaf4';
  g.fillRect(0, 0, 320, 400);
  const ink = '#33323d';
  g.strokeStyle = ink;
  g.fillStyle = ink;
  g.lineWidth = 3.5;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const line = (pts: number[]) => {
    g.beginPath();
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    g.stroke();
  };

  // suit: narrow shoulders, long body, lapels
  g.beginPath();
  g.moveTo(118, 262);
  g.quadraticCurveTo(160, 248, 202, 262);
  g.lineTo(214, 392);
  g.moveTo(118, 262);
  g.lineTo(106, 392);
  g.stroke();
  line([146, 256, 160, 300, 174, 256]);
  line([160, 300, 160, 392]);
  // bow tie
  g.beginPath();
  g.moveTo(160, 252);
  g.lineTo(140, 242);
  g.lineTo(140, 262);
  g.closePath();
  g.moveTo(160, 252);
  g.lineTo(180, 242);
  g.lineTo(180, 262);
  g.closePath();
  g.fill();
  // thin neck
  line([154, 226, 154, 246]);
  line([166, 226, 166, 246]);

  // big round head
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(160, 160, 76, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = ink;

  // tall top hat sitting on top of the head
  g.beginPath();
  g.rect(132, 34, 56, 58);
  g.stroke();
  g.fillRect(132, 76, 56, 9);
  line([112, 92, 208, 92]);

  // small happy eyes, little nose
  g.beginPath();
  g.arc(140, 150, 5, 0, Math.PI * 2);
  g.arc(180, 150, 5, 0, Math.PI * 2);
  g.fill();
  line([132, 136, 146, 133]);
  line([174, 133, 188, 136]);
  g.beginPath();
  g.arc(160, 168, 6, 0, Math.PI * 2);
  g.stroke();

  // the famous curly moustache
  g.beginPath();
  g.moveTo(160, 180);
  g.bezierCurveTo(146, 172, 124, 176, 116, 190);
  g.bezierCurveTo(112, 198, 118, 204, 124, 198);
  g.moveTo(160, 180);
  g.bezierCurveTo(174, 172, 196, 176, 204, 190);
  g.bezierCurveTo(208, 198, 202, 204, 196, 198);
  g.stroke();
  // smile
  g.beginPath();
  g.arc(160, 192, 18, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();

  // a lollipop in his hand
  line([210, 300, 250, 250]);
  g.beginPath();
  g.arc(258, 240, 15, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(258, 240, 7, 0, Math.PI * 1.6);
  g.stroke();

  g.font = '20px "Chewy", sans-serif';
  g.fillText('Jolly good show!', 18, 30);
  g.fillText('E.O.', 262, 386);
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

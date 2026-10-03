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
 * The framed portrait on the wall: Pops from Regular Show, painted in full colour in
 * the show's flat, outlined style - big round head, top hat, curly moustache,
 * tuxedo with a bow tie, and a lollipop.
 */
export function pictureTexture() {
  const W = 640;
  const H = 800;
  const [c, g] = canvas(W, H);
  const ink = '#26232c';
  const outlined = (fill: string, width = 7) => {
    g.fillStyle = fill;
    g.fill();
    g.lineWidth = width;
    g.strokeStyle = ink;
    g.stroke();
  };
  g.lineJoin = 'round';
  g.lineCap = 'round';

  // studio backdrop
  const bg = g.createRadialGradient(W / 2, 330, 60, W / 2, 400, 520);
  bg.addColorStop(0, '#bfe0e6');
  bg.addColorStop(1, '#7fb1c2');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // tuxedo: shoulders, white shirt, lapels
  g.beginPath();
  g.moveTo(90, H + 10);
  g.quadraticCurveTo(110, 600, 230, 575);
  g.lineTo(410, 575);
  g.quadraticCurveTo(530, 600, 550, H + 10);
  g.closePath();
  outlined('#2b2a33');
  g.beginPath();
  g.moveTo(262, 575);
  g.lineTo(320, 760);
  g.lineTo(378, 575);
  g.closePath();
  outlined('#fbfaf6', 5);
  g.beginPath();
  g.moveTo(232, 578);
  g.lineTo(300, 700);
  g.lineTo(262, 576);
  g.moveTo(408, 578);
  g.lineTo(340, 700);
  g.lineTo(378, 576);
  outlined('#1d1c23', 4);
  // buttons
  g.fillStyle = ink;
  for (const y of [665, 705]) {
    g.beginPath();
    g.arc(320, y, 6, 0, Math.PI * 2);
    g.fill();
  }

  // thin neck
  g.beginPath();
  g.rect(300, 500, 40, 90);
  outlined('#f3ebdf', 5);

  // red bow tie
  g.beginPath();
  g.moveTo(320, 590);
  g.lineTo(268, 562);
  g.lineTo(268, 618);
  g.closePath();
  g.moveTo(320, 590);
  g.lineTo(372, 562);
  g.lineTo(372, 618);
  g.closePath();
  outlined('#c8343c', 5);
  g.beginPath();
  g.arc(320, 590, 11, 0, Math.PI * 2);
  outlined('#a62930', 4);

  // the big round lollipop-like head
  g.beginPath();
  g.arc(320, 330, 182, 0, Math.PI * 2);
  outlined('#f6eee3', 8);
  // soft shading on the lower side
  g.save();
  g.clip();
  g.fillStyle = 'rgba(190,160,140,0.18)';
  g.beginPath();
  g.ellipse(360, 440, 190, 110, -0.3, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.beginPath();
  g.arc(320, 330, 182, 0, Math.PI * 2);
  g.lineWidth = 8;
  g.strokeStyle = ink;
  g.stroke();

  // rosy cheeks
  g.fillStyle = 'rgba(240,140,150,0.45)';
  for (const x of [222, 418]) {
    g.beginPath();
    g.ellipse(x, 372, 34, 22, 0, 0, Math.PI * 2);
    g.fill();
  }

  // eyes and brows
  g.fillStyle = ink;
  for (const x of [262, 378]) {
    g.beginPath();
    g.ellipse(x, 300, 12, 17, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(x + 4, 293, 4, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = ink;
  }
  g.lineWidth = 6;
  g.strokeStyle = ink;
  for (const [x, d] of [[262, -1], [378, 1]] as const) {
    g.beginPath();
    g.arc(x, 262, 26, Math.PI * (1.2 + (d > 0 ? 0.05 : -0.05)), Math.PI * (1.8 + (d > 0 ? 0.05 : -0.05)));
    g.stroke();
  }
  // small round nose
  g.beginPath();
  g.arc(320, 345, 15, 0, Math.PI * 2);
  outlined('#f1dccd', 5);

  // big curly black moustache
  g.beginPath();
  g.moveTo(320, 372);
  g.bezierCurveTo(290, 352, 230, 356, 205, 390);
  g.bezierCurveTo(192, 410, 208, 432, 226, 420);
  g.bezierCurveTo(214, 410, 220, 396, 236, 396);
  g.bezierCurveTo(262, 398, 292, 400, 320, 392);
  g.bezierCurveTo(348, 400, 378, 398, 404, 396);
  g.bezierCurveTo(420, 396, 426, 410, 414, 420);
  g.bezierCurveTo(432, 432, 448, 410, 435, 390);
  g.bezierCurveTo(410, 356, 350, 352, 320, 372);
  g.closePath();
  outlined('#2a2730', 5);

  // happy open smile
  g.beginPath();
  g.moveTo(268, 420);
  g.quadraticCurveTo(320, 478, 372, 420);
  g.quadraticCurveTo(320, 440, 268, 420);
  g.closePath();
  outlined('#8e2c3a', 5);

  // top hat sitting on top of the head
  g.beginPath();
  g.ellipse(320, 168, 120, 26, 0, 0, Math.PI * 2);
  outlined('#1d1c22', 6);
  g.beginPath();
  g.moveTo(244, 168);
  g.lineTo(254, 34);
  g.quadraticCurveTo(320, 18, 386, 34);
  g.lineTo(396, 168);
  g.quadraticCurveTo(320, 182, 244, 168);
  g.closePath();
  outlined('#1d1c22', 6);
  g.beginPath();
  g.moveTo(248, 128);
  g.quadraticCurveTo(320, 142, 392, 128);
  g.lineTo(394, 152);
  g.quadraticCurveTo(320, 166, 246, 152);
  g.closePath();
  outlined('#55535e', 4);
  g.strokeStyle = 'rgba(255,255,255,0.25)';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(272, 50);
  g.lineTo(266, 120);
  g.stroke();

  // swirly lollipop
  g.lineWidth = 9;
  g.strokeStyle = '#f2efe6';
  g.beginPath();
  g.moveTo(520, 760);
  g.lineTo(560, 560);
  g.stroke();
  g.beginPath();
  g.arc(566, 520, 50, 0, Math.PI * 2);
  outlined('#ffffff', 6);
  g.strokeStyle = '#e0457b';
  g.lineWidth = 12;
  g.beginPath();
  for (let a = 0; a < Math.PI * 6; a += 0.1) {
    const r = 4 + a * 2.2;
    const x = 566 + Math.cos(a) * r;
    const y = 520 + Math.sin(a) * r;
    if (a === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();
  g.beginPath();
  g.arc(566, 520, 50, 0, Math.PI * 2);
  g.lineWidth = 6;
  g.strokeStyle = ink;
  g.stroke();
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

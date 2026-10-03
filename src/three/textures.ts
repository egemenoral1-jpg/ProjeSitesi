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
 * The framed portrait on the wall: Pops from Regular Show in the show's flat,
 * outlined style - huge pink round head, tiny tilted top hat, big cream
 * moustache, thin body in a grey vest, one finger raised.
 */
export function pictureTexture() {
  const W = 640;
  const H = 800;
  const [c, g] = canvas(W, H);
  const ink = '#1f1d24';
  const shape = (fill: string, width = 6) => {
    g.fillStyle = fill;
    g.fill();
    g.lineWidth = width;
    g.strokeStyle = ink;
    g.stroke();
  };
  const path = (pts: number[], close = true) => {
    g.beginPath();
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    if (close) g.closePath();
  };
  g.lineJoin = 'round';
  g.lineCap = 'round';

  // plain light backdrop
  const bg = g.createRadialGradient(W / 2, 360, 80, W / 2, 400, 560);
  bg.addColorStop(0, '#fffdf8');
  bg.addColorStop(1, '#e9e4da');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  const skin = '#f6e4c4';
  const pants = '#4b4a52';

  // legs and shoes
  path([292, 610, 300, 610, 296, 760, 284, 760]);
  shape(pants, 5);
  path([340, 610, 350, 610, 356, 760, 344, 760]);
  shape(pants, 5);
  g.beginPath();
  g.ellipse(276, 768, 28, 11, 0, 0, Math.PI * 2);
  shape('#26252b', 4);
  g.beginPath();
  g.ellipse(362, 768, 28, 11, 0, 0, Math.PI * 2);
  shape('#26252b', 4);

  // left arm hanging down (cream sleeve, small hand)
  path([262, 470, 274, 472, 262, 600, 250, 598]);
  shape(skin, 5);
  g.beginPath();
  g.ellipse(255, 610, 13, 16, 0.2, 0, Math.PI * 2);
  shape(skin, 4);
  // right arm raised, index finger up
  path([366, 472, 378, 480, 512, 452, 506, 440]);
  shape(skin, 5);
  path([506, 440, 516, 448, 548, 392, 538, 386]);
  shape(skin, 5);
  g.beginPath();
  g.ellipse(545, 380, 14, 16, 0, 0, Math.PI * 2);
  shape(skin, 4);
  path([541, 368, 549, 368, 551, 330, 543, 330]);
  shape(skin, 4);
  g.beginPath();
  g.arc(547, 330, 4, Math.PI, 0);
  g.stroke();

  // thin torso: white shirt with a dark grey vest
  path([270, 470, 370, 470, 362, 620, 278, 620]);
  shape('#fbfaf5', 5);
  path([278, 478, 318, 470, 322, 620, 284, 620]);
  shape('#3e3d45', 5);
  path([362, 478, 322, 470, 318, 620, 356, 620]);
  shape('#3e3d45', 5);
  g.fillStyle = '#cfcbd6';
  for (const y of [520, 560, 600]) {
    g.beginPath();
    g.arc(320, y, 4, 0, Math.PI * 2);
    g.fill();
  }
  // neck
  path([308, 440, 332, 440, 330, 474, 310, 474]);
  shape(skin, 5);

  // the huge pink round head
  g.beginPath();
  g.arc(320, 250, 205, 0, Math.PI * 2);
  shape('#f8c4c6', 8);
  g.save();
  g.beginPath();
  g.arc(320, 250, 201, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = 'rgba(214,120,130,0.16)';
  g.beginPath();
  g.ellipse(380, 360, 210, 120, -0.4, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.beginPath();
  g.ellipse(240, 140, 60, 34, -0.6, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // tiny top hat, tilted, sitting on the upper left of the head
  g.save();
  g.translate(250, 60);
  g.rotate(-0.28);
  g.beginPath();
  g.ellipse(0, 0, 48, 11, 0, 0, Math.PI * 2);
  shape('#26252b', 5);
  path([-28, 0, -24, -62, 24, -62, 28, 0]);
  shape('#26252b', 5);
  path([-27, -14, 27, -14, 26, -24, -26, -24]);
  shape('#55535d', 3);
  g.restore();

  // small eyes looking up, tiny brows
  g.fillStyle = ink;
  for (const x of [286, 352]) {
    g.beginPath();
    g.ellipse(x, 236, 8, 11, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.lineWidth = 5;
  g.strokeStyle = ink;
  g.beginPath();
  g.moveTo(272, 212);
  g.lineTo(298, 206);
  g.moveTo(340, 206);
  g.lineTo(366, 212);
  g.stroke();

  // reddish little nose
  g.beginPath();
  g.ellipse(320, 268, 15, 12, 0, 0, Math.PI * 2);
  shape('#c1563f', 4);

  // big cream moustache with curled ends
  g.beginPath();
  g.moveTo(320, 280);
  g.bezierCurveTo(296, 270, 250, 276, 232, 300);
  g.bezierCurveTo(220, 318, 236, 340, 254, 328);
  g.bezierCurveTo(246, 318, 252, 306, 266, 308);
  g.bezierCurveTo(286, 312, 304, 308, 320, 300);
  g.bezierCurveTo(336, 308, 354, 312, 374, 308);
  g.bezierCurveTo(388, 306, 394, 318, 386, 328);
  g.bezierCurveTo(404, 340, 420, 318, 408, 300);
  g.bezierCurveTo(390, 276, 344, 270, 320, 280);
  g.closePath();
  shape('#f3e2b0', 5);
  // small smile under it
  g.beginPath();
  g.arc(320, 316, 16, 0.2 * Math.PI, 0.8 * Math.PI);
  g.lineWidth = 4;
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

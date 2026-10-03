import gsap from 'gsap';
import { STAGE, TV, TV_SCREEN_ABS } from '../config/layout';
import type { CameraState } from '../state/machine';
import { clamp, getRig, run } from './rig';

const CENTER = { x: STAGE.w / 2, y: STAGE.h / 2 };

/**
 * The camera is a 2D container (transform-origin 0 0). To look at point `focus`
 * with `zoom`, we translate so that the point lands `pull` of the way towards
 * the middle of the stage.
 */
function cameraTransform(focus: { x: number; y: number }, zoom: number, pull: number) {
  const tx = CENTER.x + (focus.x - CENTER.x) * (1 - pull);
  const ty = CENTER.y + (focus.y - CENTER.y) * (1 - pull);
  return { x: tx - zoom * focus.x, y: ty - zoom * focus.y, scale: zoom };
}

/** Zoom that makes the TV screen fill most of the viewport, plus the matching text size. */
function tvZoom() {
  const s = getRig().scale();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const z = clamp(Math.min((0.9 * vw) / (TV.screen.w * s), (0.8 * vh) / (TV.screen.h * s)), 1.2, 3.4);
  const screenRealW = TV.screen.w * z * s;
  const realFont = clamp(screenRealW / 34, 12.5, 19);
  document.documentElement.style.setProperty('--tv-fs', `${(realFont / (z * s)).toFixed(2)}px`);
  return z;
}

export function setCamera(state: CameraState, focus?: { x: number; y: number }) {
  const { camera } = getRig();
  let target: { x: number; y: number; scale: number };
  let duration = 1;
  let ease = 'power3.inOut';
  switch (state) {
    case 'CASSETTE_FOCUS_CAMERA':
      target = cameraTransform(focus ?? CENTER, 1.08, 0.22);
      duration = 1.1;
      break;
    case 'TV_CAMERA':
      target = cameraTransform(TV_SCREEN_ABS, tvZoom(), 1);
      duration = 1.5;
      break;
    case 'RETURN_CAMERA':
    case 'IDLE_CAMERA':
    default:
      target = { x: 0, y: 0, scale: 1 };
      duration = state === 'RETURN_CAMERA' ? 1.3 : 0.1;
      ease = 'power2.inOut';
  }
  return run(gsap.to(camera, { ...target, duration, ease, overwrite: true }));
}

export function initCamera() {
  gsap.set(getRig().camera, { x: 0, y: 0, scale: 1, transformOrigin: '0 0' });
}

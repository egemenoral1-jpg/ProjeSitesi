import gsap from 'gsap';
import type { Tape } from '../data/tapes';

export type Side = 'left' | 'right';

export type TVPhase = 'off' | 'black' | 'static' | 'noise' | 'glitch' | 'tracking' | 'project' | 'shutdown';

/** Imperative handle the TV component exposes to the animation layer. */
export interface TVHandle {
  setPhase(phase: TVPhase): void;
  show(tape: Tape | null): void;
}

export interface ArmParts {
  arm: HTMLElement;
  hand: HTMLElement;
  /** the cassette the hand is holding (hidden when empty) */
  held: HTMLElement;
}

/**
 * The "rig" is the set of DOM nodes the animation functions drive.
 * Components register their elements here; animation code never imports
 * components or project data, it only receives generic elements.
 */
export interface Rig {
  scene: HTMLElement;
  camera: HTMLElement;
  character: HTMLElement;
  bob: HTMLElement;
  arms: Record<Side, ArmParts>;
  tv: TVHandle;
  /** current scene scale (design px -> css px) */
  scale: () => number;
}

const rigParts: Partial<Rig> = {};

export function registerRig(parts: Partial<Rig>) {
  Object.assign(rigParts, parts);
}

export function getRig(): Rig {
  const r = rigParts as Rig;
  if (!r.scene || !r.camera || !r.character || !r.arms || !r.tv) throw new Error('Scene rig is not ready');
  return r;
}

export const wait = (seconds: number) => new Promise<void>((res) => gsap.delayedCall(seconds, res));

/** Resolve when a tween/timeline completes. (Never `await` a GSAP timeline directly: it is thenable.) */
export const run = (anim: gsap.core.Animation) =>
  new Promise<void>((res) => {
    anim.eventCallback('onComplete', () => res());
  });

/** Design-space centre of a cassette element (written by VHSCassette as data attributes). */
export function pointOf(el: HTMLElement) {
  return { x: Number(el.dataset.cx), y: Number(el.dataset.cy) };
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

import gsap from 'gsap';
import type * as THREE from 'three';

/**
 * Playback speed for the sequence steps that are awaited with run()/wait().
 * (Changing gsap.globalTimeline.timeScale instead would make every running animation jump.)
 */
let speed = 1;
export const setSpeed = (s: number) => {
  speed = s;
};

export const wait = (seconds: number) => new Promise<void>((res) => gsap.delayedCall(seconds / speed, res));

/** Resolve when a tween/timeline completes. (Never `await` a GSAP timeline directly: it is thenable.) */
export const run = (anim: gsap.core.Animation) =>
  new Promise<void>((res) => {
    if (speed !== 1) anim.timeScale(speed);
    anim.eventCallback('onComplete', () => res());
  });

/** Tween a THREE.Vector3 (or anything with x/y/z) to a point. */
export const tweenVec = (v: THREE.Vector3, to: { x: number; y: number; z: number }, duration: number, ease = 'power2.inOut') =>
  gsap.to(v, { x: to.x, y: to.y, z: to.z, duration, ease, overwrite: 'auto' });

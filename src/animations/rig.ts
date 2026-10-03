import gsap from 'gsap';
import type * as THREE from 'three';

export const wait = (seconds: number) => new Promise<void>((res) => gsap.delayedCall(seconds, res));

/** Resolve when a tween/timeline completes. (Never `await` a GSAP timeline directly: it is thenable.) */
export const run = (anim: gsap.core.Animation) =>
  new Promise<void>((res) => {
    anim.eventCallback('onComplete', () => res());
  });

/** Tween a THREE.Vector3 (or anything with x/y/z) to a point. */
export const tweenVec = (v: THREE.Vector3, to: { x: number; y: number; z: number }, duration: number, ease = 'power2.inOut') =>
  gsap.to(v, { x: to.x, y: to.y, z: to.z, duration, ease, overwrite: 'auto' });

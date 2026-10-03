import gsap from 'gsap';
import * as THREE from 'three';
import type { GripMode, MordecaiArm } from '../three/MordecaiArm';
import { run, tweenVec } from './rig';

/** Hand poses: where the fingers point, where the palm faces, how curled the fingers are. */
export type HandPose = 'rest' | 'reach' | GripMode | 'push';

export function handPose(arm: MordecaiArm, pose: HandPose) {
  const s = arm.sign;
  switch (pose) {
    case 'end': // on top of the tape, fingers over it, holding
      return { finger: new THREE.Vector3(-s, -0.2, 0.05), palm: new THREE.Vector3(0, -1, 0), curl: 0.42 };
    case 'reach': // palm toward the label, fingers open
      return { finger: new THREE.Vector3(-s * 0.3, 1, 0.15), palm: new THREE.Vector3(0, 0, -1), curl: 0.05 };
    case 'front': // palm on the label, fingers curled over the top edge
      return { finger: new THREE.Vector3(-s * 0.3, 1, 0.1), palm: new THREE.Vector3(0, 0, -1), curl: 0.55 };
    case 'push': // flat hand pushing the tape in
      return { finger: new THREE.Vector3(-s * 0.4, 1, 0.1), palm: new THREE.Vector3(0, 0, -1), curl: 0.12 };
    case 'rest':
    default:
      return { finger: new THREE.Vector3(-s * 0.25, 1, -0.4), palm: new THREE.Vector3(0, 0, -1), curl: 0.3 };
  }
}

/** Blend the hand into a pose. */
export function poseHand(arm: MordecaiArm, pose: HandPose, duration: number) {
  const p = handPose(arm, pose);
  const tl = gsap.timeline();
  tl.add(tweenVec(arm.finger, p.finger, duration), 0);
  tl.add(tweenVec(arm.palm, p.palm, duration), 0);
  tl.to(arm, { curl: p.curl, duration, ease: 'power2.inOut' }, 0);
  return tl;
}

/** Snap the hand into a pose (no animation). */
export function setHand(arm: MordecaiArm, pose: HandPose) {
  const p = handPose(arm, pose);
  arm.finger.copy(p.finger);
  arm.palm.copy(p.palm);
  arm.curl = p.curl;
}

export const moveWrist = (arm: MordecaiArm, to: THREE.Vector3, duration: number, ease = 'power2.inOut') =>
  tweenVec(arm.wrist, to, duration, ease);

/** Squeeze or open the fingers. */
export const grip = (arm: MordecaiArm, curl: number, duration = 0.2) => gsap.to(arm, { curl, duration, ease: 'power2.out' });

/** Pull the arm back out of the shot and hide it. */
export async function retractArm(arm: MordecaiArm, rest: THREE.Vector3, duration = 0.75) {
  const tl = gsap.timeline();
  tl.add(moveWrist(arm, rest, duration, 'power2.in'), 0);
  tl.add(poseHand(arm, 'rest', duration), 0);
  await run(tl);
  arm.visible = false;
}

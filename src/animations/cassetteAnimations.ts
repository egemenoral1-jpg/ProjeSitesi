import gsap from 'gsap';
import * as THREE from 'three';
import { TAPE, TAPE_IN_SLOT_Z, TV } from '../config/layout';
import { getWorld, type TapeObject } from '../three/World';
import type { MordecaiArm } from '../three/MordecaiArm';
import { run, wait } from './rig';
import { grip, handPose, moveWrist, poseHand, retractArm, setHand } from './characterAnimations';

/**
 * The cassette choreography. Every function receives a generic TapeObject
 * (mesh + where it lives); none of them looks at project data.
 *
 * The hand always holds a tape the way you pull a book off a pile: palm on the
 * label side near the outer end, fingers curled over the top edge. That works
 * for any tape in a stack and is also how the tape is pushed into the VCR.
 */

const slotCentre = (z: number) => new THREE.Vector3(TV.slot.x, TV.slot.y, z);
/** in front of the slot, a hand-width away */
const FRONT_OF_SLOT = TV.frontZ + TAPE.d / 2 + 0.14;
/** rear of the tape just inside the slot */
const PARTLY_IN = TV.frontZ + TAPE.d / 2 - 0.05;
/** keep the flat pushing hand a few millimetres off the label */
const PUSH_GAP = new THREE.Vector3(0, 0, 0.012);

const rests = new WeakMap<MordecaiArm, THREE.Vector3>();
const armFor = (t: TapeObject) => getWorld().arms[t.stack];

/** Tapes lying on top of `t` in the same stack. */
const tapesAbove = (t: TapeObject) => getWorld().tapes.filter((o) => o.stack === t.stack && o.slot > t.slot);

/** Pulled out of the stack toward the camera, ready to travel. */
function pulledOut(t: TapeObject) {
  const out = t.stack === 'left' ? -1 : 1;
  return t.home.clone().add(new THREE.Vector3(out * 0.02, 0.025, 0.3));
}

const wristFor = (arm: MordecaiArm, centre: THREE.Vector3) => arm.wristFor('front', centre, handPose(arm, 'front').finger);

/** Anchor the arm and give it enough reach for this tape's whole trip. */
function prepare(t: TapeObject) {
  const arm = armFor(t);
  const targets = [wristFor(arm, t.home), wristFor(arm, slotCentre(FRONT_OF_SLOT)), wristFor(arm, slotCentre(TAPE_IN_SLOT_Z))];
  const { rest } = getWorld().prepareArm(arm, targets);
  rests.set(arm, rest);
  arm.wrist.copy(rest);
  setHand(arm, 'rest');
  arm.visible = true;
  return arm;
}

/** The arm reaches in and the open hand settles on the label of the tape. */
export async function animateArmToCassette(t: TapeObject) {
  const arm = prepare(t);
  const out = t.stack === 'left' ? -1 : 1;
  const grab = wristFor(arm, t.home);
  const before = grab.clone().add(new THREE.Vector3(out * 0.05, 0.03, 0.14));
  const tl = gsap.timeline();
  tl.add(poseHand(arm, 'reach', 0.7), 0.1);
  tl.add(moveWrist(arm, before, 0.8, 'power2.out'), 0);
  tl.add(moveWrist(arm, grab, 0.35, 'power1.inOut'), 0.8);
  await run(tl);
  await wait(0.12); // the hand is on the tape
}

/** Curl the fingers over the edge, take it, slide it out; the tapes above drop down. */
export async function pickUpCassette(t: TapeObject) {
  const arm = armFor(t);
  await run(grip(arm, handPose(arm, 'front').curl, 0.22));
  t.state = 'held';
  arm.hold(t.mesh, 'front');
  const tl = gsap.timeline();
  tl.add(moveWrist(arm, wristFor(arm, pulledOut(t)), 0.65), 0);
  tl.to(tapesAbove(t), { dropY: -TAPE.h, duration: 0.35, ease: 'bounce.out', stagger: 0.05 }, 0.3);
  await run(tl);
}

/** Carry it in front of the VCR slot and line it up. */
export async function carryCassette(t: TapeObject) {
  const arm = armFor(t);
  const tl = gsap.timeline();
  tl.add(moveWrist(arm, wristFor(arm, slotCentre(FRONT_OF_SLOT)), 0.95), 0);
  tl.add(moveWrist(arm, wristFor(arm, slotCentre(FRONT_OF_SLOT - 0.07)), 0.3, 'power1.inOut'), 0.95);
  await run(tl);
}

/** Slide it partly in, open the hand flat on the label and push it home. */
export async function insertCassette(t: TapeObject) {
  const arm = armFor(t);
  await run(moveWrist(arm, wristFor(arm, slotCentre(PARTLY_IN)), 0.4, 'power1.in'));

  arm.release();
  t.state = 'loose';
  const flat = gsap.timeline();
  flat.add(poseHand(arm, 'push', 0.3), 0);
  flat.add(moveWrist(arm, wristFor(arm, slotCentre(PARTLY_IN)).add(PUSH_GAP), 0.3), 0);
  await run(flat);

  const push = gsap.timeline();
  push.to(t.mesh.position, { z: TAPE_IN_SLOT_Z, duration: 0.42, ease: 'power2.in' }, 0);
  push.add(moveWrist(arm, wristFor(arm, slotCentre(TAPE_IN_SLOT_Z)).add(PUSH_GAP), 0.42, 'power2.in'), 0);
  push.to(t.mesh.position, { y: TV.slot.y - 0.002, duration: 0.06, yoyo: true, repeat: 1 }, 0.42); // clunk
  await run(push);
}

/** Hand leaves the shot after inserting. */
export function leaveSlot(t: TapeObject) {
  const arm = armFor(t);
  return retractArm(arm, rests.get(arm) ?? arm.wrist.clone().add(new THREE.Vector3(0, -0.5, 0.5)));
}

/** BACK: pull the tape out of the VCR and put it back where it was in its stack. */
export async function ejectCassette(t: TapeObject) {
  const arm = prepare(t);
  const inSlot = slotCentre(TAPE_IN_SLOT_Z);

  let tl = gsap.timeline();
  tl.add(poseHand(arm, 'reach', 0.8), 0);
  tl.add(moveWrist(arm, wristFor(arm, inSlot).add(new THREE.Vector3(0, 0, 0.1)), 0.8, 'power2.out'), 0);
  tl.add(moveWrist(arm, wristFor(arm, inSlot), 0.3), 0.8);
  await run(tl);
  await run(grip(arm, handPose(arm, 'front').curl, 0.22));
  t.state = 'held';
  arm.hold(t.mesh, 'front');

  tl = gsap.timeline();
  tl.add(moveWrist(arm, wristFor(arm, slotCentre(FRONT_OF_SLOT)), 0.55), 0);
  tl.add(moveWrist(arm, wristFor(arm, pulledOut(t)), 0.85), 0.55);
  tl.to(tapesAbove(t), { dropY: 0, duration: 0.3, ease: 'power2.out' }, 1.0);
  tl.add(moveWrist(arm, wristFor(arm, t.home), 0.5, 'power2.inOut'), 1.4);
  await run(tl);

  arm.release();
  t.state = 'home';
  await run(grip(arm, handPose(arm, 'reach').curl, 0.18));
  await retractArm(arm, rests.get(arm)!);
}

/** Put everything back without animation (if a sequence is interrupted). */
export function resetCassette(t: TapeObject) {
  const w = getWorld();
  for (const arm of [w.arms.left, w.arms.right]) {
    arm.release();
    arm.visible = false;
  }
  t.state = 'home';
  tapesAbove(t).forEach((o) => (o.dropY = 0));
}

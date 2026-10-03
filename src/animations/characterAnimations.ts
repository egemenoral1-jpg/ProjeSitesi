import gsap from 'gsap';
import { ARMS } from '../config/layout';
import { getRig, run, type Side } from './rig';

/**
 * Only Mordecai's arms are in the shot. Each arm is a sleeve anchored at a
 * shoulder below the bottom corner of the stage:
 *  - `angle` is its CSS rotation (0 = pointing down, ~±160 = reaching up into the room)
 *  - `len`   is how far it is extended (scaleY of the sleeve image)
 * The hand is a separate layer glued to the end of the sleeve every frame.
 * All coordinates are stage (design) pixels.
 */
interface ArmPose {
  angle: number;
  len: number;
}

const shoulder = (side: Side) => ARMS.shoulders[side];

export function handAt(side: Side, pose: ArmPose) {
  const s = shoulder(side);
  const r = (pose.angle * Math.PI) / 180;
  return { x: s.x - pose.len * Math.sin(r), y: s.y + pose.len * Math.cos(r) };
}

/** Pose that puts the hand on a stage point. */
export function poseToward(side: Side, target: { x: number; y: number }): ArmPose {
  const s = shoulder(side);
  const dx = target.x - s.x;
  const dy = target.y - s.y;
  const len = Math.min(ARMS.len, Math.max(ARMS.min, Math.hypot(dx, dy)));
  return { angle: (Math.atan2(-dx, dy) * 180) / Math.PI, len };
}

/** Resting pose: hand tucked just below the bottom edge of the stage. */
const REST: Record<Side, ArmPose> = {
  left: poseToward('left', { x: ARMS.shoulders.left.x + 220, y: 1040 }),
  right: poseToward('right', { x: ARMS.shoulders.right.x - 220, y: 1040 }),
};

const state: Record<Side, ArmPose> = { left: { ...REST.left }, right: { ...REST.right } };

function applyArm(side: Side) {
  const { arm, hand } = getRig().arms[side];
  const p = state[side];
  const h = handAt(side, p);
  // the hand art points its fingers up; turn it to continue the sleeve (wrist bands line up with the arm)
  const tilt = p.angle > 0 ? p.angle - 180 : p.angle + 180;
  gsap.set(arm, { rotation: p.angle, scaleY: p.len / ARMS.len });
  gsap.set(hand, { x: h.x, y: h.y });
  gsap.set(hand.querySelector('.m-hand-img'), { rotation: tilt });
}

export function poseArm(side: Side, to: ArmPose, duration: number, ease = 'power2.inOut') {
  return gsap.to(state[side], { angle: to.angle, len: to.len, duration, ease, overwrite: true, onUpdate: () => applyArm(side) });
}

/** Move the hand to a stage point. */
export const reachArm = (side: Side, target: { x: number; y: number }, duration: number, ease?: string) =>
  poseArm(side, poseToward(side, target), duration, ease);

export function showArm(side: Side, on: boolean) {
  const { arm, hand } = getRig().arms[side];
  gsap.set([arm, hand], { autoAlpha: on ? 1 : 0 });
}

/** Pull the arm back out of the shot and hide it. */
export async function retractArm(side: Side, duration = 0.7) {
  await run(poseArm(side, REST[side], duration, 'power2.in'));
  showArm(side, false);
}

/** Squeeze/open the hand image to fake a grip. */
export function gripHand(side: Side, closed: boolean) {
  const img = getRig().arms[side].hand.querySelector('.m-hand-img');
  return gsap.to(img, { scaleX: closed ? 0.86 : 1, scaleY: closed ? 0.92 : 1, duration: 0.18, ease: 'power2.out' });
}

export function initArms() {
  (['left', 'right'] as Side[]).forEach((s) => {
    const { arm, held } = getRig().arms[s];
    gsap.set(arm, { transformOrigin: '50% 0%' });
    state[s] = { ...REST[s] };
    applyArm(s);
    showArm(s, false);
    gsap.set(held, { autoAlpha: 0 });
  });
}

export const returnToIdle = () => Promise.all([retractArm('left'), retractArm('right')]).then(() => undefined);

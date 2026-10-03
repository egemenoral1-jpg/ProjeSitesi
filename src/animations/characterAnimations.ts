import gsap from 'gsap';
import { CHARACTER } from '../config/layout';
import { getRig, run, type Side } from './rig';

/**
 * Arm model: each arm is a straight tube that hangs from the shoulder.
 *  - `angle` is its CSS rotation (0 = hanging down, negative = swinging towards +x)
 *  - `len`   is how far it is stretched (rubber-hose style, scaleY)
 * The hand is a separate layer glued to the end of the arm every frame.
 * Everything is expressed in "character space": origin = centre of the feet.
 */
interface ArmPose {
  angle: number;
  len: number;
}

const REST: Record<Side, ArmPose> = {
  left: { angle: 7, len: CHARACTER.armLen },
  right: { angle: -7, len: CHARACTER.armLen },
};

const state: Record<Side, ArmPose> = {
  left: { ...REST.left },
  right: { ...REST.right },
};

export const shoulderOf = (side: Side) => ({
  x: side === 'left' ? -CHARACTER.shoulderX : CHARACTER.shoulderX,
  y: CHARACTER.shoulderY,
});

export function handLocal(side: Side, pose: ArmPose = state[side]) {
  const sh = shoulderOf(side);
  const r = (pose.angle * Math.PI) / 180;
  return { x: sh.x - pose.len * Math.sin(r), y: sh.y + pose.len * Math.cos(r) };
}

function applyArm(side: Side) {
  const { arm, hand } = getRig().arms[side];
  const p = state[side];
  const h = handLocal(side);
  gsap.set(arm, { rotation: p.angle, scaleY: p.len / CHARACTER.armLen });
  gsap.set(hand, { x: h.x, y: h.y });
}

/** Pose that puts the hand on a point given in character space. */
export function poseToward(side: Side, target: { x: number; y: number }): ArmPose {
  const sh = shoulderOf(side);
  const dx = target.x - sh.x;
  const dy = target.y - sh.y;
  const len = Math.min(CHARACTER.armLen, Math.max(CHARACTER.armMin, Math.hypot(dx, dy)));
  return { angle: (Math.atan2(-dx, dy) * 180) / Math.PI, len };
}

export function poseArm(side: Side, to: ArmPose, duration: number, ease = 'power2.inOut') {
  return gsap.to(state[side], { angle: to.angle, len: to.len, duration, ease, overwrite: true, onUpdate: () => applyArm(side) });
}

/** Move the hand to a point in character space. */
export const reachArm = (side: Side, target: { x: number; y: number }, duration: number, ease?: string) =>
  poseArm(side, poseToward(side, target), duration, ease);

export const restArm = (side: Side, duration = 0.6) => poseArm(side, REST[side], duration);

/** Squeeze/open the hand image to fake a grip. */
export function gripHand(side: Side, closed: boolean) {
  const img = getRig().arms[side].hand.querySelector('.m-hand-img');
  return gsap.to(img, { scale: closed ? 0.84 : 1, rotation: closed ? -10 : 0, duration: 0.18, ease: 'power2.out' });
}

export const characterX = () => Number(gsap.getProperty(getRig().character, 'x'));

/** Step along the floor with a little bob. */
export function walkTo(x: number) {
  const { character, bob } = getRig();
  const dist = Math.abs(x - characterX());
  if (dist < 2) return Promise.resolve();
  const duration = Math.max(0.25, dist / 340);
  const steps = Math.max(2, Math.round(duration / 0.18));
  gsap.killTweensOf(bob);
  gsap.to(bob, { y: -9, duration: 0.09, yoyo: true, repeat: steps * 2 - 1, ease: 'sine.inOut', onComplete: () => void gsap.set(bob, { y: 0 }) });
  return run(gsap.to(character, { x, duration, ease: 'sine.inOut' }));
}

/** Put arms and body in their start pose (no animation). */
export function initCharacter() {
  const { character } = getRig();
  gsap.set(character, { x: CHARACTER.idleX });
  (['left', 'right'] as Side[]).forEach((s) => {
    state[s] = { ...REST[s] };
    applyArm(s);
    const { arm, held } = getRig().arms[s];
    gsap.set(arm, { transformOrigin: '50% 0%' });
    gsap.set(held, { autoAlpha: 0 });
  });
}

export function returnToIdle() {
  return Promise.all([walkTo(CHARACTER.idleX), run(restArm('left')), run(restArm('right'))]).then(() => undefined);
}

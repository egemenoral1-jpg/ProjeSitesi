import gsap from 'gsap';
import { CHARACTER, TAPE, TV_SLOT_ABS } from '../config/layout';
import type { Tape } from '../data/tapes';
import { clamp, getRig, pointOf, run, wait, type Side } from './rig';
import { gripHand, handLocal, poseArm, poseToward, reachArm, restArm, shoulderOf, walkTo } from './characterAnimations';

/** Where the body stands when the right arm can just reach the VCR slot. */
export const INSERT_X = TV_SLOT_ABS.x - CHARACTER.shoulderX - CHARACTER.reachDx;

/** Position of the hand that holds a cassette (the cassette hangs 40px above the hand). */
const HOLD_LIFT = 40;
const CHEST = { x: -42, y: -252 };

const SPINE_SCALE = TAPE.spineW / TAPE.frontH;

function showHeld(side: Side, tape: Tape, pose: gsap.TweenVars) {
  const { held } = getRig().arms[side];
  held.style.setProperty('--c', tape.color);
  const label = held.querySelector('.held-label');
  if (label) label.textContent = tape.label;
  gsap.set(held, { autoAlpha: 1, x: 0, transformOrigin: '50% 50%', ...pose });
}

/** Step up to the cassette and stretch the left arm until the hand is on it. */
export async function animateArmToCassette(cassette: HTMLElement) {
  const p = pointOf(cassette);
  const bodyX = clamp(p.x + CHARACTER.shoulderX + CHARACTER.reachDx, 420, 840);
  const target = { x: p.x - bodyX, y: p.y - CHARACTER.floorY };
  await Promise.all([
    walkTo(bodyX),
    wait(0.2).then(() => run(poseArm('left', poseToward('left', target), 0.85))),
  ]);
  await wait(0.14); // tiny pause: hand is on the cassette
}

/** Grab the cassette: grip, swap the shelf cassette for the held one, pull the arm back. */
export async function pickUpCassette(cassette: HTMLElement, tape: Tape) {
  const rig = getRig();
  const { held } = rig.arms.left;
  showHeld('left', tape, { y: 0, rotation: -90, scaleY: SPINE_SCALE, scaleX: 1 });
  cassette.classList.add('is-picked');
  await run(gripHand('left', true));
  const pull = gsap.timeline();
  pull.add(reachArm('left', CHEST, 0.75), 0);
  pull.to(held, { y: -HOLD_LIFT, rotation: 0, scaleY: 1, duration: 0.7, ease: 'power2.inOut' }, 0.05);
  await run(pull);
  await wait(0.1);
}

/** Walk to the TV with the cassette, pass it to the right hand (hands meet at the chest). */
export async function carryCassette(tape: Tape) {
  const rig = getRig();
  await walkTo(INSERT_X);
  // right hand comes to the left hand
  await run(reachArm('right', CHEST, 0.45));
  showHeld('right', tape, { y: -HOLD_LIFT, rotation: 0, scaleY: 1, scaleX: 1 });
  gsap.set(rig.arms.left.held, { autoAlpha: 0 });
  gripHand('right', true);
  gripHand('left', false);
  restArm('left', 0.6);
  // lift the cassette in front of the VCR slot
  const slotLocal = { x: TV_SLOT_ABS.x - INSERT_X, y: TV_SLOT_ABS.y - CHARACTER.floorY };
  await run(reachArm('right', { x: slotLocal.x - 10, y: slotLocal.y + HOLD_LIFT + 46 }, 0.8));
  await wait(0.1);
}

/** Push the cassette into the slot: it squashes into the VCR and disappears. */
export async function insertCassette() {
  const { held } = getRig().arms.right;
  const slotLocal = { x: TV_SLOT_ABS.x - INSERT_X, y: TV_SLOT_ABS.y - CHARACTER.floorY };
  const tl = gsap.timeline();
  tl.add(reachArm('right', { x: slotLocal.x, y: slotLocal.y + HOLD_LIFT - 4 }, 0.45, 'power1.in'), 0);
  tl.set(held, { transformOrigin: '50% 100%' }, 0.3);
  tl.to(held, { scaleY: 0.05, scaleX: 0.9, duration: 0.5, ease: 'power2.in' }, 0.3);
  tl.to(held, { autoAlpha: 0, duration: 0.1 }, 0.78);
  await run(tl);
  gsap.set(held, { transformOrigin: '50% 50%' });
  await run(gripHand('right', false));
}

/** After BACK: the cassette reappears on the shelf. */
export function restoreCassette(cassette: HTMLElement) {
  cassette.classList.remove('is-picked');
  gsap.fromTo(cassette, { y: -26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'bounce.out', clearProps: 'transform,opacity,visibility' });
}

/** Small helper used by tests/debug: current hand position in character space. */
export const debugHand = (side: Side) => ({ hand: handLocal(side), shoulder: shoulderOf(side) });

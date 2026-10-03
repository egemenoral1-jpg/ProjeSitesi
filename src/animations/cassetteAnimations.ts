import gsap from 'gsap';
import { ARMS, TAPE, TAPE_IN_SLOT_SCALE, TV_SLOT_ABS } from '../config/layout';
import type { Tape } from '../data/tapes';
import { getRig, paintTape, pointOf, run, sideOf, wait, type Side } from './rig';
import { gripHand, reachArm, retractArm, showArm } from './characterAnimations';

/** Where the hand must be to hold a tape centred on `c` at `scale` (it grips the outer end). */
function gripPoint(side: Side, c: { x: number; y: number }, scale = 1) {
  const off = ARMS.grip * scale;
  return { x: c.x + (side === 'right' ? off : -off), y: c.y };
}

/** Where the tape waits in front of the slot, a bit closer to the camera. */
const FRONT_OF_SLOT = { x: TV_SLOT_ABS.x, y: TV_SLOT_ABS.y + 70 };
const FRONT_SCALE = 1.06;

function heldTape(side: Side) {
  const { held } = getRig().arms[side];
  // scale around the gripped end so the hand never slides along the tape
  gsap.set(held, { transformOrigin: side === 'right' ? '100% 50%' : '0% 50%' });
  return held;
}

/** Tapes lying on top of `el` in the same stack. */
function tapesAbove(el: HTMLElement) {
  const slot = Number(el.dataset.slot);
  return Array.from(document.querySelectorAll<HTMLElement>(`[data-stack="${el.dataset.stack}"]`)).filter(
    (t) => Number(t.dataset.slot) > slot,
  );
}

/** The arm comes up from below and the hand lands on the end of the cassette. */
export async function animateArmToCassette(cassette: HTMLElement) {
  const side = sideOf(cassette);
  showArm(side, true);
  await run(reachArm(side, gripPoint(side, pointOf(cassette)), 0.95, 'power3.out'));
  await wait(0.14); // tiny pause: hand is on the cassette
}

/** Grip, swap the shelf cassette for the held one, slide it out of the stack. */
export async function pickUpCassette(cassette: HTMLElement, tape: Tape) {
  const side = sideOf(cassette);
  const held = heldTape(side);
  paintTape(held, tape);
  gsap.set(held, { autoAlpha: 1, scale: 1 });
  cassette.classList.add('is-picked');
  await run(gripHand(side, true));

  const c = pointOf(cassette);
  const out = side === 'right' ? 70 : -70;
  const tl = gsap.timeline();
  tl.add(reachArm(side, gripPoint(side, { x: c.x + out, y: c.y - 24 }, 1.04), 0.55), 0);
  tl.to(held, { scale: 1.04, duration: 0.55, ease: 'power2.inOut' }, 0);
  // the tapes above drop into the gap
  tl.to(tapesAbove(cassette), { y: TAPE.h + TAPE.gap, duration: 0.35, ease: 'bounce.out', stagger: 0.04 }, 0.35);
  await run(tl);
}

/** Bring the cassette in front of the VCR slot. */
export async function carryCassette(cassette: HTMLElement) {
  const side = sideOf(cassette);
  const held = heldTape(side);
  const tl = gsap.timeline();
  tl.add(reachArm(side, gripPoint(side, FRONT_OF_SLOT, FRONT_SCALE), 1.0, 'power2.inOut'), 0);
  tl.to(held, { scale: FRONT_SCALE, duration: 1.0, ease: 'power2.inOut' }, 0);
  await run(tl);
  await wait(0.12);
}

/** Push it into the slot. It stays there with the label showing, the hand lets go and leaves. */
export async function insertCassette(cassette: HTMLElement, tape: Tape) {
  const side = sideOf(cassette);
  const held = heldTape(side);
  const { slotTape } = getRig();
  const tl = gsap.timeline();
  tl.add(reachArm(side, gripPoint(side, TV_SLOT_ABS, TAPE_IN_SLOT_SCALE), 0.5, 'power2.in'), 0);
  tl.to(held, { scale: TAPE_IN_SLOT_SCALE, duration: 0.5, ease: 'power2.in' }, 0);
  await run(tl);
  // hand over to the copy that lives in the TV
  paintTape(slotTape, tape);
  gsap.set(slotTape, { autoAlpha: 1, scale: TAPE_IN_SLOT_SCALE });
  gsap.set(held, { autoAlpha: 0 });
  gsap.fromTo(slotTape, { y: 0 }, { y: 2, duration: 0.08, yoyo: true, repeat: 1 }); // the "clunk"
  await run(gripHand(side, false));
}

export const leaveSlot = (cassette: HTMLElement) => retractArm(sideOf(cassette));

/** BACK: the hand pulls the tape out of the VCR and puts it back where it came from. */
export async function ejectCassette(cassette: HTMLElement, tape: Tape) {
  const side = sideOf(cassette);
  const held = heldTape(side);
  const { slotTape } = getRig();
  showArm(side, true);
  await run(reachArm(side, gripPoint(side, TV_SLOT_ABS, TAPE_IN_SLOT_SCALE), 0.9, 'power3.out'));
  paintTape(held, tape);
  gsap.set(held, { autoAlpha: 1, scale: TAPE_IN_SLOT_SCALE });
  gsap.set(slotTape, { autoAlpha: 0 });
  await run(gripHand(side, true));

  let tl = gsap.timeline();
  tl.add(reachArm(side, gripPoint(side, FRONT_OF_SLOT, FRONT_SCALE), 0.5), 0);
  tl.to(held, { scale: FRONT_SCALE, duration: 0.5 }, 0);
  await run(tl);

  const c = pointOf(cassette);
  const above = tapesAbove(cassette);
  tl = gsap.timeline();
  tl.to(above, { y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform' }, 0);
  tl.add(reachArm(side, gripPoint(side, c), 0.9), 0.1);
  tl.to(held, { scale: 1, duration: 0.9 }, 0.1);
  await run(tl);

  cassette.classList.remove('is-picked');
  gsap.set(held, { autoAlpha: 0 });
  await run(gripHand(side, false));
  await retractArm(side);
}

/** Put everything back in place without animation (used if a sequence is interrupted). */
export function resetCassette(cassette: HTMLElement) {
  const { slotTape, arms } = getRig();
  cassette.classList.remove('is-picked');
  gsap.set(tapesAbove(cassette), { clearProps: 'transform' });
  gsap.set([slotTape, arms.left.held, arms.right.held], { autoAlpha: 0 });
}

import type { Tape } from '../data/tapes';
import type { SceneState } from '../state/machine';
import { sfx } from '../audio/audio';
import { pointOf } from './rig';
import { setCamera } from './cameraAnimations';
import { returnToIdle } from './characterAnimations';
import {
  animateArmToCassette,
  carryCassette,
  ejectCassette,
  insertCassette,
  leaveSlot,
  pickUpCassette,
  resetCassette,
} from './cassetteAnimations';
import { playTV, stopTV } from './tvAnimations';
import { freezeParallax } from '../utils/parallaxStore';

type Report = (s: SceneState) => boolean;

/**
 * The whole "small animated movie" for one cassette. The step functions it
 * calls are generic: they receive the cassette element / tape and never look
 * at project data.
 */
export async function playCassetteSequence(cassette: HTMLElement, tape: Tape, to: Report) {
  freezeParallax(true);
  to('SELECTING');
  sfx.play('cassetteClick');
  await setCamera('CASSETTE_FOCUS_CAMERA', pointOf(cassette));

  to('REACHING');
  await animateArmToCassette(cassette);

  to('PICKING_UP');
  await pickUpCassette(cassette, tape);

  to('CARRYING');
  await Promise.all([carryCassette(cassette), setCamera('RETURN_CAMERA')]);

  to('INSERTING');
  sfx.play('vhsInsert');
  await insertCassette(cassette, tape);

  to('PLAYING');
  await Promise.all([leaveSlot(cassette), playTV(tape), setCamera('TV_CAMERA')]);
  to('VIEWING_PROJECT');
}

/** BACK: TV off, camera back, the hand ejects the tape and returns it to its stack. */
export async function playBackSequence(cassette: HTMLElement | null, tape: Tape | null, to: Report) {
  to('RETURNING');
  sfx.play('buttonClick');
  await stopTV();
  await setCamera('RETURN_CAMERA');
  if (cassette && tape) await ejectCassette(cassette, tape);
  freezeParallax(false);
  to('IDLE');
}

/** Safety net if anything throws mid-sequence. */
export async function recover(cassette: HTMLElement | null, to: Report) {
  to('RETURNING');
  await stopTV().catch(() => undefined);
  if (cassette) resetCassette(cassette);
  await Promise.all([setCamera('RETURN_CAMERA'), returnToIdle()]);
  freezeParallax(false);
  to('IDLE');
}

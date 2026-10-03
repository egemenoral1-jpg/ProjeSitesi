import type { Tape } from '../data/tapes';
import type { SceneState } from '../state/machine';
import { sfx } from '../audio/audio';
import { pointOf, wait } from './rig';
import { setCamera } from './cameraAnimations';
import { returnToIdle } from './characterAnimations';
import { animateArmToCassette, carryCassette, insertCassette, pickUpCassette, restoreCassette } from './cassetteAnimations';
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
  const focus = pointOf(cassette);
  await setCamera('CASSETTE_FOCUS_CAMERA', focus);

  to('REACHING');
  await animateArmToCassette(cassette);

  to('PICKING_UP');
  await pickUpCassette(cassette, tape);

  to('CARRYING');
  await carryCassette(tape);

  to('INSERTING');
  sfx.play('vhsInsert');
  await insertCassette();

  to('PLAYING');
  const cam = setCamera('TV_CAMERA');
  const idleArms = wait(0.4).then(() => returnToIdle());
  await Promise.all([playTV(tape), cam]);
  await idleArms;
  to('VIEWING_PROJECT');
}

/** BACK: close the project, TV off, camera and Mordecai go home, cassette returns to the shelf. */
export async function playBackSequence(cassette: HTMLElement | null, to: Report) {
  to('RETURNING');
  sfx.play('buttonClick');
  await stopTV();
  await Promise.all([setCamera('RETURN_CAMERA'), returnToIdle()]);
  if (cassette) restoreCassette(cassette);
  await wait(0.5);
  freezeParallax(false);
  to('IDLE');
}

/** Safety net if anything throws mid-sequence. */
export async function recover(cassette: HTMLElement | null, to: Report) {
  to('RETURNING');
  await stopTV().catch(() => undefined);
  await Promise.all([setCamera('RETURN_CAMERA'), returnToIdle()]);
  if (cassette) restoreCassette(cassette);
  freezeParallax(false);
  to('IDLE');
}

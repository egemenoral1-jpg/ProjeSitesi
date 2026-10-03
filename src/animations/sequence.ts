import * as THREE from 'three';
import { TV } from '../config/layout';
import type { SceneState } from '../state/machine';
import gsap from 'gsap';
import { sfx } from '../audio/audio';
import { getWorld, type TapeObject } from '../three/World';
import { setCamera } from './cameraAnimations';
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

type Report = (s: SceneState) => boolean;

/** The hand part of the sequence plays a bit faster than authored. */
const HAND_SPEED = 1.35;
const handSpeed = (on: boolean) => void gsap.globalTimeline.timeScale(on ? HAND_SPEED : 1);

/**
 * The whole "small animated movie" for one cassette. The step functions it
 * calls are generic: they receive the tape object and never look at project data.
 */
export async function playCassetteSequence(t: TapeObject, to: Report) {
  const w = getWorld();
  w.setFrozen(true);
  to('SELECTING');
  sfx.play('cassetteClick');
  await setCamera('CASSETTE_FOCUS_CAMERA', t.home);

  to('REACHING');
  handSpeed(true);
  await animateArmToCassette(t);

  to('PICKING_UP');
  await pickUpCassette(t);

  to('CARRYING');
  await Promise.all([carryCassette(t), setCamera('CASSETTE_FOCUS_CAMERA', new THREE.Vector3(TV.slot.x, TV.slot.y, TV.frontZ))]);

  to('INSERTING');
  sfx.play('vhsInsert');
  await insertCassette(t);
  handSpeed(false);

  to('PLAYING');
  await Promise.all([leaveSlot(t), playTV(t.tape), setCamera('TV_CAMERA')]);
  to('VIEWING_PROJECT');
}

/** BACK: TV off, camera back, the hand ejects the tape and returns it to its stack. */
export async function playBackSequence(t: TapeObject | null, to: Report) {
  to('RETURNING');
  sfx.play('buttonClick');
  await stopTV();
  await setCamera('RETURN_CAMERA');
  handSpeed(true);
  if (t) await ejectCassette(t);
  handSpeed(false);
  getWorld().setFrozen(false);
  to('IDLE');
}

/** Safety net if anything throws mid-sequence. */
export async function recover(t: TapeObject | null, to: Report) {
  handSpeed(false);
  to('RETURNING');
  await stopTV().catch(() => undefined);
  if (t) resetCassette(t);
  await setCamera('RETURN_CAMERA');
  getWorld().setFrozen(false);
  to('IDLE');
}

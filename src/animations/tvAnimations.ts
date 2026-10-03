import type { Tape } from '../data/tapes';
import { sfx } from '../audio/audio';
import { getRig, wait } from './rig';

/**
 * BLACK -> STATIC -> VHS NOISE -> GLITCH -> TRACKING -> PROJECT SCREEN.
 * Generic: it only receives the tape to show, nothing project specific.
 */
export async function playTV(tape: Tape) {
  const { tv, scene } = getRig();
  scene.dataset.tv = 'on';
  sfx.play('crtPowerOn');
  tv.setPhase('black');
  await wait(0.35);
  sfx.play('tvStatic');
  tv.setPhase('static');
  await wait(0.75);
  tv.setPhase('noise');
  await wait(0.5);
  tv.setPhase('glitch');
  await wait(0.45);
  tv.setPhase('tracking');
  tv.show(tape);
  await wait(0.7);
  tv.setPhase('project');
}

/** Short VHS rewind / CRT collapse, then the TV rests. */
export async function stopTV() {
  const { tv, scene } = getRig();
  sfx.play('vhsRewind');
  tv.setPhase('glitch');
  await wait(0.25);
  tv.setPhase('shutdown');
  await wait(0.55);
  tv.show(null);
  tv.setPhase('off');
  scene.dataset.tv = 'off';
}

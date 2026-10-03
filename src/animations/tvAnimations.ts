import type { Tape } from '../data/tapes';
import { sfx } from '../audio/audio';
import { tvBus } from '../state/tvBus';
import type { TVPhase } from '../three/ScreenTexture';
import { getWorld } from '../three/World';
import { wait } from './rig';

function phase(p: TVPhase) {
  const w = getWorld();
  w.tv.screen.setPhase(p);
  w.tv.led.emissiveIntensity = p === 'off' ? 0.15 : 2.5;
  tvBus.set({ phase: p });
}

/**
 * BLACK -> STATIC -> VHS NOISE -> GLITCH -> TRACKING -> PROJECT SCREEN.
 * Generic: it only receives the tape to show.
 */
export async function playTV(tape: Tape) {
  sfx.play('crtPowerOn');
  phase('black');
  await wait(0.35);
  sfx.play('tvStatic');
  phase('static');
  await wait(0.7);
  phase('noise');
  await wait(0.5);
  phase('glitch');
  await wait(0.45);
  tvBus.set({ tape });
  phase('tracking');
  await wait(0.7);
  phase('project');
  sfx.duck(true);
}

/** Short VHS rewind, CRT collapses, then the set goes back to snow. */
export async function stopTV() {
  sfx.play('vhsRewind');
  sfx.duck(false);
  phase('glitch');
  await wait(0.25);
  phase('shutdown');
  await wait(0.55);
  tvBus.set({ tape: null });
  phase('off');
}

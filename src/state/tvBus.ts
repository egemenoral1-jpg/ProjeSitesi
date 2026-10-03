import { useSyncExternalStore } from 'react';
import type { Tape } from '../data/tapes';
import type { TVPhase } from '../three/ScreenTexture';

/**
 * Tiny store shared by the animation code (writer) and the HTML overlay that
 * shows the project on the TV screen (reader).
 */
interface TVState {
  phase: TVPhase;
  tape: Tape | null;
}

let state: TVState = { phase: 'off', tape: null };
const listeners = new Set<() => void>();

export const tvBus = {
  get: () => state,
  set(patch: Partial<TVState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
};

export const useTV = () => useSyncExternalStore(tvBus.subscribe, tvBus.get);

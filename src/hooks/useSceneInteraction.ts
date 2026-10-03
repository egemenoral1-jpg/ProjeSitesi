import { useCallback, useRef, useState } from 'react';
import { canTransition, type SceneState } from '../state/machine';
import { playBackSequence, playCassetteSequence, recover } from '../animations/sequence';
import { getWorld, type TapeObject } from '../three/World';

const HINT_KEY = 'hint-dismissed';

/**
 * Owns the interaction state machine. React state only changes on high-level
 * transitions (about ten times per cassette); all motion is imperative GSAP/three.js.
 */
export function useSceneInteraction() {
  const stateRef = useRef<SceneState>('INTRO');
  const [state, setStateUI] = useState<SceneState>('INTRO');
  const [hintVisible, setHintVisible] = useState(() => {
    try {
      return sessionStorage.getItem(HINT_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const current = useRef<TapeObject | null>(null);

  /** Ask for a transition; returns false (and does nothing) if it is not allowed right now. */
  const to = useCallback((next: SceneState) => {
    if (!canTransition(stateRef.current, next)) return false;
    stateRef.current = next;
    setStateUI(next);
    try {
      getWorld().interactive = next === 'IDLE';
    } catch {
      /* world not ready yet */
    }
    return true;
  }, []);

  const introDone = useCallback(() => void to('IDLE'), [to]);

  const select = useCallback(
    async (t: TapeObject) => {
      if (stateRef.current !== 'IDLE') return;
      setHintVisible(false);
      try {
        sessionStorage.setItem(HINT_KEY, '1');
      } catch {
        /* ignore */
      }
      current.current = t;
      try {
        await playCassetteSequence(t, to);
      } catch (err) {
        console.error('Cassette sequence failed', err);
        await recover(t, to);
        current.current = null;
      }
    },
    [to],
  );

  const back = useCallback(async () => {
    if (stateRef.current !== 'VIEWING_PROJECT') return;
    try {
      await playBackSequence(current.current, to);
    } catch (err) {
      console.error('Back sequence failed', err);
      await recover(current.current, to);
    }
    current.current = null;
  }, [to]);

  return { state, hintVisible, select, back, introDone };
}

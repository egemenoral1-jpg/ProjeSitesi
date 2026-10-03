import { useCallback, useRef, useState } from 'react';
import { canTransition, type SceneState } from '../state/machine';
import { TAPES } from '../data/tapes';
import { playBackSequence, playCassetteSequence, recover } from '../animations/sequence';

const HINT_KEY = 'hint-dismissed';

/**
 * Owns the interaction state machine. React state is only updated when the
 * high-level state changes (about ten times per cassette); all motion is
 * imperative GSAP, outside React.
 */
export function useSceneInteraction() {
  const stateRef = useRef<SceneState>('INTRO');
  const [state, setStateUI] = useState<SceneState>('INTRO');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(() => {
    try {
      return sessionStorage.getItem(HINT_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const cassetteEl = useRef<HTMLElement | null>(null);
  const tapeRef = useRef<(typeof TAPES)[number] | null>(null);

  /** Ask for a transition; returns false (and does nothing) if it is not allowed right now. */
  const to = useCallback((next: SceneState) => {
    if (!canTransition(stateRef.current, next)) return false;
    stateRef.current = next;
    setStateUI(next);
    return true;
  }, []);

  const introDone = useCallback(() => void to('IDLE'), [to]);

  const select = useCallback(
    async (id: string, el: HTMLElement) => {
      if (stateRef.current !== 'IDLE') return;
      const tape = TAPES.find((t) => t.id === id);
      if (!tape) return;
      setHintVisible(false);
      try {
        sessionStorage.setItem(HINT_KEY, '1');
      } catch {
        /* ignore */
      }
      setSelectedId(id);
      cassetteEl.current = el;
      tapeRef.current = tape;
      try {
        await playCassetteSequence(el, tape, to);
      } catch (err) {
        console.error('Cassette sequence failed', err);
        await recover(el, to);
        setSelectedId(null);
      }
    },
    [to],
  );

  const back = useCallback(async () => {
    if (stateRef.current !== 'VIEWING_PROJECT') return;
    try {
      await playBackSequence(cassetteEl.current, tapeRef.current, to);
    } catch (err) {
      console.error('Back sequence failed', err);
      await recover(cassetteEl.current, to);
    }
    setSelectedId(null);
    cassetteEl.current = null;
    tapeRef.current = null;
  }, [to]);

  return { state, selectedId, hintVisible, select, back, introDone, busy: state !== 'IDLE' };
}

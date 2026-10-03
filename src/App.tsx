import { useCallback, useEffect, useState } from 'react';
import { sfx } from './audio/audio';
import { IntroSequence } from './components/intro/IntroSequence';
import { Scanlines } from './components/effects/Scanlines';
import { Stage3D } from './components/Stage3D';
import { TVOverlay } from './components/television/TVOverlay';
import { useSceneInteraction } from './hooks/useSceneInteraction';
import type { TapeObject } from './three/World';

export default function App() {
  const { state, hintVisible, select, back, introDone } = useSceneInteraction();
  const [sound, setSound] = useState(() => sfx.isEnabled());
  const [ready, setReady] = useState(false);
  const [tip, setTip] = useState<{ title: string; x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.state = state;
  }, [state]);

  // browsers only allow audio after a user gesture: start the music on the first click / key press
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const onHover = useCallback((t: TapeObject | null, at: { x: number; y: number } | null) => {
    setTip(t && at ? { title: t.tape.title, x: at.x, y: at.y } : null);
  }, []);
  const onSelect = useCallback(
    (t: TapeObject) => {
      setTip(null);
      void select(t);
    },
    [select],
  );

  return (
    <>
      <Stage3D onReady={() => setReady(true)} onSelect={onSelect} onHover={onHover} />
      <TVOverlay onBack={back} />
      {tip && state === 'IDLE' && (
        <div className="tape-tip" style={{ left: tip.x, top: tip.y }}>
          {tip.title}
        </div>
      )}
      <Scanlines strength="page" />
      {state === 'IDLE' && hintVisible && <div className="hint">Click a cassette.</div>}
      <a className="cv-link" href="https://egemenoral.com/" title="Back to my CV">
        ← CV
      </a>
      <button
        type="button"
        className="sound-toggle"
        aria-pressed={sound}
        onClick={() => {
          sfx.setEnabled(!sound);
          setSound(!sound);
        }}
      >
        ♪ {sound ? 'ON' : 'OFF'}
      </button>
      {state === 'INTRO' && <IntroSequence onDone={introDone} ready={ready} />}
    </>
  );
}

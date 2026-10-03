import { useEffect, useState } from 'react';
import { sfx } from './audio/audio';
import { IntroSequence } from './components/intro/IntroSequence';
import { Scanlines } from './components/effects/Scanlines';
import { Scene } from './components/scene/Scene';
import { useParallax } from './hooks/useParallax';
import { useSceneInteraction } from './hooks/useSceneInteraction';

export default function App() {
  const { state, selectedId, hintVisible, select, back, introDone, busy } = useSceneInteraction();
  const [sound, setSound] = useState(false);
  useParallax();

  useEffect(() => {
    document.documentElement.dataset.state = state;
  }, [state]);

  return (
    <>
      <Scene selectedId={selectedId} busy={busy} onSelect={select} onBack={back} />
      <Scanlines strength="page" />
      {state === 'IDLE' && hintVisible && <div className="hint">Click a cassette.</div>}
      <button
        type="button"
        className="sound-toggle"
        aria-pressed={sound}
        onClick={() => {
          sfx.setEnabled(!sound);
          setSound(!sound);
        }}
      >
        SOUND {sound ? 'ON' : 'OFF'}
      </button>
      {state === 'INTRO' && <IntroSequence onDone={introDone} />}
    </>
  );
}

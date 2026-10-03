import { memo } from 'react';
import type { Tape } from '../../data/tapes';
import type { TVPhase } from '../../animations/rig';
import { Scanlines } from '../effects/Scanlines';
import { VHSNoise } from '../effects/VHSNoise';
import { ProjectScreen } from './ProjectScreen';
import { TVEffects } from './TVEffects';

interface Props {
  phase: TVPhase;
  tape: Tape | null;
  onBack: () => void;
}

const NOISY: TVPhase[] = ['static', 'noise', 'glitch'];

/** The glass of the CRT: everything the visitor reads is drawn in here. */
export const TVScreen = memo(function TVScreen({ phase, tape, onBack }: Props) {
  const showContent = !!tape && (phase === 'tracking' || phase === 'project' || phase === 'shutdown');
  return (
    <div className={`tv-screen phase-${phase}`}>
      <div className="tv-picture">
        <VHSNoise active={NOISY.includes(phase)} />
        {showContent && tape && <ProjectScreen tape={tape} onBack={onBack} />}
        <TVEffects phase={phase} />
      </div>
      <Scanlines />
      <div className="tv-glass" />
    </div>
  );
});

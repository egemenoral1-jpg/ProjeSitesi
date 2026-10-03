import { memo } from 'react';
import type { TVPhase } from '../../animations/rig';

/** Overlay layers whose look is driven entirely by CSS (see tv.css) from the phase class. */
export const TVEffects = memo(function TVEffects({ phase }: { phase: TVPhase }) {
  return (
    <>
      <div className="fx fx-rgb" data-phase={phase} />
      <div className="fx fx-tracking" data-phase={phase} />
      <div className="fx fx-flash" data-phase={phase} />
    </>
  );
});

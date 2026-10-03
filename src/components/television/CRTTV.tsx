import { memo, useEffect, useMemo, useState } from 'react';
import { ASSETS } from '../../config/assets';
import { TV } from '../../config/layout';
import type { Tape } from '../../data/tapes';
import { registerRig, type TVHandle, type TVPhase } from '../../animations/rig';
import { TVScreen } from './TVScreen';

/**
 * The CRT television: frame image + screen. Its only link to the animation
 * system is the TVHandle registered in the rig.
 */
export const CRTTV = memo(function CRTTV({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<TVPhase>('off');
  const [tape, setTape] = useState<Tape | null>(null);

  const handle = useMemo<TVHandle>(() => ({ setPhase, show: setTape }), []);
  useEffect(() => registerRig({ tv: handle }), [handle]);

  return (
    <div className="tv" style={{ left: TV.x, top: TV.y, width: TV.w, height: TV.h }}>
      <img className="abs" src={ASSETS.tv.frame} alt="" draggable={false} style={{ left: 0, top: 0, width: TV.w, height: TV.h }} />
      <div className="tv-window" style={{ left: TV.screen.x, top: TV.screen.y, width: TV.screen.w, height: TV.screen.h }}>
        <TVScreen phase={phase} tape={tape} onBack={onBack} />
      </div>
      <div className={`tv-led${phase === 'off' ? '' : ' on'}`} />
    </div>
  );
});

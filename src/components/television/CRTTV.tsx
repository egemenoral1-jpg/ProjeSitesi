import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS } from '../../config/assets';
import { TAPE, TV } from '../../config/layout';
import type { Tape } from '../../data/tapes';
import { registerRig, type TVHandle, type TVPhase } from '../../animations/rig';
import { TapeGraphic } from '../cassette/TapeGraphic';
import { TVScreen } from './TVScreen';

/**
 * The CRT television: frame image + screen + the tape that sits in the VCR slot.
 * Its only link to the animation system is what it registers in the rig.
 */
export const CRTTV = memo(function CRTTV({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<TVPhase>('off');
  const [tape, setTape] = useState<Tape | null>(null);
  const slotTape = useRef<HTMLDivElement>(null);

  const handle = useMemo<TVHandle>(() => ({ setPhase, show: setTape }), []);
  useEffect(() => registerRig({ tv: handle, slotTape: slotTape.current! }), [handle]);

  return (
    <div className="tv" style={{ left: TV.x, top: TV.y, width: TV.w, height: TV.h }}>
      <img className="abs" src={ASSETS.tv.frame} alt="" draggable={false} style={{ left: 0, top: 0, width: TV.w, height: TV.h }} />
      <div className="tv-window" style={{ left: TV.screen.x, top: TV.screen.y, width: TV.screen.w, height: TV.screen.h }}>
        <TVScreen phase={phase} tape={tape} onBack={onBack} />
      </div>
      <div
        ref={slotTape}
        className="slot-tape tape"
        style={{ left: TV.slot.x - TAPE.w / 2, top: TV.slot.y - TAPE.h / 2, width: TAPE.w, height: TAPE.h }}
      >
        <TapeGraphic />
      </div>
      <div className={`tv-led${phase === 'off' ? '' : ' on'}`} />
    </div>
  );
});

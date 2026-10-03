import { forwardRef } from 'react';
import { ARMS, TAPE } from '../../config/layout';
import { TapeGraphic } from '../cassette/TapeGraphic';

interface Props {
  src: string;
  side: 'left' | 'right';
  heldRef: React.Ref<HTMLDivElement>;
}

/**
 * A hand layer. The tape it carries lives inside it, under the fingers, offset so
 * the hand grips the tape's outer end (right hand -> right end, left hand -> left end).
 */
export const MordecaiHand = forwardRef<HTMLDivElement, Props>(function MordecaiHand({ src, side, heldRef }, ref) {
  const h = ARMS.hand;
  const offset = side === 'right' ? -ARMS.grip : ARMS.grip;
  return (
    <div ref={ref} className="m-hand" style={{ left: -h / 2, top: -h / 2, width: h, height: h }}>
      <div
        ref={heldRef}
        className="held tape"
        style={{ left: h / 2 + offset - TAPE.w / 2, top: (h - TAPE.h) / 2, width: TAPE.w, height: TAPE.h }}
      >
        <TapeGraphic />
      </div>
      <img className="m-hand-img" src={src} alt="" draggable={false} />
    </div>
  );
});

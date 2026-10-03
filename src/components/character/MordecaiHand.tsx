import { forwardRef } from 'react';
import { ASSETS } from '../../config/assets';
import { CHARACTER, TAPE } from '../../config/layout';

interface Props {
  src: string;
  heldRef: React.Ref<HTMLDivElement>;
}

/** A hand layer. The cassette it carries lives inside it, drawn under the fingers. */
export const MordecaiHand = forwardRef<HTMLDivElement, Props>(function MordecaiHand({ src, heldRef }, ref) {
  const h = CHARACTER.handSize;
  return (
    <div ref={ref} className="m-hand" style={{ left: -h / 2, top: -h / 2, width: h, height: h }}>
      <div ref={heldRef} className="held" style={{ left: (h - TAPE.frontW) / 2, top: (h - TAPE.frontH) / 2, width: TAPE.frontW, height: TAPE.frontH }}>
        <img src={ASSETS.cassettes.front} alt="" draggable={false} />
        <span className="held-label" />
      </div>
      <img className="m-hand-img" src={src} alt="" draggable={false} />
    </div>
  );
});

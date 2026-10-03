import { forwardRef } from 'react';
import { ARMS } from '../../config/layout';

interface Props {
  src: string;
  side: 'left' | 'right';
}

/** A sleeve anchored at the shoulder (below the stage), rotated/stretched by the animation code. */
export const MordecaiArm = forwardRef<HTMLImageElement, Props>(function MordecaiArm({ src, side }, ref) {
  const s = ARMS.shoulders[side];
  return (
    <img
      ref={ref}
      className="m-arm"
      src={src}
      alt=""
      draggable={false}
      style={{ left: s.x - ARMS.w / 2, top: s.y, width: ARMS.w, height: ARMS.len }}
    />
  );
});

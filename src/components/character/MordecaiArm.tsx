import { forwardRef } from 'react';
import { CHARACTER } from '../../config/layout';

interface Props {
  src: string;
  side: 'left' | 'right';
}

/** An arm layer: a tube anchored at the shoulder, rotated/stretched by the animation code. */
export const MordecaiArm = forwardRef<HTMLImageElement, Props>(function MordecaiArm({ src, side }, ref) {
  const sx = side === 'left' ? -CHARACTER.shoulderX : CHARACTER.shoulderX;
  return (
    <img
      ref={ref}
      className="m-arm"
      src={src}
      alt=""
      draggable={false}
      style={{ left: sx - CHARACTER.armW / 2, top: CHARACTER.shoulderY, width: CHARACTER.armW, height: CHARACTER.armLen }}
    />
  );
});

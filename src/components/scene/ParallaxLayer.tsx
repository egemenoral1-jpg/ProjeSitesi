import { memo, useEffect, useRef, type ReactNode } from 'react';
import { PARALLAX, type ParallaxId } from '../../config/layout';
import { registerLayer } from '../../utils/parallaxStore';

interface Props {
  id: ParallaxId;
  children: ReactNode;
}

/** One independent 2D layer. It is moved with a GPU transform by the parallax store, never by React. */
export const ParallaxLayer = memo(function ParallaxLayer({ id, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? registerLayer(ref.current, PARALLAX[id]) : undefined), [id]);
  return (
    <div ref={ref} className={`layer layer-${id}`}>
      {children}
    </div>
  );
});

import { useEffect } from 'react';
import { setPointer } from '../utils/parallaxStore';

/** Mouse parallax. Touch pointers are ignored, so phones keep a static room. */
export function useParallax() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}

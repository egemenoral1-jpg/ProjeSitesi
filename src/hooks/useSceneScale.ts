import { useEffect, useRef, type RefObject } from 'react';
import { STAGE } from '../config/layout';

/**
 * Fits the 1600x900 design stage into the viewport with one CSS transform.
 * Landscape: show the whole stage. Portrait: crop to the playable middle strip
 * (tape stacks + TV) and scale that to the width, so the room is never turned into
 * a regular mobile layout.
 */
export function useSceneScale(sceneRef: RefObject<HTMLElement>) {
  const scale = useRef(1);

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const portrait = vh > vw * 1.05;
      const s = portrait ? Math.min(vw / 1420, vh / 760) : Math.min(vw / STAGE.w, vh / STAGE.h);
      scale.current = s;
      const el = sceneRef.current;
      if (el) {
        el.style.transform = `translate(-50%, -50%) scale(${s})`;
        // On tall screens the area above the stage continues the upper wall, the area below the floor.
        const top = vh / 2 - (STAGE.h / 2) * s + 4;
        (el.parentElement as HTMLElement).style.background = `linear-gradient(#a3a3aa ${top}px, #7a7d88 ${top}px)`;
      }
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, [sceneRef]);

  return scale;
}

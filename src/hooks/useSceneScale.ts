import { useEffect, useRef, type RefObject } from 'react';
import { STAGE } from '../config/layout';

/**
 * Fits the 1600x900 design stage into the viewport with one CSS transform.
 * Landscape: show the whole stage. Portrait: crop to the playable middle strip
 * (shelf + TV) and scale that to the width, so the room is never turned into
 * a regular mobile layout.
 */
const HORIZON_Y = 646; // where wall meets floor, in stage coordinates

export function useSceneScale(sceneRef: RefObject<HTMLElement>) {
  const scale = useRef(1);

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const portrait = vh > vw * 1.05;
      const s = portrait ? Math.min(vw / 1180, vh / 700) : Math.min(vw / STAGE.w, vh / STAGE.h);
      scale.current = s;
      const el = sceneRef.current;
      if (el) {
        el.style.transform = `translate(-50%, -50%) scale(${s})`;
        // On tall screens the area above/below the stage continues the wall and the floor.
        const horizon = vh / 2 + (HORIZON_Y - STAGE.h / 2) * s;
        (el.parentElement as HTMLElement).style.background = `linear-gradient(#1e1630 ${horizon}px, #24160f ${horizon}px)`;
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

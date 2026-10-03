import { useEffect, useState } from 'react';
import { useTV } from '../../state/tvBus';
import { getWorld } from '../../three/World';
import { Scanlines } from '../effects/Scanlines';
import { ProjectScreen } from './ProjectScreen';

/**
 * The project "plays" on the CRT: when the camera faces the screen this HTML
 * layer is placed exactly over the 3D screen, with CRT/VHS effects on top.
 */
export function TVOverlay({ onBack }: { onBack: () => void }) {
  const { phase, tape } = useTV();
  const visible = !!tape && (phase === 'tracking' || phase === 'project');
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    // follow the screen while the camera settles, then on resize
    const follow = () => {
      try {
        const r = getWorld().screenRect();
        setRect((old) =>
          old && Math.abs(old.left - r.left) < 0.5 && Math.abs(old.top - r.top) < 0.5 && Math.abs(old.width - r.width) < 0.5 ? old : r,
        );
      } catch {
        /* not ready */
      }
      raf = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible || !tape || !rect) return null;
  const fontSize = Math.max(13, Math.min(21, rect.width / 30));
  return (
    <div
      className={`tv-overlay phase-${phase}`}
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, fontSize, ['--c' as string]: lighten(tape.color) }}
    >
      <ProjectScreen tape={tape} onBack={onBack} />
      <div className="fx-tracking" />
      <Scanlines />
      <div className="tv-glass" />
    </div>
  );
}

/** Label colours are dark (for white text on the cassette); on the screen we need a bright accent. */
function lighten(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.55);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}

import { memo, useEffect, useRef } from 'react';
import { setWorld, World, type TapeObject } from '../three/World';

interface Props {
  onReady: () => void;
  onSelect: (t: TapeObject) => void;
  onHover: (t: TapeObject | null, at: { x: number; y: number } | null) => void;
}

/** Mounts the three.js world on a full-screen canvas. */
export const Stage3D = memo(function Stage3D({ onReady, onSelect, onHover }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const handlers = useRef({ onSelect, onHover, onReady });
  handlers.current = { onSelect, onHover, onReady };

  useEffect(() => {
    const world = new World(canvas.current!);
    world.onSelect = (t) => handlers.current.onSelect(t);
    world.onHover = (t, at) => handlers.current.onHover(t, at);
    setWorld(world);
    if (import.meta.env.DEV) (window as unknown as { world: World }).world = world;
    let alive = true;
    world.build().then(() => alive && handlers.current.onReady());
    return () => {
      alive = false;
      setWorld(null);
      world.dispose();
    };
  }, []);

  return <canvas ref={canvas} className="stage3d" />;
});

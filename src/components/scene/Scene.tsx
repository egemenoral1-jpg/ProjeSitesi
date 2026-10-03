import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { STAGE, TAPE_IN_SLOT_SCALE } from '../../config/layout';
import { getRig, registerRig } from '../../animations/rig';
import { initCamera } from '../../animations/cameraAnimations';
import { initArms } from '../../animations/characterAnimations';
import { useSceneScale } from '../../hooks/useSceneScale';
import { CassetteShelf } from '../cassette/CassetteShelf';
import { Mordecai } from '../character/Mordecai';
import { CRTTV } from '../television/CRTTV';
import { Lighting } from './Lighting';
import { ParallaxLayer } from './ParallaxLayer';
import { Background, Room } from './Room';

interface SceneProps {
  selectedId: string | null;
  busy: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
  onBack: () => void;
}

/**
 * Layer stack (bottom -> top):
 *  background, room (wall + table), tape stacks, TV, Mordecai's arms, lighting.
 * Each layer is an independent 2D plane with its own parallax depth.
 * The `.camera` wrapper is the 2D camera: GSAP moves/zooms it with a single transform.
 */
export function Scene({ selectedId, busy, onSelect, onBack }: SceneProps) {
  const scene = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const scale = useSceneScale(scene);

  useEffect(() => {
    registerRig({ scene: scene.current!, camera: camera.current!, scale: () => scale.current });
    initCamera();
    initArms();
    gsap.set(getRig().slotTape, { autoAlpha: 0, scale: TAPE_IN_SLOT_SCALE, transformOrigin: '50% 50%' });
  }, [scale]);

  return (
    <div className="viewport">
      <div ref={scene} className="scene" data-tv="off" style={{ width: STAGE.w, height: STAGE.h }}>
        <div ref={camera} className="camera">
          <ParallaxLayer id="background">
            <Background />
          </ParallaxLayer>
          <ParallaxLayer id="room">
            <Room />
          </ParallaxLayer>
          <ParallaxLayer id="furniture">
            <CassetteShelf selectedId={selectedId} disabled={busy} onSelect={onSelect} />
          </ParallaxLayer>
          <ParallaxLayer id="tv">
            <CRTTV onBack={onBack} />
          </ParallaxLayer>
          <ParallaxLayer id="character">
            <Mordecai />
          </ParallaxLayer>
          <Lighting />
        </div>
      </div>
    </div>
  );
}

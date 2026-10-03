import { useEffect, useRef } from 'react';
import { STAGE } from '../../config/layout';
import { registerRig } from '../../animations/rig';
import { initCamera } from '../../animations/cameraAnimations';
import { initCharacter } from '../../animations/characterAnimations';
import { useSceneScale } from '../../hooks/useSceneScale';
import { CassetteShelf } from '../cassette/CassetteShelf';
import { Mordecai } from '../character/Mordecai';
import { CRTTV } from '../television/CRTTV';
import { Foreground, Furniture, Props } from './Furniture';
import { Lighting } from './Lighting';
import { ParallaxLayer } from './ParallaxLayer';
import { Background, Room } from './Room';

interface Props_ {
  selectedId: string | null;
  busy: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
  onBack: () => void;
}

/**
 * Layer stack (bottom -> top):
 *  background, room, furniture + cassettes, props, TV, Mordecai (so his arm can reach in front of the TV),
 *  foreground, lighting. Each layer is an independent 2D plane with its own parallax depth.
 * The `.camera` wrapper is the 2D camera: GSAP moves/zooms it with a single transform.
 */
export function Scene({ selectedId, busy, onSelect, onBack }: Props_) {
  const scene = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const scale = useSceneScale(scene);

  useEffect(() => {
    registerRig({ scene: scene.current!, camera: camera.current!, scale: () => scale.current });
    initCamera();
    initCharacter();
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
            <Furniture />
            <CassetteShelf selectedId={selectedId} disabled={busy} onSelect={onSelect} />
          </ParallaxLayer>
          <ParallaxLayer id="props">
            <Props />
          </ParallaxLayer>
          <ParallaxLayer id="tv">
            <CRTTV onBack={onBack} />
          </ParallaxLayer>
          <ParallaxLayer id="character">
            <Mordecai />
          </ParallaxLayer>
          <ParallaxLayer id="foreground">
            <Foreground />
          </ParallaxLayer>
          <Lighting />
        </div>
      </div>
    </div>
  );
}

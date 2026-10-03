import { memo, useEffect, useRef } from 'react';
import { ASSETS } from '../../config/assets';
import { registerRig } from '../../animations/rig';
import { MordecaiArm } from './MordecaiArm';
import { MordecaiHand } from './MordecaiHand';

const art = ASSETS.characters.mordecai;

/**
 * Only Mordecai's arms appear in the shot: sleeve + hand per side, each a separate image layer.
 * They are hidden until a cassette is picked, then reach in from the bottom corners.
 */
export const Mordecai = memo(function Mordecai() {
  const armL = useRef<HTMLImageElement>(null);
  const armR = useRef<HTMLImageElement>(null);
  const handL = useRef<HTMLDivElement>(null);
  const handR = useRef<HTMLDivElement>(null);
  const heldL = useRef<HTMLDivElement>(null);
  const heldR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerRig({
      arms: {
        left: { arm: armL.current!, hand: handL.current!, held: heldL.current! },
        right: { arm: armR.current!, hand: handR.current!, held: heldR.current! },
      },
    });
  }, []);

  return (
    <div className="arms">
      <MordecaiArm ref={armL} src={art.leftArm} side="left" />
      <MordecaiArm ref={armR} src={art.rightArm} side="right" />
      <MordecaiHand ref={handL} heldRef={heldL} src={art.leftHand} side="left" />
      <MordecaiHand ref={handR} heldRef={heldR} src={art.rightHand} side="right" />
    </div>
  );
});

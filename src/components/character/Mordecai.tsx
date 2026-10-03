import { memo, useEffect, useRef } from 'react';
import { ASSETS } from '../../config/assets';
import { CHARACTER } from '../../config/layout';
import { registerRig } from '../../animations/rig';
import { MordecaiArm } from './MordecaiArm';
import { MordecaiHand } from './MordecaiHand';

const art = ASSETS.characters.mordecai;

/**
 * Mordecai = body + two arms + two hands, each a separate image layer.
 * The origin of #character is the centre of his feet; the animation code moves it with `x`.
 */
export const Mordecai = memo(function Mordecai() {
  const character = useRef<HTMLDivElement>(null);
  const bob = useRef<HTMLDivElement>(null);
  const armL = useRef<HTMLImageElement>(null);
  const armR = useRef<HTMLImageElement>(null);
  const handL = useRef<HTMLDivElement>(null);
  const handR = useRef<HTMLDivElement>(null);
  const heldL = useRef<HTMLDivElement>(null);
  const heldR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerRig({
      character: character.current!,
      bob: bob.current!,
      arms: {
        left: { arm: armL.current!, hand: handL.current!, held: heldL.current! },
        right: { arm: armR.current!, hand: handR.current!, held: heldR.current! },
      },
    });
  }, []);

  return (
    <div ref={character} className="character" style={{ top: CHARACTER.floorY }}>
      <div ref={bob} className="bob">
        <img
          className="m-body"
          src={art.body}
          alt="Mordecai"
          draggable={false}
          style={{ left: -CHARACTER.bodyW / 2, top: -CHARACTER.bodyH, width: CHARACTER.bodyW, height: CHARACTER.bodyH }}
        />
        <MordecaiArm ref={armL} src={art.leftArm} side="left" />
        <MordecaiArm ref={armR} src={art.rightArm} side="right" />
        <MordecaiHand ref={handL} heldRef={heldL} src={art.leftHand} />
        <MordecaiHand ref={handR} heldRef={heldR} src={art.rightHand} />
      </div>
    </div>
  );
});

import { memo } from 'react';
import { ASSETS } from '../../config/assets';
import { SHELF, TV } from '../../config/layout';

/** Furniture that sits behind the character. Positions are design pixels. */
export const Furniture = memo(function Furniture() {
  return (
    <>
      <img className="abs" src={ASSETS.furniture.plant} alt="" draggable={false} decoding="async" style={{ left: 110, top: 528, width: 170, height: 300 }} />
      <img className="abs" src={ASSETS.furniture.lamp} alt="" draggable={false} decoding="async" style={{ left: 1470, top: 330, width: 140, height: 420 }} />
      <img className="abs" src={ASSETS.furniture.armchair} alt="" draggable={false} decoding="async" style={{ left: 1400, top: 570, width: 260, height: 260 }} />
      <img className="abs" src={ASSETS.furniture.rug} alt="" draggable={false} decoding="async" style={{ left: 330, top: 760, width: 760, height: 170 }} />
      <img className="abs" src={ASSETS.furniture.shelf} alt="" draggable={false} decoding="async" style={{ left: SHELF.x, top: SHELF.y, width: SHELF.w, height: SHELF.h }} />
      <img className="abs" src={ASSETS.furniture.tvStand} alt="" draggable={false} decoding="async" style={{ left: TV.x - 30, top: TV.y + TV.h - 8, width: 560, height: 190 }} />
    </>
  );
});

export const Props = memo(function Props() {
  return <img className="abs" src={ASSETS.props.cans} alt="" draggable={false} decoding="async" style={{ left: 230, top: 770, width: 120, height: 70 }} />;
});

export const Foreground = memo(function Foreground() {
  return <img className="abs" src={ASSETS.props.pizza} alt="" draggable={false} decoding="async" style={{ left: 1130, top: 818, width: 200, height: 90 }} />;
});

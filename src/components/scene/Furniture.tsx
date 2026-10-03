import { memo } from 'react';
import { ASSETS } from '../../config/assets';
import { TABLE_Y } from '../../config/layout';

/** Things standing on the table around the TV. Positions are design pixels. */
export const Furniture = memo(function Furniture() {
  return (
    <>
      <img className="abs" src={ASSETS.furniture.plant} alt="" draggable={false} decoding="async" style={{ left: -20, top: TABLE_Y - 300, width: 170, height: 300 }} />
      <img className="abs" src={ASSETS.furniture.lamp} alt="" draggable={false} decoding="async" style={{ left: 1470, top: TABLE_Y - 420, width: 140, height: 420 }} />
    </>
  );
});

export const Props = memo(function Props() {
  return <img className="abs" src={ASSETS.props.cans} alt="" draggable={false} decoding="async" style={{ left: 1455, top: TABLE_Y - 66, width: 120, height: 70 }} />;
});

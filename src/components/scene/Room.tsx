import { memo } from 'react';
import { ASSETS } from '../../config/assets';

/** Far background (night outside the stage) and the room shell: wall, floor, window, poster. */
export const Background = memo(function Background() {
  return <img className="abs" src={ASSETS.background} alt="" draggable={false} decoding="async" style={{ left: -800, top: -450, width: 3200, height: 1800 }} />;
});

export const Room = memo(function Room() {
  return <img className="abs" src={ASSETS.room} alt="" draggable={false} decoding="async" style={{ left: -250, top: -30, width: 2100, height: 960 }} />;
});

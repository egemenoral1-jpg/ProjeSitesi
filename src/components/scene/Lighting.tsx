import { memo } from 'react';

/** Soft CRT glow on the wall and table; it brightens while a tape plays (`data-tv` on the scene). */
export const Lighting = memo(function Lighting() {
  return (
    <div className="lighting" aria-hidden="true">
      <div className="light tv-glow" />
      <div className="light tv-table" />
    </div>
  );
});

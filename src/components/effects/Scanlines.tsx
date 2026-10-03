import { memo } from 'react';

/** Pure CSS scanlines + vignette. `strength` picks the intensity variant. */
export const Scanlines = memo(function Scanlines({ strength = 'screen' }: { strength?: 'screen' | 'page' }) {
  return <div className={`scanlines scanlines-${strength}`} aria-hidden="true" />;
});

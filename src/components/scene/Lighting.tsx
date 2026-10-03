import { memo } from 'react';

const MOTES = Array.from({ length: 12 }, (_, i) => ({
  left: 120 + ((i * 197) % 1360),
  top: 120 + ((i * 131) % 480),
  delay: -((i * 1.7) % 12),
  dur: 14 + (i % 5) * 3,
  size: 2 + (i % 3),
}));

/** Light pools + dust. Pure CSS; brightness of the TV glow follows `data-tv` on the scene. */
export const Lighting = memo(function Lighting() {
  return (
    <div className="lighting" aria-hidden="true">
      <div className="light shade" />
      <div className="light lamp" />
      <div className="light tv-glow" />
      <div className="light tv-table" />
      {MOTES.map((m, i) => (
        <i key={i} className="mote" style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s`, animationDuration: `${m.dur}s` }} />
      ))}
    </div>
  );
});

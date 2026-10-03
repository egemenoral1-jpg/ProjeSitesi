import { memo, useState } from 'react';
import { ASSETS } from '../../config/assets';
import { TAPE, cassettePosition } from '../../config/layout';
import type { Tape } from '../../data/tapes';

interface Props {
  tape: Tape;
  index: number;
  total: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
}

/** One cassette standing on the shelf. Generic: it only knows the Tape it is given. */
export const VHSCassette = memo(function VHSCassette({ tape, index, total, selected, disabled, onSelect }: Props) {
  const pos = cassettePosition(index, total);
  const [tip, setTip] = useState(false);
  return (
    <button
      type="button"
      className={`cassette${selected ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}${tip ? ' show-tip' : ''}`}
      style={{
        left: pos.x - TAPE.spineW / 2,
        top: pos.y - TAPE.spineH / 2,
        width: TAPE.spineW,
        height: TAPE.spineH,
        // @ts-expect-error CSS custom property
        '--c': tape.color,
      }}
      data-cassette-id={tape.id}
      data-cx={pos.x}
      data-cy={pos.y}
      aria-label={`${tape.title} cassette`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={() => setTip(true)}
      onPointerLeave={() => setTip(false)}
      onBlur={() => setTip(false)}
      onClick={(e) => {
        if (!disabled) onSelect(tape.id, e.currentTarget);
      }}
    >
      <img className="cassette-art" src={ASSETS.cassettes.spine} alt="" draggable={false} />
      <span className="cassette-label">
        <b>{tape.label}</b>
      </span>
      <span className="cassette-tip">{tape.title}</span>
    </button>
  );
});

import { memo, useState } from 'react';
import { TAPE, tapePosition, type StackId } from '../../config/layout';
import type { Tape } from '../../data/tapes';
import { TapeGraphic } from './TapeGraphic';

interface Props {
  tape: Tape;
  stack: StackId;
  slot: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
}

/** One cassette lying in a stack. Generic: it only knows the Tape it is given. */
export const VHSCassette = memo(function VHSCassette({ tape, stack, slot, selected, disabled, onSelect }: Props) {
  const pos = tapePosition(stack, slot);
  const [tip, setTip] = useState(false);
  return (
    <button
      type="button"
      className={`cassette tape stack-${stack}${selected ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}${tip ? ' show-tip' : ''}`}
      style={{
        left: pos.x - TAPE.w / 2,
        top: pos.y - TAPE.h / 2,
        width: TAPE.w,
        height: TAPE.h,
        ['--c' as string]: tape.color,
      }}
      data-cassette-id={tape.id}
      data-stack={stack}
      data-slot={slot}
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
      <TapeGraphic label={tape.label} />
      <span className="cassette-tip">{tape.title}</span>
    </button>
  );
});

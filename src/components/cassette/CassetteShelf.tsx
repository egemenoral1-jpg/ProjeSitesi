import { memo } from 'react';
import type { StackId } from '../../config/layout';
import { TAPES, type Tape } from '../../data/tapes';
import { VHSCassette } from './VHSCassette';

interface Props {
  selectedId: string | null;
  disabled: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
}

/** Projects are stacked on the left of the TV, About / Skills / Contact on the right. */
const stackOf = (t: Tape): StackId => (t.kind === 'project' ? 'left' : 'right');

export const CassetteShelf = memo(function CassetteShelf({ selectedId, disabled, onSelect }: Props) {
  const counters: Record<StackId, number> = { left: 0, right: 0 };
  return (
    <>
      {TAPES.map((t) => {
        const stack = stackOf(t);
        const slot = counters[stack]++;
        return (
          <VHSCassette
            key={t.id}
            tape={t}
            stack={stack}
            slot={slot}
            selected={selectedId === t.id}
            disabled={disabled}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
});

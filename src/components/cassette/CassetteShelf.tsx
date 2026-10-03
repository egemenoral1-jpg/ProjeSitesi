import { memo } from 'react';
import { TAPES } from '../../data/tapes';
import { VHSCassette } from './VHSCassette';

interface Props {
  selectedId: string | null;
  disabled: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
}

export const CassetteShelf = memo(function CassetteShelf({ selectedId, disabled, onSelect }: Props) {
  return (
    <>
      {TAPES.map((t, i) => (
        <VHSCassette key={t.id} tape={t} index={i} total={TAPES.length} selected={selectedId === t.id} disabled={disabled} onSelect={onSelect} />
      ))}
    </>
  );
});

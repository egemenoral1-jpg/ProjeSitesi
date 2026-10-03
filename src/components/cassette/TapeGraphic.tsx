import { ASSETS } from '../../config/assets';

/** The spine of a VHS tape: art + label. Shared by the stacks, the hand and the VCR slot. */
export function TapeGraphic({ label }: { label?: string }) {
  return (
    <>
      <img className="tape-art" src={ASSETS.cassettes.spine} alt="" draggable={false} />
      <span className="tape-label">
        <b>{label}</b>
      </span>
    </>
  );
}

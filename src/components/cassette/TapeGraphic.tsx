import { ASSETS } from '../../config/assets';
import { TAPE } from '../../config/layout';
import { labelFontSize } from '../../utils/tapeLabel';

/**
 * A VHS tape seen from the front with a bit of its top: art + coloured label with hand-lettered title.
 * The element box is the front face; the top face is drawn above it.
 * Shared by the stacks, the hand and the VCR slot.
 */
export function TapeGraphic({ label }: { label?: string }) {
  return (
    <>
      <img className="tape-art" src={ASSETS.cassettes.tape} alt="" draggable={false} style={{ top: -TAPE.top, height: TAPE.h + TAPE.top }} />
      <span className="tape-label">
        <b style={{ fontSize: labelFontSize(label) }}>{label}</b>
      </span>
    </>
  );
}

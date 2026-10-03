/**
 * Scene geometry, all in "design pixels" on a 1600x900 stage.
 * The whole scene is scaled to the viewport with a single CSS transform.
 *
 * Composition: close-up of a CRT on a table, cassettes stacked on both sides,
 * Mordecai's arms reach in from the bottom corners.
 */
export const STAGE = { w: 1600, h: 900 } as const;

/** Top surface of the table everything stands on. */
export const TABLE_Y = 652;
/** Where wall meets table/floor in the room art (used to colour the area outside the stage on tall screens). */
export const HORIZON_Y = 652;

export const TV = {
  x: 480,
  y: 96,
  w: 640,
  h: 560,
  screen: { x: 42, y: 38, w: 456, h: 342 },
  /** VCR slot centre and size, relative to the TV */
  slot: { x: 270, y: 468, w: 340, h: 54 },
} as const;

export const TV_SLOT_ABS = { x: TV.x + TV.slot.x, y: TV.y + TV.slot.y } as const;
export const TV_SCREEN_ABS = {
  x: TV.x + TV.screen.x + TV.screen.w / 2,
  y: TV.y + TV.screen.y + TV.screen.h / 2,
} as const;

/** A cassette lying flat, seen from its spine (the label side). */
export const TAPE = { w: 270, h: 46, gap: 3 } as const;
/** How big the cassette looks once it is pushed into the slot (it moves away from the camera). */
export const TAPE_IN_SLOT_SCALE = 0.9;

export type StackId = 'left' | 'right';
export const STACKS: Record<StackId, { x: number; baseY: number }> = {
  left: { x: 300, baseY: TABLE_Y },
  right: { x: 1300, baseY: TABLE_Y },
};

/** Centre of the n-th tape (0 = bottom) in a stack. */
export function tapePosition(stack: StackId, slot: number) {
  const s = STACKS[stack];
  return { x: s.x, y: s.baseY - (slot + 0.5) * (TAPE.h + TAPE.gap) };
}

/**
 * Mordecai's arms. Each arm is a sleeve anchored at a shoulder below the
 * bottom corner of the stage; it rotates and stretches so the hand lands on a target.
 */
export const ARMS = {
  shoulders: {
    left: { x: 120, y: 1260 },
    right: { x: 1480, y: 1260 },
  },
  len: 1000, // length of the arm image (max reach)
  min: 160,
  w: 96,
  hand: 120,
  /** the hand grips the end of the tape: distance from tape centre to the hand centre */
  grip: TAPE.w / 2 - 22,
} as const;

/** Mouse parallax amplitude (px) per layer. TV barely moves, foreground moves most. */
export const PARALLAX = {
  background: 6,
  room: 9,
  furniture: 14,
  props: 18,
  tv: 3,
  character: 6,
  foreground: 24,
} as const;
export type ParallaxId = keyof typeof PARALLAX;

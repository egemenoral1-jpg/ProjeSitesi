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
  x: 420,
  y: 80,
  w: 760,
  h: 580,
  screen: { x: 40, y: 34, w: 536, h: 402 },
  /** VCR slot centre and size, relative to the TV */
  slot: { x: 380, y: 523, w: 360, h: 58 },
} as const;

export const TV_SLOT_ABS = { x: TV.x + TV.slot.x, y: TV.y + TV.slot.y } as const;
export const TV_SCREEN_ABS = {
  x: TV.x + TV.screen.x + TV.screen.w / 2,
  y: TV.y + TV.screen.y + TV.screen.h / 2,
} as const;

/**
 * A cassette lying flat, seen from the front with a bit of its top visible.
 * `h` is the front face (the label side); the top face (`top` px) is drawn above it
 * and is covered by the next tape in a stack.
 */
export const TAPE = { w: 270, h: 56, top: 44, gap: 0 } as const;
/** How big the cassette looks once it is pushed into the slot (it moves away from the camera). */
export const TAPE_IN_SLOT_SCALE = 0.9;

export type StackId = 'left' | 'right';
export const STACKS: Record<StackId, { x: number; baseY: number }> = {
  left: { x: 245, baseY: TABLE_Y },
  right: { x: 1355, baseY: TABLE_Y },
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
    left: { x: 100, y: 1260 },
    right: { x: 1500, y: 1260 },
  },
  len: 1000, // length of the arm image (max reach)
  min: 160,
  w: 100,
  /** hand image size; its centre is the end of the sleeve and the gripping point */
  hand: { w: 168, h: 240 },
  /** the hand grips the end of the tape: distance from tape centre to the hand centre */
  grip: TAPE.w / 2 - 6,
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

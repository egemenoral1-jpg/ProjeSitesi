/**
 * Scene geometry, all in "design pixels" on a 1600x900 stage.
 * The whole scene is scaled to the viewport with a single CSS transform.
 */
export const STAGE = { w: 1600, h: 900 } as const;

export const CHARACTER = {
  idleX: 770,
  floorY: 830,
  bodyW: 200,
  bodyH: 520,
  shoulderX: 58, // distance of each shoulder from the body centre
  shoulderY: -330, // relative to the feet
  armLen: 200,
  armMin: 56,
  armW: 44,
  handSize: 64,
  /** distance (px) kept horizontally between shoulder and target when stepping up to something */
  reachDx: 150,
} as const;

export const SHELF = { x: 270, y: 520, w: 420, h: 70 } as const;

export const TAPE = {
  spineW: 46,
  spineH: 170,
  gap: 8,
  frontW: 170,
  frontH: 94,
} as const;

/** Centre of the n-th cassette standing on the shelf. */
export function cassettePosition(i: number, n: number) {
  const span = n * TAPE.spineW + (n - 1) * TAPE.gap;
  const startX = SHELF.x + (SHELF.w - span) / 2;
  return { x: startX + i * (TAPE.spineW + TAPE.gap) + TAPE.spineW / 2, y: SHELF.y - TAPE.spineH / 2 };
}

export const TV = {
  x: 860,
  y: 240,
  w: 500,
  h: 420,
  screen: { x: 30, y: 30, w: 390, h: 292 },
  slot: { x: 190, y: 375, w: 220, h: 28 }, // centre, relative to the TV
  standY: 650,
} as const;

export const TV_SLOT_ABS = { x: TV.x + TV.slot.x, y: TV.y + TV.slot.y } as const;
export const TV_SCREEN_ABS = {
  x: TV.x + TV.screen.x + TV.screen.w / 2,
  y: TV.y + TV.screen.y + TV.screen.h / 2,
} as const;

/** Mouse parallax amplitude (px) per layer. TV barely moves, foreground moves most. */
export const PARALLAX = {
  background: 6,
  room: 10,
  furniture: 16,
  props: 20,
  tv: 3,
  character: 5,
  foreground: 26,
} as const;
export type ParallaxId = keyof typeof PARALLAX;

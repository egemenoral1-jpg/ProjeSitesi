/**
 * 3D scene geometry in metres. +x right, +y up, +z towards the viewer.
 * A Regular Show style living room: the TV stands on a wooden cabinet against
 * the wall (top at TABLE.topY), tapes are stacked on both sides of it, the
 * staircase climbs on the right, a framed picture hangs on the left.
 */
export const TABLE = { topY: 0.75, width: 1.86, depth: 0.62, z: 0.0, thickness: 0.05 } as const;

export const STAIRS = { startX: 1.0, steps: 10, run: 0.27, rise: 0.19, depth: 0.62 } as const;

export const WALL_Z = -0.55;

export const TV = {
  width: 0.8,
  bodyH: 0.56,
  baseH: 0.13,
  bodyDepth: 0.4,
  baseDepth: 0.5,
  /** z of the front face of the TV */
  frontZ: 0.24,
  /** screen centre (x, y) and size; the screen faces +z */
  screen: { x: -0.07, y: 1.17, w: 0.54, h: 0.405 },
  /** VCR slot centre and size on the front of the base */
  slot: { x: 0, y: TABLE.topY + 0.065, w: 0.345, h: 0.062 },
} as const;

/** A VHS cassette lying flat: width along x, thickness along y, depth along z (label faces +z). */
export const TAPE = { w: 0.27, h: 0.052, d: 0.155 } as const;

/** Tape centre once pushed into the VCR (its label side sticks out ~1 cm). */
export const TAPE_IN_SLOT_Z = TV.frontZ + 0.012 - TAPE.d / 2;

export type StackId = 'left' | 'right';
export const STACKS: Record<StackId, { x: number; z: number }> = {
  left: { x: -0.67, z: 0.1 },
  right: { x: 0.67, z: 0.1 },
};
/** How many projects go into the left stack; the rest go right. */
export const LEFT_STACK_COUNT = 3;

export function tapeHome(stack: StackId, slot: number) {
  const s = STACKS[stack];
  return { x: s.x, y: TABLE.topY + TAPE.h / 2 + slot * TAPE.h, z: s.z };
}

export const CAMERA = {
  fov: 36,
  /** idle: what the camera looks at, and how much width must stay in view */
  look: { x: 0.05, y: 1.08, z: 0 },
  height: 1.3,
  fitHalfWidth: 1.22,
  /** portrait screens: a wider vertical field of view so the room is not tiny */
  portraitFov: 52,
} as const;

export const ARM = {
  /** upper arm and forearm length (scaled up per sequence if a target is far away) */
  upper: 0.52,
  fore: 0.5,
  radius: 0.042,
  /** shoulders sit just outside the bottom corners of the view (camera space) */
  shoulderCam: { x: 0.46, y: -0.3, z: -0.36 },
} as const;

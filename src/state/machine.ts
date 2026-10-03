export type SceneState =
  | 'INTRO'
  | 'IDLE'
  | 'SELECTING'
  | 'REACHING'
  | 'PICKING_UP'
  | 'CARRYING'
  | 'INSERTING'
  | 'PLAYING'
  | 'VIEWING_PROJECT'
  | 'RETURNING';

/** Allowed transitions. Anything else is ignored, so clicks during an animation do nothing. */
const NEXT: Record<SceneState, SceneState[]> = {
  INTRO: ['IDLE'],
  IDLE: ['SELECTING'],
  SELECTING: ['REACHING', 'RETURNING'],
  REACHING: ['PICKING_UP', 'RETURNING'],
  PICKING_UP: ['CARRYING', 'RETURNING'],
  CARRYING: ['INSERTING', 'RETURNING'],
  INSERTING: ['PLAYING', 'RETURNING'],
  PLAYING: ['VIEWING_PROJECT', 'RETURNING'],
  VIEWING_PROJECT: ['RETURNING'],
  RETURNING: ['IDLE'],
};

export const canTransition = (from: SceneState, to: SceneState) => NEXT[from].includes(to);

export type CameraState = 'IDLE_CAMERA' | 'CASSETTE_FOCUS_CAMERA' | 'TV_CAMERA' | 'RETURN_CAMERA';

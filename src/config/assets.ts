/**
 * Central asset configuration.
 *
 * Every image/sound used by the app is referenced ONLY from here. To swap a
 * placeholder for final artwork, drop the new file into public/assets/... and
 * change the matching path below (e.g. `placeholder-mordecai-body.svg` ->
 * `mordecai-body.webp`). Nothing else in the code base needs to change.
 * See docs/ASSETS.md for sizes, anchors and layers of every file.
 */
const base = import.meta.env.BASE_URL;
const a = (p: string) => `${base}assets/${p}`;

export const ASSETS = {
  background: a('background/placeholder-background.svg'),
  room: a('room/placeholder-room.svg'),
  furniture: {
    shelf: a('furniture/placeholder-shelf.svg'),
    tvStand: a('furniture/placeholder-tv-stand.svg'),
    armchair: a('furniture/placeholder-armchair.svg'),
    lamp: a('furniture/placeholder-lamp.svg'),
    rug: a('furniture/placeholder-rug.svg'),
    plant: a('furniture/placeholder-plant.svg'),
  },
  props: {
    pizza: a('props/placeholder-pizza.svg'),
    cans: a('props/placeholder-cans.svg'),
  },
  characters: {
    mordecai: {
      body: a('characters/mordecai/placeholder-mordecai-body.svg'),
      leftArm: a('characters/mordecai/placeholder-mordecai-left-arm.svg'),
      rightArm: a('characters/mordecai/placeholder-mordecai-right-arm.svg'),
      leftHand: a('characters/mordecai/placeholder-mordecai-left-hand.svg'),
      rightHand: a('characters/mordecai/placeholder-mordecai-right-hand.svg'),
    },
  },
  cassettes: {
    front: a('cassettes/placeholder-vhs-front.svg'),
    spine: a('cassettes/placeholder-vhs-spine.svg'),
  },
  tv: {
    frame: a('tv/placeholder-tv.svg'),
  },
  /** Optional sounds. Missing files are ignored silently. */
  audio: {
    cassetteClick: a('audio/cassette-click.mp3'),
    vhsInsert: a('audio/vhs-insert.mp3'),
    tvStatic: a('audio/tv-static.mp3'),
    buttonClick: a('audio/button-click.mp3'),
    crtPowerOn: a('audio/crt-power-on.mp3'),
    vhsRewind: a('audio/vhs-rewind.mp3'),
    ambience: a('audio/room-ambience.mp3'),
  },
} as const;

export type SoundName = keyof typeof ASSETS.audio;

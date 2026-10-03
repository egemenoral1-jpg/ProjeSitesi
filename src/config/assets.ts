/**
 * Central asset configuration.
 *
 * Every image/sound used by the app is referenced ONLY from here. To swap a
 * placeholder for final artwork, drop the new file into public/assets/... and
 * change the matching path below (e.g. `placeholder-mordecai-right-arm.svg` ->
 * `mordecai-right-arm.webp`). Nothing else in the code base needs to change.
 * See docs/ASSETS.md for sizes, anchors and layers of every file.
 */
const base = import.meta.env.BASE_URL;
const a = (p: string) => `${base}assets/${p}`;

export const ASSETS = {
  background: a('background/placeholder-background.svg'),
  room: a('room/placeholder-room.svg'),
  characters: {
    mordecai: {
      leftArm: a('characters/mordecai/placeholder-mordecai-left-arm.svg'),
      rightArm: a('characters/mordecai/placeholder-mordecai-right-arm.svg'),
      leftHand: a('characters/mordecai/placeholder-mordecai-left-hand.svg'),
      rightHand: a('characters/mordecai/placeholder-mordecai-right-hand.svg'),
    },
  },
  cassettes: {
    tape: a('cassettes/placeholder-vhs.svg'),
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

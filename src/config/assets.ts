/**
 * Central asset configuration.
 *
 * The 3D room, TV, cassettes and Mordecai's arm are built procedurally in `src/three/`
 * (one builder per object), and their textures are drawn on canvases in `src/three/textures.ts`.
 * To use real artwork later, replace a builder with a loaded model/texture; every
 * file path the app needs lives here so nothing else has to know where files are.
 */
const base = import.meta.env.BASE_URL;
const a = (p: string) => `${base}assets/${p}`;

export const ASSETS = {
  /** Fonts used on canvas textures (loaded from Google Fonts in index.html). */
  fonts: {
    label: 'Chewy',
    tv: 'VT323',
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

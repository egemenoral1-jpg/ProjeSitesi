/**
 * Central asset configuration.
 *
 * The 3D room, TV, cassettes and Mordecai's arm are built procedurally in `src/three/`
 * (one builder per object), and their textures are drawn on canvases in `src/three/textures.ts`.
 * Music and sound effects are synthesised in `src/audio/audio.ts`, so the site ships no media files.
 */
const base = import.meta.env.BASE_URL;

export const ASSETS = {
  /** Fonts used on canvas textures (loaded from Google Fonts in index.html). */
  fonts: {
    label: 'Chewy',
    tv: 'VT323',
  },
  audio: {
    /**
     * Optional: put a music file you have the rights to in public/assets/audio/ and set its
     * path here (e.g. `${base}assets/audio/music.mp3`). It then replaces the built-in tune.
     */
    musicFile: null as string | null,
    /** base URL kept for the line above */
    base: `${base}assets/audio/`,
  },
} as const;

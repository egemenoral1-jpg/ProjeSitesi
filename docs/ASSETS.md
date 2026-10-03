# Asset manifest

All artwork is loaded through [`src/config/assets.ts`](../src/config/assets.ts). Each file below currently
exists as a **placeholder SVG** in `public/assets/`. To use final artwork, put the new file in the same
folder and change the one path in `assets.ts` (for example `placeholder-mordecai-right-hand.svg` ->
`mordecai-right-hand.webp`). The animation code never knows which kind of file it is displaying.

Conventions

- Coordinates are **design pixels** on a 1600x900 stage. The scene is scaled to the viewport.
- "Display size" is what the image occupies in the scene. Export final art at **2x** as WebP (or PNG) and keep
  the aspect ratio exactly.
- Keep the anchor/pivot rules: they are what make the arm animation line up.
- Style: flat cartoon, thick dark outlines (#16161c), like the Regular Show TV shot: light grey strip at the top,
  muted purple wall, tan wooden table, black CRT showing static. Tapes stacked on both sides of the TV,
  only Mordecai's arms enter the shot from the bottom corners.

## Layers (bottom to top)

| # | Layer | Parallax (px) | Contents |
|---|-------|---------------|----------|
| 1 | background | 6 | colour fill beyond the stage (ultra-wide / portrait screens) |
| 2 | room | 9 | grey top strip, purple wall, table, blurry floor |
| 3 | furniture | 14 | the **tape stacks** |
| 5 | tv | 3 | CRT frame, live screen, the tape sitting in the VCR slot |
| 6 | character | 6 | Mordecai's arms and hands (above the TV so they can reach the slot) |
| 7 | lighting | - | CSS glow from the screen (no art) |

## Files

### Background / room (opaque)
- `background/placeholder-background.svg` - 3200x1800 at (-800,-450). Top half grey (#a3a3aa), bottom half grey-blue (#7a7d88).
- `room/placeholder-room.svg` - drawn at (-250,-30), 2100x960 (stretched horizontally, keep it made of horizontal bands).
  Grey strip down to stage y~120, purple wall (darker at the edges) down to y~634, table top y~634-676
  (objects stand on **y = 652**), table front edge to y~714, blurry grey floor below.

### Television (transparent corners)
- `tv/placeholder-tv.svg` - display **760x580** at (420,80); the VCR base rests on the table.
  Required geometry relative to the TV (see `TV` in `src/config/layout.ts`):
  - screen opening: x 40, y 34, 536x402 (dark well; the DOM screen with static/content is placed on top)
  - right column: keypad (y 50-240) and speaker slats (y 270-400)
  - VCR base: y 466-578, three round buttons each side, **slot centre (380,523), about 360x58**
  - power LED is CSS at (708,426)

### Cassette (transparent)
- `cassettes/placeholder-vhs.svg` - **270x100**: a VHS tape seen from the front and slightly above.
  Top face (y 0-44): two reel windows and a white centre label. Front face (y 44-100): black.
  The coloured label with the hand-lettered white title is CSS, drawn on the front face (x 10-260, y 50-91 of the art).
  The element box of a tape is the front face (270x56); the top face sticks out above it and is hidden by the next
  tape in a stack. In the VCR slot only the front face is shown.

### Mordecai's arms (transparent, `characters/mordecai/`)
| File | Display size | Anchor / pivot | Purpose |
|------|--------------|----------------|---------|
| `placeholder-mordecai-left-arm.svg` | 100x1000 | **top centre = shoulder**, placed off-stage at (100,1260) | sleeve from the bottom-left, serves the left stack |
| `placeholder-mordecai-right-arm.svg` | 100x1000 | top centre = shoulder, placed at (1500,1260) | sleeve from the bottom-right, serves the right stack |
| `placeholder-mordecai-left-hand.svg` | 168x240 (art 140x200) | **centre = end of the sleeve = gripping point**, fingers pointing **up** | left hand + wrist |
| `placeholder-mordecai-right-hand.svg` | 168x240 (art 140x200) | same | right hand + wrist |

The sleeve is plain blue with dark outlines on both long edges, drawn hanging straight down. The code rotates it
(about +-160 deg) and stretches it vertically between 16% and 100%, so keep it a simple tube.

The hand image carries the recognisable part of the arm: Mordecai's **blue feather-like pointed fingers**, and
below the palm the end of the forearm with the **two white bands**. Its lower half overlaps the end of the sleeve,
so the forearm piece must be about as wide as the sleeve (~84/140 of the image width). The image is rotated to
continue the sleeve and squeezed horizontally to fake a grip. The hand holds the tape by its **outer end**.

### Audio (optional, `public/assets/audio/`)
`cassette-click.mp3`, `vhs-insert.mp3`, `tv-static.mp3`, `button-click.mp3`, `crt-power-on.mp3`, `vhs-rewind.mp3`,
`room-ambience.mp3` (loop). Sounds are off until the visitor presses the SOUND button; missing files are ignored.

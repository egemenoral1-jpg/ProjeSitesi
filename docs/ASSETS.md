# Asset manifest

All artwork is loaded through [`src/config/assets.ts`](../src/config/assets.ts). Each file below currently
exists as a **placeholder SVG** in `public/assets/`. To use final artwork, put the new file in the same
folder and change the one path in `assets.ts` (for example `placeholder-mordecai-right-arm.svg` ->
`mordecai-right-arm.webp`). The animation code never knows which kind of file it is displaying.

Conventions

- Coordinates are **design pixels** on a 1600x900 stage. The scene is scaled to the viewport.
- "Display size" is what the image occupies in the scene. Export final art at **2x** that size
  as WebP (or PNG) and keep the aspect ratio exactly.
- Keep the anchor/pivot rules: they are what make the arm animation line up.
- Composition: close-up of a CRT TV on a table against a purple wall, tapes stacked on both sides of the TV,
  only Mordecai's arms enter the shot (from the bottom-left and bottom-right corners).
- Light: the CRT screen is the main light, a warm lamp on the right, the rest of the room stays dim.

## Layers (bottom to top)

| # | Layer | Parallax (px) | Contents |
|---|-------|---------------|----------|
| 1 | background | 6 | colour fill beyond the stage (ultra-wide / portrait screens) |
| 2 | room | 9 | upper wall, purple wall, table, blurry floor |
| 3 | furniture | 14 | plant, lamp + the **tape stacks** |
| 4 | props | 18 | soda cans |
| 5 | tv | 3 | CRT frame, live screen, the tape sitting in the VCR slot |
| 6 | character | 6 | Mordecai's arms and hands (above the TV so they can reach the slot) |
| 7 | lighting | - | CSS light pools, darkening and dust (no art) |

## Files

### Background / room (opaque)
- `background/placeholder-background.svg` - 3200x1800 at (-800,-450). Top half = upper-wall colour, bottom half = floor colour.
- `room/placeholder-room.svg` - drawn at (-250,-30), 2100x960 (stretched horizontally, keep it made of horizontal bands).
  Light grey upper wall down to stage y~210, purple wall down to y~634, table top surface y~634-674
  (objects stand on **y = 652**), table front edge to y~732, blurry floor below.

### Furniture / props (transparent)
| File | Display size | Position (top-left) | Purpose |
|------|--------------|---------------------|---------|
| `furniture/placeholder-plant.svg` | 170x300 | (-20,352) | plant on the table, far left |
| `furniture/placeholder-lamp.svg` | 140x420 | (1470,232) | lamp on the table, far right (glow is CSS) |
| `props/placeholder-cans.svg` | 120x70 | (1455,586) | soda cans next to the lamp |

### Television (transparent corners)
- `tv/placeholder-tv.svg` - display 640x560 at (480,96); its feet stand on the table (bottom at y 656).
  Required geometry relative to the TV (see `TV` in `src/config/layout.ts`):
  - screen opening: x 42, y 38, 456x342 - draw a plain dark well there, the DOM screen is placed on top
  - VCR slot: centre (270,468), about 340x54, a dark horizontal opening under the screen
  - power LED is CSS at (594,494)

### Cassettes (transparent)
- `cassettes/placeholder-vhs-spine.svg` - display **270x46**: a tape lying flat, seen from its spine.
  Blank label area at x 16..254, y 7..39; the coloured label and title are drawn by CSS on top.
  The same image is used in the stacks, in the hand and in the VCR slot (shown at 0.9 scale there).

### Mordecai's arms (transparent, `characters/mordecai/`)
| File | Display size | Anchor / pivot | Purpose |
|------|--------------|----------------|---------|
| `placeholder-mordecai-left-arm.svg` | 96x1000 | **top centre = shoulder** (placed off-stage at (120,1260)) | arm from the bottom-left, serves the left stack |
| `placeholder-mordecai-right-arm.svg` | 96x1000 | top centre = shoulder (placed at (1480,1260)) | arm from the bottom-right, serves the right stack |
| `placeholder-mordecai-left-hand.svg` | 120x120 | **centre**, fingers pointing **up** | glued to the end of the left sleeve |
| `placeholder-mordecai-right-hand.svg` | 120x120 | centre, fingers up | glued to the end of the right sleeve |

The sleeve is drawn hanging straight down (shoulder at the top, wrist at the bottom). The code rotates it
(about +-160 deg) and stretches it vertically between 16% and 100% of its length, so keep it a simple tapered
tube without detail that would look wrong when stretched. The hand art is rotated a little to follow the sleeve and
squeezed horizontally to fake a grip. The hand holds the tape by its **outer end** (right hand -> right end).

### Audio (optional, `public/assets/audio/`)
`cassette-click.mp3`, `vhs-insert.mp3`, `tv-static.mp3`, `button-click.mp3`, `crt-power-on.mp3`, `vhs-rewind.mp3`,
`room-ambience.mp3` (loop). Sounds are off until the visitor presses the SOUND button; missing files are ignored.

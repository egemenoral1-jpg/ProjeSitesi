# Asset manifest

All artwork is loaded through [`src/config/assets.ts`](../src/config/assets.ts). Each file below currently
exists as a **placeholder SVG** in `public/assets/`. To use final artwork, put the new file in the same
folder and change the one path in `assets.ts` (for example `placeholder-mordecai-body.svg` ->
`mordecai-body.webp`). The animation code never knows which kind of file it is displaying.

Conventions

- Coordinates are **design pixels** on a 1600x900 stage. The scene is scaled to the viewport.
- "Display size" is what the image occupies in the scene. Export final art at **2x** that size
  (e.g. 400x1040 for a 200x520 slot) as WebP (or PNG if WebP is a problem) and keep the aspect ratio exactly.
- Keep the anchor/pivot rules, they are what make the arm animation line up.
- Light direction: the CRT (right-centre) is the main light, a warm lamp on the far right, weak moonlight from the window.

## Layers (bottom to top)

| # | Layer | Parallax (px) | Contents |
|---|-------|---------------|----------|
| 1 | background | 6 | far backdrop |
| 2 | room | 10 | wall, floor, window, poster |
| 3 | furniture | 16 | shelf, TV stand, rug, plant, lamp, armchair + the **cassettes** |
| 4 | props | 20 | small floor items |
| 5 | tv | 3 | CRT frame + live screen |
| 6 | character | 5 | Mordecai (above the TV so the arm can reach in front of it) |
| 7 | foreground | 26 | items nearest the camera |
| 8 | lighting | - | CSS light pools and dust (no art) |

## Files

### Background
- **Room backdrop** - `background/placeholder-background.svg`
  display 3200x1800, opaque, layer *background*, position (-800,-450), purpose: dark night gradient that fills ultra-wide and portrait screens.
- **Room shell** - `room/placeholder-room.svg`
  display 1700x960, opaque, layer *room*, position (-50,-30). Wall until y~646 (stage coords), floor below it, window around (280,80)-(550,340), poster around (1030,60)-(1180,260).
  The wall/floor horizon must stay at **y = 646** (stage coordinates) because mobile fills the area beyond the art with matching colours.

### Furniture (transparent)
| File | Display size | Position (top-left) | Purpose |
|------|--------------|---------------------|---------|
| `furniture/placeholder-shelf.svg` | 420x70 | (270,520) | wooden shelf the cassettes stand on; **top edge of the plank must be at the top of the image** |
| `furniture/placeholder-tv-stand.svg` | 560x190 | (830,652) | cabinet under the TV; its top surface meets the TV bottom |
| `furniture/placeholder-armchair.svg` | 260x260 | (1400,570) | right side of the room |
| `furniture/placeholder-lamp.svg` | 140x420 | (1470,330) | warm lamp (the glow itself is CSS) |
| `furniture/placeholder-rug.svg` | 760x170 | (330,760) | floor ellipse under Mordecai (perspective-squashed) |
| `furniture/placeholder-plant.svg` | 170x300 | (110,528) | left side of the room |

### Props (transparent)
- `props/placeholder-cans.svg` 120x70 at (230,770) - soda cans on the floor.
- `props/placeholder-pizza.svg` 200x90 at (1130,818) - pizza box in the *foreground* layer.

### Television
- **CRT frame** - `tv/placeholder-tv.svg`, display 500x420 at (860,240), transparent corners.
  Contains: bezel, side knobs/keypad/speaker grille, VCR strip with the cassette slot.
  Required geometry (do not move without editing `src/config/layout.ts`):
  - screen opening: x 30, y 30, 390x292 (the DOM screen is drawn on top, the art should show a dark well there)
  - VCR slot: centre (190,375) relative to the TV, about 220x28
  - eject button area near (353,372)
  - power LED is drawn by CSS at (452,366)

### Cassettes (transparent)
- **Spine** - `cassettes/placeholder-vhs-spine.svg`, display 46x170. Blank label area (6..40 x 10..160); the title text and colour band are drawn by CSS.
- **Front** - `cassettes/placeholder-vhs-front.svg`, display 170x94 (draw as 240x132 ratio). Blank label area at the top (x 7%-93%, y 7%-50%); the text is drawn by CSS. The reel window is in the bottom half.

### Mordecai (transparent, all in `characters/mordecai/`)
| File | Display size | Anchor / pivot | Purpose |
|------|--------------|----------------|---------|
| `placeholder-mordecai-body.svg` | 200x520 | **bottom centre = the soles of the feet** (placed at floor y=830). Front view, neutral stance, **no arms** | static body |
| `placeholder-mordecai-left-arm.svg` | 44x200 | **top centre = the shoulder joint.** Arm hangs straight down, slightly tapered, first/last pixel row full width | arm for picking up cassettes (screen-left = Mordecai's right arm) |
| `placeholder-mordecai-right-arm.svg` | 44x200 | same | arm for inserting into the VCR |
| `placeholder-mordecai-left-hand.svg` | 64x64 | **centre of the palm** | glued to the end of the left arm |
| `placeholder-mordecai-right-hand.svg` | 64x64 | centre of the palm | glued to the end of the right arm |

Shoulders sit at x = +-58 from the body centre and y = -330 above the feet. Draw the body so that its shoulder sockets
land there, and keep the arm length at 200 (the animation stretches it between 56 and 200 px, so avoid fine detail
along the arm). The hands should look fine both open and slightly squeezed (the grip animation scales/rotates them).

### Audio (optional, `public/assets/audio/`)
`cassette-click.mp3`, `vhs-insert.mp3`, `tv-static.mp3`, `button-click.mp3`, `crt-power-on.mp3`, `vhs-rewind.mp3`,
`room-ambience.mp3` (loop). Sounds are off until the visitor presses the SOUND button; missing files are ignored.

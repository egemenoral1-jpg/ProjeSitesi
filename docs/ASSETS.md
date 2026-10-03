# Scene objects and how to replace them

The room is real 3D (three.js) drawn in a cartoon style: cel shading (`MeshToonMaterial`, three light bands,
see `src/three/toon.ts`) plus a dark contour around every object (`OutlineEffect`), with the colours of the
Regular Show living room (`PALETTE`). Every object is built in code by one builder, and every texture is drawn on a
canvas, so the site needs no image or model files. To use real artwork later, replace one builder; the animation
code only talks to the objects below through their public fields.

Units are metres: +x right, +y up, +z toward the viewer. All positions/sizes live in
[`src/config/layout.ts`](../src/config/layout.ts).

| Object | Builder | Notes for a replacement model |
|--------|---------|-------------------------------|
| Living room: cream walls, green carpet, yellow staircase with balusters, framed drawing, floor lamp, wooden TV cabinet | `src/three/buildRoom.ts` (`buildRoom`) | cabinet top must stay at `TABLE.topY` (0.75); staircase size in `STAIRS` |
| Lights: bright hemisphere, warm key light with shadows, cool fill, lamp glow | `src/three/buildRoom.ts` (`buildLights`) | the TV adds its own flickering point light |
| CRT TV with built-in VCR | `src/three/buildTV.ts` | front face at `TV.frontZ`; screen centre/size `TV.screen`; slot centre `TV.slot`. Keep a plane for the picture that uses `screen.texture` |
| Picture on the CRT (snow, black, noise, glitch, tracking, collapse) | `src/three/ScreenTexture.ts` | canvas texture, phases are driven by `tvAnimations.ts` |
| VHS cassette | `src/three/buildTape.ts` | box `TAPE` = 0.27 x 0.052 x 0.155, label faces +z. Label and top textures come from `textures.ts` |
| Mordecai's arm and hand | `src/three/MordecaiArm.ts` | see below |
| Canvas textures: wall paint, wood, carpet, drawing, tape label, tape top | `src/three/textures.ts` | swap any of them for `new THREE.TextureLoader().load(url)` |

## Mordecai's arm

`MordecaiArm` is driven by four values that GSAP tweens:

- `wrist` - world position of the wrist (two-bone IK places shoulder -> elbow -> wrist)
- `finger` - direction the fingers point
- `palm` - direction the palm faces
- `curl` - 0 open hand ... 1 fist (each finger has three joints, the thumb two)

The shoulder is placed just outside the bottom corner of the view for every sequence (`World.prepareArm`), and the
arm is lengthened if a target is far (portrait phones). Like Mordecai in the show it is light blue with two white
stripes near the wrist, and the hand has spread, pointed feather-tip fingers, each outlined in black (drawn 1.3x life size).

The arm is outlined by its own screen-space "inverted hull" (`src/three/outline.ts`) instead of the room-wide
OutlineEffect: that effect makes lines very thin on objects close to the camera and leaves black spikes on pointed
tips. The hull keeps a bold, constant ink line (thickness is a fraction of the screen height).

To use a rigged hand model (GLB) instead: load it once, add it under `hand` in place of `buildHand`, and map
`curl` to the finger bones in `update()`. Nothing else changes.

## Fonts

Canvas textures use the fonts listed in `ASSETS.fonts` (`src/config/assets.ts`), loaded from Google Fonts:
Chewy for cassette labels (ASCII only), VT323 for the TV text, Lilita One for titles.

## Audio

Everything is synthesised in [`src/audio/audio.ts`](../src/audio/audio.ts) with the Web Audio API, so there are no
audio files:

- **Music:** an original, laid-back 70s/80s groove (electric piano, bass, drums, a short lead line; Am7 - D9 -
  Fmaj7 - E7 at 98 BPM). It starts on the visitor's first click or key press (browsers block audio before that),
  gets quieter while a tape is playing, and the corner button (♪ ON / OFF) mutes it; the choice is remembered.
- **Effects:** tape click, VCR insert clunk, CRT power-on whine, static, rewind.

The show's own theme is copyrighted, so it is not included. To use a music file you have the rights to, put it in
`public/assets/audio/` and set `ASSETS.audio.musicFile` in `src/config/assets.ts`; it replaces the built-in tune.

## The portrait on the wall

`pictureTexture()` in `src/three/textures.ts` paints Pops in full colour in the show's flat, outlined style: huge
pink round head, tiny tilted top hat, red nose, big cream moustache, thin body in a grey vest, one finger raised.

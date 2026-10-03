# Scene objects and how to replace them

The room is real 3D (three.js). Every object is built in code by one builder, and every texture is drawn on a
canvas, so the site needs no image or model files. To use real artwork later, replace one builder; the animation
code only talks to the objects below through their public fields.

Units are metres: +x right, +y up, +z toward the viewer. All positions/sizes live in
[`src/config/layout.ts`](../src/config/layout.ts).

| Object | Builder | Notes for a replacement model |
|--------|---------|-------------------------------|
| Room: wall, grey top strip, rail, skirting, floor, wooden table | `src/three/buildRoom.ts` (`buildRoom`) | table top surface must stay at `TABLE.topY` (0.75) |
| Lights: hemisphere, warm key light with soft shadows, cool fill | `src/three/buildRoom.ts` (`buildLights`) | the TV adds its own flickering point light |
| CRT TV with built-in VCR | `src/three/buildTV.ts` | front face at `TV.frontZ`; screen centre/size `TV.screen`; slot centre `TV.slot`. Keep a plane for the picture that uses `screen.texture` |
| Picture on the CRT (snow, black, noise, glitch, tracking, collapse) | `src/three/ScreenTexture.ts` | canvas texture, phases are driven by `tvAnimations.ts` |
| VHS cassette | `src/three/buildTape.ts` | box `TAPE` = 0.27 x 0.052 x 0.155, label faces +z. Label and top textures come from `textures.ts` |
| Mordecai's arm and hand | `src/three/MordecaiArm.ts` | see below |
| Canvas textures: wallpaper, wood, floor, tape label, tape top | `src/three/textures.ts` | swap any of them for `new THREE.TextureLoader().load(url)` |

## Mordecai's arm

`MordecaiArm` is driven by four values that GSAP tweens:

- `wrist` - world position of the wrist (two-bone IK places shoulder -> elbow -> wrist)
- `finger` - direction the fingers point
- `palm` - direction the palm faces
- `curl` - 0 open hand ... 1 fist (each finger has three joints, the thumb two)

The shoulder is placed just outside the bottom corner of the view for every sequence (`World.prepareArm`), and the
arm is lengthened if a target is far (portrait phones). Two white bands sit near the wrist, the fingers are long
and pointed like feathers, like Mordecai's.

To use a rigged hand model (GLB) instead: load it once, add it under `hand` in place of `buildHand`, and map
`curl` to the finger bones in `update()`. Nothing else changes.

## Fonts

Canvas textures use the fonts listed in `ASSETS.fonts` (`src/config/assets.ts`), loaded from Google Fonts:
Chewy for cassette labels (ASCII only), VT323 for the TV text, Lilita One for titles.

## Audio (optional, `public/assets/audio/`)

`cassette-click.mp3`, `vhs-insert.mp3`, `tv-static.mp3`, `button-click.mp3`, `crt-power-on.mp3`, `vhs-rewind.mp3`,
`room-ambience.mp3` (loop). Sounds are off until the visitor presses the SOUND button; missing files are ignored.

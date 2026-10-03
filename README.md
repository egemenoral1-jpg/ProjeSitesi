# Egemen's Room: an interactive 2D/2.5D cartoon portfolio

There is no portfolio UI here. You are sitting in front of an old CRT television in a cozy cartoon living room,
with VHS tapes stacked on both sides of it. **The tapes are the navigation** and **the TV is the content interface**.
Click a tape and Mordecai's arm reaches in from the bottom of the frame, grabs it, slides it out of the stack and
pushes it into the VCR slot; the TV crackles into static, VHS noise and tracking, then plays the project.

Everything is 2D. There is **no Three.js, no WebGL, no 3D models**. The depth comes from independent image
layers, mouse parallax and a 2D "camera" container moved with CSS transforms (2.5D).

## Stack

- React 18 + TypeScript + Vite
- GSAP for timelines (arm, hand, cassette, camera, TV)
- Plain CSS for hover, scanlines, lighting, ambient motion
- SVG placeholder art (swap for WebP/PNG, see below)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview
```

## Architecture

```
src/
  config/      assets.ts (every image/sound path)   layout.ts (all scene geometry)
  data/        projects.ts   profile.ts   tapes.ts (projects + special tapes -> one cassette list)
  state/       machine.ts   interaction + camera states
  hooks/       useSceneInteraction (state machine)  useParallax  useSceneScale
  animations/  rig.ts  characterAnimations  cassetteAnimations  cameraAnimations  tvAnimations  sequence
  components/  scene/ character/ cassette/ television/ intro/ effects/
  audio/       optional sound manager (off by default)
  styles/      plain CSS per area
public/assets/ background room furniture props characters/mordecai cassettes tv ui audio
docs/          ASSETS.md (manifest)  AI-ASSET-PROMPTS.md
```

### Scene and layers

The scene is a fixed 1600x900 "design stage" scaled to the window with one CSS transform
(`useSceneScale`). On portrait phones it crops to the playable strip (both tape stacks + TV) instead of turning into
a normal mobile layout. Inside it, `.camera` wraps independent `ParallaxLayer`s:

`background -> room -> furniture + tape stacks -> props -> TV -> Mordecai's arms -> lighting`

Projects are stacked on the left of the TV, About / Skills / Contact on the right. Only Mordecai's arms are in the
shot: the arms layer is above the TV so the hand can reach the slot. Layers move with GPU transforms only; the
parallax store updates them with `gsap.quickTo`, so React never re-renders on mouse move. TV barely moves,
foreground moves most. The room holds still while the cinematic plays so hands line up exactly. Touch devices
get no mouse parallax.

### Interaction state machine

`INTRO -> IDLE -> SELECTING -> REACHING -> PICKING_UP -> CARRYING -> INSERTING -> PLAYING -> VIEWING_PROJECT -> RETURNING -> IDLE`

`canTransition()` in `state/machine.ts` rejects everything else, so clicking tapes during an animation does nothing
and cassettes are rendered disabled. Camera states: `IDLE_CAMERA`, `CASSETTE_FOCUS_CAMERA`, `TV_CAMERA`, `RETURN_CAMERA`.
React state changes only on these transitions; all motion is imperative GSAP.

### Animation system

The animation functions are generic. They get a cassette element or a tape, never project data:

```ts
animateArmToCassette(cassetteElement)        // arm reaches in, hand lands on the tape's outer end
pickUpCassette(cassetteElement, tape)        // grip, slide it out of the stack, tapes above drop down
carryCassette(cassetteElement)               // bring it in front of the VCR slot
insertCassette(cassetteElement, tape)        // push it in; it stays in the slot with its label showing
playTV(tape)                                 // black -> static -> noise -> glitch -> tracking -> screen
ejectCassette(cassetteElement, tape)         // BACK: pull it out and put it back in its stack
returnToIdle()                               // arms leave the shot
```

Arm model: each arm is a sleeve anchored at a shoulder below the bottom corner of the stage
(`transform-origin` top centre). The code solves the angle and stretch needed to put the hand on a target point,
then glues the separate hand layer to the end of the sleeve every frame. The left arm serves the left stack, the
right arm the right stack. The held cassette lives inside the hand layer (gripped at its outer end), so it follows
the movement automatically; it scales around the gripped end to suggest depth when it goes into the slot.
`sequence.ts` chains these steps into the full 20-step "small movie"; `playBackSequence` reverses it.

### TV

`CRTTV -> TVScreen -> (VHSNoise canvas, ProjectScreen, TVEffects, Scanlines, glass)`. The screen is a phase
(`off | black | static | noise | glitch | tracking | project | shutdown`) driven by `tvAnimations.ts`; each phase
is just a CSS class. The static canvas only animates while it is visible. Text size is computed from the camera
zoom so it stays readable on desktop and phones.

## Add a project

1. Append an object to [`src/data/projects.ts`](src/data/projects.ts).
2. Done. `data/tapes.ts` turns it into a cassette and it is added to the top of the left stack
   (about 9 tapes fit before the stack reaches the top of the TV).

`liveUrl` is optional; without it the LIVE DEMO button is shown disabled. About / Skills / Contact text lives in
[`src/data/profile.ts`](src/data/profile.ts) (add your `linkedin` URL there; it is hidden while empty).

## Replace the artwork

Every placeholder is listed with size, anchor and layer in [docs/ASSETS.md](docs/ASSETS.md), and
[docs/AI-ASSET-PROMPTS.md](docs/AI-ASSET-PROMPTS.md) has consistent prompts for generating them.
Drop the new file into `public/assets/...` and change its path in [`src/config/assets.ts`](src/config/assets.ts).
No other code needs to change as long as the dimensions and anchors match.

## Audio

Sounds are optional and **off by default** (the SOUND button in the corner enables them, which also satisfies the
browser's autoplay rules). Put files with the names in `ASSETS.audio` into `public/assets/audio/`.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: checkout, `npm ci`, `npm run build`, then publishes
`dist/` with the official GitHub Pages actions. Enable it once in the repository under
**Settings -> Pages -> Source: GitHub Actions**. The build uses relative asset paths (`base: './'`), so it works at
`https://<user>.github.io/<repo>/`. There are no secrets or API keys in the front-end code.

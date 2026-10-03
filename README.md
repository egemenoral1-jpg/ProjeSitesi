# Egemen's Room: an interactive 3D cartoon portfolio

There is no portfolio UI here. You sit in front of an old CRT television that shows snow, on a wooden table in a
Regular Show style living room (grey strip, purple wall). VHS tapes are stacked on both sides of the TV: **each tape
is one of my GitHub projects** and **the TV is the content interface**.

Click a tape and Mordecai's arm reaches into the shot, grips the tape by its label, slides it out of the pile (the
tapes above drop down), carries it to the VCR and pushes it in. The TV goes black, static, VHS noise, glitch,
tracking, then plays the project: description, features, technologies and the repository details (language
breakdown, commits, stars, forks, size, branch, dates, top-level files). GERİ (back) ejects the tape and puts it back
where it was.

## Projects on the tapes

| Tape | Repository |
|------|------------|
| COMPUTER-HARDWARE | [Computer-Hardware](https://github.com/egemenoral1-jpg/Computer-Hardware) |
| HISSE-TAKIP-AI | [hisse-takip-ai](https://github.com/egemenoral1-jpg/hisse-takip-ai) |
| AMAZON ASSISTANT | [amazon-shopping-assistant](https://github.com/egemenoral1-jpg/amazon-shopping-assistant) |
| KUTUPHANE | [kutuphane](https://github.com/egemenoral1-jpg/kutuphane) (live demo) |
| SNAKE-AI | [snake-ai](https://github.com/egemenoral1-jpg/snake-ai) |

## Stack

- React 18 + TypeScript + Vite
- three.js for the 3D room (procedural models, canvas textures, soft shadows, environment reflections)
- GSAP for every animation (camera, arm, hand, tapes, TV)
- HTML/CSS for the project screen, placed exactly over the 3D CRT glass with scanlines and VHS effects

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
  config/      layout.ts (all 3D geometry, metres)   assets.ts (fonts, sounds)
  data/        projects.ts (projects + repo info)     tapes.ts (one cassette per project)
  state/       machine.ts (interaction + camera states)   tvBus.ts (TV phase/tape for the overlay)
  hooks/       useSceneInteraction (state machine)
  three/       World (renderer, camera rig, picking, loop)  buildRoom  buildTV  buildTape
               MordecaiArm (two-bone IK arm + jointed hand)  ScreenTexture (CRT picture)  textures
  animations/  cameraAnimations  characterAnimations  cassetteAnimations  tvAnimations  sequence
  components/  Stage3D  television/TVOverlay + ProjectScreen  intro/IntroSequence  effects/Scanlines
```

### Interaction state machine

`INTRO -> IDLE -> SELECTING -> REACHING -> PICKING_UP -> CARRYING -> INSERTING -> PLAYING -> VIEWING_PROJECT -> RETURNING -> IDLE`

`canTransition()` rejects everything else, and tapes can only be picked while the state is `IDLE`, so clicking during
an animation does nothing. Camera states: `IDLE_CAMERA`, `CASSETTE_FOCUS_CAMERA`, `TV_CAMERA`, `RETURN_CAMERA`.

### Animation system

The animation functions get a generic tape object (mesh + home position), never project data:

```ts
animateArmToCassette(tape)   // arm reaches in, open hand lands on the label
pickUpCassette(tape)         // fingers curl over the edge, tape slides out, the ones above drop
carryCassette(tape)          // in front of the VCR slot
insertCassette(tape)         // partly in, hand opens flat, pushes it home (label stays visible)
playTV(tape)                 // black -> static -> noise -> glitch -> tracking -> project
ejectCassette(tape)          // BACK: pull it out and lay it back in its stack
```

`MordecaiArm` solves shoulder -> elbow -> wrist with two-bone IK every frame; GSAP only tweens the wrist position,
finger direction, palm direction and finger curl. The tape the hand holds follows the palm.

Mouse movement moves the camera slightly (real parallax); touch devices just tap.

## Add a project

Append an object to [`src/data/projects.ts`](src/data/projects.ts) (texts + `repo` snapshot). A tape is created
automatically; the first `LEFT_STACK_COUNT` projects go to the left stack, the rest to the right. Stars, forks and the
last push date are refreshed live from the GitHub API when the tape plays.

## Replace the models

See [docs/ASSETS.md](docs/ASSETS.md): every object has one builder in `src/three/`, so a real model (e.g. a rigged
hand GLB) can replace it without touching the animation code.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: checkout, `npm ci`, `npm run build`, then publishes
`dist/` with the official GitHub Pages actions. Enable it once under **Settings -> Pages -> Source: GitHub Actions**.
The build uses relative paths (`base: './'`), so it works at `https://<user>.github.io/<repo>/`. There are no secrets
or API keys in the front-end code (the GitHub API is called without a token).

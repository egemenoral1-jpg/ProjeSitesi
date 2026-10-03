# AI image prompts

Generate every asset with the **same model, the same seed family and the shared style block below**, so the
scene stays consistent. Sizes and anchors for every file are in [ASSETS.md](ASSETS.md). Generate at 2x, remove
the background for transparent items, crop exactly to the aspect ratio and export WebP.

> The look is inspired by Regular Show. If you use the actual character, make sure you have the right to use it
> on a public site.

## Shared style block (paste at the start of every prompt)

```
Flat 2D cartoon in the style of Regular Show, thick uniform dark outlines (#16161c), flat colours with at most one
simple shadow tone, no gradients except soft vignettes, straight-on front view at table height, no perspective
tilt, clean vector look, no text, no watermark.
```

Negative prompt (if supported): `3d render, photo, realistic, painterly, soft airbrush, neon, cyberpunk, text, logo, watermark, perspective distortion`

## Room

**Background (3200x1800, opaque)** Plain flat fill: upper half light grey (#a3a3aa), lower half grey-blue (#7a7d88).

**Room shell (2100x960, opaque)** `<style block>` Empty wall and table made of horizontal bands only: a light grey
strip at the top 16%, then a muted purple wall (slightly darker towards the edges) down to 69%, a tan wooden table top
(69%-74%) with a light highlight on its back edge and dark outline lines, the darker front edge of the table to 79%,
and an out-of-focus grey floor below. Nothing standing on the table.

## Television

**CRT TV (1520x1160, transparent corners)** `<style block>` Old black CRT television with a VCR built into its base,
front view. Large rounded screen with a grey bezel taking the left 78% (screen area plain black), on the right a small
display window, a 3x4 grey number keypad and a column of horizontal speaker slats, a small grey button below. The base
under the screen: three round grey buttons and a little grille on each side, and a long dark horizontal cassette slot
in the middle.

## Cassette

**VHS tape (540x200, transparent)** `<style block>` A single black VHS cassette lying flat, seen from the front and
slightly above: the top face (upper 44%) shows two rounded reel windows with white reels and a white paper label in
the middle; the front face (lower 56%) is black with a large blank rectangular label area (leave it empty, the coloured
label and title are added in code).

## Mordecai's arms

Character block, reused below:

```
Mordecai, the blue jay from Regular Show: bright mid-blue (#4aa3e6), thick dark outline, slender arm. His hand is the
same blue, made of three or four long pointed feather-like fingers plus a thumb, with darker blue line details. Near
the wrist the forearm has two white bands.
```

**Sleeve (200x2000, transparent)** `<style block>` `<character block>` Only the plain blue part of the arm (no hand,
no white bands), hanging perfectly straight down, shoulder end at the top edge, wrist end at the bottom edge, dark
outline along both long edges, no outline across the ends, plain enough to be stretched vertically. Mirror it for the
other side.

**Hand (280x400, transparent)** `<style block>` `<character block>` The hand seen from the back with the fingers
pointing straight up and slightly spread, as if pushing a tape. The palm is centred around 40% of the height, the
wrist and forearm continue straight down to the bottom edge with the two white bands across it; the forearm is about
60% of the image width wide and has no outline across its bottom end. Mirror it for the other hand.

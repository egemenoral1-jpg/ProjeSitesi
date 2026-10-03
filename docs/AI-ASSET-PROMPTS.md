# AI image prompts

Generate every asset with the **same model, the same seed family and the shared style block below**, so the
scene stays consistent. Sizes and anchors for every file are in [ASSETS.md](ASSETS.md). Generate at 2x, remove
the background for transparent items, crop exactly to the aspect ratio and export WebP.

> These prompts describe a scene inspired by a late-night cartoon living room with a blue-jay character's arms.
> If you use a licensed character, make sure you have the right to use it on a public site.

## Shared style block (paste at the start of every prompt)

```
2D flat cartoon illustration in the style of a late-night animated TV show, thick clean dark outlines of constant
weight, simple cel shading with one soft shadow tone, slightly muted palette: dark brown, muted purple, deep blue,
warm tan wood, warm yellow-orange accents, CRT blue-green light. Straight-on front view at table height, no
perspective tilt. Evening living room, cozy and nostalgic. Main light: blue-green glow from an old CRT television in
the centre, weak warm lamp on the right. Not horror, not neon, not cyberpunk, no text, no watermark.
```

Negative prompt (if supported): `3d render, photo, realistic, neon, cyberpunk, horror, text, logo, watermark, blurry outlines, perspective distortion`

## Room

**Background (3200x1800, opaque)** Plain flat fill: upper half light warm grey (#8f8b96), lower half dusty blue (#3a4d63). No detail.

**Room shell (2100x960, opaque)** `<style block>` Empty wall and table seen straight on, made only of horizontal bands:
light grey upper wall in the top 25%, muted purple wallpaper with faint vertical stripes down to 69%, a tan wooden
table top from 69% to 73% with a thin highlight on its back edge, the darker front edge of the table to 79%, and a
heavily blurred floor below it (soft green, blue and violet blobs, out of focus). Nothing standing on the table.

## On the table (transparent background, same front camera)

**Plant (340x600)** `<style block>` Leafy houseplant in a terracotta pot, front view.

**Lamp (280x840)** `<style block>` Old table/floor lamp with a warm yellow fabric shade lit from inside, thin dark stand, round base.

**Soda cans (240x140)** `<style block>` Two standing soda cans (red, blue) and one tipped-over can.

## Television

**CRT TV (1280x1120, transparent corners)** `<style block>` Old dark grey CRT television with thick rounded plastic
body, front view. A big dark rounded-rectangle screen well on the left 80% (plain black, no reflection), a column on
the right with a small display window, a 3x3+1 button pad and a speaker grille. Under the screen a wide black VCR
panel with one long dark horizontal cassette slot centred under the screen and small grilles left and right of it.
Two short feet at the bottom. Subtle scuffs.

## Cassette

**VHS spine (540x92, transparent)** `<style block>` A single VHS cassette lying flat, seen exactly from its
spine (long thin side facing the viewer): black plastic, a wide blank cream label panel along most of the length,
small notches at both ends, rounded corners.

## Mordecai's arms

Character block, reused below:

```
Arm of a tall cartoon blue jay (Mordecai-like): mid-blue feathers with a slightly darker blue edge and a lighter
highlight stripe, white cartoon glove-like hands with four fingers and dark outlines.
```

**Sleeve (192x2000, transparent)** `<style block>` `<character block>` A single long blue arm hanging perfectly straight
down, shoulder end at the top edge, wrist end at the bottom edge, no hand, slightly tapered, perfectly vertical and
symmetrical, plain enough to be stretched vertically. Make a second, mirrored copy for the other side.

**Hand (240x240, transparent)** `<style block>` `<character block>` One white cartoon hand seen from the back,
fingers pointing straight up, half open as if about to grab a cassette, thumb to the side, centred in the frame.
Make a mirrored copy for the other hand.

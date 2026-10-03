# AI image prompts

Generate every asset with the **same model, same seed family and the shared style block below**, so the room stays
consistent. Sizes and anchors for every file are in [ASSETS.md](ASSETS.md). Generate at 2x, remove the background
(for transparent items), crop exactly to the aspect ratio and export WebP.

> These prompts describe an original late-night cartoon living room and a blue-jay character. If you use a licensed
> character, make sure you have the right to use it on a public site.

## Shared style block (paste at the start of every prompt)

```
2D flat cartoon illustration, late-night animated TV show style, thick clean dark-navy outlines of constant weight,
simple cel shading with one soft shadow tone, slightly muted desaturated palette: dark brown, muted purple, deep blue,
warm yellow-orange accents, CRT blue-green light. Straight-on orthographic front view (no perspective tilt), eye level,
slightly messy cozy nostalgic living room, night time. Main light: blue-green glow from an old CRT television on the
right-centre, weak warm lamp light from the far right, faint moonlight from a window on the left. Not horror, not neon,
not cyberpunk, no text, no watermark.
```

Negative prompt (if supported): `3d render, photo, realistic, neon, cyberpunk, horror, text, logo, watermark, blurry, perspective distortion`

## Room

**Background (3200x1800, opaque)**
`<style block>` Empty dark night sky gradient, deep blue to purple to dark brown, extremely soft, almost flat, very low detail, used only as a backdrop.

**Room shell (1700x960, opaque)**
`<style block>` Empty living-room wall and floor seen straight on. Muted purple wallpaper with faint vertical stripes in the upper 70%, dark baseboard, wooden plank floor in dark brown in the lower 30% (horizon line at 70% of the height). A four-pane window with a night sky, moon and distant hills on the left (about 17% from the left, 8-35% from the top). A small retro rock-concert poster on the upper right wall. No furniture, no characters. Keep the centre uncluttered.

## Furniture (transparent background, side-on, same eye-level camera)

**Shelf (420x70)** `<style block>` A single wooden wall shelf plank with two triangular brackets, seen from the front, top edge flat and aligned to the top of the image, transparent background.

**TV stand (560x190)** `<style block>` Low wooden TV cabinet with two doors and round brass knobs, flat top surface, front view, transparent background.

**Armchair (260x260)** `<style block>` Worn dusty-rose armchair with a high back, front view, transparent background.

**Floor lamp (140x420)** `<style block>` Old floor lamp with a warm yellow fabric shade and thin dark stand, front view, transparent background. The shade looks lit from inside.

**Rug (760x170)** `<style block>` Oval maroon rug with a gold border pattern, viewed from the front so it is a flat squashed ellipse, transparent background.

**Plant (170x300)** `<style block>` Leafy houseplant in a terracotta pot, front view, transparent background.

## Props

**Soda cans (120x70)** `<style block>` Two standing soda cans (red, blue) and one tipped-over can, transparent background.

**Pizza box (200x90)** `<style block>` Open flat pizza box with a slice missing, seen from the front at floor level, transparent background.

## Television

**CRT TV (500x420, transparent corners)** `<style block>` Old grey-black CRT television with a thick rounded plastic bezel, front view. A dark rounded-rectangle screen well on the left 80% (leave it plain black, no reflections), a column on the right with two round dials, a 3x3 button pad and a speaker grille. Below the screen a wide VCR strip with a long dark horizontal cassette slot on the left (about 45% of the width) and a small EJECT button on the right. Subtle wear and scratches.

## Cassettes

**Spine (92x340 at 2x, transparent)** `<style block>` A single VHS tape seen from the spine, standing upright: black plastic with a wide blank cream label panel filling most of the length, rounded corners.

**Front (480x264 at 2x, transparent)** `<style block>` A single VHS cassette seen from the front, black plastic, a blank cream label panel across the top half, a dark rectangular window with two white tape reels in the bottom half, small screw details.

## Mordecai (blue jay, front view, neutral stance)

Character sheet block, reused in every prompt below:

```
Mordecai-style tall blue jay character: bright mid-blue feathers, lighter blue-white chest, white face mask with large
round white eyes with small black pupils and heavy dark eyebrows, small black pointed beak, a three-spike feather crest
on the head, thin blue legs with dark blue feet, relaxed slightly bored expression. Same proportions in every image:
head about 1/3 of the body height.
```

**Body (400x1040 at 2x, transparent)** `<style block>` `<character block>` Full body from the front, standing, **no arms at all** (the shoulders end in plain round sockets at 63% of the height from the feet, 58 px left and right of centre at 1x), feet exactly at the bottom edge of the image, centred horizontally.

**Left / right arm (88x400 at 2x, transparent)** `<style block>` `<character block>` A single blue arm hanging straight down, slightly tapered, no hand (ends bluntly), the shoulder end at the top edge, perfectly vertical and symmetrical so it can be rotated around the top centre.

**Left / right hand (128x128 at 2x, transparent)** `<style block>` `<character block>` A single white cartoon glove-like hand, relaxed half-open, four fingers and thumb, centred in the frame, front view; generate a mirrored version for the other side.

# AI prompt pack: 12 images, 6 video clips

Written 2026-10-15. **Status: not run.** AI image and video generation is not available in this environment today (the ElevenLabs creative endpoints return Forbidden and no other generator is reachable). These prompts are ready to paste the day generation is switched on. Nothing here is a product photo, and no output may be presented as one until it passes the check below.

Every prompt describes the product **generically**: an oversized hooded cloak, button front, plush faux-fur lining, relaxed mid-calf length. That is deliberate. A generic description lets us hold the output up against the real sample and see where the generator guessed. Where the sample settles a detail (button count, arm style, lining colour), fill the variable and the prompt gets more accurate.

## Re-shoot flags

Every shot carries one of three flags.

| Flag | Meaning | Where the AI version may be used |
|---|---|---|
| **RE-SHOOT** | The shot shows a detail a buyer relies on: colour, texture, buttons, hood shape, length on the body, how the weight drapes. | Storyboards, layout tests, internal drafts only. **Before any ad or product page, replace it with Cody's photo or clip of the sample.** |
| **CONDITIONAL** | A mood scene where the cloak is seen at a distance. | Ads and organic posts only if it passes all 11 checks below against the sample, every claim it implies is switched on in config, it carries the platform's AI label, and it is logged in `asset-log.csv`. A real version is still preferred. |
| **REAL ONLY** | Scale readings, labels, size and fit, packaging, thermostats and screens. | Never generated. Listed here so nobody tries. |

| ID | Shot | Flag | Real replacement |
|---|---|---|---|
| AI-IMG-01 | Studio packshot, front, hood down | RE-SHOOT | ph-hc01 |
| AI-IMG-02 | Studio packshot, three-quarter, hood up | RE-SHOOT | ph-hc02 |
| AI-IMG-03 | Studio packshot, back, hood up | RE-SHOOT | ph-hc03 |
| AI-IMG-04 | Macro, faux-fur lining | RE-SHOOT | ph-hc04 |
| AI-IMG-05 | Macro, hood rim | RE-SHOOT | ph-hc05 |
| AI-IMG-06 | Lifestyle, reading nook | CONDITIONAL | ph-hc08 |
| AI-IMG-07 | Lifestyle, couch movie night | CONDITIONAL | ph-hc07 |
| AI-IMG-08 | Lifestyle, porch at dusk | CONDITIONAL | none yet (AI may lead here) |
| AI-IMG-09 | Lifestyle, home-office chair | CONDITIONAL | ph-hc15 |
| AI-IMG-10 | Flat lay | RE-SHOOT | ph-hc09 |
| AI-IMG-11 | Colour swatch grid | RE-SHOOT | a grid of real photos, one per colour |
| AI-IMG-12 | Size reference, two heights | RE-SHOOT (illustration only, never in ads) | ph-hc12 + V6 |
| AI-VID-01 | Slow push-in on the hood | RE-SHOOT | V3 shot 4 |
| AI-VID-02 | Wrapping up on a couch | CONDITIONAL | V1 shot 4, V2 shot 3 |
| AI-VID-03 | Fabric close-up | RE-SHOOT | V5 shot 1 |
| AI-VID-04 | Throw it on, swing and drape | RE-SHOOT | V1 shot 2 |
| AI-VID-05 | Porch at dusk | CONDITIONAL | none yet |
| AI-VID-06 | Reading nook, rain on the window | CONDITIONAL | V5 shot 4 |
| (none) | Scale reading, labels, fit by height, packaging, thermostat | REAL ONLY | V1 shot 3, ph-hc10, ph-hc11, ph-hc12, V6, V4 shot 1 |

## Ground rules

1. **No supplier or competitor image goes into a generator,** not as a reference, a start frame, a style match or an edit base. Once the sample is photographed, Cody's own photos are the reference images (`ph-hc16`, `ph-hc02`, `ph-hc04`); image-to-image from our own sample is the most accurate route.
2. **Adults only,** clearly adult (apparent age 25-60), varied in gender, ethnicity and build. Never a real person's likeness, never a celebrity, never "in the style of" a brand, photographer or campaign.
3. **Face clear and awake** in every shot with a person. No sleeping, no lying down with the hood up, no hood over the face.
4. **No flames:** no candles, fireplaces, fire pits or space heaters.
5. **No text in the image.** Headlines and prices are added in the edit from config, so they can be checked and changed.
6. **Log every output** in `asset-log.csv`: prompt ID, generator and model, date, reference inputs, check result, where it is used.
7. **Label it.** On TikTok, switch on the AI-generated content label for any post with a realistic AI scene. On Meta, keep any AI label Meta applies or asks for. Never present an AI image as a customer photo or as "our photo".
8. Generating spends credits. Run each prompt once with the generator's default number of variations, and pick from those. Do not re-send a call to "retry".

## Variables

Fill these once, then search and replace through the prompts. Before the sample arrives, use the defaults; they are deliberately non-committal.

| Variable | Default until the sample is checked | Set from |
|---|---|---|
| `{{COLOUR}}` | warm oatmeal | `listing.json` colour names; one run per colour sold |
| `{{LINING_COLOUR}}` | cream | the sample |
| `{{OUTER_LOOK}}` | a heavy, matte, brushed cotton-look outer fabric | the sample and its fiber label |
| `{{BUTTON_DESC}}` | a row of large buttons down the front | the sample: count, size, colour |
| `{{HOOD_DESC}}` | a deep, roomy hood | the sample |
| `{{LENGTH}}` | mid-calf length on an adult of average height | the sample on Cody, at Cody's height |
| `{{ARM_STYLE}}` | the arms stay under the cloak and the hands come out at the front opening | the sample: sleeveless cape, arm slits, or sleeves |
| `{{POCKETS}}` | no visible pockets | the sample |

**Product block.** Every prompt below already contains it, written out in full:

> an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints

**Negative prompt** (add to every image and video run; remove "drawstrings" if the sample has one):

```prompt
text, letters, words, logos, brand labels, tags, watermarks, price stickers, minors, anyone who looks under 21, candles, open flames, fireplace, fire pit, space heater, person asleep, eyes closed, lying down, hood pulled over the face, face hidden, sad or distressed expression, tears, hospital or clinic room, pill bottles, split screen, side-by-side comparison, fantasy costume, medieval, wizard, sword, cosplay, horns, gothic or punk styling, studs, chains, zips, drawstrings, extra sleeves, extra limbs, distorted hands, extra fingers, plastic-looking fur, shiny synthetic sheen, animals wearing clothes, cluttered background
```

---

## Image prompts

Output size: generate at the largest the model allows in the stated ratio, then export at 1080 px on the short side or more. File names are fixed so the asset log and UTMs line up.

### AI-IMG-01 · Studio packshot, front, hood down

- **File:** `ai-img-01-packshot-front.png` · **Ratio:** 4:5 · **Flag:** RE-SHOOT (replace with `ph-hc01`)
- **Reference input:** none until the sample is photographed, then `ph-hc16-on-hanger.jpg`.

```prompt
Studio catalog photograph of an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Worn by an adult model in their thirties standing straight and facing the camera, hood down, front fully buttoned, neutral relaxed expression. Seamless warm off-white paper background, large soft light from the left, gentle fill from the right, soft contact shadow on the floor. Full length from head to feet, centred, generous empty space around the figure. 50mm lens look, f/8, everything sharp, true-to-life colour, clean and calm.
```

### AI-IMG-02 · Studio packshot, three-quarter, hood up

- **File:** `ai-img-02-packshot-hood-up.png` · **Ratio:** 4:5 · **Flag:** RE-SHOOT (replace with `ph-hc02`)
- **Used as stand-in for:** S1 drafts only.

```prompt
Studio catalog photograph of an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Worn by an adult model in their forties turned three-quarters to the left, hood up and framing the face, the face fully visible, eyes open, a small warm smile. Seamless warm off-white background, soft key light from the front left, subtle rim light separating the hood from the background. Framed from just above the hood to the hem, with room above for a headline. 85mm lens look, f/5.6, true-to-life colour.
```

### AI-IMG-03 · Studio packshot, back, hood up

- **File:** `ai-img-03-packshot-back.png` · **Ratio:** 4:5 · **Flag:** RE-SHOOT (replace with `ph-hc03`)

```prompt
Studio catalog photograph of an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Seen from directly behind on an adult model of average height standing straight, hood up, showing the full back panel, the shape of the hood from behind and where the hem falls. Seamless warm off-white background, even soft light, soft floor shadow. Full length, centred. 50mm lens look, f/8, true-to-life colour.
```

### AI-IMG-04 · Macro, faux-fur lining

- **File:** `ai-img-04-macro-lining.png` · **Ratio:** 1:1 · **Flag:** RE-SHOOT (replace with `ph-hc04`)
- **Used as stand-in for:** S6 card 1 drafts only.

```prompt
Macro photograph of the inside of an oversized adult hooded cloak in {{COLOUR}}: the front edge folded back so the plush {{LINING_COLOUR}} faux-fur lining and {{OUTER_LOOK}} show side by side along a clean seam. Raking window light from the side to show the depth and softness of the pile. Very shallow depth of field, focus on the tips of the fibres, background falling off to a soft blur. Neutral off-white linen surface underneath. No hands, no labels. True-to-life colour, quiet and tactile.
```

### AI-IMG-05 · Macro, hood rim

- **File:** `ai-img-05-macro-hood.png` · **Ratio:** 1:1 · **Flag:** RE-SHOOT (replace with `ph-hc05`)

```prompt
Close-up photograph of {{HOOD_DESC}} of an oversized adult hooded cloak in {{COLOUR}} with a plush {{LINING_COLOUR}} faux-fur lining at the hood rim. The hood is up on an adult seen from the shoulders up at a three-quarter angle; the lining frames the side of the face, and the face sits mostly outside the right edge of the frame, with only the cheek and jaw visible. Soft window light from the left, shallow depth of field, focus on the hood rim where the lining meets {{OUTER_LOOK}}. Warm off-white background. True-to-life colour.
```

### AI-IMG-06 · Lifestyle, reading nook

- **File:** `ai-img-06-reading-nook.png` · **Ratio:** 4:5 (also make 9:16) · **Flag:** CONDITIONAL (real version: `ph-hc08`)
- **Used as stand-in for:** S4; start frame for AI-VID-06.

```prompt
Lifestyle photograph of a cosy reading nook beside a large window on an overcast autumn afternoon. An adult in their forties sits deep in a soft armchair wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. The hood is up, the face fully visible, awake and quietly smiling, reading a hardback book. A ceramic mug of tea on a small wooden side table, a warm reading lamp switched on, a trailing houseplant, linen and oak textures. Soft natural light mixed with the lamp's warm glow. Eye-level camera, 35mm lens look, f/2.8, gentle depth of field, editorial home-magazine style, the cloak's colour true to life.
```

### AI-IMG-07 · Lifestyle, couch movie night

- **File:** `ai-img-07-couch-movie-night.png` · **Ratio:** 4:5 (also make 9:16) · **Flag:** CONDITIONAL (real version: `ph-hc07`)
- **Used as stand-in for:** S3; start frame for AI-VID-02.

```prompt
Lifestyle photograph of a living room in the evening. An adult in their late twenties sits cross-legged on a soft, deep sofa wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Hood up, face fully visible, relaxed and smiling, holding a bowl of popcorn in their lap. A cool soft glow from an off-screen television on one side and a warm table lamp on the other, a knitted throw over the sofa arm, an uncluttered room. 35mm lens look, low light but clean, natural skin tones, the cloak's colour true to life. No visible screen.
```

### AI-IMG-08 · Lifestyle, porch at dusk

- **File:** `ai-img-08-porch-dusk.png` · **Ratio:** 4:5 (also make 9:16) · **Flag:** CONDITIONAL (no real version planned yet; a real porch photo is a good later reshoot)
- **Used as:** start frame for AI-VID-05; organic posts.

```prompt
Lifestyle photograph of a wooden front porch at dusk in late autumn, deep blue sky, a warm porch light above the door. An adult in their fifties sits on the top step wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Hood up, face fully visible and calm, holding a steaming mug in both hands, breath faintly visible in the cold air. Fallen leaves on the steps, a potted plant beside the door. No fire of any kind. Quiet, still mood. 50mm lens look, f/2, the cloak's colour true to life under mixed blue and warm light.
```

### AI-IMG-09 · Lifestyle, home-office chair

- **File:** `ai-img-09-home-office.png` · **Ratio:** 4:5 · **Flag:** CONDITIONAL (real version: `ph-hc15`)
- **Used as stand-in for:** S8.

```prompt
Lifestyle photograph of a small home office on a cold, bright morning. An adult in their thirties sits in a simple desk chair wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the hood rim and the front opening, {{HOOD_DESC}}, relaxed {{LENGTH}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints. Hood up, face fully visible, focused and content, holding a mug. A closed laptop and a notebook on a wooden desk, soft window light from the side, a plant on the windowsill. No screens showing anything, no brand marks. 35mm lens look, f/2.8, true-to-life colour.
```

### AI-IMG-10 · Flat lay

- **File:** `ai-img-10-flat-lay.png` · **Ratio:** 4:5 · **Flag:** RE-SHOOT (replace with `ph-hc09`)

```prompt
Top-down flat lay photograph of an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining, folded neatly into a soft rectangle with the hood resting on top and a strip of lining showing along one edge, no logos, no prints. It lies on a light oak floor with a natural linen cloth, surrounded by a ceramic mug of tea, a closed paperback book and a pair of wool socks. Soft, even daylight from above, almost no shadows, plenty of empty space at the top of the frame. True-to-life colour, calm and tidy.
```

### AI-IMG-11 · Colour swatch grid

- **File:** `ai-img-11-colour-grid.png` · **Ratio:** 1:1 · **Flag:** RE-SHOOT (replace with a grid of real photos, one per colour sold)
- **How:** generate each colour as its own image with the same prompt and, where the tool allows, the same seed, then assemble the grid in the edit. Asking for a whole grid in one image tends to drift the shape between squares. Use only colours in `listing.json`, and only those sold in adult sizes.

```prompt
Studio catalog photograph on a warm off-white background: an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining, folded into a neat square with the hood on top and a little lining showing at the edge, no logos, no prints. Shot straight down from above, centred, the folded cloak filling the middle two thirds of the square frame. Soft, even, shadowless light. Identical framing, lighting and fold for every colour in the set. True-to-life colour is the whole point of the image.
```

### AI-IMG-12 · Size reference, two heights

- **File:** `ai-img-12-size-reference.png` · **Ratio:** 4:5 · **Flag:** RE-SHOOT, illustration only. **Never in an ad or on the product page.** A generator cannot know where the hem falls on a given height; only `ph-hc12` and V6 can show that.

```prompt
Studio photograph against a plain light grey wall marked with a subtle vertical height scale of thin lines and no numbers. Two adults of clearly different heights, one about five foot four and one about six foot three, stand side by side facing the camera, both wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining visible at the front opening, {{HOOD_DESC}}, {{ARM_STYLE}}, {{POCKETS}}, no logos, no prints, hoods down. Even, flat lighting, full length from head to toe, camera at hip height so there is no lens distortion, neutral friendly expressions, catalog style.
```

---

## Video prompts

Generate 5-8 second clips, vertical 9:16, 24 or 30 fps, with slow and simple motion; most models fall apart on fast hand movements and buttons. Where a start frame is named, run image-to-video from it so the cloak matches the still. Once the sample is photographed, prefer Cody's own photo as the start frame.

### AI-VID-01 · Slow push-in on the hood

- **File:** `ai-vid-01-hood-push-in.mp4` · **Length:** 6 s · **Flag:** RE-SHOOT (real version: V3 shot 4)
- **Start frame:** `ai-img-02-packshot-hood-up.png`, or `ph-hc02-three-quarter-hood-up.jpg` once it exists.

```prompt
A slow, steady push-in from a medium shot to a close-up of an adult wearing an oversized adult hooded cloak in {{COLOUR}} with {{HOOD_DESC}} up and a plush {{LINING_COLOUR}} faux-fur lining framing the face, standing against a warm off-white background. The person turns their head slightly toward the camera and smiles, eyes open, face fully visible. The lining at the hood rim moves softly with the turn. Soft key light from the left. One continuous shot, no cuts, smooth camera, calm pace.
```

### AI-VID-02 · Wrapping up on a couch

- **File:** `ai-vid-02-couch-wrap.mp4` · **Length:** 8 s · **Flag:** CONDITIONAL (real versions: V1 shot 4, V2 shot 3). The slow, heavy settle implies weight: use it in ads only if `claims.weighted` is on.
- **Start frame:** `ai-img-07-couch-movie-night.png`.

```prompt
Evening living room, warm lamp light. An adult sits down onto a soft, deep sofa wearing an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining, {{ARM_STYLE}}. They pull the front closed with both hands, lean back into the cushions and lift the hood up over their head, face fully visible, a relaxed smile. The fabric drapes and settles slowly around their shoulders. Static camera at eye level, gentle natural motion, one continuous shot.
```

### AI-VID-03 · Fabric close-up

- **File:** `ai-vid-03-lining-close-up.mp4` · **Length:** 5 s · **Flag:** RE-SHOOT (real version: V5 shot 1)
- **Start frame:** `ai-img-04-macro-lining.png`.

```prompt
Extreme close-up of fingertips slowly brushing across a plush {{LINING_COLOUR}} faux-fur lining at the edge of a {{COLOUR}} hooded cloak. Raking side light shows the pile bending under the fingers and springing back. Very shallow depth of field, slow and gentle movement, nothing else in frame, one continuous shot.
```

### AI-VID-04 · Throw it on

- **File:** `ai-vid-04-throw-on.mp4` · **Length:** 6 s · **Flag:** RE-SHOOT (real version: V1 shot 2). How a cloak swings and settles shows its weight, so only real footage may carry this in an ad.
- **Start frame:** `ai-img-01-packshot-front.png` with the cloak held up, or a real still from V1.

```prompt
A bright living room in daylight. An adult standing in the middle of the room lifts an oversized adult hooded cloak in {{COLOUR}}, {{OUTER_LOOK}}, {{BUTTON_DESC}}, a plush {{LINING_COLOUR}} faux-fur lining, by the shoulders, swings it around onto their shoulders in one smooth motion, lets it settle, fastens the top button and pulls the hood up, face fully visible and smiling. Static camera, medium-wide shot, natural motion, one continuous shot.
```

### AI-VID-05 · Porch at dusk

- **File:** `ai-vid-05-porch-dusk.mp4` · **Length:** 7 s · **Flag:** CONDITIONAL (no real version yet)
- **Start frame:** `ai-img-08-porch-dusk.png`.

```prompt
Blue hour on a wooden front porch in late autumn, a warm light above the door. An adult sits on the top step wearing an oversized adult hooded cloak in {{COLOUR}} with the hood up and a plush {{LINING_COLOUR}} lining at the hood rim, face fully visible, holding a steaming mug in both hands. They take a slow sip and look out toward the street, breath faintly visible in the cold air, a few leaves drifting down. Slow lateral camera move from left to right, calm and quiet, no fire of any kind, one continuous shot.
```

### AI-VID-06 · Reading nook, rain on the window

- **File:** `ai-vid-06-reading-nook-rain.mp4` · **Length:** 8 s · **Flag:** CONDITIONAL (real version: V5 shot 4)
- **Start frame:** `ai-img-06-reading-nook.png`.

```prompt
Static wide shot of a reading nook by a large window with rain running down the glass on a grey afternoon. An adult in a soft armchair wears an oversized adult hooded cloak in {{COLOUR}} with the hood up and a plush {{LINING_COLOUR}} lining at the hood rim, face fully visible and calm. They turn a page of a hardback book and reach for a mug of tea on the side table. A warm reading lamp glows beside them. Gentle, minimal motion, one continuous shot.
```

---

## The 11-point check (every output, side by side with the sample)

Lay the output next to Cody's photo of the sample, taken in daylight next to the white-paper reference. Any "no" means the output is discarded. Do not fix a wrong detail by editing it in; that creates a picture of a product we do not sell.

1. Colour matches the sample in daylight.
2. Lining colour and pile length match.
3. Buttons match: count, size, colour and spacing.
4. Hood shape and depth match. No drawstring unless the sample has one.
5. Length on the body matches the sample on a person of similar height.
6. Arm style matches `{{ARM_STYLE}}`. No sleeves, cuffs, pockets or zips that the sample lacks.
7. No text, logos, labels or watermarks anywhere.
8. Hands, fingers and faces look natural.
9. Every person is clearly an adult, awake, with the face clear of the hood.
10. No flames, candles, fireplaces or heaters; no hospital or clinic setting; no one asleep.
11. It does not resemble any competitor's photos (setting, model, pose, styling).

Record the result in `asset-log.csv` (`matches_sample` and `checked_by`).

## Running it, once generation is enabled

These steps assume the ElevenLabs creative tools, which is the generator this workspace has connected. Another generator works the same way.

1. List the models this workspace can run, and read the model guide for any model not used before.
2. Create one flow for the product, so stills and clips can be connected as start frames.
3. Upload Cody's sample photos as reference files. Never upload supplier or competitor images.
4. Run each image prompt once with the default number of variations. Pick the best; pin it.
5. Run the video prompts image-to-video from the pinned stills, or from Cody's photos.
6. Download, name exactly as above, run the 11-point check, and log every file.
7. Add text in the edit, from config, and run `check_copy.py` on any new copy.

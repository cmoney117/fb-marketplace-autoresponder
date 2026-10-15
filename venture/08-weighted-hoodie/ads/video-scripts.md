# Video scripts: six vertical shorts

Written 2026-10-15. Six scripts of 10-22 seconds, each shootable by Cody on a phone with the one sample, in one afternoon, UGC style. Each shot also names the AI video prompt (`ai-prompt-pack.md`) that can stand in for it once generation is enabled, and says when a shot must stay real. Tokens and gates: `README.md`. Every on-screen line, voiceover line and caption here passes `check_copy.py`.

| Script | Asset ID | Angle (`angles.md`) | Length | Meta use | Requires |
|---|---|---|---|---|---|
| V1 Blanket. Hoodie. Both. | vid-hc01 | 1 Hugs back | 15 s | Ad set A | claims.weighted, claims.weight_lb (fallback: none) |
| V2 Social battery | vid-hc02 | 3 Homebody (alt hooks: 7) | 11 s | Ad set B | none (caption: features.buttons, fallback: none) |
| V3 The blanket thief | vid-hc03 | 2 Gift | 18 s | Ad set C | none (Christmas end card: claims.ships_from_us) |
| V4 Thermostat wars | vid-hc04 | 4 Thermostat | 12 s | Ad set C, Phase 2 | none |
| V5 Couch season, sound on | vid-hc05 | 5 Couch season | 20 s | Ad set B | claims.lining (fallback: none) |
| V6 Fit check by height | vid-hc06 | 8 Tall fit | 22 s | Phase 2, organic, comment replies | claims.sizes |

## Rules for every video

**Who is on camera, and in what voice.**
- Cody speaks as the person who runs the shop. Never as a customer, and never "I bought this and...". On a personal account, say it is your shop.
- A friend or partner can act in a scene (V3). They do not give opinions about the product, and they sign a simple written model release before the footage is used. Log it in `asset-log.csv`.
- Adults only, and clearly adult. No children, teens, school settings or school-year themes.
- The face is always clear of the hood. Nobody lies down or sleeps with the hood up.
- No candles, fireplaces, fire pits or space heaters in any frame (Safety block: keep away from flames).
- No supplier packaging, no gift boxes, no unboxing. The parcel arrives in fulfillment-partner packaging and we never show it as anything else.
- No stressed, tired or upset "before" moment, ever. People are neutral or happy throughout.

**Phone settings.**
- Rear camera, 1x lens (the ultra-wide stretches the length and misleads on fit). Vertical 9:16, 4K at 30 fps.
- Lock focus and exposure on the cloak (long-press on iPhone or Android). Turn off beauty mode, filters and portrait blur, which smear the lining texture.
- At the start of each setup, film three seconds of the cloak next to a sheet of plain white paper. The editor uses it to keep the colour true. Wrong colour is a refund.
- Daylight from a window is the main light. Evening scenes add one warm lamp, not overhead lights.

**Text and sound.**
- Keep on-screen text out of the top 250 px, the bottom 670 px and the right 120 px of a 1080 x 1920 frame, where Reels and TikTok buttons sit.
- Burn in captions for any voiceover; most people watch muted.
- Ad music comes from Meta's Sound Collection (Meta ads) or TikTok's Commercial Music Library (a Business account post). Never a trending song in an ad.
- The first frame must show the cloak. It is also the thumbnail.

**End card** (last 2-4 seconds of every video, over packshot `ph-hc01`):

```copy requires=none
{{BRAND}}
{{PRICE}} · Free US shipping · {{DOMAIN}}
```

While the delivery promise is valid, this version can replace it:

```copy requires=claims.ships_from_us
{{BRAND}} · {{PRICE}} · Free US shipping
Arrives {{ARRIVAL_WINDOW}} after you order
```

---

## V1 · vid-hc01 · Blanket. Hoodie. Both. · 15 s

**Requires:** claims.weighted, claims.weight_lb

- **Angle:** 1, the hoodie that hugs back. **Meta:** ad set A, lead creative.
- **On camera:** Cody. **Props:** digital kitchen scale set to lb and tared, couch, mug. **Light:** daylight.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-2 s | Top-down: the cloak spread open across the couch like a blanket. A hand smooths it flat. | It's a blanket. | It's a blanket. | Real preferred (shows the whole cloak); AI-IMG-10 for storyboards only |
| 2 | 2-5 s | Medium, one continuous take: Cody lifts it by the shoulders, swings it on, does the top button, pulls the hood up. | It's a hoodie. | It's a hoodie. | AI-VID-04, but real only in ads (shows drape and weight) |
| 3 | 5-9 s | Close, phone on a tripod: scale shows 0.0 lb, the folded cloak goes on, the number settles. **No cut during the reading.** | It weighs about {{WEIGHT_LB}} lb. | And it weighs about {{WEIGHT_LB}} pounds. | **Real only. Never AI.** |
| 4 | 9-12 s | Medium-wide: Cody sits back into the couch, pulls the front closed, picks up the mug. Hood up, face clear, small smile. | Hood up. Stay in. | | AI-VID-02 (lifestyle; check against the sample) |
| 5 | 12-15 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Alternative first lines** for hook tests (same footage; shot 1's text changes; post as vid-hc01b and vid-hc01c):

```copy requires=none
The hoodie that hugs back.
```

```copy
Put it on the scale first.
```

**Caption (Meta primary text)**

```copy
It's a blanket and a hoodie at once, with about {{WEIGHT_LB}} lb of comforting weight across your shoulders. Throw it on over anything, pull the hood up, settle in. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
blanket or hoodie? both. about {{WEIGHT_LB}} lb, weighed on our own sample. {{BRAND_TAG}} #cozy #couchseason #wearableblanket #cozyathome #homebody
```

**Fallback if `claims.weighted` is off.** Replace shot 3 with a close-up of a hand pulling the hood up around the face, and use:

| Replaces | On-screen text | Voiceover | Requires |
|---|---|---|---|
| Shot 3 | It's both. | It's both. | none |

```copy requires=none
It's a blanket and a hoodie at once. Throw it on over anything, pull the hood up, settle in. {{PRICE}}, free US shipping.
```

**Notes.** The scale clip is evidence as well as an ad: keep the raw file. The number on screen must be the measured weight rounded down to the nearest 0.5 lb, and it must match `claims.weight_lb` in config. If the scale shows 4.3, the text says "about 4 lb".

---

## V2 · vid-hc02 · Social battery · 11 s

**Requires:** none

- **Angle:** 3, hood up, world out. **Meta:** ad set B, lead creative.
- **On camera:** Cody. **Props:** keys and a bowl by the door, couch, lamp, TV remote or mug. **Light:** dusk, one warm lamp plus fading window light.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-3 s | Locked-off wide of the hallway: Cody walks in and drops the keys in the bowl. Neutral face: not tired, not upset, no sigh. The cloak is visible draped on the couch arm in frame. | My social battery after 5pm: | | AI-VID-02 (lifestyle) |
| 2 | 3-6 s | Medium: Cody picks the cloak off the couch arm and throws it on in one move. Hood up. | | | Real preferred (drape) |
| 3 | 6-9 s | Wide: Cody drops onto the couch, wraps the front closed, remote in hand, lamp glow, content smile. | Hood up. World out. | | AI-VID-02 |
| 4 | 9-11 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Audio:** a calm licensed track. No voiceover.

**Alternative first lines** for TikTok hook tests (same footage; post as vid-hc02b and vid-hc02c):

```copy
Saturday plans: none.
```

```copy
Plans cancelled. Hood up.
```

**Caption (Meta primary text)**

```copy requires=features.buttons
Made for quiet nights in. Throw it on over anything, button it closed, pull the hood up. {{PRICE}}, free US shipping.
```

**Caption fallback if `features.buttons` is off**

```copy requires=none
Made for quiet nights in. Throw it on over anything, wrap it closed, pull the hood up. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
the only plan i have tonight {{BRAND_TAG}} #homebody #nightin #cozy #couchseason
```

**Notes.** The walk-in is there to set the time of day, not a mood. If a take looks weary, reshoot it. This is the script most likely to be copied by viewers as a trend; reply to every comment in the first hour.

---

## V3 · vid-hc03 · The blanket thief · 18 s

**Requires:** none

- **Angle:** 2, gift for the person who's always cold. **Meta:** ad set C, lead creative.
- **On camera:** Cody plus one adult friend or partner (signed release, acting only, no lines about the product). **Props:** two or three throw blankets, couch, the cloak. **Light:** daylight or lamp.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-3 s | Wide: the friend on the couch under every blanket in the house. Cody at the other end with nothing, arms crossed, comic look. | Found the gift for the friend who steals every blanket. | | AI-VID-02 variant (two adults) |
| 2 | 3-7 s | Medium: Cody walks behind the couch with the cloak, drapes it over the friend's shoulders, flips the hood up. | | | Real preferred |
| 3 | 7-11 s | Medium: the friend pushes all the blankets over to Cody and snuggles into the cloak, buttoning the front. | Now everyone gets a blanket. | | AI-VID-02 |
| 4 | 11-14 s | Close: the friend's face inside the hood, fully clear, smiling. The hood rim fills the frame edge. | Hood up. Stay in. | | AI-VID-01, but real only in ads (hood detail) |
| 5 | 14-18 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Christmas end card** (only while valid; stop using it at the end of Thu 3 Dec):

```copy requires=claims.ships_from_us
Order by {{XMAS_LAST_ORDER}} for Christmas delivery in the contiguous US.
```

**Caption (Meta primary text)**

```copy
Everyone has a blanket thief. Give them their own: a roomy hooded cloak they can wear around the house. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
tag the blanket thief {{BRAND_TAG}} #giftideas #giftsforhim #giftsforher #cozy #homebody
```

**Notes.** The friend acts; they are not a reviewer. No "I love it" lines and no gift box.

---

## V4 · vid-hc04 · Thermostat wars · 12 s

**Requires:** none

- **Angle:** 4, thermostat wars. **Meta:** Phase 2 for ad set C, and organic.
- **On camera:** Cody, plus a second adult's hand (no face needed, but get a release if they are recognisable). **Props:** a wall thermostat, a hook or chair beside it with the cloak, couch. **Light:** daylight.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-3 s | Close: a hand reaches to turn the thermostat up. A second hand comes in and gently moves it back. | Thermostat wars, settled. | | Real only (a real thermostat; AI tends to invent displays) |
| 2 | 3-6 s | Medium: Cody takes the cloak off the hook beside the thermostat, throws it on, hood up. | | | AI-VID-04, but real only in ads |
| 3 | 6-10 s | Wide: Cody on the couch, cocooned, gives a thumbs up to the off-screen housemate. | The thermostat stays where it is. The hood goes up. | | AI-VID-02 |
| 4 | 10-12 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Caption (Meta primary text)**

```copy
Every house has one person who's always cold. This one has a hood now. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
settled it {{BRAND_TAG}} #thermostatwars #cozy #homebody #couchseason
```

**Notes.** The thermostat may show a temperature in the footage. On-screen text never adds a number, and no line mentions heating bills or energy savings.

---

## V5 · vid-hc05 · Couch season, sound on · 20 s

**Requires:** claims.lining

- **Angle:** 5, couch season. **Meta:** ad set B, second creative.
- **On camera:** Cody's hands, then Cody wide. **Props:** mug, kettle or teapot, a book, a reading lamp, an armchair or window seat. No candles. **Light:** overcast daylight or rain at the window, plus the lamp.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-3 s | Macro: fingertips brush slowly across the lining at the hood rim. Natural sound. | Couch season starts now. | | AI-VID-03, but real only in ads (texture) |
| 2 | 3-6 s | Close: tea poured into the mug. Sound up. | | | Any |
| 3 | 6-10 s | Close: hands fasten the front buttons one by one, cloak on the body. | Soft faux-fur lining. | | **Real only** (button detail) |
| 4 | 10-16 s | Wide: Cody in the armchair by the window, hood up, face clear, book open, turns a page, reaches for the mug. | Reading-nook ready. | | AI-VID-06 (lifestyle; check against the sample) |
| 5 | 16-20 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Audio:** natural sound only: rain on the window, the pour, the page, the fabric. No music, so no licensing.

**Caption (Meta primary text)**

```copy
A book, a mug, and a hooded cloak with a soft faux-fur lining. That's the whole plan. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
sound on {{BRAND_TAG}} #asmr #readingnook #couchseason #cozy #rainyday
```

**Fallback if `claims.lining` is off:**

| Replaces | On-screen text | Requires |
|---|---|---|
| Shot 3 | Wrap it closed. Settle in. | none |

```copy requires=none
A book, a mug, and a roomy hooded cloak. That's the whole plan. {{PRICE}}, free US shipping.
```

---

## V6 · vid-hc06 · Fit check by height · 22 s

**Requires:** claims.sizes

- **Angle:** 8, tall-person fit. **Meta:** Phase 2. Also the standard reply to "will it fit me?" comments.
- **On camera:** Cody. A second adult of a clearly different height makes it twice as useful (release needed). **Props:** tape measure, painter's tape, a plain wall or door frame. **Phone:** tripod at hip height, 1x lens, straight on, so the length is not distorted.

| # | Time | Shot and action | On-screen text | Voiceover | AI version |
|---|---|---|---|---|---|
| 1 | 0-3 s | Full length, front, against the plain wall, hood down. | How long is it on {{OWNER_HEIGHT}}? | I'm {{OWNER_HEIGHT}}, wearing {{OWNER_SIZE}}. | **Real only** |
| 2 | 3-8 s | Slow turn: side, back, front. | {{OWNER_SIZE}} on {{OWNER_HEIGHT}}. | | **Real only** |
| 3 | 8-12 s | Close: tape measure from the floor up to the hem. Hold still on it. | The hem lands here. | Here's where the hem lands. | **Real only** |
| 4 | 12-18 s | Screen recording of the size chart on the product page, scrolling slowly. | Sized by height. Find yours on the size chart. | It's sized by height, so find your height on the chart. | n/a |
| 5 | 18-22 s | End card | {{BRAND}} · {{PRICE}} · Free US shipping | | n/a |

**Caption (Meta primary text)**

```copy
Sized by height, from {{HEIGHT_MIN}} to {{HEIGHT_MAX}}. Here it is on {{OWNER_HEIGHT}}, so you can see where the hem lands. {{PRICE}}, free US shipping.
```

**TikTok caption**

```copy
fit check on {{OWNER_HEIGHT}}. the size chart is on the site. {{BRAND_TAG}} #fitcheck #tallpeople #tallfashion #cozy
```

**Notes.** `{{OWNER_HEIGHT}}` and `{{OWNER_SIZE}}` come from the shoot log: measure Cody barefoot against the wall that day. The size chart shown must be the one rendered from config, with adult sizes only.

---

## Shoot list: everything from the sample in one session

About 2.5-3 hours. Do it the day the sample gate is done, in this order (it groups the shots by setup so the light and the outfit change as little as possible). Name each file exactly as below and log it in `asset-log.csv`.

**Bring:** phone (charged, lens cleaned, 50 GB free), small tripod, white printer paper, kitchen scale (lb mode, tared), tape measure, painter's tape, an off-white bedsheet or a plain light wall, mug, tea, a book, two or three throws, a plain kraft paper tag on twine, a pen. Check the care label before steaming out creases.

**Set 0 · Evidence for the sample gate** (never used in ads)

| ID | Shot | Why |
|---|---|---|
| ph-hc13-packaging.jpg | The parcel as it arrived: every side, the shipping label, any packing slip or price slip | Sample gate; shows what customers will receive |
| ph-hc11-labels.jpg | Every sewn-in label, flat and readable: fiber, origin, RN or maker, care | Sample gate; sets `claims.outer_fiber`, `claims.lining`, `claims.care` |
| raw-scale-evidence.mov | One unbroken clip: empty scale at 0.0, cloak on, reading held for 5 seconds | Evidence for `claims.weight_lb`; also V1 shot 3 |

**Set 1 · Off-white packshots** (window daylight, sheet or plain wall behind)

| ID | Shot | Used in |
|---|---|---|
| ph-hc01-front-hood-down.jpg | Cody full length, straight on, hood down, front buttoned | End cards, S6, product page |
| ph-hc02-three-quarter-hood-up.jpg | Cody at three-quarter angle, hood up, face clear | S1 |
| ph-hc03-back-hood-up.jpg | Back view, hood up, full length | Product page, S7 support |
| ph-hc16-on-hanger.jpg | The cloak alone on a wooden hanger or chair, front | Product page, flat swaps |

**Set 2 · Macros** (window light, phone 10-15 cm from the fabric)

| ID | Shot | Used in |
|---|---|---|
| ph-hc04-lining-macro.jpg | Lining texture with the outer edge folded back so both fabrics show | S6 card |
| ph-hc05-hood-rim.jpg | The hood opening and rim, close | S6 card |
| ph-hc06-buttons.jpg | The button front, close | S6 card |
| V5 shots 1 and 3 | Lining brush; buttons fastened | V5 |

**Set 3 · Scale and fit** (tripod)

| ID | Shot | Used in |
|---|---|---|
| ph-hc10-scale.jpg | The folded cloak on the scale, display readable | S6 card, V1 |
| ph-hc12-height.jpg | Cody against the wall with a tape mark at their height, wearing it | S7 |
| V6 shots 1-3, V1 shot 3 | As scripted | V6, V1 |

**Set 4 · Couch and living room** (daylight)

| ID | Shot | Used in |
|---|---|---|
| ph-hc07-couch-hood-up.jpg | Cody on the couch, hood up, face clear, mug | S3 |
| ph-hc17-thermostat.jpg | Cody in the cloak beside the wall thermostat, hand on the dial, smiling | S5 |
| V1 shots 1, 2, 4 and V4 shots 1-3 | As scripted | V1, V4 |

**Set 5 · Reading nook** (overcast window, lamp on)

| ID | Shot | Used in |
|---|---|---|
| ph-hc08-reading-nook.jpg | Armchair or window seat, hood up, book, mug, lamp | S4 |
| V5 shots 2 and 4 | As scripted | V5 |

**Set 6 · Desk**

| ID | Shot | Used in |
|---|---|---|
| ph-hc15-desk.jpg | Desk chair, laptop closed or on a blank screen, mug, hood up, face clear | S8 |

**Set 7 · Flat lay and gift still life**

| ID | Shot | Used in |
|---|---|---|
| ph-hc09-flat-lay.jpg | Top-down: cloak folded on a wood floor or linen, with mug, book and wool socks | Product page, organic |
| ph-hc14-gift-tag.jpg | The cloak folded on the couch with the kraft tag on twine. Handwrite the tag text from `static-ads.md` S2 | S2 |

**Set 8 · Evening** (lamp light; friend arrives for V3)

| ID | Shot | Used in |
|---|---|---|
| V2 shots 1-3 | As scripted | V2 |
| V3 shots 1-4 | As scripted, with the friend | V3 |

**Photo settings:** full resolution, vertical, with space around the cloak so it can be cropped to 1:1, 4:5 and 9:16. Shoot every photo twice: once tight, once with room.

**After the shoot:** write in the shoot log the measured weight, Cody's height, the size worn, the colour name from the listing, and anything that differs from the listing (pockets, buttons, sleeves). Those facts set the config flags and the `{{ARM_STYLE}}` and `{{BUTTON_DESC}}` values in the AI prompt pack.

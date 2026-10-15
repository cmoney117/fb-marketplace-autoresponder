# Static ads: eight concepts

Written 2026-10-15. Eight single-image or carousel ads, each with on-image text, headline, primary text in two lengths, CTA, the image to use and alt text. Tokens and gates: `README.md`. Every customer-facing line passes `check_copy.py`.

| Concept | Asset ID | Angle (`angles.md`) | Image (real sample) | Meta use | Requires |
|---|---|---|---|---|---|
| S1 The hoodie that hugs back | img-hc01 | 1 | ph-hc02 | Ad set A | claims.weighted (fallback: none; long text also features.buttons) |
| S2 For the person who's always cold | img-hc02 | 2 | ph-hc14 | Ad set C | none (Christmas line: claims.ships_from_us) |
| S3 Hood up. World out. | img-hc03 | 3 | ph-hc07 | Ad set B | none (long text: features.buttons) |
| S4 Couch season starts now | img-hc04 | 5 | ph-hc08 | Phase 2, ad set B | none (long text: claims.lining) |
| S5 Thermostat wars, settled | img-hc05 | 4 | ph-hc17 | Phase 2, ad set C | none (long text: features.buttons) |
| S6 What it's made of (carousel) | img-hc06 | 1 (proof) | ph-hc04, ph-hc05, ph-hc06, ph-hc10 | Ad set A | claims.lining, claims.outer_fiber, claims.weighted, claims.weight_lb (card 3: features.buttons; long text also claims.origin) |
| S7 Sized by height | img-hc07 | 8 | ph-hc12 + size chart | Phase 2, organic | claims.sizes |
| S8 Camera off. Hood up. | img-hc08 | 6 | ph-hc15 | Phase 2 | none (long text: features.buttons) |

Photo IDs come from the shoot list at the end of `video-scripts.md`. The AI stand-ins and their re-shoot flags are in `ai-prompt-pack.md`.

## Rules for every static

- **Images:** Cody's own photos of the sample. An AI image may stand in only where the concept says so, only after it passes the side-by-side check against the sample (`ai-prompt-pack.md`), and never for a detail shot. No supplier or competitor image, ever.
- **Nothing on the image that we can't back:** no stars, review counts, badges ("bestseller", "new and improved"), "as seen on" logos, strike-through prices, "% off" bursts, countdown timers or stock counters.
- **Price on the image** is optional; if shown, it is `{{PRICE}}` from config, alone. Showing the price on cold traffic saves money on clicks from people who would never pay it.
- **Sizes:** build at 1080 x 1350 (4:5) for Feed. Make a 1080 x 1920 (9:16) version for Stories and Reels with all text inside the safe area (out of the top 250 px and bottom 670 px). A 1080 x 1080 crop covers the rest.
- **Type:** one warm serif for headlines (for example Fraunces or DM Serif Display, both free under the Open Font License on Google Fonts) and one plain sans for small lines (for example Inter). Dark text on the photo's lightest area, or a soft off-white band behind it. Keep text to a small share of the image; the photo sells.
- **Colour:** off-white background (#F5F1EA), deep charcoal text (#2B2A28), one muted accent sampled from the cloak's own colour. The cloak's colour in the photo must match the real thing.
- **CTA buttons** are Meta's fixed list. "Shop now" unless the concept says otherwise.
- **Long text** runs as its own ad in Phase 2 (UTM suffix `-l`), so the read on short versus long stays clean. Phase 1 uses the short text.

---

## S1 · img-hc01 · The hoodie that hugs back

**Requires:** claims.weighted

- **Angle:** 1. **Meta:** ad set A, creative 2 (next to V1).
- **Image:** `ph-hc02-three-quarter-hood-up.jpg`: Cody at three-quarter angle, hood up, face clear, off-white background. AI stand-in for internal drafts only: AI-IMG-02 (RE-SHOOT flag, so never in ads, posts or the product page).
- **Layout:** photo fills the frame. Headline top left in the serif. Price line bottom left, above the safe area.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | The hoodie that hugs back. | none |
| On-image price line | {{PRICE}} · Free US shipping | none |
| Headline | The hoodie that hugs back | none |
| Description | Free US shipping | none |
| CTA | Shop now | none |
| Alt text | Adult in an oversized hooded cloak with the hood up, standing against a plain light background. | none |

**Primary text, short**

```copy
A hooded blanket you can wear, with a calming weight across your shoulders. {{PRICE}}, free US shipping.
```

**Primary text, long**

```copy requires=claims.weighted,claims.weight_lb,claims.lining,claims.ships_from_us,features.buttons
It's a blanket. It's a hoodie. It's about {{WEIGHT_LB}} lb of comforting weight that sits on your shoulders like a hug.

Button it closed, pull the hood up, and settle in.

· Soft faux-fur lining
· Throw it on over anything
· {{PRICE}} with free US shipping
· Ships in {{SHIP_WINDOW}} and arrives {{ARRIVAL_WINDOW}} after you order, with tracking

{{REFUND_LINE}}
```

**Fallback if `claims.weighted` is off** (short, then long)

```copy requires=none
A hooded blanket you can wear. Throw it on, pull the hood up, stay in. {{PRICE}}, free US shipping.
```

```copy requires=none
It's a blanket. It's a hoodie. It's both.

Wrap it closed, pull the hood up, and settle in. It stays on when you get up for a snack, which a blanket never does.

· Throw it on over anything
· {{PRICE}} with free US shipping

{{REFUND_LINE}}
```

**Check on the sample:** "stays on when you get up" (the fallback) must be true with the front closed.

---

## S2 · img-hc02 · For the person who's always cold

**Requires:** none

- **Angle:** 2. **Meta:** ad set C, creative 2 (next to V3). Christmas long text runs until the end of Thu 3 Dec only.
- **Image:** `ph-hc14-gift-tag.jpg`: the cloak folded on the couch with a plain kraft tag on twine. Handwrite the tag text below in marker. No wrapping paper, no box, no bow.
- **Layout:** still life fills the frame; headline in the top third on the calmest part of the photo.

| Element | Copy | Requires |
|---|---|---|
| Handwritten tag | for the blanket thief | none |
| On-image headline | For the person who's always cold. | none |
| Headline | For the person who's always cold | none |
| Description | Free US shipping | none |
| CTA | Shop now | none |
| Alt text | Folded hooded cloak on a couch with a paper gift tag tied on with twine. | none |

**Primary text, short**

```copy
Found the gift for the friend who steals every blanket. A roomy hooded cloak they can wear. {{PRICE}}, free US shipping.
```

**Primary text, long, until the end of Thu 3 Dec**

```copy requires=claims.ships_from_us
Everyone has one. The friend who takes every blanket on the couch. The partner who's cold in July.

This one is theirs: a roomy hooded cloak to wear around the house. Hood up, wrapped up, done.

{{PRICE}} with free US shipping. Order by {{XMAS_LAST_ORDER}} for Christmas delivery in the contiguous US.

{{REFUND_LINE}}
```

**Primary text, long, from Fri 4 Dec**

```copy requires=none
Everyone has one. The friend who takes every blanket on the couch. The partner who's cold in July.

This one is theirs: a roomy hooded cloak to wear around the house. Hood up, wrapped up, done.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

---

## S3 · img-hc03 · Hood up. World out.

**Requires:** none

- **Angle:** 3. **Meta:** ad set B, creative 3 (next to V2 and V5).
- **Image:** `ph-hc07-couch-hood-up.jpg`: Cody on the couch, hood up, face clear, mug in hand. An evening lamp-light version is better if the colour stays true. AI stand-in: AI-IMG-07 (conditional, see the prompt pack).
- **Layout:** headline in the empty wall space above the couch.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | Hood up. World out. | none |
| Headline | Hood up. World out. | none |
| Description | Made for quiet nights in | none |
| CTA | Shop now | none |
| Alt text | Adult relaxing on a couch in a hooded cloak with the hood up, holding a mug. | none |

**Primary text, short**

```copy
Made for quiet nights in. A roomy hooded cloak for homebodies and introverts. {{PRICE}}, free US shipping.
```

**Primary text, long** (if `features.buttons` is off, change "button it closed" to "wrap it closed" and re-run `check_copy.py`)

```copy requires=features.buttons
Plans cancelled? Good.

Throw it on over anything, button it closed, and pull the hood up. Your quiet corner, wherever you sit.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

---

## S4 · img-hc04 · Couch season starts now

**Requires:** none

- **Angle:** 5. **Meta:** Phase 2, ad set B, or a swap-in if a B creative is killed.
- **Image:** `ph-hc08-reading-nook.jpg`: armchair or window seat, hood up, book, mug, lamp. No candles. AI stand-in: AI-IMG-06 (conditional).
- **Layout:** headline over the window or wall area.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | Couch season starts now. | none |
| Headline | Couch season starts now | none |
| Description | Reading-nook ready | none |
| CTA | Shop now | none |
| Alt text | Adult reading in an armchair by a window, wearing a hooded cloak with the hood up. | none |

**Primary text, short**

```copy
A book, a mug, a hood. That's the plan. Reading-nook ready, {{PRICE}} with free US shipping.
```

**Primary text, long**

```copy requires=claims.lining
A book, a mug of tea, and a hooded cloak with a soft faux-fur lining. That's the whole plan.

It drapes like a blanket and stays on like a hoodie, so nothing slides off when you reach for your mug.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

**Long fallback if `claims.lining` is off**

```copy requires=none
A book, a mug of tea, and a roomy hooded cloak. That's the whole plan.

It drapes like a blanket and stays on like a hoodie, so nothing slides off when you reach for your mug.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

**Check on the sample:** "stays on like a hoodie" must be true with the front closed and the wearer seated.

---

## S5 · img-hc05 · Thermostat wars, settled

**Requires:** none

- **Angle:** 4. **Meta:** Phase 2, ad set C (it works as a gift for the cold one).
- **Image:** `ph-hc17-thermostat.jpg`: Cody in the cloak beside the wall thermostat, hand on the dial, smiling. **Text-led alternative:** a plain warm background, the headline large, and the cloak cut out from `ph-hc01-front-hood-down.jpg`.
- **Layout:** headline beside the thermostat.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | Thermostat wars, settled. | none |
| Headline | Thermostat wars, settled | none |
| Description | Free US shipping | none |
| CTA | Shop now | none |
| Alt text | Adult in a hooded cloak standing next to a wall thermostat, smiling. | none |

**Primary text, short**

```copy
Every house has one person who's always cold. Give the cold one a hood. {{PRICE}}, free US shipping.
```

**Primary text, long** (if `features.buttons` is off, change "Button it, hood up" to "Wrap it closed, hood up" and re-run `check_copy.py`)

```copy requires=features.buttons
Every house has a thermostat argument.

Here's a peace offering: a roomy hooded cloak that wraps around the shoulders and stays put. Button it, hood up, and leave the dial alone.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

**Never add:** heating-bill or energy-saving lines. A temperature on the real thermostat is fine; a number in the text is not.

---

## S6 · img-hc06 · What it's made of (carousel)

**Requires:** claims.lining, claims.outer_fiber, claims.weighted, claims.weight_lb

- **Angle:** 1, as proof. **Meta:** ad set A, creative 3. Carousel of four square cards (1080 x 1080). **Real photos only**: these are detail shots, and no AI version may run.
- **Images:** `ph-hc04-lining-macro.jpg`, `ph-hc05-hood-rim.jpg`, `ph-hc06-buttons.jpg`, `ph-hc10-scale.jpg`.
- **Layout:** each card is one macro photo with one line of text in a soft off-white band at the bottom.

| Card | Image | Card text | Requires |
|---|---|---|---|
| 1 | ph-hc04 | Soft faux-fur lining | claims.lining |
| 2 | ph-hc05 | A roomy hood that stays up | none |
| 3 | ph-hc06 | Button front. Throw it on over anything. | features.buttons |
| 4 | ph-hc10 | About {{WEIGHT_LB}} lb, weighed on our own sample | claims.weighted, claims.weight_lb |

| Element | Copy | Requires |
|---|---|---|
| Headline | What it's made of | none |
| Description | Free US shipping | none |
| CTA | Learn more | none |
| Alt text, card 1 | Close-up of a soft faux-fur lining with the outer fabric folded back. | claims.lining |
| Alt text, card 2 | Close-up of the rim of a roomy hood. | none |
| Alt text, card 3 | Close-up of a button front closure. | features.buttons |
| Alt text, card 4 | A folded hooded cloak on a kitchen scale. | none |

**Primary text, short**

```copy
{{OUTER_FIBER}} outside, soft faux-fur lining inside, about {{WEIGHT_LB}} lb in all. {{PRICE}}, free US shipping.
```

**Primary text, long**

```copy requires=claims.lining,claims.outer_fiber,claims.weighted,claims.weight_lb,claims.origin,features.buttons
Here's exactly what you get.

· Outer: {{OUTER_FIBER}}
· Lining: {{LINING_DESC}}
· Weight: about {{WEIGHT_LB}} lb, weighed on our own sample
· Button front and a roomy hood
· Imported
· {{PRICE}} with free US shipping

{{REFUND_LINE}}
```

**Fallback if `claims.weighted` is off:** drop card 4 and use the line below. If `features.buttons` is off, drop card 3 and the "Button front" line of the long text, and change "Button it closed" to "Wrap it closed".

```copy requires=claims.lining,claims.outer_fiber,features.buttons
{{OUTER_FIBER}} outside, soft faux-fur lining inside. Button it closed, pull the hood up. {{PRICE}}, free US shipping.
```

**Check on the sample:** "stays up" on card 2 must be true when the wearer turns their head. "Imported" must match the origin on the sewn-in label (`claims.origin`).

---

## S7 · img-hc07 · Sized by height

**Requires:** claims.sizes

- **Angle:** 8. **Meta:** Phase 2. Also the image to post in reply to fit questions.
- **Image:** left half `ph-hc12-height.jpg` (Cody beside a tape mark at their height, wearing it). Right half: the size chart rendered from config, adult sizes only, in the brand sans.
- **Layout:** headline across the top.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | Sized by height. | claims.sizes |
| On-image chart | {{SIZE_CHART}} | claims.sizes |
| Headline | Sized by height | claims.sizes |
| Description | Find your height on the chart | none |
| CTA | Learn more | none |
| Alt text | Adult wearing a hooded cloak beside a height mark on a wall, next to a size chart. | claims.sizes |

**Primary text, short**

```copy
Pick your size by height, from {{HEIGHT_MIN}} to {{HEIGHT_MAX}}. {{PRICE}}, free US shipping.
```

**Primary text, long**

```copy
Pick your size by your height, from {{HEIGHT_MIN}} to {{HEIGHT_MAX}}.

The size chart on the product page shows each size, and our fit video shows where the hem lands on {{OWNER_HEIGHT}}.

Between sizes or not sure? Message us before you order and we'll help you pick.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

---

## S8 · img-hc08 · Camera off. Hood up.

**Requires:** none

- **Angle:** 6. **Meta:** Phase 2.
- **Image:** `ph-hc15-desk.jpg`: desk chair, laptop closed or on a blank screen, mug, hood up, face clear. No app logos on screen. AI stand-in: AI-IMG-09 (conditional).
- **Layout:** headline top right, over the wall.

| Element | Copy | Requires |
|---|---|---|
| On-image headline | Camera off. Hood up. | none |
| Headline | Camera off. Hood up. | none |
| Description | Free US shipping | none |
| CTA | Shop now | none |
| Alt text | Adult at a home desk wearing a hooded cloak with the hood up, holding a mug. | none |

**Primary text, short**

```copy
The work-from-home uniform for cold mornings. Throw it on over anything. {{PRICE}}, free US shipping.
```

**Primary text, long** (if `features.buttons` is off, change "button it closed" to "wrap it closed" and re-run `check_copy.py`)

```copy requires=features.buttons
Cold home office, early start, camera off.

Throw it on over whatever you're wearing, button it closed, and get to work. It stays on your shoulders when you reach for your coffee.

{{PRICE}} with free US shipping.

{{REFUND_LINE}}
```

**Check on the sample:** how the hands come out of the front (`{{ARM_STYLE}}` in the prompt pack). If reaching for a mug pulls the front open, cut the last sentence of the long text.

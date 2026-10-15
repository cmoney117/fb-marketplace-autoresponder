# Ad angles, ranked

Written 2026-10-15. Eight angles for the hooded cloak, ranked by how well we expect each to sell to **cold traffic on Meta in Q4, at {{PRICE}}, from a store with no reviews yet**. Tokens and gates are defined in `README.md`. Every hook line below passes `check_copy.py`.

**How they were ranked.** Five questions, in this order of weight:
1. Does the first two seconds show what the product *is*? A new product category sells on the demo.
2. Is there a reason to buy now that is true? (Q4 gifting is real. Fake urgency is banned.)
3. Does the hook depend on a claim the sample has not confirmed yet?
4. How big is the audience the message speaks to?
5. How close does it sit to a policy line (health, personal attributes, before/after)?

These are judgments, not data. The Meta test (`launch-plan.md`) puts angles 1, 3 and 2 head to head, and the TikTok organic plan tests all eight for free. Re-rank after both.

## Summary

| Rank | Angle | Hook line | Requires | Meta test | Used in |
|---|---|---|---|---|---|
| 1 | The hoodie that hugs back (wearable-blanket demo) | It's a blanket. It's a hoodie. It weighs about {{WEIGHT_LB}} lb. | claims.weighted, claims.weight_lb | Ad set A | V1, S1, S6 |
| 2 | Gift for the person who's always cold | Found the gift for the friend who steals every blanket. | none | Ad set C | V3, S2 |
| 3 | Hood up, world out (homebody) | My social battery after 5pm: | none | Ad set B | V2, S3 |
| 4 | Thermostat wars | Thermostat wars, settled. | none | Phase 2, ad set C | V4, S5 |
| 5 | Couch season (reading nook, movie night) | Couch season starts now. | none | Ad set B, second creative | V5, S4 |
| 6 | Cold mornings at the desk (work from home) | Camera off. Hood up. | none | Phase 2 | S8 |
| 7 | Weekend uniform | Saturday plans: none. | none | Organic first | V2 alt hook |
| 8 | Tall-person fit | Sized by height, up to {{HEIGHT_MAX}}. | claims.sizes | Organic, comment replies, Phase 2 | V6, S7 |

---

## 1. The hoodie that hugs back (wearable-blanket demo)

**Requires:** claims.weighted, claims.weight_lb

**Audience.** Adults who already live in a blanket at home: couch sitters, readers, people who wear a hoodie over a hoodie. Many will have seen weighted blankets and never thought of wearing one. Broad on Meta; the creative does the targeting.

**Hook lines**

```copy
It's a blanket. It's a hoodie. It weighs about {{WEIGHT_LB}} lb.
```

```copy
A weighted hug you can wear around the house.
```

```copy
Put it on the scale first. About {{WEIGHT_LB}} lb of cozy.
```

**Fallback hooks** (no flag needed; use these if `claims.weighted` is off)

```copy requires=none
The hoodie that hugs back.
```

```copy requires=none
A blanket you can walk around in.
```

```copy requires=none
It's a blanket. It's a hoodie. It's both.
```

**Why it works.**
- The product is new to most people. The fastest way to sell a new thing is to show it doing its one trick: a blanket that stays on you like a hoodie.
- A kitchen scale with a real reading is concrete proof that a no-name brand can show on day one, before any reviews exist. It also answers the first question every buyer has ("is it actually heavy?") without a single adjective.
- "Hugs back" carries the comfort idea in plain words, with no health promise. It sits inside the allowed phrases ("feels like a hug", "a wearable hug").

**Proof to show:** the scale reading (real footage only, never AI), the drape as it goes on, the hood going up, Cody sitting down in it.

**Watch-outs:** never pair the weight with a feeling it "fixes". No "melts away", no "finally relax", no sleep. Never mention body weight ("lose", "slim") so automated review does not read "weighted" as weight loss. The scale shot must show the cloak alone, on a tared scale, with the unit visible.

**Season:** all year. This is the evergreen angle and the one to scale after Christmas.

---

## 2. Gift for the person who's always cold

**Requires:** none

**Audience.** Q4 gift buyers: partners, adult children shopping for parents, friends shopping for friends. The buyer is not the wearer, so the hook names the wearer in the third person.

**Hook lines**

```copy
Found the gift for the friend who steals every blanket.
```

```copy
For the person who's always cold.
```

```copy
For the one who's cold in July.
```

**Supporting line** (only while the promise is valid; stop using it at the end of Thu 3 Dec)

```copy requires=claims.ships_from_us
Order by {{XMAS_LAST_ORDER}} for Christmas delivery in the contiguous US.
```

**Why it works.**
- Gift intent is the strongest real reason to buy in November and early December, and it is true. The last-order date is a real cutoff, so it gives timing without fake urgency.
- Everyone knows a blanket thief. The hook names a person the viewer can picture, which is what makes a gift ad work.
- Speaking about a third person keeps it clear of Meta's personal-attributes rule. "For the person who's always cold" is fine. "Are you always cold?" is not.
- Gift buyers compare less on price, which helps a {{PRICE}} item with no reviews.

**Watch-outs:** no gift-box, gift-wrap or unboxing shots, because the parcel arrives in fulfillment-partner packaging. A plain paper tag on twine is as far as styling goes. Never imply the wearer is a child ("for the little one", stocking stuffers for kids). After Thu 3 Dec, swap to the evergreen version or pause the ad set (`launch-plan.md` §8).

**Season:** launch to Thu 3 Dec. A softer "for the always-cold" version can run in January and February without the Christmas line.

---

## 3. Hood up, world out (homebody)

**Requires:** none

**Audience.** Homebodies, introverts, people who are done with people by early evening, remote workers. The hook is first-person and funny, so it works without saying anything about the viewer.

**Hook lines**

```copy
My social battery after 5pm:
```

```copy
Hood up. World out.
```

```copy
Plans cancelled. Hood up.
```

```copy
Made for quiet nights in. For homebodies and introverts.
```

**Why it works.**
- It is an identity joke, and identity jokes get shared and saved. That matters most on TikTok, where it is the strongest organic hook we have.
- First-person ("My social battery") is the safe form under Meta's personal-attributes rule. We describe ourselves, not the viewer.
- "Hood up, world out" says what the hood is for in four words.

**Watch-outs:** this is the angle that can slide into mental-health territory. Never show a stressed, tired or tearful "before" moment, because that turns it into before/after with a mental-health result. Keep the person neutral or smiling throughout. "Introverts" only in the third person. Never "drained", "overwhelmed", "burnt out", or anything that names a state of mind the cloak changes.

**Season:** all year.

---

## 4. Thermostat wars

**Requires:** none

**Audience.** Couples and housemates who argue about the heating. People in cold houses or old apartments. Strong from the first cold snap through February.

**Hook lines**

```copy
Thermostat wars, settled.
```

```copy
The thermostat stays where it is. The hood goes up.
```

```copy
Every house has one person who's always cold.
```

**Why it works.**
- A small, real, funny conflict that almost every household has. The viewer tags the person they argue with, which is free reach.
- It gives a practical reason for a {{PRICE}} purchase without any claim: stay warm without touching the dial.
- It doubles as a gift angle (buy it for the cold one), so it can join ad set C in Phase 2.

**Watch-outs:** no savings claims. Never "cut your heating bill" or "save energy", because we cannot back a number. A real thermostat may show a temperature in the footage; that is fine as long as on-screen text never adds one.

**Season:** first cold snap to end of February.

---

## 5. Couch season (reading nook, movie night)

**Requires:** none

**Audience.** Readers, movie-night people, cozy-home content fans. The mood audience from Pinterest and Instagram.

**Hook lines**

```copy
Couch season starts now.
```

```copy
Reading-nook ready.
```

```copy
A book, a mug, a hood. That's the plan.
```

```copy
The movie-night uniform.
```

**Why it works.**
- It sells the evening, not the garment, and that evening is what people are actually buying.
- It is the easiest angle to shoot well on a phone: warm lamp, window, mug, book.
- It suits statics and slow ASMR-style video, which give the ad account visual variety next to the demo.

**Why it ranks fifth:** mood ads get likes more than clicks. There is no reason to buy today, and the product is not the hero. It works best as the second creative in ad set B, next to the sharper homebody hook.

**Watch-outs:** no candles, fireplaces or fire pits in any shot (the Safety block says keep away from flames). No napping or sleeping in it, and the face is always clear of the hood. Avoid #booktok and school-year themes, which skew young.

**Season:** October to March.

---

## 6. Cold mornings at the desk (work from home)

**Requires:** none

**Audience.** Remote and hybrid workers in cold home offices. People who start early before the heating kicks in.

**Hook lines**

```copy
Camera off. Hood up.
```

```copy
The work-from-home uniform for cold mornings.
```

**Why it works.**
- It names a daily, repeated use. Something worn every weekday morning justifies {{PRICE}} more easily than something worn on a Friday night.
- "Camera off" is a small shared joke for anyone on video calls.

**Why it ranks sixth:** a smaller audience than the couch, and a cold *office* is weaker than a cold *home office*, because a cloak at a shared office is a stretch. Keep it at home.

**Watch-outs:** a laptop screen must be blank or closed (no third-party app logos, no fake dashboards). Do not claim hands-free typing until the sample confirms how the arms come out of the front (`ai-prompt-pack.md`, `{{ARM_STYLE}}`).

**Season:** October to March. Strong in January ("back to work" weeks).

---

## 7. Weekend uniform

**Requires:** none

**Audience.** Comfort dressers. People whose weekend plan is no plan.

**Hook lines**

```copy
Saturday plans: none.
```

```copy
Throw it on over anything.
```

```copy
The weekend uniform.
```

**Why it works.** It sells frequency of use and low effort: over pajamas, over gym clothes, over whatever. "Throw it on over anything" is also the most useful supporting line in the whole kit, so it appears inside other ads.

**Why it ranks seventh:** as a lead hook it is generic. Plenty of hoodies are a weekend uniform. Use it as a line inside other ads and as an alternative opening for V2 on TikTok.

**Season:** all year.

---

## 8. Tall-person fit

**Requires:** claims.sizes

**Audience.** Tall adults who find blanket hoodies too short, and people buying for a tall partner. Small audience, high intent.

**Hook lines**

```copy
Sized by height, up to {{HEIGHT_MAX}}.
```

```copy
Long enough for tall people.
```

```copy
Find your size by your height.
```

**Why it works.** For tall people, length is the first thing they check and the usual reason they return a blanket hoodie. A real clip of the hem on a measured adult answers it before they ask.

**Why it ranks last:** it depends entirely on the supplier size guide having a genuinely long size, and the audience is small. It is still worth making, because it answers the commonest fit question in comments and DMs, and fit questions are what drive returns.

**Watch-outs:** every height and size comes from the size chart in config and the clip of Cody (`{{OWNER_HEIGHT}}`, `{{OWNER_SIZE}}`), never from the supplier's marketing photos. Adult sizes only: if the listing has children's sizes, they are not listed and never shown. No comparison with other brands' lengths.

**Season:** all year.

---

## If the weight claim is off

If the sample is not meaningfully weighted, the product is a lined hooded cloak. Re-run `economics.md` first. If it still goes ahead:

| Rank | Angle | Change |
|---|---|---|
| 1 | Gift for the person who's always cold | Unchanged |
| 2 | Hood up, world out | Unchanged |
| 3 | Thermostat wars | Unchanged |
| 4 | Wearable-blanket demo | Use the fallback hooks only. No scale shot, no weight card |
| 5 | Couch season | Unchanged |
| 6-8 | Desk, weekend, tall fit | Unchanged |

`static-ads.md` S1 and S6 and `video-scripts.md` V1 have fallback versions marked `requires=none`.

## If the item ships from China

No paid ads at all (`economics.md` §7). Organic posts can continue with the honest promise from config. The Christmas line is off, and the China-direct cutoff (about Tue 17 Nov per `economics.md` §7) is only ever stated through the config value.

## Hooks we considered and rejected

None of these may be used, in any wording.

| Rejected hook | Why |
|---|---|
| "Are you always cold?" | Second person plus a personal attribute (Meta). Use the third-person version |
| "Made for anxious days" / "Calm your nervous system" | Health and mental-health claims (Meta, TikTok, FTC, NAD) |
| "Fall asleep in it" / "Better sleep" | Sleep claim; also against the Safety block (no sleeping with the hood over the face) |
| "Me at work / me at home" split screen | Before/after framing with a mood change |
| "The weighted hoodie everyone is talking about" | Fake social proof |
| "Only a few left before Christmas" | Fake scarcity |
| "The original weighted hoodie" / "The first..." | Absolute and "first" claims; also not true |
| "Half the price of the big brand" | Comparison pricing against another brand's list price (FTC 16 CFR 233.2) and rides on their mark |
| "Perfect for the whole family" | Implies children |

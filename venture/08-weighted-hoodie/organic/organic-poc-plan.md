# Hunkerhood organic test: the plan

Written 2026-11-01 for Cody. Budget: **$0**. The posts are in `content-pack.md` (same folder); this page covers what counts, how Day 15 is decided, and who does what. The agent's nightly job reads §1 and §2, and the content pack's Day 15 review uses the same numbers.

Day 1 is the day you say go. Posting runs Days 1-14, and the review is on Day 15, using the totals at the end of Day 14. Example: if you start Mon 2 Nov, the review is Mon 16 Nov.

## 1. The goal

**Prove that strangers will buy Hunkerhood at $99, or at least sign up for it, before any money is spent.**

Only strangers count. Each tracking link names its channel in `utm_source`, and the waitlist form keeps that tag:

| `utm_source` | Bucket | Counts toward the result? |
|---|---|---|
| tiktok, instagram, facebook, fbgroup, pinterest, reddit, youtube, threads | Stranger | Yes |
| friends (texts, Messenger, your personal Facebook profile) | Friends | No, reported separately |
| email (your personal emails) | Email | No, reported separately |
| blank, nextdoor_personal, anything else | Unknown | No |

- `facebook` means the brand Page only. Your personal profile uses the friends link.
- Friends and email show goodwill, not a market, so they never decide the result.
- Views, likes and followers are nice to know but decide nothing. The store has no visit analytics turned on, so the test measures only sign-ups (Jotform) and orders (Stripe).

## 2. Go / no-go on Day 15

**Which channel an order counts under.** Orders open on switch day, which comes after the sample check (content-pack §3). For each paid Stripe order the agent picks the channel like this:
1. It uses the Stripe payment's `utm_source` if there is one and it isn't `email`.
2. Otherwise it matches the buyer's email to their waitlist row and uses that row's `utm_source`. That way, buyers who came through the one launch email (W-1) count under the channel they first signed up from.
3. An order with no waitlist row counts as `email` if it was tagged email, and as Unknown if it had no tag.

The agent matches emails in memory only and logs counts, never names or emails, because the repo is public. Until it can read the tag on a Stripe payment, orders with no waitlist match are reported as "channel not known yet".

**The decision.** Read the rows from the top down; the first one that fits is the result.

| At the end of Day 14 | Result | Next |
|---|---|---|
| 2 or more stranger orders, **or** 30 or more stranger sign-ups with at least 10 from one channel | **Go** | The agent starts the paid-test checklist (see below). Keep posting on the channel that worked. |
| Real video (Track B) has run for fewer than 7 days | **Too early** | Keep posting. Check these numbers again 14 days after B1. |
| Track B has run for 7 days or more, with fewer than 10 stranger sign-ups and no stranger orders | **No-go** (stop or switch) | Spend no money on this product. Decide with the agent whether to try one new angle from `../ads/angles.md` or drop the product. |
| Anything else (for example 10-29 stranger sign-ups, or 1 stranger order) | **Not yet** (iterate) | Run 14 more days of Track B on your two best channels, and re-post the best video with new first lines. No money. |

**Why these numbers.** They are judgment calls: no source gives a rule for turning organic results into a paid forecast. Here is what they rest on (`../economics.md`):
- **What's at stake.** The paid test spends $840 over 14 days. At the base case it expects about 18 orders and a loss of about $55, its stop-losses cap the loss at about $300, and it needs about $1,300 in cash (§1, §8). So the bar is that strangers act, not just that people like the product.
- **The margin is thin.** Each order leaves $43.59 before ads at $40 landed cost (§1), so paid ads must win each order for less than that to break even. If warm strangers won't buy for free, paid traffic won't do better.
- **2 orders.** A stranger paying $99 with no reviews and a 10-22 business-day wait is the strongest signal a free test can give. Three would be safer, but orders can only open after the sample check, so only a few of the 14 days will have a buy button.
- **30 sign-ups, with 10 from one channel.** A sign-up costs nothing, so it is a weaker signal than an order. If about 1 in 10 sign-ups buys at launch (my assumption, not a sourced figure), 30 sign-ups is about 3 orders. Ten from one channel points to a channel worth testing, not scattered luck.
- **Under 10 after a week of real video.** Even if 1 in 5 bought, that is under 2 orders, which isn't enough to justify risking $300.
- **Too early.** Before the sample arrives there is only a drawing. A product nobody has seen can't fail fairly, so it gets a week of real video first.

**Go doesn't mean spending money the next day.** It starts the checklist in `../ads/launch-plan.md` §1, and every box there must be ticked before any spend. Two boxes will probably block:
- **Box 2:** paid ads run only if the product ships from a US warehouse. At 10-22 business days, `economics.md` §7 says no paid ads.
- **Box 4:** the house rule of 25 organic orders before any ads. You either waive it in writing or wait for the orders.

Also, no new paid test starts in Black Friday week (23-30 Nov). If the boxes clear after about 16 Nov, run Phase 1 only, or wait for ad prices to drop in late December. A Go earned on TikTok doesn't prove Meta ads will work; the paid test's kill rules cover that risk.

## 3. Channels for these 14 days

Ranked by what each channel can tell us. Each day in `content-pack.md` §3 takes about 20 minutes in total, replies included.

| # | Channel | Min/day | In 14 days | Why |
|---|---|---|---|---|
| 1 | TikTok (Business account) | 5; 20 once real video exists | Set up on Day 1; 3 photo posts; then 1 video a day | The main free discovery channel. TikTok's discover pages show top wearable-blanket clips with 46K-180K likes (Oct 2026). The bio link is the only link. Turn on the "Your brand" disclosure. |
| 2 | Friends and family (1:1 texts, personal emails) | 8 on Days 2-4 and Day 8, then replies | 30 texts, one at a time, plus a few emails | The warmest first buyers and the most honest feedback. They don't count toward Go. |
| 3 | Instagram | 5 | Set up on Day 2; 1 carousel and 2 Stories; Reels once video exists | Uses the same files as TikTok, and gift buyers are there. The only clickable links are the bio link and the Story link sticker. |
| 4 | Facebook groups you're already in | 10 per post | 2 posts, a week apart, each with a different first line | Local adults buying gifts. Post only where the written rules allow promotion, and screenshot the rules first. |
| 5 | Your personal Facebook profile | 3 | 2 posts at most | One "I started a small business" post is normal; repeated selling risks a restriction. It counts as friends. |
| 6 | Threads | 5 | 4 text posts | Text posts suit the phase before real photos, and links are allowed. |
| 7 | Facebook Page | 3 | Set up on Day 5; 2 link posts, the monthly cap | Makes the brand look real when people check it. A new Page gets almost no reach. |
| 8 | Pinterest | 2 | Set up on Day 6; 3 pins | People search for gift ideas there, but pins take months to build, and links from new accounts can get blocked as spam. |
| 9 | Reddit (r/smallbusiness weekly thread) | 2 | 1 comment that discloses it's your shop, from your existing account | Feedback only: the readers are sellers, not buyers. |
| 10 | YouTube Shorts | 3 | Only after the sample arrives | Reuses the same videos. The link goes on the channel page only. |

**Off-limits, and why:**
- **Nextdoor from your personal account:** Nextdoor's rules say business promotion must come from a Business Page. The `nextdoor_personal` link isn't used in this test.
- **Facebook Marketplace:** it's built for items in hand. An illustration, a 10-22 business-day wait and an off-site checkout fail its accuracy and shipping expectations.
- **TikTok Shop:** reportedly requires US stock that ships in about 2 business days.
- **Google free listings:** they need a working buy page and a real photo as the main image.
- **Lemon8:** it needs real photos, and its rules for business posts couldn't be checked.
- **Product subreddits** (r/shutupandtakemymoney, r/INEEEEDIT, r/BuyItForLife): their rules couldn't be confirmed, so treat them as no. In gift and cozy subreddits, take part as a person only, with no link.
- **Never as the brand:** health-condition "always cold" groups, anxiety, sensory, ADHD or autism groups, weighted-blanket groups, anything for school, college, kids or parents, #booktok, and gaming communities. These either imply health claims or reach minors.
- **Never anywhere:** cold DMs, comments under other brands' posts, the same post in two groups, bought followers or views, engagement pods, giveaways, friends posing as customers, or paid boosts.

## 4. Who does what

**You do only what needs your accounts or your hands:**
- **Before Day 1:** save the 10 images to your phone, and email the agent your OK on the return terms (content-pack §0).
- **Set up the profiles:** TikTok on Day 1, Instagram and Threads on Day 2, the Facebook Page on Day 5, Pinterest on Day 6, and YouTube the day after B1.
- **Post and reply:** post each day's boxes from `content-pack.md` §3, and reply to comments and DMs on your own posts using the §7 templates. This takes about 20 minutes a day.
- **People you know:** text and email them one at a time, with no follow-ups. Before posting in a group, read its rules and screenshot them.
- **Tell the agent:** questions you got twice, the day the sample arrives (with the sample-check photos and weight), and when you've made the Stripe Payment Link.
- **When a sale comes in:** place the supplier order the same business day.
- **Day 15:** do the 20-minute review.

**The agent does this every night. It never posts, sends DMs or spends money.**
1. It counts new waitlist sign-ups (Jotform 262925084645060) by `utm_source` and by bucket (§1).
2. Once the Stripe link is live, it checks Gmail for Stripe payments and assigns each order to a channel (§2). It tells you about every sale right away, with what to order from the supplier.
3. It logs one row in `verification-log.csv`: totals, buckets, orders, test day, days since B1, and the §2 result, marked "provisional" until Day 15.
4. It checks tomorrow's boxes against the date rules (§6) and anything new, such as a repeated question, a cold snap, the sample arriving or orders opening. If a box has to change, it drafts the new one and runs it through `../ads/check_copy.py`.
5. It messages you only for a sale, a sign-up milestone (the first, then every 10), a changed post for tomorrow, or the Day 15 result.

**One-time agent jobs:**
- **Before Day 1:** publish the store fix that keeps the tracking tags when a visitor moves between pages (it's built but not live yet), and send you the images.
- **On switch day:** put the Stripe link in the store config and set up the W-1 email as a draft for you to send.

## 5. When the sample arrives: switch to Track B

**On the day it arrives:**
1. **Do the sample check (about 10 minutes) before you post any footage.** Photograph the labels and the packaging (evidence only, never posted). Weigh the cloak on a kitchen scale, and note the order, ship and delivery dates and where the postage came from. Send it all to the agent. Don't mention weight, fabric, care, sizing or origin until the agent switches each claim on.
2. **Film the 15-minute list below**, then post B1 on TikTok and as an Instagram Reel.

**From then on:**
- Track B (content-pack §4) replaces the TikTok and Instagram items left in the calendar. That's one video a day: about 15 minutes of posting, plus replies.
- The next day, set up YouTube and post B1 there, as a Facebook Page Reel (no link), on Threads and on your profile.
- In any box you still post, delete every sentence saying the sample is on its way, in the mail or only an illustration. Use a still from B1 or B2 instead of the drawing. Skip D12-2 and D13-1.
- The 7-day count for the Too-early row starts at B1.
- Orders open only after the sample check, and only if the sample matches the product page.

**15-minute filming list.** This gives you B1 and B2. B3-B6 are filmed in the content pack's two longer sessions, and B4 and B5 need a second adult who signs the model release first.
- **Setup (2 min):** couch near a window in daylight, or by a lamp. Phone vertical, rear camera, 1x lens, no filters. Take the cloak out of its bag off camera. Keep packaging, candles, heaters, house numbers and mail out of frame. Adults only; faceless is fine.
- **Shot 1, top-down (2 takes):** the cloak spread across the couch while a hand smooths it flat.
- **Shot 2, medium, one continuous move (3 takes):** lift the cloak by the shoulders, swing it on and pull the hood up.
- **Shot 3, close:** a hand pulls the hood up with the face clear, or a back view with the hood up.
- **Shot 4, wide:** sit back into the couch and wrap the front closed, mug in hand.
- **Shot 5, macro, 5 seconds, natural sound:** fingertips brushing across the hood rim. This is a spare shot for B6.
- **Afterwards:** keep the originals. Instagram and YouTube get the file from your camera roll, never the TikTok download.

## 6. Holiday timing

Delivery is promised as 10-22 business days after the order. That is the overseas-shipping promise (`../economics.md` §7).

| Date (2026) | What it means |
|---|---|
| End of Mon 16 Nov | Gift-angle posts stop, one day before the cutoff. |
| **Tue 17 Nov** | **Last safe order date for Christmas.** Counting 22 business days (with Thanksgiving off) lands on Fri 18 Dec, which leaves 3 business days of slack before 24 Dec. |
| Fri 20 Nov | The zero-slack date: the 22nd business day falls on Wed 23 Dec. Never rely on it. |

**Up to the end of Mon 16 Nov:** gift-idea posts are fine ("For the person who's always cold", "the friend who steals every blanket") as long as they include "Delivery takes 10-22 business days, tracked." Never give a date, never use the word Christmas, and never say "in time for". While the buy button still opens the waitlist, post no gift-timing at all, because a sign-up can't order yet.

**From Tue 17 Nov:**
- No gift wording anywhere. Use the "after Mon 16 Nov" versions in the pack, skip `carousel-1.png`, `pin-1.png` and the gift groups, and move the D9-1 gift pin to a secret board.
- Run homebody and couch posts, plus the dated posts in content-pack §3: Thanksgiving eve, Black Friday (no sale), Small Business Saturday, and the longest night on Mon 21 Dec.
- If orders open after 17 Nov, use no holiday-gift wording for the rest of the season.
- Hanukkah (4-12 Dec) is out of reach too.

**If someone asks whether it will arrive for the holidays,** reply: "Delivery takes 10-22 business days after you order, with tracking, so I can't promise a holiday date." Never post either cutoff date.

**If the supplier later confirms US-warehouse shipping** (5-11 business days), the agent updates the config. The last order date then moves to Fri 4 Dec, and gift wording stops at the end of Thu 3 Dec.

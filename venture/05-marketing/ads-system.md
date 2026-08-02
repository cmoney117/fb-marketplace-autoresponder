# Paid Ads System (dormant until organic validates a winner)

**Activation gate:** paid ads turn on only when (a) a product has ≥5 organic sales in 30 days (proven demand + proven listing conversion), AND (b) its contribution margin clears the breakeven-ROAS bar below. Until both are true, ad spend is $0. This gate is checked by the weekly review run.

## The math that decides everything (2025-2026 benchmarks)

```
Contribution margin = (AOV − COGS − shipping − fees − returns) ÷ AOV
Breakeven ROAS      = 1 ÷ contribution margin
Target ROAS         = breakeven × 1.3–1.5
```

| Product type | Typical margin | Breakeven ROAS | Advertisable at 2026 CPMs? |
|---|---|---|---|
| Digital product | 80–95% | 1.05–1.25 | **Yes — easiest case** |
| POD single item | ~39% | ~2.55 | Marginal — needs bundles/AOV boosters |
| POD low-margin | ~20% | 5.0 | **No — don't try** |

Reference benchmarks: Meta CPM ~$13.50–16.80 (e-com), CVR ~1.57%, CPA ~$30; TikTok CPM ~$9–13, CPA ~$33; Pinterest retail CPA ~$7–8 (cheapest — and our audience skews Pinterest anyway). Full sources in `02-research/04-marketing-and-traffic.md` §2.

**Where we start when the gate opens: Pinterest ads at $5–10/day** on the proven product (lowest CPA, same creative as our organic pins), then Meta once budget ≥$500–1,000/mo makes creative testing statistically meaningful.

## Testing framework (practitioner heuristics, encoded for the weekly run)

1. **Batch:** 4–8 creatives per test round, AI-generated (AI creatives hit ROAS parity below $100 AOV — exactly our range), each with a distinct hook/angle from the creative log.
2. **Structure:** test in ABO (fixed budget per variant, clean reads); scale winners into a CBO/Advantage+ campaign (60-70/30-40 split per current practice).
3. **Spend per variant:** evaluate only after 1–3× AOV spent (~$50–100/variant minimum).
4. **Kill rules (automatic flags):** 2× AOV spent with 0 purchases → kill. ≥50 clicks with CTR <0.5% → kill. ≤50% of target ROAS for 7 days post-learning → kill.
5. **Scale rules:** ROAS ≥ target for 7 days AND ≥3 purchases → +20–30% budget per 3 days (never >50%/day — resets learning).
6. **Iterate winners:** top creative's hook becomes the brief for the next AI batch.

## Tracking (per `tracking-and-utm-conventions.md`)

- Every ad link UTM-tagged with the creative's asset ID; GA4 + platform pixel client-side only until ~$1–2k/mo spend (then flip on server-side conversions).
- Weekly dashboard: spend, revenue by UTM, per-creative CPA, blended MER. Blended MER below breakeven for 14 days → cut spend 50%, return to creative testing.

## Hard rules

- Owner approves the ads budget before the first dollar (one-time per budget tier); the weekly run proposes, human approves changes >$50/day total.
- No ads to the own-store checkout until the store has processed ≥25 trouble-free organic orders (protects the Stripe account from a cold-traffic dispute spike).
- Creative claims follow compliance doc §7 (no fake scarcity, no unsubstantiated claims, AI disclosure where required).

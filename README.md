# AML Risk Analysis Dashboard

A decision-support prototype that ingests transaction data (CSV/Excel) and generates jurisdiction-aware money laundering risk alerts for AML compliance analysts.

**[https://bt-project-aml.ai.studio/](https://bt-project-aml.ai.studio/)**

> ⚠️ **Demo data only.** Do not upload real, personal, or client transaction data — this is a public student project, not a secure or certified compliance system. Use the included sample datasets or your own synthetic data.
(Test data: sample_transactions_500.csv)

## What it does

Upload a transaction log and the dashboard will:

- Auto-detect common transaction fields (date, amount, currency, sender/receiver, country, transaction type, customer type), with a manual column-mapping fallback
- Let you select a regulatory jurisdiction (EU — AMLR/AMLD6, US — BSA/FinCEN, or Custom) and load jurisdiction-appropriate default thresholds — all adjustable, with the active threshold version logged for audit purposes
- Score every transaction (0–100) across four risk tiers (Low / Medium / High / Critical) based on:
  - Currency-normalized amount thresholds
  - Geographic risk (high-risk jurisdiction screening)
  - PEP and sanctions-keyword screening
  - Multi-transaction pattern detection — structuring (same sender **and** recipient, repeated sub-threshold payments) vs. dispersed fund distribution (same sender, different recipients), scored by the group's aggregate materiality rather than by mere group membership
- Generate a plain-language trigger-reason explanation and a jurisdiction-appropriate recommended next step for every High/Critical alert, always flagged as advisory-only
- Export a timestamped, auditable CSV recording the active rule configuration, every transaction's score and trigger reasons, and analyst review tags

## How it was built

This was built prompt-first in **Google AI Studio**, then hardened through several rounds of structured adversarial testing against synthetic transaction datasets. That process surfaced (and fixed) real logic defects, including:

- A **currency-conversion gap** — amounts were compared against a EUR threshold regardless of currency, so a ¥23,000 transaction (≈€140) was incorrectly flagged as exceeding a €10,000 threshold
- A **disconnected geographic-risk rule** — a configured high-risk jurisdiction list wasn't actually wired into the scoring engine, so transactions touching Iran or North Korea could score 0
- An **over-triggering structuring rule** — an early fix for detecting split/structured transactions ignored the recipient, flagging ~35% of a clean test dataset as suspicious; the corrected version requires recipient-matching plus a materiality floor tied to the reporting threshold

Each fix was verified by re-running the same test dataset and confirming (a) the target defect was resolved and (b) every previously-correct rule produced identical output — a basic regression check.

## Known limitations

- **Not a certified compliance product.** This is a course/portfolio project intended to demonstrate risk-scoring logic and testing methodology, not to be relied on for real AML decisions.
- Sanctions/PEP screening is **name-keyword based**, not a match against a live, authoritative watch-list — trivially defeated by a name change.
- Currency conversion uses a **fixed exchange-rate table**, not live market rates.
- Detection rules cover a handful of illustrative typologies (structuring, dispersed distribution, geographic/PEP/sanctions risk) — this is not exhaustive of real-world AML typologies.
- Tested up to ~500 synthetic transactions; large-scale performance (100k+ rows) has been separately addressed for computation but not exhaustively load-tested.

All outputs are explicitly labeled advisory-only in the app itself; the final decision on any suspicious activity report rests with a human compliance analyst.

## Tech

Built and iterated entirely via prompt engineering in Google AI Studio, with synthetic test data generated and validated in Python (pandas) as part of the QA process.

## Author

Bill (Hsiang Yu) Tang — [LinkedIn](https://linkedin.com/in/bill-tang-a9023622a)

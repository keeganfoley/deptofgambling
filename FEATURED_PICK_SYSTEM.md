# FEATURED PICK SYSTEM

**Version:** 1.0
**Created:** December 28, 2025
**Status:** ACTIVE

---

## PURPOSE

The Featured Pick System identifies our "hottest" Fund+Sport+BetType combo and features whatever picks come from it that day. This creates a simple, trackable "best bet" concept for social media content while maintaining our multi-fund approach.

**Backtest Results:** 15-5 (75.0%) over 30 days, +$1,309 profit, 65.5% ROI

---

## QUALIFICATION RULES

### Step 1: Calculate 30-Day Rolling Records
For each unique Fund+Sport+BetType combo (e.g., "Sharp_NFL_spread", "Vector_NCAAB_spread"):
- Look back exactly 30 days from today
- Count wins and losses in that window
- Calculate win percentage

### Step 2: Apply Thresholds
A combo qualifies if it meets BOTH criteria:
- **Minimum 8 picks** in the 30-day window
- **Minimum 60% win rate** in that window

### Step 3: Rank Qualifiers
- Sort all qualifying combos by win percentage (highest first)
- The #1 combo is today's "Featured Source"

### Step 4: Check Today's Slate
- Look at today's pending bets in bets.json
- Filter to only picks from the #1 combo
- Those are the Featured Picks

---

## DECISION FLOWCHART

```
START: New day begins
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: GATHER DATA                                                         │
│ Look back exactly 30 days from today                                        │
│ Count wins and losses for each Fund+Sport+BetType combo                     │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: CHECK QUALIFICATIONS                                                │
│ For each combo, check:                                                      │
│   • Does it have 8+ picks in the 30-day window?                            │
│   • Does it have 60%+ win rate?                                            │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
    ┌────────────────────────────────┐
    │ Any combos qualify?            │
    └────────────────────────────────┘
         │
    NO   │   YES
    ▼    │    ▼
┌────────┴────────────────────────────────────────────────────────────────────┐
│ NO FEATURED PICK                  │                                         │
│ "No combo has 8+ picks at 60%+"   │                                         │
│ → Skip today                      │                                         │
└───────────────────────────────────┘                                         │
                                    │
                                    ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │ STEP 3: RANK QUALIFIERS                                 │
                    │ Sort all qualifying combos by win% (highest first)      │
                    │ The #1 combo is TODAY'S FEATURED SOURCE                 │
                    └─────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │ STEP 4: CHECK TODAY'S SLATE                             │
                    │ Does the #1 combo have any picks scheduled today?       │
                    └─────────────────────────────────────────────────────────┘
                                    │
                               NO   │   YES
                               ▼    │    ▼
                    ┌──────────┴────────────────────────────────────────────────┐
                    │ NO FEATURED PICK                                         │
                    │ "#1 combo qualified but                                   │
                    │  has no picks today"     │                                │
                    │ → Skip today             │                                │
                    └──────────────────────────┘                                │
                                               │
                                               ▼
                               ┌───────────────────────────────────────────────┐
                               │ FEATURED PICK(S) IDENTIFIED                   │
                               │ All picks from the #1 combo today             │
                               │ are FEATURED PICKS                            │
                               └───────────────────────────────────────────────┘
                                               │
                                               ▼
                                            END
```

---

## OUTCOME TYPES

| Outcome | Icon | Meaning |
|---------|------|---------|
| Featured pick(s) exist | 🟢 | #1 combo has picks today |
| No featured pick (no slate) | 🟡 | #1 combo qualified but no picks today |
| No featured pick (no qualifier) | 🔴 | No combo hit 60%/8 picks threshold |

---

## QUICK REFERENCE

| Parameter | Value |
|-----------|-------|
| Lookback window | 30 days |
| Minimum picks | 8 |
| Minimum win rate | 60% |
| Ranking method | Highest win% wins |
| Tie breaker | More picks wins |

---

## SIMPLE IF-THEN RULES

```
IF no combo has 8+ picks at 60%+ in last 30 days
   → NO FEATURED PICK TODAY (no qualifier)

IF combos qualify but #1 has no picks today
   → NO FEATURED PICK TODAY (no slate match)

IF #1 qualifying combo has picks today
   → THOSE ARE THE FEATURED PICKS
```

---

## DATA STORAGE

### bets.json - Additional Fields
When a bet is identified as featured, add:
```json
{
  "featured": true,
  "featuredSource": "Sharp_NFL_spread",
  "featuredSourceRecord": "12-3",
  "featuredSourceWinPct": 80.0
}
```

### featured_picks.json - Tracking File
```json
{
  "record": { "wins": 15, "losses": 5 },
  "winRate": 75.0,
  "lastUpdated": "2025-12-28",
  "history": [
    {
      "date": "2025-12-28",
      "featuredSource": "Sharp_NFL_spread",
      "sourceRecord": "12-3",
      "sourceWinPct": 80.0,
      "picks": [
        { "id": 390, "team": "Cleveland Browns", "description": "Browns +4.5", "result": "pending" },
        { "id": 394, "team": "Miami Dolphins", "description": "Dolphins +5.5", "result": "pending" }
      ],
      "dayResult": "pending"
    }
  ]
}
```

---

## COMMANDS

| Command | Action |
|---------|--------|
| "featured pick" | Show today's featured pick analysis |
| "what's the featured pick today" | Same as above |
| "featured pick record" | Show cumulative W-L from featured_picks.json |
| "update results" | Also updates featured_picks.json |

---

## VIDEO SCRIPT TEMPLATE

When featured picks exist, generate:

```
VIDEO SCRIPT:

"Our [Source Combo readable] system is [X-X] over the last 30 days.
Today it likes [Pick(s)].
Full card's free in Discord, link in bio."
```

**Example:**
```
"Our Sharp NFL spreads system is 12-3 over the last 30 days.
Today it likes Browns +4.5 and Dolphins +5.5.
Full card's free in Discord, link in bio."
```

---

## HISTORICAL PERFORMANCE (Backtest)

| Metric | Value |
|--------|-------|
| Record | 15-5 |
| Win Rate | 75.0% |
| Profit | +$1,309 |
| ROI | 65.5% |
| Longest Win Streak | 6 picks |
| Longest Loss Streak | 1 pick |
| Days with Featured Pick | 13 of 30 |
| Statistical Significance | Yes (z=2.06) |

---

## INTEGRATION POINTS

1. **lib/discord.ts** - `calculateFeaturedPick()`, `getFeaturedPicksForDate()`, `formatFeaturedPickMessage()`
2. **DISCORD_FORMATS.md** - Featured pick message template
3. **data/featured_picks.json** - Tracking file
4. **bets.json** - Additional fields per bet

---

*Version 1.0 - December 28, 2025*

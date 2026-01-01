# ANALYSIS PROMPT v4.0 - ALWAYS USE THIS FOR SCREENSHOT ANALYSIS

> **Claude: Read this file FIRST before analyzing any betting screenshots.**
> **Then read HEDGE_FUND_ARCHITECTURE.md (v4.0) for full rules.**

---

## PRE-ANALYSIS CHECKLIST

- [ ] Read HEDGE_FUND_ARCHITECTURE.md (v4.0)
- [ ] Resize screenshots if needed (max 1800px width)
- [ ] Identify what sports are included
- [ ] Note current time - filter for games AFTER cutoff time only
- [ ] **ASK USER: "Do you have props data/screenshots to include?"**

---

## DAILY UNIT TARGETS (v4.0)

| Level | Units | When |
|-------|-------|------|
| **Target** | 10-15u | Normal day |
| **Soft Max** | 20u | Exceptional day (multiple 70+ conviction plays) |
| **Hard Max** | 24u | Never exceed |

**Per Fund:**
- Target: 3-4u per fund
- Max: 6u per fund (only if exceptional plays)

**3u Bets:**
- Max 2 per WEEK across all funds
- Requires 80+ conviction score
- Requires Kelly calculation support

---

## 🔥 DYNAMIC UNIT SIZING (v4.1 - Dec 2024)

> **CRITICAL: Apply these AFTER calculating base units from fund matrices below**

Based on 390-bet historical analysis, apply these tier adjustments:

### TIER 1: SIZE UP TO 2u (45%+ ROI historically)
| Combination | ROI | Win Rate |
|-------------|-----|----------|
| **SharpFund + NFL** | +45.8% | 75.0% |
| **SharpFund + NCAAB** | +45.2% | 76.9% |

### TIER 2: SIZE UP TO 1.5u (27-49% ROI)
| Combination | ROI | Win Rate |
|-------------|-----|----------|
| **SharpFund + spread** (any sport) | +32.7% | 70.5% |
| **CatalystFund + spread** | +49.2% | 68.4% |

### TIER 4: SIZE DOWN TO 0.5u MAX (Negative ROI)
| Combination | ROI | Win Rate | Action |
|-------------|-----|----------|--------|
| **VectorFund + totals** | -39.8% | 30.0% | ⚠️ 0.5u MAX or SKIP |
| **VectorFund + props** | -17.9% | 45.8% | ⚠️ 0.5u MAX or SKIP |
| **VectorFund + NCAAF** | -13.8% | 35.7% | ⚠️ 0.5u MAX or SKIP |
| **Any totals bet** | -20.7% | 42.1% | ⚠️ Reduce sizing |

### ⚠️ EDGE SKEPTICISM RULE
**If stated edge > 20%, DO NOT size up.** Historical data shows:
- 5-10% edge → 61% WR (good)
- 20-30% edge → 37-55% WR (bad)
- 30%+ edge → 0% WR (disaster)

**Trust tiers over stated edge. High edge ≠ high win rate.**

### Quick Check Before Every Bet:
```bash
npx tsx scripts/check-sizing.ts [Fund] [Sport] [BetType]
```

---

## FUND CRITERIA (Must Meet These)

### ⚫️ VECTORFUND (Model Edge)
| Grade | Edge % | Units |
|-------|--------|-------|
| C+ | 3-4% | 0.5u |
| B- | 4-5% | 0.75u |
| B | 5-6% | 1.0u |
| B+ | 6-8% | 1.25u |
| A- | 8-10% | 1.5u |
| A | 10-15% | 2.0u |
| A+ | 15%+ | 2.5u |

**Pass if:** Grade < C+ AND Edge < 3%

### 🟢 SHARPFUND (Sharp Money)
**Sharp Score Calculation:**
```
Sharp Action lit = 3 pts
Big Money lit = 2 pts
DIFF 10-20% = 1 pt
DIFF 20-30% = 2 pts
DIFF 30%+ = 3 pts
RLM (1+ pt move opposite public) = 2 pts
PRO Systems lit = 1 pt
```

| Sharp Score | Units |
|-------------|-------|
| 2-3 | 0.5u |
| 4-5 | 1.0u |
| 6-7 | 1.25u |
| 7-8 | 1.5u |
| 8-9 | 2.0u |
| 10+ | 2.5u |

**Pass if:** Sharp Score < 2

### 🟠 CONTRAFUND (Fade Public)
| Sport | Public Threshold | 80%+ Units |
|-------|------------------|------------|
| NFL/NCAAF | ≥ 65% | 2.0u max |
| NBA | ≥ 70% | 2.0u max |
| NCAAB/NHL | ≥ 75% | 2.0u max |

**Boost if:** DIFF is negative (money diverges from bets)
**Reduce if:** DIFF is positive (money confirms bets)
**BLOCKED if:** Sharp Action or Big Money lit on public side
**Pass if:** Below threshold

### 🟣 CATALYSTFUND (Situational)
**Situation Point Values:**
```
TIER 1 (Full Points):
- Rest advantage (2+ days vs B2B): 3 pts
- PRO Systems trigger: 3 pts
- Cross-country travel (3+ TZ): 2 pts
- Off bye week (NFL): 2 pts
- Key injury to opponent: 2 pts

TIER 2 (×0.75 multiplier):
- 3rd road game in 4 nights: 2.25 pts
- Altitude (Denver/Utah): 1.5 pts
- Divisional underdog: 1.5 pts

TIER 3 (×0.5 multiplier):
- Revenge game: 1.5 pts
- Facing former team: 1 pt
- Letdown/lookahead: 1 pt
```

| Score | Units |
|-------|-------|
| 1.5-2.5 | 0.5u |
| 2.5-4.0 | 1.0u |
| 4.0-5.5 | 1.25u |
| 5.5-7.0 | 1.5u |
| 7.0-8.5 | 2.0u |
| 8.5+ | 2.5u |

**Pass if:** Situational Score < 1.5

### PROPS (VectorFund) ⚠️ HISTORICALLY NEGATIVE ROI
| Edge % | Units |
|--------|-------|
| < 15% | PASS |
| 15-25% | 0.5u |
| 25-35% | 0.5u |
| 35%+ | 0.5u (max) |

**⚠️ WARNING: VectorFund props have -17.9% historical ROI (45.8% WR)**
**Props max 0.5u each. Consider skipping entirely.**

---

## CONVICTION SCORE CALCULATION (Required for All Picks)

```
Conviction Score = Base Points + Bonus Points - Penalty Points

BASE POINTS:
- Vector: Edge% × 10 (e.g., 8% edge = 80 pts)
- Sharp: Sharp Score × 10 (e.g., score 7 = 70 pts)
- Contra: (Public% - Threshold) × 2 + |DIFF|
- Catalyst: Situation Score × 10 (e.g., score 5.5 = 55 pts)

BONUS POINTS:
- Multiple funds agree on same side: +20 pts
- Line moved in our favor since open: +10 pts
- Key injury supports our side: +15 pts
- Research strongly confirms: +10 pts

PENALTY POINTS:
- Line moved against us: -15 pts
- Questionable injury on our side: -10 pts
- Conflicting signals within fund: -10 pts
```

**Thresholds:**
- 40+ = Can include in card
- 60+ = Strong play
- 80+ = Top-tier (eligible for 2.5-3u)

---

## KELLY CALCULATION (Required for 2u+ Bets)

For any bet sized 2u or higher, MUST calculate:

```
1. Convert odds to decimal (-110 → 1.909)
2. Estimate true probability from edge
3. Full Kelly = (b × p - q) / b
4. Quarter Kelly = Full Kelly × 0.25
5. Final = MIN(Quarter Kelly, Matrix cap)
```

**Show Kelly in output for all 2u+ bets**

---

## SLOW DAY GUIDANCE

**If no picks score above 60 conviction:**
- Take 0-5u max that day
- It's okay to pass entirely
- Don't force action

**Signs of a slow day:**
- Few/no sharp signals lit
- No extreme public percentages
- Model edges all below 5%
- No major situational factors

**Output:** "SLOW DAY - Highest conviction: XX. Recommend 0-5u max or pass."

---

## REQUIRED OUTPUT FORMAT

### Per Fund Section:
```
## [FUND NAME] (X.Xu total)

### Pick 1: [TEAM] [LINE] @ [ODDS] - [X.X]u
**Book:** [Sportsbook name]
**Conviction:** [XX] pts
**Kelly:** [X.X]u (if 2u+ bet)

**Criteria Met:**
- [Criterion 1]: [Value]
- [Criterion 2]: [Value]

**WHY:** [1-2 sentence explanation of why market is wrong]

---
```

### CUTS Section (Required):
```
## CUTS (Qualified but didn't make card)

| Pick | Fund | Conv. | Reason |
|------|------|-------|--------|
| [Team] | Vector | 38 | Below 40 threshold |
| [Team] | Sharp | 45 | Budget exhausted |
```

---

## FINAL SUMMARY TABLE

Always end with this:

```
## ALL PICKS SUMMARY

| Rank | Fund | Pick | Line | Odds | Book | Conv. | Units | Kelly |
|------|------|------|------|------|------|-------|-------|-------|
| 1 | Vector | TCU | +6.5 | -108 | DK | 85 | 2.0u | 2.3u |
| 2 | Sharp | Capitals | -1.5 | +160 | BR | 72 | 1.5u | - |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**TOTAL UNITS:** X.Xu (Target: 10-15u)

| Fund | Units |
|------|-------|
| ⚫️ VectorFund | X.Xu |
| 🟢 SharpFund | X.Xu |
| 🟠 ContraFund | X.Xu |
| 🟣 CatalystFund | X.Xu |

## CUTS
| Pick | Conv. | Reason |
|------|-------|--------|
| ... | ... | ... |
```

---

## WHEN USER SAYS "PLACED" OR SHOWS BET SLIP

Automatically save bets to `data/bets.json`:

```python
# Add each bet with:
{
  "id": [next_id],
  "date": "[TODAY]",
  "sport": "[SPORT]",
  "description": "[TEAM] [LINE]",
  "odds": [ODDS as integer],
  "stake": [UNITS as float],
  "result": "pending",
  "betType": "spread|total|moneyline|props",
  "team": "[TEAM NAME]",
  "opponent": "[OPPONENT]",
  "gameTime": "[TIME] ET",
  "fund": "[VectorFund|SharpFund|ContraFund|CatalystFund]",
  "thesis": "[WHY explanation]",
  "convictionScore": [XX]
}
```

**Show THREE views:**
1. Individual bets table
2. By fund summary
3. Combined exposure (if same game in multiple funds)

**Confirm with:** "✅ Added X bets to bets.json (IDs #X-#Y)"

---

## ODDS API VERIFICATION

Before finalizing picks, access Odds API to:
1. Verify current lines haven't moved significantly
2. Find best available odds across books
3. **If line moved 1.5+ points AGAINST us → REMOVE pick**
4. **If line moved in our favor → Add +10 conviction bonus**

```bash
curl "https://api.the-odds-api.com/v4/sports/[SPORT]/odds/?apiKey=[KEY]&regions=us&markets=h2h,spreads,totals"
```

Sports keys:
- `basketball_nba`
- `basketball_ncaab`
- `icehockey_nhl`
- `americanfootball_nfl`
- `americanfootball_ncaaf`

---

## RED FLAGS - REDUCE OR PASS

| Red Flag | Action |
|----------|--------|
| Sharp Action lit on OPPOSITE side | PASS or 0.5u max |
| Line moved 1.5+ points against you | REMOVE from card |
| Key injury announced after screenshots | Re-evaluate, adjust conviction |
| Your pick matches 80%+ public on "sharp" play | Verify not a trap |

---

## CONFLICT RESOLUTION RULES

When two funds want OPPOSITE sides of the same game:

| Conflict | Resolution |
|----------|------------|
| **Sharp vs Contra** | Sharp ALWAYS wins. Never fade a sharp play. |
| **Sharp vs Vector** | Sharp wins (information > model). |
| **Sharp vs Catalyst** | Sharp wins. |
| **Vector vs Catalyst** | Higher conviction score wins. |

**The rule: Sharp signals have priority. Never fade a sharp play.**

---

## TIERED ANALYSIS PROCESS

### Tier 1: Quick Scan (All Games)
Flag games with:
- Edge 5%+ OR Grade B+ (Vector)
- Sharp Action OR Big Money lit (Sharp)
- Public above threshold (Contra)
- PRO Systems triggered (Catalyst)

**Games with ZERO flags = SKIP**

### Tier 2: Deep Research (Flagged Games)
Web search for:
- Injuries (last 24 hours)
- Rest/travel situation
- Recent form
- Weather (outdoor games)

**Ask:** Does research CONFIRM or KILL the edge?

### Tier 3: Conviction Scoring (Remaining Games)
- Calculate conviction score for each
- Verify lines via Odds API
- Calculate Kelly for 2u+ bets

### Tier 4: Final Selection
- Rank ALL picks by conviction score
- Start with 15u budget
- Take picks until budget exhausted OR conviction < 40 OR 12 picks reached
- Show CUTS (what didn't make it)

**If you can't answer WHY clearly = NO BET**

---

## FILTERING LOG (Show This During Analysis)

**Always display the funnel:**

```
═══════════════════════════════════════════════════════════
FILTERING LOG
═══════════════════════════════════════════════════════════

TIER 1 (Quick Scan): 47 games → 14 flagged
  ✗ 33 eliminated - no qualifying signals

TIER 2 (Research): 14 games → 9 remaining
  ✗ 3 killed - key injuries announced
  ✗ 2 killed - line moved 1.5+ points against

TIER 3 (Conviction): 9 candidates scored
  - Highest: 92 pts (Pelicans +9)
  - Lowest: 35 pts (cut - below 40)

TIER 4 (Final): 7 picks, 12.5u total
  ✗ 2 cut - below 40 conviction threshold

SLOW DAY CHECK: Highest conviction 92 ✓ (>60, proceed normally)
═══════════════════════════════════════════════════════════
```

**This log is REQUIRED for every analysis output.**

---

## QUICK REFERENCE - v4.1 THRESHOLDS

| Fund | Key Threshold | Base Max | Dynamic Tier |
|------|---------------|----------|--------------|
| Sharp + NFL/NCAAB | Sharp Score ≥ 3 | 2.5u | **🔥 TIER 1 → 2u** |
| Sharp + spread | Sharp Score ≥ 3 | 2.5u | **📈 TIER 2 → 1.5u** |
| Catalyst + spread | Sit. Score ≥ 1.5 | 2.5u | **📈 TIER 2 → 1.5u** |
| Vector (spreads) | Grade ≥ B, Edge ≥ 3.5% | 2.5u | Standard |
| Contra | NFL 65%, NBA 70%, NCAAB/NHL 75% | 2.0u | Standard |
| **Vector + totals** | - | - | **⚠️ TIER 4 → 0.5u MAX** |
| **Vector + props** | Edge ≥ 15% | - | **⚠️ TIER 4 → 0.5u MAX** |
| **Vector + NCAAF** | - | - | **⚠️ TIER 4 → 0.5u MAX** |

| Conviction | Meaning |
|------------|---------|
| 40+ | Include in card |
| 60+ | Strong play |
| 80+ | Top-tier (apply tier multiplier) |

### ⚠️ EDGE SKEPTICISM
| Stated Edge | Trust Level |
|-------------|-------------|
| 5-15% | ✅ Trust it |
| 15-20% | ⚠️ Verify |
| 20%+ | ❌ DO NOT size up |

---

*Version 4.1 (Dec 2024) - Dynamic sizing based on 390-bet analysis*

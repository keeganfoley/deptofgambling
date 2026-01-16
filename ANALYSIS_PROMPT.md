# ANALYSIS PROMPT v5.0 - SPREADS FOCUS + AUTO ENHANCEMENT

> **Claude: Read this file FIRST before analyzing any betting screenshots.**
> **Updated Jan 2026: Props/Totals BLOCKED. Spreads only. Auto-enhancement enabled.**

---

## PRE-ANALYSIS CHECKLIST

- [ ] Read HEDGE_FUND_ARCHITECTURE.md for full rules
- [ ] Identify what sports are included
- [ ] Note current time - filter for games AFTER cutoff time only
- [ ] **SKIP props/totals** - these bet types are BLOCKED
- [ ] **Read THESIS_LANGUAGE.md** - Never mention source names in thesis

---

## 📝 THESIS LANGUAGE RULES (Critical - Read THESIS_LANGUAGE.md)

> **Frontend thesis must NEVER mention specific data source names.**
> **Backend stores all raw indicator data for analysis.**

### FORBIDDEN in Thesis Text

| NEVER USE | USE INSTEAD |
|-----------|-------------|
| "Action Network" | "Our model" / "Model analysis" |
| "Sharp Action lit" | "Professional money is backing..." |
| "Big Money lit" | "Significant money moving to..." |
| "PRO projections" | "Our model projects..." |
| "DIFF calculation" | "Money diverging from public..." |
| "Sharp Score 8" | "Multiple sharp indicators aligned" |
| "PRO Systems triggered" | "Historical patterns favor..." |
| "Conviction Score" | (Don't mention - internal only) |

### Thesis Structure

Every thesis should explain:
1. **WHY** - Why does this edge exist?
2. **DATA** - Numbers without source attribution
3. **LOGIC** - Why would we win?
4. **RISK** - What could go wrong?

**See THESIS_LANGUAGE.md for full translation table and examples.**

---

## 🔍 EXTERNAL SOURCES CHECKLIST (New Jan 2026)

> **For every pick, gather data from multiple sources to validate signals.**

### NCAAB Games (Required)
```
□ KenPom ratings for both teams (kenpom.com)
  - Search: "[Team] KenPom efficiency rating"
  - Get: Adjusted efficiency, tempo, national rank
  - Compare: KenPom projected spread vs our projection

□ Sagarin ratings (sagarin.com)
  - Search: "[Team] Sagarin rating college basketball"
  - Get: Power rating for comparison
```

### NFL/NCAAF Games (Required)
```
□ ESPN FPI/SP+ ratings
  - Search: "[Team] ESPN FPI ranking"
  - Get: Power index, projected point differential

□ Sagarin ratings (sagarin.com)
  - Search: "[Team] Sagarin rating football"
```

### NBA Games (Required)
```
□ ESPN BPI ratings
  - Search: "[Team] ESPN BPI NBA"
  - Get: Basketball Power Index rating

□ Rest/schedule check
  - Search: "[Team] schedule"
  - Check: B2B? Days rest? Travel?
```

### ALL Games (Required)
```
□ Covers consensus
  - Search: "[Team A] vs [Team B] Covers picks"
  - Get: Expert consensus percentage

□ ATS trends
  - Search: "[Team] ATS record last 10 games"
  - Get: Recent covering performance

□ Injury news (LAST 48 HOURS ONLY)
  - Search: "[Team] injury report today"
  - Get: Only NEW updates, not old injuries
```

### What To Do With This Data

1. **Store in `research` field** - Save KenPom rating, Covers consensus, etc.
2. **Compare projections** - Does KenPom agree with our model?
3. **Validate signals** - If sharps like it AND KenPom agrees = stronger play
4. **Use in thesis** - Reference the data without naming sources

---

## 🔄 AUTOMATED ENHANCEMENT (New Jan 2026)

**For every game that passes initial screening, Claude AUTOMATICALLY:**

### Step 1: Line Shopping (Odds API)
```
For each potential pick:
- Pull current lines from Odds API
- Find best available spread across all books
- Note any book discrepancies (1+ point = value)
- Report: "Best line: [Team] [Spread] @ [Book]"
```

### Step 2: Context Research (Web Search)
```
For each potential pick, search for:
- Injuries (last 24-48 hours ONLY) - "[Team] injury news"
- Rest situation - Is either team on B2B? Travel?
- Recent news - Anything that explains WHY the signal exists?
```

### ⚠️ RELEVANCE FILTER (Critical)

**Only report information that is:**
1. NEW (last 24-48 hours) - status CHANGED recently
2. NOT already priced into the line
3. ACTIONABLE - affects how we should bet

**RELEVANT (report this):**
```
✅ "Tatum upgraded from questionable to probable today"
✅ "Brown missed shootaround, now questionable (was probable)"
✅ "Starting PG announced out 30 mins ago, line hasn't moved"
✅ "Team on 3rd game in 4 nights after cross-country travel"
✅ "Key rotation player returning tonight after 2-week absence"
```

**IRRELEVANT (do NOT report):**
```
❌ "Tatum has been out all season" - ALREADY PRICED IN
❌ "Team has struggled recently" - VAGUE, already in line
❌ "Player averages 22 PPG" - NOT ACTIONABLE
❌ "Team is 5-10 on the road" - ALREADY PRICED IN
❌ "Injury from 2 weeks ago" - ALREADY PRICED IN
```

**The Test:** Ask "Did something CHANGE in the last 24-48 hours?"
- If YES → report it, it might not be priced
- If NO → don't mention it, market already knows

### Step 3: WHY Analysis (Required)
```
Before ANY pick is approved, answer:
1. WHY would sharps/model be right here?
2. WHAT information edge exists?
3. WHY hasn't the market already priced this?

If you can't answer all 3 = PASS on the pick
```

**This happens automatically. User just pastes data, Claude does the rest.**

---

## 🧠 INTELLECTUAL WHY FRAMEWORK (Critical)

> **Signals are INPUTS, not ANSWERS. Every pick requires understanding CONTEXT.**

### The Three Questions (Must Answer All)

**Q1: WHY would this edge exist?**
```
Good answers:
- "Injury news broke 2 hours ago, line hasn't fully adjusted"
- "Public overreacting to last week's blowout loss"
- "Market underweighting 3 days rest vs back-to-back"
- "Sharps pounding this because line opened too high"

Bad answers:
- "Sharp Action is lit" (that's a signal, not a reason)
- "Model says 8% edge" (that's data, not understanding)
```

**Q2: WHAT information asymmetry exists?**
```
Consider:
- Do we know something the market hasn't FULLY priced?
- Is there RECENT news (24-48 hrs) that explains the signal?
- Is there a situational factor (rest, travel, schedule)?
- Is there a market bias we're exploiting (public overreaction)?

KEY: The information must be CURRENT and ACTIONABLE.
"Tatum out all year" = useless (already priced)
"Tatum upgraded to probable 2 hours ago" = valuable (may not be priced)
```

**Q3: WHY hasn't the market already corrected this?**
```
Possible reasons:
- News is recent (< 24 hours)
- Casual bettors haven't noticed yet
- Public bias is strong (popular team, primetime game)
- Situational factors are hard to quantify
```

### Signal Without Context = No Bet

| Scenario | Action |
|----------|--------|
| Sharp Action lit + can explain WHY | ✅ Proceed |
| Sharp Action lit + can't explain WHY | ⚠️ Investigate more or PASS |
| Multiple signals + clear context | ✅ High conviction |
| Multiple signals + no clear context | ⚠️ Something we're missing - PASS |

### Red Flags (Signals That Don't Make Sense)

- **Sharp Action on obviously weak team** - Why would sharps like them? Investigate.
- **Huge model edge (20%+) on major game** - Market is efficient. Be skeptical.
- **All signals aligned but line hasn't moved** - Why not? Trap?
- **Public heavy but no contra signals** - Maybe public is right this time.

### The Intellectual Standard

```
Before betting: "I understand WHY this bet should win."
Not: "The signals say bet this."

We are not signal followers.
We are signal interpreters.
```

---

## 📊 QUANTITATIVE ANALYSIS STANDARD (Required)

> **We are a quantitative fund. Every claim must have numbers behind it.**

### Language Standard

**AMATEUR (Don't do this):**
```
❌ "Team has been struggling lately"
❌ "They're playing well"
❌ "Good matchup"
❌ "Sharp money likes this"
```

**INSTITUTIONAL (Do this):**
```
✅ "Team is 3-7 ATS in last 10, failing to cover by avg of 4.2 points"
✅ "Averaging 118.3 PPG over last 5 (vs 112.1 season avg), +6.2 above baseline"
✅ "Opponent allows 47.3% from 3PT to PGs (28th in NBA), exploitable by their backcourt"
✅ "Sharp money moved line from -3 to -5 against 68% public action = 2pt RLM"
```

### Required Statistics (Include When Relevant)

**ATS Performance:**
```
- Last 10 ATS record and cover margin
- Home/Away ATS splits
- As favorite/underdog ATS splits
- ATS vs specific opponent types (ranked teams, division, etc.)
```

**Situational Stats:**
```
- Record on rest vs no rest
- Record on B2B (both teams)
- Record after loss / after win
- Record in 2nd game of road trip
```

**Matchup Stats:**
```
- Pace differential (possessions per game)
- Offensive/Defensive efficiency ratings
- Position-specific matchup advantages
- Rebounding differential, turnover rates
```

**Line Movement Data:**
```
- Opening line vs current line (exact movement)
- Public betting % vs money %
- DIFF calculation (Money% - Bet%)
- Reverse line movement magnitude
```

### The Math Must Add Up

Before finalizing any pick, verify:

```
1. SIGNAL CHECK: What do the indicators say?
   - Sharp Score: X pts
   - Model Edge: X%
   - Public/Money split: X%/X% (DIFF: X%)

2. STATISTICAL CHECK: Do the numbers support it?
   - Relevant ATS trend: X-X (X%)
   - Situational factor: Team is X-X in this spot
   - Matchup edge: Quantified advantage

3. CONTEXT CHECK: Does the narrative make sense?
   - WHY would this edge exist?
   - WHAT information isn't priced?
   - Is there a logical explanation?

4. OVERRIDE CHECK: Should we fade the signal?
   - Do signals conflict with statistics?
   - Is there a reason to be skeptical?
   - Does the math NOT add up?
```

### When to Override Signals

**OVERRIDE (fade the signal) when:**
```
- Sharp Action lit BUT team is 2-8 ATS last 10 with no clear catalyst for change
- High model edge BUT line hasn't moved (market disagrees)
- Multiple signals BUT situational stats historically negative
- Everything looks good BUT can't explain WHY market would be wrong
```

**TRUST (follow the signal) when:**
```
- Signals + Statistics + Context all align
- Clear, quantifiable edge exists
- Recent information supports the play
- Math adds up across all dimensions
```

### Analysis Output Format

Every pick analysis must include:

```
## [TEAM] [LINE] - [FUND] - [UNITS]u

**Signal Summary:**
- Sharp Score: X/10 | Model Edge: X% | Grade: X
- Line Movement: Opened X, now X (+/- X pts)
- Public: X% bets / X% money (DIFF: X%)

**Statistical Case:**
- ATS Last 10: X-X (X%), avg margin: +/- X pts
- Situational: X-X in [relevant situation]
- Matchup Edge: [Quantified advantage with numbers]

**Context:**
- [Recent news/change if any - with timestamp]
- [Why this edge exists - logical explanation]
- [Why market hasn't fully priced it]

**Risk Factors:**
- [What could go wrong - be honest]

**Line Shopping:**
- Best Available: [Line] @ [Book]
- Consensus: [Line]
- Edge vs Consensus: [X pts]

**Verdict:** [1-2 sentences on why we're betting this, math-based]
```

### The Fund Manager Mindset

```
You are not a bettor. You are a fund manager.

Every decision affects the portfolio.
Every analysis must be defensible.
Every claim must have evidence.

If someone asked "Why did you bet this?" you must be able to say:
"The Sharp Score was 8, team is 7-3 ATS last 10 covering by 3.2 avg,
they're on 3 days rest vs opponent on B2B, and we got the best line
at -5.5 vs -6.5 consensus. The math supported 1.5u allocation."

Not: "The signals looked good."
```

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
| **VectorFund + NCAAF** | -13.8% | 35.7% | ⚠️ 0.5u MAX or SKIP |

### 🚫 BLOCKED BET TYPES (Do Not Bet - Jan 2026)
| Bet Type | All-Time Record | Profit | Action |
|----------|-----------------|--------|--------|
| **ALL PROPS** | 22-26 (45.8%) | -$1,179 | 🚫 DO NOT BET |
| **ALL TOTALS** | 20-24 (45.5%) | -$928 | 🚫 DO NOT BET |

**If user asks for props/totals:** "These bet types are currently blocked based on historical performance. Our edge is in spreads (60.2% WR, +$6,938). Focusing there."

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

### ~~PROPS~~ 🚫 BLOCKED
**Props are no longer bet. Historical: 22-26 (45.8% WR), -$1,179 loss.**
**Skip any props analysis entirely.**

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

**Signal Data:**
| Metric | Value |
|--------|-------|
| Sharp Score | X/10 |
| Model Edge | X% |
| Grade | X |
| Line Move | X → X (Δ X) |
| Public/Money | X% / X% |
| DIFF | X% |

**Statistical Case:**
- ATS L10: X-X (X%), avg cover margin: ±X pts
- Situation: X-X [in relevant spot]
- Matchup: [Quantified edge with numbers]

**Line Shopping:**
- Best: [Line] @ [Book] ← USE THIS
- Consensus: [Line]
- Edge: X pts better than market

**Thesis:** [2-3 sentences explaining WHY this bet wins, with math/stats backing every claim. Must answer: What edge exists and why isn't it fully priced?]

**Risk:** [What could make this lose - be honest]

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

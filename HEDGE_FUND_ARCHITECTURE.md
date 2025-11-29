# DEPARTMENT OF GAMBLING - HEDGE FUND ARCHITECTURE

## Complete Operational Framework for 4-Fund Strategy

**Primary Data Source:** Action Network Pro ($14.99/month)
**Supplementary Data:** Odds API (20,000 calls/month)
**Analysis Engine:** Claude Code

---

# SECTION 0: CORE PHILOSOPHY

## 0.1 The Decision Framework

**Action Network = DATA INPUT, Claude = DECISION MAKER**

Action Network provides the signals. Claude determines if they make sense.

For every potential bet, quickly answer:
- **WHY would this edge exist?**
- **Is there a reason the market is wrong?**

```
If you can explain WHY in 1-2 sentences → PROCEED
If you can't explain WHY → PASS (even if signals are lit)
```

**Examples:**
- ✅ "Sharp money on Celtics because Tatum questionable news just broke and market hasn't adjusted"
- ✅ "Public hammering Cowboys but they're 2-6 ATS as favorites this year - recency bias"
- ✅ "Model edge exists because market underweighting Heat's home rest advantage"
- ❌ "Signals are lit but I can't explain why the market would be wrong here" → PASS

## 0.2 FUND INDEPENDENCE (No Combining)

**CRITICAL: Each fund operates 100% independently.**

- VectorFund analyzes → outputs ITS picks with ITS unit sizing
- SharpFund analyzes → outputs ITS picks with ITS unit sizing
- ContraFund analyzes → outputs ITS picks with ITS unit sizing
- CatalystFund analyzes → outputs ITS picks with ITS unit sizing

**NO BOOSTING:** If two funds like the same game, they each list it separately with their own reasoning and sizing. Units are NEVER combined or boosted.

**UNIT SIZING OVERVIEW:**
See Section 0.7 for detailed fund-by-fund matrices. General guide:
- 0.5u = Low conviction (barely qualifies, minimum threshold)
- 0.75-1.0u = Medium conviction (solid but not exceptional)
- 1.25-1.5u = High conviction (strong signals confirmed)
- 2.0u = Very high conviction (multiple strong signals)
- 2.5u = Near-max (exceptional edge + all confirmations)
- 3.0u = MAX - only 1-2 per WEEK, requires 80+ conviction score

**OUTPUT FORMAT - Always list by fund separately:**

```
VECTOR FUND PICKS:
1. [Pick] - [Units]u @ [Odds from Odds API]
   WHY: [explanation]

SHARP FUND PICKS:
1. [Pick] - [Units]u @ [Odds from Odds API]
   WHY: [explanation]

CONTRA FUND PICKS:
1. [Pick] - [Units]u @ [Odds from Odds API]
   WHY: [explanation]

CATALYST FUND PICKS:
1. [Pick] - [Units]u @ [Odds from Odds API]
   WHY: [explanation]
```

**Never combine funds. Never boost units. Each fund stands alone.**

## 0.3 WHY Requirement (Mandatory for Every Pick)

Every pick must include a 1-2 sentence "WHY" explanation:

| Fund | WHY Format |
|------|------------|
| **Vector** | "Model edge exists because [injury/matchup/market slow to adjust to X]" |
| **Sharp** | "Sharps like this because [information edge/value on line move/market overreaction]" |
| **Contra** | "Public is wrong because [recency bias/overreaction to last game/popular team tax]" |
| **Catalyst** | "Situation mispriced because [market doesn't weight rest/travel/revenge enough]" |

**If you cannot write the WHY sentence → DO NOT BET**

## 0.4 Red Flags Check (Kills or Reduces Bet)

Before finalizing any pick, check for red flags:

| Red Flag | Action |
|----------|--------|
| **Conflicting sharp signals** (Sharp Action lit on OPPOSITE side of your pick) | PASS or reduce to 0.5u |
| **Key injury announced** after Action Network data was updated | Re-evaluate, likely PASS |
| **Line moving hard against your side** (2+ points since you identified it) | Reduce to 0.5u or PASS |
| **Obvious trap game indicators** (too-good-to-be-true line, everyone on same side) | Extra scrutiny on WHY |
| **Your pick matches 80%+ public** on a "sharp" or "model" play | Verify it's not a trap |

```
Red flag present = Reduce to 0.5u OR PASS
Multiple red flags = PASS regardless of signals
```

## 0.5 DAILY UNIT TARGETS & LIMITS

**DAILY UNIT TARGETS:**
| Level | Units | When |
|-------|-------|------|
| **Target** | 10-15u | Normal day |
| **Soft Max** | 20u | Exceptional day (multiple high-conviction plays) |
| **Hard Max** | 24u | Never exceed |

**PER FUND LIMITS:**
- Target: 3-4u per fund per day
- Max: 6u per fund (only if exceptional plays exist)

**3u MAX BET RESTRICTION:**
- Maximum 2 bets at 3u per WEEK across all funds
- 3u requires conviction score 80+ AND Kelly calculation supports it
- Must be able to articulate WHY in 2 sentences
- Ask: "Would I bet this if it were my last bet of the week?"

**VALUE IS EVERYTHING:**
- Only bet when genuine value exists
- Every pick must pass the "WHY would the market be wrong?" test
- If you can't explain the edge clearly, it's not a bet
- Qualification is STEP 1 - picks must then COMPETE for limited daily units

**CONFLICT RESOLUTION (When Funds Want Opposite Sides):**

| Conflict | Resolution |
|----------|------------|
| Sharp vs Contra | **Sharp ALWAYS wins.** Never fade a sharp play. |
| Sharp vs Vector | Sharp wins (information > model). |
| Sharp vs Catalyst | Sharp wins. |
| Vector vs Catalyst | Higher edge wins. |

**The rule: Sharp signals have priority. If Sharp likes Team A, Contra does NOT fade Team A.**

**PLAYER PROPS PROCESS:**
1. First, analyze all Action Network prop projections provided
2. Research each prop - player averages, matchup, minutes, situation
3. Calculate edge and determine value
4. THEN access Odds API for additional props or line verification
5. Props must meet 15%+ edge threshold (higher variance)
6. Props max 1u each, go to VectorFund

**WORKFLOW ORDER:**
1. Read all screenshots/data
2. Run 4-fund analysis on ALL games
3. Calculate conviction scores for all qualifying picks
4. Rank ALL picks by conviction score
5. Select TOP 8-12 picks that fit within daily unit budget
6. THEN access Odds API for verification
7. Output final picks with full reasoning

## 0.6 TIERED ANALYSIS PROCESS

Not every game gets deep research. Use this filtering system:

**TIER 1 FILTER (Quick Scan - All Games):**
Using Action Network data only, flag games that have:
- Edge 5%+ OR Grade B+ or higher (Vector candidates)
- Sharp Action OR Big Money lit (Sharp candidates)
- Public 70%+ on one side (Contra candidates)
- PRO Systems triggered (Catalyst candidates)

Games with ZERO flags = SKIP entirely

**TIER 2 FILTER (Deep Research - Flagged Games Only):**
For games that passed Tier 1, web search:
- Injuries (last 24 hours)
- Rest/travel situation
- Recent form (last 3-5 games)
- Head-to-head history if relevant
- Any news that affects the line

Ask: "Does this research CONFIRM or KILL the edge?"
- Confirms = stays in consideration
- Kills = remove from picks

**TIER 3 FILTER (Final Conviction - Top Candidates Only):**
For remaining games after Tier 2:
- Access Odds API to verify lines
- Check for better odds across books
- Pull player props if relevant
- Rank by conviction
- Select TOP picks within unit caps

**THE KEY QUESTION:**
Before any bet is finalized, answer:
"Why is the market wrong, and what do I know that the line doesn't reflect?"

If you can't answer clearly = NO BET

**PROPS ANALYSIS:**
For Action Network props provided:
1. Quick scan for edges 15%+
2. Web search player's recent games, minutes, usage
3. Check matchup defense rankings
4. Odds API to verify/find best line
5. Only bet props where research confirms edge

## 0.7 FUND-BY-FUND UNIT SIZING MATRICES

### ⚫️ VECTORFUND MATRIX (Model Edge)

| Grade | Edge % | Conviction | Base Units | Kelly Cap |
|-------|--------|------------|------------|-----------|
| C+ | 3-4% | Low | 0.5u | 1.0u |
| B- | 4-5% | Low-Med | 0.75u | 1.0u |
| B | 5-6% | Medium | 1.0u | 1.5u |
| B+ | 6-8% | Med-High | 1.25u | 1.5u |
| A- | 8-10% | High | 1.5u | 2.0u |
| A | 10-15% | Very High | 2.0u | 2.5u |
| A+ | 15%+ | Max | 2.5u | 3.0u |

**3u Vector Bet Requires:** A+ grade AND 15%+ edge AND confirmed by research AND no red flags

### 🟢 SHARPFUND MATRIX (Follow Smart Money)

**Sharp Score Calculation:**
```
Sharp Action lit = 3 pts
Big Money lit = 2 pts
DIFF 10-20% = 1 pt
DIFF 20-30% = 2 pts
DIFF 30%+ = 3 pts
RLM detected (1+ pt move opposite public) = 2 pts
PRO Systems lit = 1 pt
```

| Sharp Score | Signals Present | Conviction | Units |
|-------------|-----------------|------------|-------|
| 2-3 | Sharp OR Big Money (one only) | Low | 0.5u |
| 4-5 | Sharp AND Big Money | Medium | 1.0u |
| 6-7 | Sharp + Big Money + DIFF 10-20% | Med-High | 1.25u |
| 7-8 | Sharp + Big Money + DIFF 20-30% | High | 1.5u |
| 8-9 | Sharp + Big Money + DIFF 30%+ | Very High | 2.0u |
| 10+ | All signals + RLM + PRO Systems | Max | 2.5u |

**3u Sharp Bet Requires:** Score 10+ (all signals firing) AND line moving our direction AND confirmed by research

### 🟠 CONTRAFUND MATRIX (Fade Public)

**NFL/NCAAF (65% threshold):**
| Public % | DIFF | Conviction | Units |
|----------|------|------------|-------|
| 65-70% | Positive (confirms public) | Low | 0.5u |
| 65-70% | Negative (diverges from public) | Medium | 1.0u |
| 70-75% | Any | Med-High | 1.25u |
| 75-80% | Negative | High | 1.5u |
| 80%+ | Any | Very High | 2.0u |

**NBA (70% threshold):**
| Public % | DIFF | Conviction | Units |
|----------|------|------------|-------|
| 70-75% | Negative | Medium | 1.0u |
| 75-80% | Negative | High | 1.5u |
| 80%+ | Any | Very High | 2.0u |

**NCAAB/NHL (75% threshold):**
| Public % | DIFF | Conviction | Units |
|----------|------|------------|-------|
| 75-80% | Negative | Medium | 1.0u |
| 80-85% | Negative | High | 1.5u |
| 85%+ | Any | Very High | 2.0u |

**Contra Blockers (PASS regardless of public %):**
- Sharp Action lit on public side → PASS
- Big Money lit on public side → PASS
- Line moving toward public → Reduce to 0.5u max

**3u Contra Bet Requires:** 85%+ public AND negative DIFF AND no sharp signals on public side AND primetime/popular team bias

### 🟣 CATALYSTFUND MATRIX (Situational)

**Situation Point Values:**
```
TIER 1 (Proven - Full Points):
- Rest advantage (2+ days vs B2B): 3 pts
- PRO Systems trigger: 3 pts
- Cross-country travel (3+ TZ): 2 pts
- Off bye week (NFL): 2 pts
- Key injury to opponent (star OUT): 2 pts

TIER 2 (Likely - 0.75x multiplier):
- 3rd road game in 4 nights: 2.25 pts (3 × 0.75)
- Altitude game (Denver, Utah): 1.5 pts
- Divisional underdog: 1.5 pts
- Playoff implications one team only: 1.5 pts

TIER 3 (Narrative - 0.5x multiplier):
- Revenge game: 1.5 pts (3 × 0.5)
- Facing former team: 1 pt
- Letdown/lookahead spot: 1 pt
```

| Situation Score | Conviction | Units |
|-----------------|------------|-------|
| 1.5-2.5 | Low | 0.5u |
| 2.5-4.0 | Medium | 1.0u |
| 4.0-5.5 | Med-High | 1.25u |
| 5.5-7.0 | High | 1.5u |
| 7.0-8.5 | Very High | 2.0u |
| 8.5+ | Max | 2.5u |

**3u Catalyst Bet Requires:** Score 8.5+ (multiple Tier 1 factors stacking) AND confirmed by research

## 0.8 CONVICTION SCORE SYSTEM (Final Pick Selection)

After all 4 funds generate qualified picks, calculate conviction score for EVERY pick:

**Conviction Score Formula:**
```
Conviction Score = Base Points + Bonus Points - Penalty Points

BASE POINTS (by fund):
- Vector: Edge% × 10 (e.g., 8% edge = 80 pts)
- Sharp: Sharp Score × 10 (e.g., score 7 = 70 pts)
- Contra: (Public% - Threshold) × 2 + |DIFF| (e.g., 75% NFL with -15% DIFF = 20 + 15 = 35 pts)
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

**Final Selection Process:**
```
1. Calculate conviction score for all qualified picks
2. Rank ALL picks by conviction score
3. Start with 15u daily budget
4. Take picks in order of conviction score until:
   a) Budget exhausted, OR
   b) Next pick's conviction score < 40 (minimum threshold), OR
   c) 12 picks reached (max per day)

If exceptional day (multiple 70+ conviction picks):
- Can extend to 20u soft max
- Never exceed 24u hard max
```

**Minimum Conviction Thresholds:**
- Score 40+ = Can be included in daily card
- Score 60+ = Strong play
- Score 80+ = Top-tier play (eligible for 2.5-3u)

## 0.9 QUARTER KELLY CALCULATION (Required for 2u+ Bets)

For any bet sized at 2u or higher, MUST calculate Kelly:

```
Step 1: Convert odds to decimal
  -110 → 1.909
  +150 → 2.50

Step 2: Estimate true probability
  Use Action Network edge to back-calculate:
  If market implied = 52.4% and edge = 8%
  True probability ≈ 52.4% + (8% × 0.5) = 56.4%

Step 3: Calculate Full Kelly
  Full Kelly = (b × p - q) / b
  Where b = decimal - 1, p = true prob, q = 1-p

Step 4: Quarter Kelly
  Recommended = Full Kelly × 0.25

Step 5: Cap Check
  Final units = MIN(Quarter Kelly result, Matrix maximum)
```

**Example:**
- Pelicans +9 @ -112, Edge 18.1%
- Decimal odds: 1.893, b = 0.893
- Market implied: 52.8%, True prob ≈ 52.8% + 9% = 61.8%
- Full Kelly: (0.893 × 0.618 - 0.382) / 0.893 = 19.0%
- Quarter Kelly: 19% × 0.25 = 4.75% → 4.75u
- Matrix cap for A+ 15%+: 3.0u
- **Final: 3.0u** (capped by matrix)

## 0.10 SLOW DAYS

**If no picks score above 60 conviction:**
- Take 0-5u max that day
- It's okay to pass entirely
- Don't force action
- Better to preserve capital than chase marginal plays

**Signs of a slow day:**
- Few/no sharp signals lit
- No extreme public percentages
- Model edges all below 5%
- No major situational factors

**What to do:**
- Take only the 1-2 best plays if they exist
- Size down (0.5-1u max per pick)
- Or pass entirely and wait for tomorrow

---

# SECTION 1: UNIVERSAL FOUNDATIONS

## 1.1 Fund Independence Principle

**Each fund operates with its own philosophy and analysis.**

The 4 funds are designed to have different philosophies that will often agree on the same side:

- VectorFund might say BET Team A based on model edge
- SharpFund might say BET Team A because sharp money is there
- ContraFund might say BET Team A because public is heavy on B
- CatalystFund might say BET Team A because of rest advantage

**When funds AGREE = multiple entries from different funds (not boosted units).**

**When funds CONFLICT (opposite sides):**
See Section 0.5 CONFLICT RESOLUTION. Sharp signals have priority - never fade a sharp play.

## 1.2 Bankroll Structure

| Fund | Starting Capital | Base Unit (1%) | Max Single Bet | Max Daily Units |
|------|------------------|----------------|----------------|-----------------|
| VectorFund | $10,000 | $100 | $300 (3u) | 6 units |
| ContraFund | $10,000 | $100 | $300 (3u) | 6 units |
| SharpFund | $10,000 | $100 | $300 (3u) | 6 units |
| CatalystFund | $10,000 | $100 | $300 (3u) | 6 units |
| **TOTAL** | **$40,000** | - | - | **24 units** |

## 1.3 Dynamic Unit Sizing (Based on Bankroll)

```
Unit Size = Current_Bankroll × 0.01

If fund = $10,000 → Unit = $100
If fund = $12,000 → Unit = $120
If fund = $8,000 → Unit = $80
If fund = $6,000 → Unit = $60 (and review strategy)
```

## 1.4 Kelly Criterion Formula

```
Full Kelly % = (b × p - q) / b

Where:
- b = (decimal odds) - 1
- p = your estimated win probability
- q = 1 - p

We use QUARTER KELLY:
Recommended Stake = Full Kelly % × 0.25 × Bankroll
```

**Example Calculation:**
- Estimated probability: 58%
- Odds: -110 (decimal: 1.909)
- b = 0.909
- Full Kelly = (0.909 × 0.58 - 0.42) / 0.909 = 11.6%
- Quarter Kelly = 11.6% × 0.25 = 2.9% of bankroll
- On $10,000 fund = $290 bet (round to $300 = 3 units)

## 1.5 Implied Probability Conversion

```
Negative odds (favorites):
Implied % = |Odds| / (|Odds| + 100)

Positive odds (underdogs):
Implied % = 100 / (Odds + 100)
```

| Odds | Implied Probability |
|------|---------------------|
| -200 | 66.67% |
| -150 | 60.00% |
| -130 | 56.52% |
| -115 | 53.49% |
| -110 | 52.38% |
| -105 | 51.22% |
| +100 | 50.00% |
| +110 | 47.62% |
| +120 | 45.45% |
| +150 | 40.00% |
| +200 | 33.33% |

## 1.6 Expected Value (EV) Formula

```
EV% = (Your_Probability × Decimal_Odds) - 1

If EV% > 0 → Positive expected value → Consider betting
If EV% > 3% → Good edge
If EV% > 5% → Strong edge
If EV% > 8% → Excellent edge
```

## 1.7 Breakeven Win Rates

| Odds | Breakeven % | Need to Win |
|------|-------------|-------------|
| -115 | 53.49% | 54+ out of 100 |
| -110 | 52.38% | 53+ out of 100 |
| -105 | 51.22% | 52+ out of 100 |
| +100 | 50.00% | 50+ out of 100 |

---

# SECTION 2: DATA SOURCES & TOOLS

## 2.1 Action Network Pro (Primary Data Source) - $14.99/month

Action Network Pro is our primary data source. It provides 80% of what we need.

**Data Collection Methods by Page:**

| Page | Collection Method | Notes |
|------|-------------------|-------|
| PRO Projections | Screenshot | Capture all games visible |
| Public Betting & Money % | Screenshot | Capture DIFF column |
| PRO Report | Screenshot EACH GAME POPUP | Click game row to see signal explanations |
| Prop Projections | Cmd+A copy/paste | Text format works well for props |

**PRO Report Columns:**
| Column | What It Shows | Fund Usage |
|--------|---------------|------------|
| OPEN | Opening line | All funds (baseline) |
| BEST ODDS | Current best line + juice | All funds |
| SHARP ACTION | Sharp money indicator (blue = signal) | SharpFund |
| BIG MONEY | Large money on one side (blue = signal) | SharpFund |
| PRO SYSTEMS | Backtested system triggers | Situational bonus |
| MODEL PROJ. | Their model's projection | Vector Fund |
| TOP EXPERTS | Expert consensus | Reference only |
| BETS | Public ticket % | Contra Fund |
| $ | Public money % | Sharp + Contrarian |

**PRO Projections Columns:**
| Column | What It Shows | Fund Usage |
|--------|---------------|------------|
| OPEN | Opening line | Baseline |
| PRO LINE | Action Network model projection | Vector Fund |
| CONS. | Current consensus line | All funds |
| GRADE | A+ to F rating | Vector Fund |
| EDGE | % difference (projection vs market) | Vector Fund |
| BEST ODDS | Best available line | All funds |
| BET % | Public ticket percentage | Contra Fund |
| MONEY % | Public money percentage | SharpFund |

**Public Betting & Money % Page:**
| Column | What It Shows | Fund Usage |
|--------|---------------|------------|
| % OF BETS | Ticket percentage | Contra Fund |
| % OF MONEY | Dollar percentage | SharpFund |
| DIFF | Money - Bets divergence | SharpFund (KEY!) |
| BETS | Total number of bets | Volume context |

**PRO Systems (Backtested Profitable Systems):**
| System | Record | Win % | ROI | Type |
|--------|--------|-------|-----|------|
| High Winds (PRO) | 613-455-10 | 57% | +11% | Weather/Unders |
| Divisional Unders (PRO) | 188-136-5 | 58% | +15% | Situational |
| Road Dog Low Total (PRO) | 394-287-16 | 58% | +13% | Situational |
| Contrarian Unders Winning Teams | 1016-932-181 | 52% | +6% | Contrarian |
| Reverse Line Movement Unders | 479-392-8 | 55% | +7% | Sharp |

## 2.2 Odds API (Supplementary) - Already Have

**Primary Uses:**
| Use Case | Why Needed | Credits |
|----------|------------|---------|
| Player props | Action Pro props limited | 4 per game |
| Line shopping verification | Confirm "best odds" | 3 per sport |
| CLV tracking | Record closing lines | 3 per sport |
| Deep prop analysis | All prop types, all players | 4+ per game |

**API Cost Per Call:**
- Main lines (3 markets × 1 region) = 3 credits
- Props per game (4 prop types) = 4 credits per game
- Budget: 20,000 credits/month = ~667/day

**Monthly Usage Estimate:**
- Daily main lines (5 sports × 2 checks) = 30 credits/day
- Props (15 games × 4 credits) = 60 credits/day
- Total: ~90/day × 30 = 2,700/month (14% of budget)

## 2.3 Web Search (Situational Research)

**What We Get:**
| Data Point | Source | Used By |
|------------|--------|---------|
| Team offensive/defensive ratings | TeamRankings, NBA.com | Quant verification |
| Player season averages | ESPN, Basketball-Reference | Props |
| Injury reports | ESPN, team sites | All funds |
| Rest/schedule data | ESPN, NBA.com | Situational |
| Weather (outdoor games) | Weather.com | Situational |
| Recent matchup history | ESPN | Situational |
| Revenge narratives | Sports news | Situational |
| Travel/timezone data | Calculate from schedule | Situational |

## 2.4 Apify - NOT NEEDED

Action Network Pro provides all public betting data.
Apify only needed if Action Network goes down.

---

# SECTION 3: FUND-BY-FUND ARCHITECTURE

**Remember: Each fund operates INDEPENDENTLY. Conflicting positions are expected and intentional.**

---

## FUND 1: VECTOR FUND

### 3.1.1 Philosophy
Pure mathematical edge detection. We use Action Network's model projections as a baseline and verify with our own analysis. Bet when model edge is significant and we agree with the direction.

**Props belong to Vector Fund** - Action Network Pro has prop projections with calculated edges. All prop bets are placed through VectorFund.

### 3.1.2 Data Requirements (Action Network Pro)

| Data | Action Network Location | Required |
|------|-------------------------|----------|
| Opening Line | PRO Projections → OPEN | Yes |
| Current Line | PRO Projections → CONS | Yes |
| Model Projection | PRO Projections → PRO LINE | Yes |
| Model Edge % | PRO Projections → EDGE | Yes |
| Model Grade | PRO Projections → GRADE | Yes |
| Best Available Odds | PRO Projections → BEST ODDS | Yes |
| Public Bet % | PRO Projections → BET % | Context |
| Public Money % | PRO Projections → MONEY % | Context |

**Supplementary (Web Search):**
| Data | Source | Purpose |
|------|--------|---------|
| Team stats | TeamRankings, NBA.com | Verify projection |
| Key injuries | ESPN | Adjust projection |
| Rest/schedule | ESPN | Factor into edge |

### 3.1.3 The Quant Formula (Simplified with Action Network)

**Step 1: Read Action Network PRO Projections**
```
PRO_LINE = Action Network's model projection
CONS = Current consensus line
EDGE = Action Network's calculated edge %
GRADE = A+ to F rating
```

**Step 2: Evaluate the Edge**
```
Action Network recommends: "at least Grade B or +3.5% Edge"

Edge Tiers:
- EDGE < 3%: No significant edge → PASS
- EDGE 3-5%: Moderate edge → Consider
- EDGE 5-8%: Good edge → Bet
- EDGE > 8%: Strong edge → Max conviction
```

**Step 3: Cross-Reference with Our Analysis**
```
Check via web search:
- Are there injuries Action Network might have missed?
- Is rest/schedule favorable?
- Does our quick projection agree with PRO LINE?

Agreement_Score:
- Action Network EDGE positive AND our analysis agrees → High conviction
- Action Network EDGE positive BUT our analysis has concerns → Medium conviction
- Action Network EDGE positive BUT our analysis disagrees → Low conviction or PASS
```

**Step 4: Final Decision**
```
Quant_Bet = TRUE when:
- GRADE >= B OR EDGE >= 3.5%
- No conflicting injury/situational factors
- Our analysis confirms direction
```

### 3.1.4 Vector Fund Decision Matrix (Main Lines)

| Action Network Data | Our Analysis | Action | Units |
|---------------------|--------------|--------|-------|
| EDGE < 3%, Grade C- or below | Any | PASS | 0 |
| EDGE 3-5%, Grade C+ | Agrees | Consider | 0.5-1.0 |
| EDGE 3-5%, Grade B- to B | Agrees | Bet | 1.0-1.5 |
| EDGE 5-8%, Grade B+ or above | Agrees | Strong Bet | 1.5-2.0 |
| EDGE > 8%, Grade A- or above | Agrees | Max Conviction | 2.0-3.0 |
| Any positive EDGE | Disagrees | PASS or Reduce | 0-0.5 |

**Example - Wizards +10.5 (from screenshot):**
- PRO LINE: +7.1
- CONS: +10.5
- GRADE: A-
- EDGE: +8.5%
- Decision: Max conviction (2.0-3.0 units) if our analysis confirms

### 3.1.5 Vector Fund Props Analysis

**Props belong to VectorFund.** Action Network Pro has prop projections with EDGE calculations.

**Action Network Prop Projections:**
- Navigate to Prop Projections page
- Use Cmd+A copy/paste to capture data
- Look for EDGE column on player props
- Example: Drummond Over 10.5 pts, Projection 14.43, Edge +28.6%

**Props Decision Matrix (Higher Thresholds Due to Variance):**

| AN Edge % | Action | Units |
|-----------|--------|-------|
| < 12% | PASS | 0 |
| 12-20% | Consider | 0.5-1.0 |
| 20-30% | Bet | 1.0-1.5 |
| 30%+ | Strong | 1.5-2.0 (cap) |

**When Action Network doesn't have prop data, use Odds API + Web Search:**
```
Player_Projection = (Season_Avg × 0.5) + (Last_5_Avg × 0.3) + (Matchup_Adj × 0.2)

Matchup_Adj:
- vs Bottom 5 defense: +15% to projection
- vs Bottom 10 defense: +10%
- vs Top 10 defense: -10%
- vs Top 5 defense: -15%

Prop_Edge = (Player_Projection - Prop_Line) / Prop_Line
```

**Props Caution:**
- Props have higher variance than main lines
- Max 2.0 units on any single prop (capped)
- Don't overload on props from same game (correlated)
- Injury news can destroy prop value (monitor)

---

## FUND 2: CONTRA FUND

### 3.2.1 Philosophy
The betting public is systematically biased. They overbet favorites, overs, popular teams, and primetime games. When public betting reaches extreme levels, historically profitable to fade.

### 3.2.2 Sport-Specific Contrarian Thresholds

| Sport | Trigger Threshold | Why Different |
|-------|-------------------|---------------|
| NFL/NCAAF | 65%+ public | Most public money, lower threshold needed |
| NBA | 70%+ public | Standard threshold |
| NCAAB/NHL | 75%+ public | Less public attention, need more extreme |

### 3.2.3 Data Requirements (Action Network Pro)

| Data | Action Network Location | Required |
|------|-------------------------|----------|
| Public Ticket % | Public Betting → % OF BETS | Yes |
| Public Money % | Public Betting → % OF MONEY | Yes |
| Money-Ticket Divergence | Public Betting → DIFF | Yes |
| Current Line | PRO Report → BEST ODDS | Yes |
| Opening Line | PRO Report → OPEN | Context |

**Quick Find: "Most Lopsided Bets" section on PRO Dashboard**
- Shows games with extreme public % instantly
- Example from screenshot: 98% CARK, 96% LEH, 91% UNT

### 3.2.4 The Contrarian Formula (Simplified with Action Network)

**Step 1: Find Lopsided Games (Sport-Specific)**
```
Use Action Network "Most Lopsided Bets" OR scan Public Betting page

NFL/NCAAF Triggers:
- 65-70% public: Moderate lean → Consider fade
- 70-75% public: Heavy lean → Fade
- 75%+ public: Extreme lean → Strong fade

NBA Triggers:
- 70-75% public: Moderate lean → Consider fade
- 75-80% public: Heavy lean → Fade
- 80%+ public: Extreme lean → Strong fade

NCAAB/NHL Triggers:
- 75-80% public: Moderate lean → Consider fade
- 80-85% public: Heavy lean → Fade
- 85%+ public: Extreme lean → Strong fade
```

**Step 2: Check Money Divergence (DIFF column)**
```
DIFF = MONEY % - BET %

Interpretation:
- DIFF negative (money < bets): Sharp money on OTHER side → STRONG signal
- DIFF positive (money > bets): Money confirms public → WEAKER signal
- DIFF near zero: Neutral → Standard fade

Example from screenshot - Cowboys:
- 69% bets on Cowboys
- 86% money on Cowboys
- DIFF = +17% (money CONFIRMS public)
- Weaker contrarian signal on Giants
```

**Step 3: Contrarian Score Formula**
```
Contrarian_Score = (BET% - Threshold) + (DIFF_Bonus)

DIFF_Bonus:
- If DIFF < 0 (money diverges): Add |DIFF| × 2
- If DIFF > 0 (money confirms): Subtract DIFF × 1

Examples (NFL with 65% threshold):
- 80% bets, -15% DIFF: Score = 15 + 30 = 45 (STRONG)
- 75% bets, +5% DIFF: Score = 10 - 5 = 5 (WEAK)
- 70% bets, -10% DIFF: Score = 5 + 20 = 25 (GOOD)
```

### 3.2.5 Contra Fund Decision Matrix

| BET % (above threshold) | DIFF | Signal Strength | Units |
|-------------------------|------|-----------------|-------|
| 0-5% above | Positive (confirms) | Weak | 0.5-1.0 |
| 0-5% above | Negative (diverges) | Moderate | 1.0-1.5 |
| 5-10% above | Positive (confirms) | Moderate | 1.0-1.5 |
| 5-10% above | Negative (diverges) | Strong | 1.5-2.0 |
| 10%+ above | Any | Strong/Max | 2.0-3.0 |

### 3.2.6 Contrarian Boosts & Cautions

**Add conviction (+0.5 units) when:**
- Primetime game (public loves overs/favorites)
- Popular team is public side (Cowboys, Lakers, etc.)
- Team on winning streak (recency bias)
- Large spread (public loves big favorites)

**Reduce or pass when:**
- Sharp Action indicator lit on public side → PASS
- PRO Systems triggered on public side → Caution
- Public side has genuine situational edge → Reduce

---

## FUND 3: SHARP FUND

### 3.3.1 Philosophy
Professional bettors have better information and models. They move lines. Action Network Pro identifies sharp money for us via indicators. We follow the smart money.

### 3.3.2 Data Requirements (Action Network Pro)

| Data | Action Network Location | Required |
|------|-------------------------|----------|
| Sharp Action Indicator | PRO Report → SHARP ACTION (blue = signal) | YES |
| Big Money Indicator | PRO Report → BIG MONEY (blue = signal) | YES |
| Opening Line | PRO Report → OPEN | Yes |
| Current Line | PRO Report → BEST ODDS | Yes |
| Public Ticket % | PRO Report → BETS | Yes |
| Public Money % | PRO Report → $ | Yes |
| Money-Ticket Divergence | Public Betting → DIFF | Yes |

**Important: Click each game row in PRO Report to see popup with signal explanations**

### 3.3.3 Sharp Signal Detection (Simplified with Action Network)

**Signal 1: Action Network Sharp Action Indicator**
```
SHARP_ACTION = Blue indicator lit in PRO Report

This is Action Network's pre-calculated sharp money detection.
When lit, professional money has been identified on that side.
```

**Signal 2: Action Network Big Money Indicator**
```
BIG_MONEY = Blue indicator lit in PRO Report

Large dollar amounts coming in on one side.
Often correlates with sharp action.
```

**Signal 3: Money vs Ticket Divergence (DIFF)**
```
DIFF = MONEY % - BET %

Sharp Signal when:
- BET % on Side A is 65%+
- BUT MONEY % on Side A is lower (negative DIFF)
- Sharps are betting bigger on Side B

Example from screenshots:
- Clippers: 26% bets, 42% money
- DIFF on Clippers: +16%
- Sharps putting bigger bets on Clippers despite public on Lakers
```

**Signal 4: Reverse Line Movement (RLM)**
```
RLM = Line moves OPPOSITE of public betting

Detect by comparing:
- OPEN line vs Current line (CONS/BEST ODDS)
- Direction of public betting

If public is 70% on Team A but line moved toward Team B:
- Sharp money on Team B moved the line
- RLM confirmed
```

### 3.3.4 The Sharp Score Formula

```
Sharp_Score =
  (AN_Sharp_Action × 3) +     // 3 points if lit
  (AN_BigMoney × 2) +         // 2 points if lit
  (DIFF_Points) +             // 0-3 points based on divergence
  (RLM_Points)                // 0-2 points if detected

DIFF_Points (when DIFF favors opposite of public):
- |DIFF| < 5%: 0 points
- |DIFF| 5-10%: 1 point
- |DIFF| 10-15%: 2 points
- |DIFF| 15%+: 3 points

RLM_Points:
- No RLM: 0 points
- Weak RLM (0.5-1 point move): 1 point
- Strong RLM (1+ point move): 2 points
```

### 3.3.5 SharpFund Decision Matrix

| Sharp Score | Signal Quality | Units |
|-------------|----------------|-------|
| 0-2 | No sharp signal | PASS |
| 3-4 | Weak signal (maybe AN Sharp OR divergence) | 0.5-1.0 |
| 5-6 | Moderate (AN Sharp + some divergence) | 1.0-1.5 |
| 7-8 | Strong (AN Sharp + Big Money + divergence) | 1.5-2.0 |
| 9+ | Very strong (all signals aligned) | 2.0-3.0 |

### 3.3.6 SharpFund Examples (From Screenshots)

**Example 1: Clippers +6.5 (Strong Signal)**
- SHARP ACTION: ✓ Lit (blue)
- BIG MONEY: ✓ Lit (blue)
- BET %: 26% on Clippers (public on Lakers)
- MONEY %: 42% on Clippers
- DIFF: +16% (money diverging toward Clippers)
- Line Move: Opened -1.5, now +6.5 (massive move)

**Sharp Score:**
- AN Sharp: 3 points
- AN Big Money: 2 points
- DIFF (16%): 3 points
- RLM: 2 points (massive move opposite public)
- **Total: 10 → MAX CONVICTION BET on Clippers +6.5**

**Example 2: Wizards +10.5 (Moderate Signal)**
- SHARP ACTION: ✓ Lit
- BIG MONEY: Not lit
- BET %: 34% on Wizards
- MONEY %: 36% on Wizards
- DIFF: +2% (minimal divergence)

**Sharp Score:**
- AN Sharp: 3 points
- AN Big Money: 0 points
- DIFF (2%): 0 points
- RLM: 1 point (line moved from +9.5 to +10.5)
- **Total: 4 → CONSIDER BET (0.5-1.0 units)**

**Example 3: Hawks -10.5 (No Signal)**
- SHARP ACTION: Not lit
- BIG MONEY: Not lit
- BET %: 66% on Hawks
- MONEY %: 64% on Hawks
- DIFF: -2% (money and bets aligned)

**Sharp Score:**
- AN Sharp: 0 points
- AN Big Money: 0 points
- DIFF: 0 points
- RLM: 0 points (line moved WITH public)
- **Total: 0 → PASS**

---

## FUND 4: CATALYST FUND

### 3.4.1 Philosophy
Certain game situations have historically been mispriced by the market. Action Network's PRO Systems identify some of these (High Winds, Road Dog Low Total, etc.). We add our own situational research for edges they don't capture.

### 3.4.2 Data Requirements

**From Action Network Pro:**
| Data | Location | Usage |
|------|----------|-------|
| PRO Systems Triggers | PRO Report → PRO SYSTEMS | Backtested situations |
| Current Line | PRO Report → BEST ODDS | Bet placement |
| My Systems | Dashboard → My Systems | Active triggers |

**PRO Systems to Follow (Documented Winners):**
| System | Record | Win % | ROI |
|--------|--------|-------|-----|
| High Winds (PRO) | 613-455-10 | 57% | +11% |
| Divisional Unders (PRO) | 188-136-5 | 58% | +15% |
| Road Dog Low Total (PRO) | 394-287-16 | 58% | +13% |
| Reverse Line Movement Unders | 479-392-8 | 55% | +7% |

**From Web Search (Situations AN doesn't cover):**
| Data | Source | Required |
|------|--------|----------|
| Team schedule (rest days) | ESPN, NBA.com | Yes |
| Travel information | Calculate from schedule | Yes |
| Previous matchup results | ESPN | For revenge |
| Playoff/standings context | ESPN standings | For motivation |
| Weather forecast | Weather.com | For outdoor |
| Injury report | ESPN, team sites | Yes |

### 3.4.3 Evidence-Based Situation Tiers

**TIER 1: PROVEN EDGES (Full Points)**
These situations have documented, backtested evidence of profitability.

| Situation | Points | Evidence |
|-----------|--------|----------|
| 2+ days rest vs B2B | +3 | Documented in NBA betting research |
| PRO Systems trigger (High Winds, etc.) | +3 | 55-58% win rate, 10%+ ROI |
| Cross-country travel (3+ time zones) | +2 | For home team |
| Off bye week (NFL) | +2 | Rest + preparation edge |
| Home underdog (NFL) | +2 | Historically profitable |

**TIER 2: LIKELY EDGES (×0.75 multiplier)**
Strong logic and some evidence, but less documented.

| Situation | Base Points | Adjusted |
|-----------|-------------|----------|
| 3rd road game in 4 nights | 3 | 2.25 |
| Altitude game (Denver, Utah) | 2 | 1.5 |
| Divisional underdog | 2 | 1.5 |
| Playoff implications for one team only | 2 | 1.5 |
| Short week (Thursday game) | 2 | 1.5 |

**TIER 3: NARRATIVE EDGES (×0.50 multiplier)**
Logical but less proven. May be priced in or overrated.

| Situation | Base Points | Adjusted |
|-----------|-------------|----------|
| Revenge game (lost by 15+ last meeting) | 3 | 1.5 |
| Facing former team (star traded) | 2 | 1.0 |
| Letdown spot (after big win) | 2 | 1.0 |
| Lookahead spot (big game next) | 2 | 1.0 |
| Sandwich game (between marquee games) | 2 | 1.0 |

**WEATHER (Outdoor Games - Tier 1 Proven):**
| Situation | Points | Description |
|-----------|--------|-------------|
| Wind 15+ mph | +2 (for under) | Affects passing/kicking |
| Wind 20+ mph | +3 (for under) | Strong wind impact |
| Cold (<32°F) | +1 (for under) | Ball handling affected |
| Rain/snow | +2 (for under) | Slippery conditions |

### 3.4.4 The Situational Score Formula

```
Situational_Score = Sum of all applicable situation points (with tier multipliers)

For Spreads:
- Positive points for Team A = Bet Team A spread

For Totals:
- Weather/pace points = Bet Under
- High-scoring teams, bad defense = Bet Over
```

### 3.4.5 Catalyst Fund Decision Matrix

| Situational Score | Quality | Units |
|-------------------|---------|-------|
| 0-1.5 | No significant edge | PASS |
| 1.5-3 | Minor situational edge | 0.5-1.0 |
| 3-5 | Moderate situational edge | 1.0-1.5 |
| 5-7 | Strong situational edge | 1.5-2.0 |
| 7+ | Major situational edge | 2.0-3.0 |

### 3.4.6 Catalyst Fund Example

**Game: Celtics at Heat (Thursday)**

**Situation Analysis:**
- Celtics played last night (B2B): Tier 1 = +3 for Heat
- Heat have 2 days rest: (included above)
- Celtics traveled from Boston to Miami: Tier 1 = +2 for Heat
- Last meeting: Heat lost by 22: Tier 3 = +3 × 0.5 = +1.5 for Heat
- Heat fighting for playoff spot, Celtics locked in: Tier 2 = +2 × 0.75 = +1.5 for Heat

**Total Situational Score for Heat: 3 + 2 + 1.5 + 1.5 = 8 points**

**Action: BET HEAT +3.5, Max units (2.0-3.0)**

---

# SECTION 4: PLAYER PROPS ARCHITECTURE

## 4.1 Props Strategy Overview

**Props belong to VectorFund.** Action Network Pro provides prop projections with calculated edges.

Props are analyzed using the same Quant methodology:
- Compare projection to line
- Calculate edge %
- Apply higher thresholds (props have more variance)

## 4.2 Props Data Requirements

| Data | Source | Method |
|------|--------|--------|
| AN Prop Projections | Action Network Pro | Cmd+A copy/paste |
| Prop lines (all books) | Odds API | API call |
| Player season averages | Web Search (ESPN, Basketball-Ref) | Research |
| Player last 5-10 games | Web Search | Research |
| Matchup defensive rankings | Web Search (TeamRankings) | Research |
| Injury impact (usage changes) | Web Search | Research |

## 4.3 Props Decision Matrix (Action Network Edge)

| AN Edge % | Action | Units |
|-----------|--------|-------|
| < 12% | PASS | 0 |
| 12-20% | Consider | 0.5-1.0 |
| 20-30% | Bet | 1.0-1.5 |
| 30%+ | Strong | 1.5-2.0 (cap) |

## 4.4 Manual Quant Props Formula

When Action Network doesn't have prop data:

```
Base_Projection = (Season_Avg × 0.5) + (Last_5_Avg × 0.3) + (Last_3_Avg × 0.2)

Matchup_Multiplier:
- vs Bottom 5 defense at stat: 1.15
- vs Bottom 10 defense: 1.10
- vs Average defense: 1.00
- vs Top 10 defense: 0.90
- vs Top 5 defense: 0.85

Minutes_Adjustment:
If expected minutes differ from average:
Adjusted_Projection = Base_Projection × (Expected_Minutes / Average_Minutes)

Final_Projection = Base_Projection × Matchup_Multiplier × Minutes_Adjustment

Edge = (Final_Projection - Prop_Line) / Prop_Line
```

## 4.5 Props Caution

- Props have higher variance than main lines
- Max 2.0 units on any single prop (capped)
- Don't overload on props from same game (correlated)
- Injury news can destroy prop value (monitor)

---

# SECTION 5: COMPLETE WEEKLY SCHEDULE

## 5.1 Weekly Overview (Simplified with Action Network Pro)

| Day | Primary Activity | Sports Focus | Screenshots Needed |
|-----|------------------|--------------|-------------------|
| Sunday PM | NFL lines open for next week | NFL, NCAAF | Optional preview |
| Monday AM | Full NFL/NCAAF analysis | NFL, NCAAF | 6 (3 per sport) |
| Monday PM | NBA/NCAAB/NHL daily | NBA, NCAAB, NHL | 9 (3 per sport) |
| Tuesday PM | NBA/NCAAB/NHL daily | NBA, NCAAB, NHL | 9 |
| Wednesday AM | NFL mid-week check | NFL | 3 |
| Wednesday PM | NBA/NCAAB/NHL daily | NBA, NCAAB, NHL | 9 |
| Thursday PM | TNF + daily sports | NFL, NBA, NCAAB, NHL | 12 |
| Friday PM | NBA/NCAAB/NHL daily | NBA, NCAAB, NHL | 9 |
| Saturday AM | Final NFL/NCAAF check | NFL, NCAAF | 6 |
| Saturday PM | NCAAF games + daily | NCAAF, NBA, NCAAB, NHL | 12 |
| Sunday AM | NFL final confirmation | NFL | 3 |

**Total weekly screenshots: ~70-80**

## 5.2 What to Capture (Per Sport)

| Page | Method | Data Captured |
|------|--------|---------------|
| PRO Projections | Screenshot | OPEN, PRO LINE, CONS, GRADE, EDGE, BET %, MONEY % |
| Public Betting | Screenshot | % OF BETS, % OF MONEY, DIFF |
| PRO Report | Screenshot EACH GAME POPUP | Sharp Action, Big Money explanations |
| Prop Projections | Cmd+A copy/paste | Player props with edges |

## 5.3 Daily Schedule Detail

### MONDAY (NFL Primary + Daily Sports)

**Morning (9-10 AM ET) - NFL/NCAAF Analysis:**

| Task | Time | Details |
|------|------|---------|
| Open Action Network Pro | 9:00 AM | Select NFL |
| Screenshot PRO Projections | 9:02 AM | All NFL games |
| Screenshot Public Betting | 9:04 AM | All NFL games |
| Screenshot PRO Report game popups | 9:06 AM | Games with signals |
| Repeat for NCAAF | 9:10 AM | Same pages |
| Paste to Claude Code | 9:15 AM | "Monday NFL/NCAAF analysis" |
| Receive picks | 9:30 AM | Full 4-fund analysis |
| Place early-week NFL bets | 10:00 AM | Quant, Sharp, Situational |

**Afternoon (2-3 PM ET) - Daily Sports:**

| Task | Time | Details |
|------|------|---------|
| Screenshot NBA (3 pages) | 2:00 PM | PRO Projections, Public Betting, PRO Report popups |
| Screenshot NCAAB (3 pages) | 2:10 PM | Same |
| Screenshot NHL (3 pages) | 2:20 PM | Same |
| Cmd+A Prop Projections | 2:25 PM | Copy/paste props data |
| Paste to Claude Code | 2:30 PM | "Monday daily sports analysis" |
| Receive picks | 2:45 PM | Full 4-fund analysis |
| Place bets | 3:00 PM | Before games |

### TUESDAY - FRIDAY (Daily Sports Only)

**Afternoon (2-3 PM ET):**

| Task | Time | Details |
|------|------|---------|
| Screenshot NBA (3 pages) | 2:00 PM | All pages |
| Screenshot NCAAB (3 pages) | 2:10 PM | All pages |
| Screenshot NHL (3 pages) | 2:20 PM | All pages |
| Cmd+A Prop Projections | 2:25 PM | Copy/paste props data |
| Paste to Claude Code | 2:30 PM | "Daily analysis" |
| Receive picks | 2:45 PM | Full 4-fund analysis |
| Place bets | 3:00 PM | Before games |

**Wednesday Additional (NFL Mid-Week Check):**

| Task | Time | Details |
|------|------|---------|
| Screenshot NFL Public Betting | 10:00 AM | Check Contrarian triggers |
| Screenshot NFL PRO Report popups | 10:05 AM | Check new Sharp signals |
| Paste to Claude Code | 10:10 AM | "NFL Wednesday check" |
| Place additional bets | 10:30 AM | Contrarian, new Sharp signals |

### SATURDAY (NCAAF Heavy + Daily)

**Morning (10-11 AM ET) - Final NFL/NCAAF:**

| Task | Time | Details |
|------|------|---------|
| Screenshot NFL final (3 pages) | 10:00 AM | Final confirmation |
| Screenshot NCAAF final (3 pages) | 10:15 AM | Saturday games |
| Paste to Claude Code | 10:30 AM | "Saturday final check" |
| Confirm positions | 10:45 AM | Any adjustments |

**Afternoon (2-3 PM ET) - Daily Sports:**

| Task | Time | Details |
|------|------|---------|
| Screenshot NCAAB (3 pages) | 2:00 PM | Saturday slate |
| Screenshot NBA (3 pages) | 2:10 PM | If games |
| Screenshot NHL (3 pages) | 2:20 PM | If games |
| Paste to Claude Code | 2:30 PM | "Saturday daily" |
| Place bets | 3:00 PM | Before games |

### SUNDAY (NFL Game Day)

**Morning (9-10 AM ET):**

| Task | Time | Details |
|------|------|---------|
| Screenshot NFL final (3 pages) | 9:00 AM | Final check |
| Paste to Claude Code | 9:15 AM | "NFL Sunday final" |
| Confirm all NFL bets | 9:30 AM | Last adjustments |

**Evening (after SNF, ~11 PM ET):**

| Task | Time | Details |
|------|------|---------|
| Record results | 11:00 PM | Update bets.json |
| Optional: Preview next week lines | 11:30 PM | Lines just opened |

---

# SECTION 6: SCREENSHOT REQUIREMENTS

## 6.1 Data Collection Methods by Page

| Page | Collection Method | Notes |
|------|-------------------|-------|
| PRO Projections | Screenshot | Full page with all games |
| Public Betting & Money % | Screenshot | Make sure DIFF column visible |
| PRO Report | Screenshot EACH GAME POPUP | Click game row for signal details |
| Prop Projections | Cmd+A copy/paste | Text works well for props |

## 6.2 Daily Screenshot Count

| Day | Session | Screenshots | Sports |
|-----|---------|-------------|--------|
| Monday AM | NFL Analysis | 6+ | NFL (3) + NCAAF (3) + game popups |
| Monday PM | Daily Sports | 9+ | NBA (3) + NCAAB (3) + NHL (3) + popups |
| Tuesday PM | Daily Sports | 9+ | NBA + NCAAB + NHL |
| Wednesday AM | NFL Check | 3+ | NFL only |
| Wednesday PM | Daily Sports | 9+ | NBA + NCAAB + NHL |
| Thursday PM | Daily Sports | 9+ | NBA + NCAAB + NHL |
| Friday PM | Daily Sports | 9+ | NBA + NCAAB + NHL |
| Saturday AM | Final Check | 6+ | NFL + NCAAF |
| Saturday PM | Daily Sports | 9+ | NBA + NCAAB + NHL |
| Sunday AM | NFL Final | 3+ | NFL only |

**Weekly total: ~70-80 screenshots**
**Per session: 3-9 screenshots (takes 2-5 minutes)**

## 6.3 How to Capture

**Method 1: Screenshot (Recommended for main pages)**
```
Mac: Cmd+Shift+4
- Drag to select each page section
- Paste directly into Claude Code (Cmd+V)
```

**Method 2: Game Popup Screenshots (For PRO Report)**
```
- Click on each game row in PRO Report
- Popup shows Sharp Action / Big Money explanations
- Screenshot the popup
- Repeat for games with lit signals
```

**Method 3: Copy/Paste (For Props)**
```
- Navigate to Prop Projections page
- Cmd+A to select all
- Cmd+C to copy
- Paste into Claude Code
- Works well for tabular prop data
```

## 6.4 Screenshot Tips

1. **Zoom out** if needed to capture all games in one screenshot
2. **Make sure columns are visible** - don't cut off MONEY % or DIFF
3. **Include the sport header** so I know which sport I'm looking at
4. **Scroll down** for additional games if page is long
5. **Screenshot game popups** for games with Sharp/Big Money signals

---

# SECTION 7: STREAMLINED COMMANDS

## 7.1 Quick Commands

| Command | What Happens |
|---------|--------------|
| `"[Sport] analysis"` + data | Full 4-fund analysis for that sport |
| `"Results update"` | Web search game results, update bets.json |
| `"Daily summary"` | Today's P/L and pending bets |
| `"Weekly summary"` | Performance by fund for the week |
| `"Why did [pick] miss?"` | Post-game analysis of losing bet |
| `"Check [team] injury"` | Web search current injury status |
| `"CLV check"` | Compare bet lines to closing lines |

## 7.2 Example Prompts

**Morning NFL (Monday):**
```
NFL analysis
[paste screenshots + props data]
```

**Daily Sports (Afternoon):**
```
Daily analysis - NBA/NCAAB/NHL
[paste screenshots + props data]
```

**Mid-Week NFL (Wednesday):**
```
NFL Wednesday check - Contrarian and Sharp updates
[paste screenshots]
```

**Final Check (Saturday/Sunday):**
```
Final NFL confirmation
[paste screenshots]
```

**Results Update:**
```
Results update - update yesterday's bets
```

**Post-Game Analysis:**
```
Why did Celtics -5.5 miss?
```

## 7.3 What Claude Code Does

When you send data, I will:

**1. Read Action Network Data:**
- PRO LINE, EDGE, GRADE from Projections
- Sharp Action, Big Money from PRO Report popups
- BET %, MONEY %, DIFF from Public Betting

**2. Run Each Fund's Analysis:**

| Fund | What I Check | Trigger |
|------|--------------|---------|
| VectorFund | EDGE %, GRADE, Props edges | Grade B+ or Edge 3.5%+ (12%+ for props) |
| ContraFund | BET %, DIFF | Sport-specific thresholds |
| SharpFund | Sharp Action, Big Money, DIFF | Any signals lit |
| CatalystFund | PRO Systems + web search | Situation applies |

**3. Web Search for Situational:**
- Rest days, back-to-backs
- Travel/timezone factors
- Revenge games (Tier 3)
- Weather (outdoor games)
- Injuries

**4. Output Full Math for Every Pick** (see Section 7.4)

## 7.4 Output Format Examples

Every pick displays ALL math:

```
═══════════════════════════════════════════════════════════════
DAILY ANALYSIS - November 26, 2025
═══════════════════════════════════════════════════════════════

VECTOR FUND:
-----------
1. WIZARDS +10.5 @ -105 (DraftKings) - 2.5u

   ACTION NETWORK DATA:
   • PRO LINE: +7.1
   • CONSENSUS: +10.5
   • EDGE: +8.5%
   • GRADE: A-

   PROBABILITY ANALYSIS:
   • Implied Probability (market): 51.2% (at -105)
   • Estimated True Probability: 55.8% (based on +7.1 projection)
   • Edge: 55.8% - 51.2% = +4.6%

   EV CALCULATION:
   • Decimal Odds: 1.952
   • EV% = (0.558 × 1.952) - 1 = +8.9%

   KELLY SIZING:
   • Full Kelly: (0.952 × 0.558 - 0.442) / 0.952 = 9.4%
   • Quarter Kelly: 9.4% × 0.25 = 2.35% → 2.5 units

   REASONING: AN model projects Wizards as +7.1, getting +10.5 is 3.4 points
   of value. Grade A- indicates strong model confidence. No conflicting
   situational factors.

2. DRUMMOND OVER 10.5 PTS @ -130 - 1.5u

   ACTION NETWORK PROP DATA:
   • Projection: 14.43 points
   • Line: 10.5
   • EDGE: +28.6%

   PROBABILITY ANALYSIS:
   • Implied Probability: 56.5% (at -130)
   • Estimated True Probability: 72% (based on 14.43 projection)

   EV CALCULATION:
   • Decimal Odds: 1.769
   • EV% = (0.72 × 1.769) - 1 = +27.4%

   KELLY SIZING:
   • Full Kelly: 27.8%
   • Quarter Kelly: 6.95% → capped at 2.0u for props, using 1.5u

   REASONING: Massive edge on Drummond points. Projection well above line.

───────────────────────────────────────────────────────────────

CONTRA FUND:
----------------
1. GIANTS +3.5 @ -110 (FanDuel) - 1.0u

   PUBLIC BETTING DATA:
   • Public Bets: 69% on Cowboys
   • Public Money: 86% on Cowboys
   • DIFF: +17% (money confirms, weaker signal)
   • Threshold: 65% (NFL)

   CONTRARIAN SCORE:
   • Base: 69% - 65% = 4 points
   • DIFF Penalty: -17 × 1 = -17 points
   • ADJUSTED SCORE: -13 (normally weak, but...)

   ADDITIONAL FACTORS:
   • Popular team (Cowboys): +5 points
   • Primetime game: +5 points
   • FINAL SCORE: -3 → Weak signal, minimum sizing

   REASONING: Cowboys have heavy public AND money support. Normally too
   much confirmation, but Cowboys tax (popular team) adds value. Minimum
   sizing due to weak score.

───────────────────────────────────────────────────────────────

SHARP FUND:
-----------
1. CLIPPERS +6.5 @ -108 (Caesars) - 3.0u

   SHARP SIGNALS:
   • Sharp Action: ✓ LIT
   • Big Money: ✓ LIT
   • Line Move: -1.5 → +6.5 (8 point move!)

   PUBLIC DATA:
   • Public Bets: 26% on Clippers
   • Public Money: 42% on Clippers
   • DIFF: +16%

   SHARP SCORE CALCULATION:
   • AN Sharp Action: 3 points
   • AN Big Money: 2 points
   • DIFF (16%): 3 points
   • RLM (8 pt move opposite public): 2 points
   • TOTAL: 10 points → MAX CONVICTION

   REASONING: All sharp indicators firing. Line moved 8 points AWAY from
   public. Classic sharp money pattern. Maximum conviction play.

───────────────────────────────────────────────────────────────

CATALYST FUND:
-----------------
1. SAINTS +6 @ -110 (BetMGM) - 2.0u

   PRO SYSTEMS:
   • Road Dog Low Total After Bad Season (PRO): ✓ TRIGGERED
   • System Record: 394-287-16 (58% win, +13% ROI)

   SITUATIONAL FACTORS:
   • Tier 1: PRO System trigger = +3 points
   • Tier 1: Home underdog = +2 points
   • Tier 2: Divisional game = +2 × 0.75 = +1.5 points

   TOTAL SITUATIONAL SCORE: 6.5 points → Strong

   UNIT SIZING: 6.5 → 1.5-2.0 units (using 2.0)

   REASONING: PRO System with documented 13% ROI triggering. Additional
   situational factors confirm.

═══════════════════════════════════════════════════════════════

DAILY SUMMARY:
--------------
• Total Picks: 5
• Total Units: 10.0

FUND BREAKDOWN:
• VectorFund: 4.0u (2 picks: Wizards spread, Drummond prop)
• ContraFund: 1.0u (1 pick: Giants)
• SharpFund: 3.0u (1 pick: Clippers)
• CatalystFund: 2.0u (1 pick: Saints)

CONFLICTING POSITIONS: None today
(If funds had opposite sides, both would be listed with note)

═══════════════════════════════════════════════════════════════
```

---

# SECTION 8: TRACKING & PERFORMANCE

## 8.1 What Gets Recorded (Per Bet)

```json
{
  "id": 104,
  "date": "2025-11-26",
  "fund": "VectorFund",
  "sport": "NBA",
  "game": "Thunder @ Lakers",
  "betType": "spread",
  "pick": "Thunder -5.5",
  "odds": -108,
  "book": "DraftKings",
  "openingLine": -5.5,
  "betLine": -5.5,
  "closingLine": null,
  "stake": 1.5,
  "stakeAmount": 150,
  "reasoning": "Model projects Thunder by 8.2. Edge: +6.3%. AN Grade: B+",
  "quantEdge": 6.3,
  "contrarianScore": null,
  "sharpScore": null,
  "situationalScore": null,
  "result": "pending",
  "pnl": null,
  "clvCaptured": null
}
```

## 8.2 CLV Tracking (Closing Line Value)

After each game closes:
```
CLV = (Our_Bet_Line - Closing_Line) for spreads
CLV = (Our_Odds - Closing_Odds) for moneylines

If we bet Thunder -5.5 and it closed at -6.5:
CLV = 1 point of value captured (good!)

Long-term: If we consistently beat closing lines, we have edge
```

## 8.3 Fund Performance Metrics

Track for each fund:
- Win/Loss record
- Units won/lost
- ROI %
- CLV average
- By sport breakdown

---

# SECTION 9: RISK MANAGEMENT RULES

## 9.1 Hard Rules (Never Break)

1. **Max 3 units on any single bet**
2. **Max 6 units per fund per day**
3. **Max 24 units total per day (across all funds)**
4. **Never chase losses with bigger bets**
5. **Never bet without running the analysis**
6. **Always record every bet**
7. **Props capped at 2.0 units maximum**

## 9.2 Bankroll Checkpoints

| Fund Balance | Action |
|--------------|--------|
| $12,000+ | Increase unit to 1% of new balance |
| $10,000 | Standard unit ($100) |
| $8,000 | Reduce unit to $80, review strategy |
| $6,000 | Reduce unit to $60, pause and full review |
| $5,000 | Stop fund, complete strategy review |

## 9.3 Losing Streak Protocol

| Consecutive Losses | Action |
|--------------------|--------|
| 5 in a row (1 fund) | Review fund's recent picks |
| 10 in a row (1 fund) | Pause fund for 1 week, full review |
| 5 in a row (all funds) | Reduce all units by 50% |
| 10 in a row (all funds) | Pause all betting, complete review |

---

# SECTION 10: QUICK REFERENCE

## 10.1 Fund Decision Cheat Sheet

**DAILY TARGETS:**
- Target: 10-15u | Soft Max: 20u | Hard Max: 24u
- Per Fund: Target 3-4u, Max 6u
- 3u Bets: Max 2 per WEEK, requires 80+ conviction

**⚫️ VECTOR FUND (Model Edge):**
| Grade | Edge % | Units |
|-------|--------|-------|
| C+ | 3-4% | 0.5u |
| B- | 4-5% | 0.75u |
| B | 5-6% | 1.0u |
| B+ | 6-8% | 1.25u |
| A- | 8-10% | 1.5u |
| A | 10-15% | 2.0u |
| A+ | 15%+ | 2.5u (3u rare) |

**VECTOR PROPS:** 15%+ edge required, max 1u each

**🟢 SHARP FUND (Sharp Score):**
| Score | Signals | Units |
|-------|---------|-------|
| 2-3 | Sharp OR Big Money | 0.5u |
| 4-5 | Sharp AND Big Money | 1.0u |
| 6-7 | Both + DIFF 10-20% | 1.25u |
| 7-8 | Both + DIFF 20-30% | 1.5u |
| 8-9 | Both + DIFF 30%+ | 2.0u |
| 10+ | All + RLM + PRO Sys | 2.5u |

**🟠 CONTRA FUND (Fade Public):**
| Sport | Threshold | 80%+ Units |
|-------|-----------|------------|
| NFL/NCAAF | 65%+ | 2.0u |
| NBA | 70%+ | 2.0u |
| NCAAB/NHL | 75%+ | 2.0u |
*Blocked if Sharp/Big Money on public side*

**🟣 CATALYST FUND (Situation Score):**
| Score | Units |
|-------|-------|
| 1.5-2.5 | 0.5u |
| 2.5-4.0 | 1.0u |
| 4.0-5.5 | 1.25u |
| 5.5-7.0 | 1.5u |
| 7.0-8.5 | 2.0u |
| 8.5+ | 2.5u |

**CONVICTION SCORE THRESHOLDS:**
- 40+ = Include in card
- 60+ = Strong play
- 80+ = Top-tier (eligible for 2.5-3u)

**SLOW DAYS (No picks above 60 conviction):**
- Take 0-5u max
- It's okay to pass entirely
- Don't force action

## 10.2 Action Network Data Quick Guide

| What You Need | Where to Find It | Method |
|---------------|------------------|--------|
| Model edge | PRO Projections → EDGE | Screenshot |
| Model grade | PRO Projections → GRADE | Screenshot |
| Sharp signals | PRO Report → Game popup | Screenshot popup |
| Big money | PRO Report → Game popup | Screenshot popup |
| Public bets % | Public Betting → % OF BETS | Screenshot |
| Public money % | Public Betting → % OF MONEY | Screenshot |
| Money-ticket divergence | Public Betting → DIFF | Screenshot |
| Opening line | PRO Report → OPEN | Screenshot |
| Best odds | PRO Report → BEST ODDS | Screenshot |
| System triggers | My Systems / PRO Report | Screenshot |
| Prop projections | Prop Projections page | Cmd+A copy/paste |

## 10.3 Key Formulas

```
Implied % (negative odds): |Odds| / (|Odds| + 100)
Implied % (positive odds): 100 / (Odds + 100)

EV%: (Your_Probability × Decimal_Odds) - 1

Contrarian Score: (BET% - Threshold) + DIFF_Bonus
Sharp Score: (AN_Sharp × 3) + (AN_BigMoney × 2) + DIFF_Points + RLM_Points

Kelly%: (b × p - q) / b, use QUARTER Kelly
```

## 10.4 Situational Tier Multipliers

| Tier | Multiplier | Examples |
|------|------------|----------|
| Tier 1: Proven | ×1.0 (full) | Rest advantages, PRO Systems, 3+ timezone travel, bye weeks |
| Tier 2: Likely | ×0.75 | 3rd road game in 4 nights, altitude, divisional dog |
| Tier 3: Narrative | ×0.50 | Revenge games, lookahead, letdown, facing former team |

## 10.5 Timing Summary

| Sport | When to Analyze | When to Bet | Contrarian Threshold |
|-------|-----------------|-------------|---------------------|
| NFL | Monday AM | Monday | 65%+ |
| NFL | Wednesday AM | Wednesday | 65%+ |
| NCAAF | Monday AM | Monday/Saturday | 65%+ |
| NBA | 2-3 PM daily | 3 PM | 70%+ |
| NCAAB | 2-3 PM daily | 3 PM | 75%+ |
| NHL | 2-3 PM daily | 3 PM | 75%+ |

## 10.6 Daily Workflow Summary

```
1. Open Action Network Pro
2. Capture data:
   - Screenshot PRO Projections
   - Screenshot Public Betting
   - Screenshot PRO Report game popups (for signals)
   - Cmd+A Prop Projections
3. Paste into Claude Code
4. Say "[Sport] analysis"
5. Receive picks with FULL MATH
6. Place bets
7. Update results next day
```

---

*Document Version: 4.0 (Conviction Score System + Formulaic Unit Sizing)*
*Updated: November 29, 2025*
*Department of Gambling Hedge Fund Operations*

**Key Principles:**
- Each fund operates INDEPENDENTLY
- Conflicting positions are the hedge
- Props belong to VectorFund (15%+ edge, 1u max)
- Every pick shows ALL math including conviction score
- Picks COMPETE for limited daily budget (10-15u target)
- 3u bets are RARE (max 2 per week, 80+ conviction)

**Version 4.0 Changes:**
- Added fund-by-fund unit sizing matrices (Section 0.7)
- Added conviction score system for final selection (Section 0.8)
- Added Quarter Kelly requirement for 2u+ bets (Section 0.9)
- Added slow day guidance (Section 0.10)
- Daily target: 10-15u (not 24u)
- Picks must score 40+ conviction to make card

**Data Sources:**
- Primary: Action Network Pro ($14.99/month)
- Supplementary: Odds API (verification, CLV tracking)
- Research: Web search (situations, injuries)

# Department of Gambling - Betting Workflow

## WEEKLY BETTING SCHEDULE

### ADVANCE BETTING (NFL/NCAAF)
| Day | Action | Sports | Funds | Pick Type |
|-----|--------|--------|-------|-----------|
| Monday | Early week analysis - lines are softest | NFL, NCAAF | Vector, Sharp | ADVANCE |
| Wednesday | Contra check - public % now settled | NFL, NCAAF | Contra | ADVANCE |
| Saturday | Final adds if needed | NCAAF | Catalyst | DAILY |
| Sunday | Final adds if needed | NFL | Catalyst | DAILY |

### DAILY BETTING (NBA/NCAAB/NHL)
| Day | Action | Sports | Funds | Pick Type |
|-----|--------|--------|-------|-----------|
| Any day with games | Game day analysis before games start | NBA, NCAAB, NHL | All 4 funds | DAILY |

### RESULTS UPDATES
| When | Action |
|------|--------|
| Morning after games | Update previous day's results |

### SPORT-SPECIFIC RULES
| Sport | Default Timing | Why |
|-------|----------------|-----|
| NFL | Advance (Mon/Wed) | Beat line movement, sharps bet early |
| NCAAF | Advance (Mon/Wed) | Beat line movement |
| NBA | Game day | Injuries, rest, lineups |
| NCAAB | Game day | Need day-of info |
| NHL | Game day | Goalie confirmations |

### AUTO-DETECTION
When user provides screenshots, detect pick type by SPORT:
- NFL or NCAAF screenshots → Default to ADVANCE picks (unless it's game day)
- NBA, NCAAB, or NHL screenshots → Default to DAILY picks
- If game date is today → DAILY picks
- If game date is future → ADVANCE picks

**No need to ask - figure it out from the sport and dates.**

---

## ANALYSIS INPUT WORKFLOW (Claude Desktop → Claude Code)

### WHY TWO CLAUDES?
- **Claude Desktop:** Handles image processing (100+ screenshots)
- **Claude Code:** Runs 4-fund analysis on structured text data

### THE WORKFLOW

```
1. USER takes screenshots from Action Network
2. USER pastes screenshots to CLAUDE DESKTOP
3. CLAUDE DESKTOP summarizes data into structured text
4. USER pastes text summary to CLAUDE CODE (me)
5. CLAUDE CODE runs 4-fund analysis
6. CLAUDE CODE outputs picks with fund attribution
7. USER says "placed"
8. CLAUDE CODE saves to bets.json + generates Instagram
```

---

### CLAUDE DESKTOP SUMMARY PROMPT

**Copy/paste this to Claude Desktop when summarizing screenshots:**

```
Summarize these Action Network Pro screenshots into this format:

[SPORT] - [DATE]

SPREADS:
[Team] [Line] | Open [X] | PRO [X] | Grade [X] | Edge [X]% | Bet [X]% | Money [X]%

TOTALS:
[Game] O/U [X] | Open [X] | PRO [X] | Grade [X] | Edge [X]% | Bet [X]% | Money [X]%

SHARP SIGNALS:
[List any teams with Sharp Action ✓, Big Money ✓, or PRO Systems ✓ lit]

LOPSIDED (70%+):
[List any games with 70%+ on one side - Team | Bet% | Money% | Diff]

PROPS (if shown):
[Player] O/U [X] [stat]: Edge [X]%, Grade [X]
```

---

### MINIMAL PASTE TEMPLATE (What Claude Code Needs)

**Only paste paywalled Action Network data. Claude Code web searches for injuries, rest, weather.**

```
[SPORT] - [DATE]

SPREADS:
[Team] [Line] | Open [X] | PRO [X] | Grade [X] | Edge [X]% | Bet [X]% | Money [X]%

TOTALS:
[Game] O/U [X] | Open [X] | PRO [X] | Grade [X] | Edge [X]% | Bet [X]% | Money [X]%

SHARP SIGNALS:
[Team]: Sharp ✓, BigMoney ✓, PRO Systems ✓

LOPSIDED (70%+):
[Team] | Bet [X]% | Money [X]% | Diff [X]%

PROPS (optional):
[Player] O/U [X] [stat]: Edge [X]%, Grade [X]
```

**Example:**
```
NBA - Nov 30

SPREADS:
Thunder -5 | Open -5 | PRO -7.2 | Grade B+ | Edge 5.3% | Bet 45% | Money 52%
Celtics -8 | Open -8 | PRO -9.1 | Grade B | Edge 3.8% | Bet 62% | Money 58%
Heat +8 | Open +8 | PRO +9.1 | Grade B | Edge 3.8% | Bet 38% | Money 42%

TOTALS:
Lakers/Suns O225 | Open 223 | PRO 228.5 | Grade A- | Edge 8.2% | Bet 55% | Money 60%

SHARP SIGNALS:
Thunder: Sharp ✓, BigMoney ✓
Nets: Sharp ✓

LOPSIDED (70%+):
Knicks | Bet 71% | Money 68% | Diff -3%

PROPS:
Tatum O24.5 pts: Edge 22%, Grade A
Jokic O11.5 reb: Edge 18%, Grade B+
```

---

### DATA RESPONSIBILITY SPLIT

| You Paste (Paywalled) | I Web Search (Public) |
|-----------------------|-----------------------|
| PRO Line projections | Current injuries |
| Grade (A+ to F) | Rest/schedule (B2B, etc.) |
| Edge % | Travel situation |
| Sharp Action / Big Money | Weather (outdoor) |
| PRO Systems | Line verification (Odds API) |
| Bet % / Money % / Diff | Bye weeks, revenge games |
| Props edges | Recent form, matchups |

**You give me the numbers. I give you the context.**

---

### TRIGGER PHRASES

| User Says | What I Do |
|-----------|-----------|
| "NBA analysis" / "NFL analysis" / etc. | Run 4-fund analysis on pasted data |
| "picks" / "what do we like" | Same - analyze for picks |
| "run it" | Same - analyze for picks |
| Just paste the data | Ask "Ready to analyze this?" then proceed |

### DISCORD TRIGGERS (AUTOMATIC + MANUAL)

**AUTOMATIC - These happen automatically as part of the workflow:**

| Trigger | What Outputs (Automatic) |
|---------|-------------------------|
| **"placed"** | After saving bets → Output #all-picks messages + #consensus-plays (if any) |
| **"update results"** | After settling bets → Output #daily-performance message |

**MANUAL - Use these to re-generate Discord output:**

| User Says | What I Output |
|-----------|---------------|
| **"discord picks"** | #all-picks + #consensus-plays for today's bets (or specify date) |
| **"discord daily"** | #daily-performance for most recent settled day |
| **"discord weekly"** | #weekly-performance (Mon-Sun of last complete week) + #overall-standing |
| **"discord all"** | All of the above |

**Script for manual testing:**
```bash
npx tsx scripts/test-discord.ts picks [date]   # #all-picks + #consensus
npx tsx scripts/test-discord.ts daily [date]   # #daily-performance
npx tsx scripts/test-discord.ts weekly         # #weekly-performance
npx tsx scripts/test-discord.ts alltime        # #overall-standing
npx tsx scripts/test-discord.ts all [date]     # Everything
```

### MY ANALYSIS PROCESS

1. **Parse** the structured text data
2. **Web search** injuries, rest, travel, weather for each game
3. **Apply** fund criteria from ANALYSIS_PROMPT.md:
   - Vector: Grade/Edge thresholds
   - Sharp: Sharp Score calculation
   - Contra: Public % thresholds (blocked if Sharp lit)
   - Catalyst: Situational scoring (from my research)
4. **Calculate** conviction scores for each candidate
5. **Verify** lines via Odds API
6. **Output** using ANALYSIS_TEMPLATE.md format
7. **Wait** for "placed" to save bets

### REQUIRED FILES FOR ANALYSIS

| File | Purpose |
|------|---------|
| `ANALYSIS_PROMPT.md` | Fund criteria, thresholds, scoring |
| `ANALYSIS_TEMPLATE.md` | Output format template |
| `HEDGE_FUND_ARCHITECTURE.md` | Full strategy documentation |

**I read these before every analysis.**

---

## DATA VALIDATION RULES

**Before saving ANY bet, validate all fields match these exact values.**

### betType (ONLY these 4 values)
| Value | Use For |
|-------|---------|
| `"spread"` | Point spreads (NOT "spreads") |
| `"total"` | Over/unders (NOT "totals") |
| `"moneyline"` | Straight up wins |
| `"props"` | Player props |

### sport (ONLY these values)
| Value | League |
|-------|--------|
| `"NBA"` | Pro basketball |
| `"NFL"` | Pro football |
| `"NCAAB"` | College basketball |
| `"NCAAF"` | College football |
| `"NHL"` | Pro hockey |
| `"Soccer"` | Soccer/MLS |

### fund (ONLY these 4 values)
| Value | Fund |
|-------|------|
| `"VectorFund"` | Model-based edge |
| `"SharpFund"` | Sharp money indicators |
| `"ContraFund"` | Fade public/contrarian |
| `"CatalystFund"` | Situational plays |

### result (ONLY these 4 values)
| Value | When |
|-------|------|
| `"pending"` | Bet placed, game not finished |
| `"win"` | Bet won |
| `"loss"` | Bet lost |
| `"push"` | Bet pushed (tie) |

### DATE FIELDS (important distinction)

| Field | Meaning | Example |
|-------|---------|---------|
| `date` | **Game date** - when the game is played | "2025-12-08" (Sunday game) |
| `datePlaced` | **Placed date** - when bet was actually placed | "2025-12-02" (Monday when placed) |

**Example: NFL bet placed Monday for Sunday game**
```json
{
  "date": "2025-12-08",        // Sunday - game day
  "datePlaced": "2025-12-02",  // Monday - when you placed it
  "gameTime": "1:00 PM ET"
}
```

**Why both dates matter:**
- `date` = Used for P/L calculations, chart candles (when result counts)
- `datePlaced` = Used to track advance picks for Instagram posts

### REQUIRED FIELDS (every bet must have ALL of these)
```
id              - Sequential integer
date            - Game date "YYYY-MM-DD" (when game is played)
datePlaced      - Placed date "YYYY-MM-DD" (when bet was placed)
sport           - From list above
betType         - From list above
fund            - From list above
description     - The pick (e.g., "Lakers -3.5")
team            - Team/player name
opponent        - Opposing team
odds            - American odds (e.g., -110)
stake           - Units (e.g., 1.5)
result          - From list above
edge            - Edge % (e.g., 8.5)
expectedValue   - EV % (e.g., 4.2)
conviction      - Score 40-100
thesis          - Full analysis text
slug            - Auto-generated URL slug
```

### VALIDATION CHECKLIST (before saving)
- [ ] betType is exactly "spread", "total", "moneyline", or "props"
- [ ] sport is exactly "NBA", "NFL", "NCAAB", "NCAAF", "NHL", or "Soccer"
- [ ] fund is exactly "VectorFund", "SharpFund", "ContraFund", or "CatalystFund"
- [ ] date is game date in YYYY-MM-DD format
- [ ] datePlaced is today's date in YYYY-MM-DD format
- [ ] team AND opponent are both filled in
- [ ] edge, expectedValue, conviction are numbers
- [ ] thesis is full analysis (not just one sentence)
- [ ] slug is unique

**NEVER use plural forms: "spreads", "totals", "moneylines", "props" is OK**

---

## GIT PUSH RULES

### ⚠️ CRITICAL: NEVER AUTO-PUSH

**User has LIMITED monthly pushes. Claude NEVER pushes unless explicitly requested.**

| User Says | Claude Does | Git Push? |
|-----------|-------------|-----------|
| **"placed"** | Save to bets.json, generate social media content | ❌ NO |
| **"update results"** | Update bets.json, run sync script, generate social media | ❌ NO |
| **"status"** | Show pending bets, portfolio balance, fund breakdown | ❌ NO |
| **"push"** or **"deploy"** | Run git add, git commit, git push | ✅ YES |

### Push Triggers (ONLY these phrases)
- "push"
- "deploy"
- "push to website"
- "go live"
- "publish"

### After Making Changes, Always Say:
> "Changes saved locally. Ready to push when you say 'push'."

### Why This Matters
- Pending bets stay private until user publishes
- User controls website timing
- Limited pushes = push strategically

---

## QUICK REFERENCE - PENDING BETS SYSTEM

### When Bets Are Placed
User will say:
- "I placed these" + list of picks
- "Bets placed" + screenshot
- Just paste picks and say "placed"

**Claude's Job:**
1. Immediately save to `data/bets.json` with `"result": "pending"`
2. **Generate Discord messages** (see DISCORD OUTPUT below)

### Next Day - Updating Results
User says "update results" or "what hit?" or "check bets"

**Claude's Job:**
1. Find ALL pending bets in bets.json
2. Categorize by date:
   - `date < today` → SETTLE (game finished)
   - `date == today` → CHECK (might be in progress)
   - `date > today` → SKIP (future game)
3. Web search final scores for settleable games
4. Update results (win/loss/push, P/L, final score)
5. Run sync script to update portfolio, charts, metrics
6. Report using standard format (✅ SETTLED / ⏳ IN PROGRESS / 🔮 FUTURE)
7. **Generate Discord daily-performance message** (see DISCORD OUTPUT below)

**THE POINT:** User never re-tells what bets were placed. They're saved. Just say "update results" and Claude handles ALL pending bets automatically - settling past games, checking today's games, skipping future games.

---

## DISCORD OUTPUT (AUTOMATIC)

**CRITICAL: Claude ALWAYS outputs Discord messages automatically after these triggers.**

Discord messages are generated automatically as part of the workflow. See `DISCORD.md` for full format specs.

### After "placed" - AUTOMATICALLY Output These:

**#all-picks** - One message per bet with track records:
```
🏒 Panthers ML @ +105
SharpFund | NHL | 1u

📊 Track Record:
• SharpFund NHL: 19-10 (65.5%)
• NHL moneylines: 21-8 (72.4%)
• SharpFund Overall: 50-23 (68.5%)

💡 Defending champs getting plus money. Sharp Action + Big Money lit.
```

**#consensus-plays** - If 2+ funds on same pick (auto-detected):
```
🎯 Grizzlies +4.5 @ -110
SharpFund + VectorFund | NBA | Dec 15

📊 Consensus Record: 8-4 (66.7%)
Last 5: ✅ ✅ ❌ ✅ ✅

Two funds. Same side. Here's why.

⚫ VectorFund
Model projects +2.1. Getting 4.5 means embedded value.

🟢 SharpFund
42% tickets, 58% money. Sharps loading up.

➡️ Multiple signals aligned. We're in.
```

### After "update results" - AUTOMATICALLY Output This:

**#daily-performance**:
```
📅 DAY 42 | Dec 15, 2025

RESULTS
━━━━━━━━━━━━━━━━━━━━
✅ Panthers ML +105 → W (+1.05u)
❌ Dolphins U42.5 -110 → L (-1.50u)
✅ Grizzlies +4.5 -110 → W (+0.91u)

Today: 5-2 | +2.58u

PORTFOLIO
━━━━━━━━━━━━━━━━━━━━
💰 Balance: $45,686.34
📊 Net P/L: +$5,686.34
📈 ROI: +14.22%
🎯 Record: 171-116-2 (59.6%)
```

### Code Location:
- Functions: `lib/discord.ts`
- Test script: `scripts/test-discord.ts`
- Full spec: `DISCORD.md`

---

## WORKFLOW 1: Adding New Picks

When you give me picks for the day, I will:

### Step 1: Create Bet Objects

For each pick, I'll add to `data/bets.json`:

```json
{
  "id": [next sequential ID],
  "date": "2025-11-27",
  "sport": "NBA",
  "description": "Lakers -3.5",
  "betType": "spread",
  "odds": -110,
  "stake": 1.5,
  "team": "Los Angeles Lakers",
  "opponent": "Sacramento Kings",
  "gameTime": "10:00 PM ET",
  "result": "pending",
  "fund": "VectorFund",
  "edge": 8.5,
  "expectedValue": 4.2,
  "conviction": 72,
  "thesis": "Full analysis text from picks output - include all reasoning, matchup details, and key factors",
  "slug": "lakers-spread-vector-nov27-2025"
}
```

**Slug is auto-generated** using format: `team-bettype-fund-date`

### REQUIRED FIELDS FOR BET DETAIL PAGES:

| Field | Description | Example |
|-------|-------------|---------|
| `edge` | Edge % from analysis | 8.5 |
| `expectedValue` | EV % from analysis | 4.2 |
| `conviction` | Conviction score (40-100) | 72 |
| `thesis` | **FULL analysis text** - NOT just one sentence. Include all reasoning, stats, matchup details from the picks output | See below |

**THESIS MUST INCLUDE:**
- Edge calculation and source (model, sharp money, fade public, situational)
- Key stats supporting the pick
- Matchup factors
- Injury/rest considerations
- Any risk factors

**BAD thesis:** "A+ grade, 18.1% edge. Curry OUT."
**GOOD thesis:** "Vector model projects +8.5% edge on this spread. Warriors are 3-8 ATS as home favorites this season. Curry OUT tonight - Warriors 92-155 historically without him. Pelicans coming off rest, averaging +4.2 margin in second game of back-to-backs. Key: Murphy III questionable but expected to play."

### Key Fields to Capture:
- `edge`: Edge percentage from analysis
- `expectedValue`: Expected value percentage
- `conviction`: Conviction score (determines units)
- `odds`: American odds at time of bet
- `stake`: Units (1u = $100)
- `thesis`: **FULL reasoning** - not abbreviated

---

## WORKFLOW 2: Updating Results (BULLETPROOF LOGIC)

When you say **"update results"**, **"check bets"**, **"what hit?"**, or any variation:

### RESULTS UPDATE RULES

**Claude NEVER asks which date - processes ALL pending bets automatically**

### Step 1: Find ALL Pending Bets

```
Find all bets where result = "pending"
```

### Step 2: Categorize Each Bet by Date

```python
for each pending bet:
    if bet.date < today:
        # PAST = game finished → UPDATE IT
        category = "SETTLE"

    elif bet.date == today:
        # TODAY = might still be playing
        # Web search for "Final" confirmation
        category = "CHECK_IF_FINAL"

    else:  # bet.date > today
        # FUTURE = game hasn't happened
        category = "SKIP_FUTURE"
```

### Step 3: Process Each Category

**For PAST games (bet.date < today):**
- Web search for final score
- Update result (win/loss/push)
- Calculate profit/loss
- Always settles (game definitely finished)

**For TODAY's games (bet.date == today):**
- Web search for "[Team] vs [Team] final score [date]"
- If result shows "Final" → UPDATE
- If "in progress" or "halftime" or no result → SKIP (report as ⏳)

**For FUTURE games (bet.date > today):**
- SKIP automatically (report as 🔮)
- No web search needed

### Step 4: Search Queries by Bet Type

**For Spreads/Moneylines:**
```
"[Team A] vs [Team B] final score [Month Day Year]"
```

**For Totals:**
```
"[Team A] [Team B] final score total points [Month Day Year]"
```

**For Player Props:**
```
"[Player name] stats [Month Day Year]"
```

### Step 5: Update Settled Bets

For each settled bet, update in bets.json:

```json
{
  "result": "win" | "loss" | "push",
  "profit": [calculated based on odds and stake],
  "finalStat": "Final: LAL 112, SAC 108 (Won by 4)",
  "closingLine": -4.0,
  "clv": 50
}
```

### CLV Calculation:

**For Spreads:**
- CLV = (closingLine - betLine) × 100 cents
- Example: Bet Lakers -3.5, closed -4.0 → CLV = +50¢

**For Totals:**
- Overs: CLV = (closingLine - betLine) × 100 cents
- Unders: CLV = (betLine - closingLine) × 100 cents

### Step 6: Report Format (ALWAYS USE THIS)

```
════════════════════════════════════════════════════════════
RESULTS UPDATE
════════════════════════════════════════════════════════════

✅ SETTLED (X bets):
━━━━━━━━━━━━━━━━━━━━
[Sport]
✅ [Team] [Line]: WIN +$XX
❌ [Team] [Line]: LOSS -$XX

⏳ IN PROGRESS (X bets):
━━━━━━━━━━━━━━━━━━━━
[Team] [Line] - game still live

🔮 FUTURE (X bets):
━━━━━━━━━━━━━━━━━━━━
[Team] [Line] - game [date]

════════════════════════════════════════════════════════════
📊 Today's P/L: +$XXX | Record: X-X
════════════════════════════════════════════════════════════
```

### Step 7: Auto-Sync (AUTOMATIC)

**Immediately after updating bets.json**, run:
```bash
npx tsx scripts/sync-all-data.ts
```

This updates:
- portfolio.json (fund balances, records, P/L, ROI)
- chartData.json (OHLC candles)
- metrics.json (all stats)

### Step 8: Show Verification (AUTOMATIC)

Display DATA SYNC CHECK output with ✅/❌ checks

### Step 9: Generate Social Media (AUTOMATIC)

Generate DAILY REPORT slides (see SOCIAL MEDIA section)

---

### TYPICAL WORKFLOW EXAMPLES

**Example 1: Normal next-day update**
- Saturday: Bet on NBA/NCAAF games (date = 2025-11-29)
- Sunday morning: Say "update results"
- All Saturday bets have date < today → All get settled ✅

**Example 2: Mixed pending bets**
- Have NFL advance picks for next Sunday (date = 2025-12-08)
- Have NBA bets from last night (date = 2025-11-28)
- Say "update results"
- NBA bets (past) → SETTLED ✅
- NFL picks (future) → SKIPPED 🔮

**Example 3: Same-day partial update**
- Morning: Bet on 3 NBA games tonight (date = today)
- Night: 2 games finished, 1 still in 4th quarter
- Say "update results"
- 2 finished games → SETTLED ✅
- 1 in-progress game → SKIPPED ⏳

---

## WORKFLOW 3: Sources for Results

### Final Scores:
1. ESPN.com game pages
2. NBA.com / NFL.com / NHL.com official sites
3. Sports Reference (basketball-reference.com, pro-football-reference.com)

### Closing Lines:
1. Action Network (best for closing lines)
2. Covers.com
3. The Odds API historical data
4. Vegas Insider

### Player Props:
1. ESPN player game logs
2. StatMuse (great for natural language queries)
3. Basketball Reference / Pro Football Reference

---

## WORKFLOW 4: Daily Routine

### Morning (Pre-Game):
1. You provide picks with lines/odds
2. I add them to bets.json with `result: "pending"`
3. Confirm picks are saved

### Next Day (Post-Game):
1. You say "update results" or "check yesterday's bets"
2. I search for final scores and closing lines
3. Update each bet with results, CLV, finalStat
4. Update chartData.json, portfolio.json
5. Run metrics update script
6. Report summary

---

## Intent Recognition

Claude reads your INTENT, not exact phrases. Say it however you want:

| Your Intent | Examples | What Claude Does |
|-------------|----------|------------------|
| **Check status** | "what's happening" / "where are we at" / "status" / "how we doing" / "balances" | Show fund balances, pending bets, P/L |
| **Settle bets** | "update" / "results" / "check the bets" / "what hit" / "did we win" / "how'd we do" | Web search scores, settle pending bets, show results |
| **Record bets** | "placed" / "I bet" / "locked in" / "took these" / "put money on" | Save mentioned picks as pending in bets.json |
| **Get picks** | "analyze" / "picks" / "what do we like" / "run it" / "what's good today" | Run 4-fund analysis on screenshot folder |
| **Plan ahead** | "tomorrow" / "what's the plan" / "morning workflow" | Show steps for next session |

**You don't need exact commands. Just say what you mean.**

---

## Automatic Behaviors

These happen automatically - you don't need to ask:

### 1. Slug Generation (On Bet Save)
When saving new pending bets, Claude automatically generates a slug for detail page URLs:
- Format: `team-bettype-fund-date`
- Example: `avalanche-wild-total-catalyst-nov28-2025`
- This means detail pages work immediately, even before results come in

### 2. chartData.json Update (On Results Update)
When settling bets ("update results"), Claude automatically:
1. Calculates daily P/L from all settled bets for that date
2. Creates new OHLC candle:
   - `open` = previous day's close
   - `high` = max(open, close + intraday swings)
   - `low` = min(open, close - intraday swings)
   - `close` = open + net P/L for the day
   - `volume` = total units risked that day
3. Appends candle to chartData.json
4. Chart on dashboard updates automatically

**You never need to manually update chartData.json.**

### 3. BET TRACKING FORMAT

When saving bets (after "placed" or "track these"), always show THREE views:

#### View 1: INDIVIDUAL BETS
Each bet saved separately to bets.json:
| ID | Pick | Line | Odds | Units | Fund |
(Even if same game in multiple funds, each is its own entry)

#### View 2: BY FUND SUMMARY
| Fund | Bets | Units | $ |
|------|------|-------|---|
| ⚫️ VectorFund | X | Xu | $XXX |
| 🟢 SharpFund | X | Xu | $XXX |
| 🟠 ContraFund | X | Xu | $XXX |
| 🟣 CatalystFund | X | Xu | $XXX |
| TOTAL | X | Xu | $XXX |

#### View 3: COMBINED EXPOSURE (when same game in multiple funds)
Show total exposure per game:
- [Game]: $XXX total (🟢 $XXX + ⚫️ $XXX)

**Always show all three views when tracking bets.**

### 4. SOCIAL MEDIA AUTO-GENERATE

#### DETECTING PICK TYPE

When user says "placed", Claude checks:
- If `date` (game date) = today → **DAILY PICKS POST**
- If `date` (game date) > today → **ADVANCE PICKS POST**

**Ask if unclear:** "Are these for today's games or a future date?"

---

#### DAILY PICKS POST (games TODAY)

**Filter:** `date` = today's date

**Early Bet Indicator:**
- If `datePlaced` < `date` → add `- Placed [M/D]` at end of line
- If `datePlaced` = `date` → nothing added (clean)

**DAILY PICKS - SLIDE 1:**
```
[DATE] - TODAY'S PICKS

[SPORT 1]
🟢 [PICK] ([ODDS]) [UNITS]U - Placed [M/D]    ← only if placed early
🟠 [PICK] ([ODDS]) [UNITS]U - Placed [M/D]    ← only if placed early

[SPORT 2]
⚫️ [PICK] ([ODDS]) [UNITS]U                   ← same-day, no date
🟢 [PICK] ([ODDS]) [UNITS]U                   ← same-day, no date

[X] PICKS | [X]U | $[X]
```

**Example:**
```
SUN DEC 8 - TODAY'S PICKS

NFL
🟢 Chiefs -3.5 (-110) 2.0U - Placed 12/2
🟠 Giants +7 (-110) 1.5U - Placed 12/4

NBA
⚫️ Lakers -4.5 (-110) 1.5U
🟢 Celtics -7 (-110) 1.0U

6 PICKS | 7.0U | $700
```

**GROUP BY SPORT:** NFL, NCAAF, NBA, NCAAB, NHL (only show sports with picks)

**CAPTION GENERATION:**
```
[DATE IN ALL CAPS] | [Dynamic content]. #sportsbetting #deptofgambling #dog
```

**Caption Logic:**
- Single sport: "[DATE] | [X] [sport] bets live."
- Multi-sport: "[DATE] | Full card. [X] bets across [sports]."
- Sunday NFL: "[DATE] | Sunday operations."
- Big day (8+ bets): "[DATE] | Heavy day. [X] bets across [sports]."

**Caption Examples:**
```
DECEMBER 8 | Full card. 6 bets across NFL and NBA. #sportsbetting #deptofgambling #dog
```
```
NOVEMBER 30 | Today's picks are live. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 8 | Sunday operations. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 14 | 4 NBA bets live. #sportsbetting #deptofgambling #dog
```

**DAILY PICKS - SLIDE 2 (EXPOSURE):**
```
TODAY'S EXPOSURE

⚫️ VECTOR: [X] PICKS | [X]U | $[X]
🟢 SHARP: [X] PICKS | [X]U | $[X]
🟠 CONTRA: [X] PICKS | [X]U | $[X]
🟣 CATALYST: [X] PICKS | [X]U | $[X]

[TOTAL PICKS] | [TOTAL UNITS]U | $[TOTAL]
```

---

#### PINNED COMMENT / ANALYSIS BREAKDOWN (REQUIRED)

**ALWAYS generate this when user says "placed"**

This is a pinned comment for Instagram explaining our decision-making. 1-2 sentences per pick.

**Format:**
```
THE ANALYSIS 🧵

[SPORT EMOJI] [SPORT]:
[Pick 1] — [1-2 sentence explanation of why. Reference model edge, sharp money, line movement, or situational factors. No external sources mentioned.]

[Pick 2] — [1-2 sentence explanation]

[SPORT EMOJI] [SPORT]:
[Pick 3] — [1-2 sentence explanation]

Let's work.
```

**Sport Emojis:**
- 🏀 NBA
- 🏈 NFL
- 🏀 NCAAB
- 🏈 NCAAF
- 🏒 NHL

**Example:**
```
THE ANALYSIS 🧵

🏀 NBA:
Mavericks +11.5 — Our model projects this as a 6-point game. Kyrie is out but the market overcorrected. 13% edge, biggest play of the day.

Jazz +12.5 — Model says 7.7, market says 12.5. Houston's offense has been inconsistent. Value on the dog.

Bulls +9 — Line inflated from 6.5 to 9. Model sees Chicago within 5. Taking the points.

Nets +4.5 — Money moving opposite the public here. 26% of bets but 30% of dollars. Smart money likes Brooklyn at home.

Pacers +6.5 — Sharp indicators lit. Cleveland missing Jarrett Allen. This line should be closer to 5.

Hawks +9.5 — Public pounding Detroit. Line moved from 5.5 to 9.5. Too many points for a home dog.

🏒 NHL:
Ducks ML — 28% of bets but 52% of money. When the dollars don't match the tickets, follow the money.

Jets/Sabres O6 — Both teams scoring lately. Sharp money confirmed on the over.

🏀 NCAAB:
Iona -1.5 — 75% of bets, 90% of money. That 15% gap is significant. Sharps see Iona covering.

North Alabama +5.5 — Model grades this B+ with 6.3% edge. Line moved in our favor from 4.5 to 5.5.

Middle Tenn +2.5 — Another B+ grade. Only 20% of public on Middle Tenn but the model likes them.

Let's work.
```

**Rules:**
- Never mention "Action Network" or "PRO projections" - just say "model" or "our model"
- Never mention external sources
- Walk through OUR decision making
- Keep it conversational but professional
- End with "Let's work." or "Let's eat."

---

#### ADVANCE PICKS POST (games in FUTURE)

**Filter:** `date` > today AND `datePlaced` = today

**EARLY BETS - SLIDE 1:**
```
EARLY BETS 📅

[SPORT] - [Game Day] [Game Date]
🟢 [PICK] ([ODDS]) [UNITS]U
🟠 [PICK] ([ODDS]) [UNITS]U

[SPORT] - [Game Day] [Game Date]
⚫️ [PICK] ([ODDS]) [UNITS]U

[X] PICKS | [X]U | $[X]
```

**Example:**
```
EARLY BETS 📅

NFL - Sun Dec 8
🟢 Chiefs -3.5 (-110) 2.0U
🟠 Giants +7 (-110) 1.5U

NCAAF - Sat Dec 7
⚫️ Georgia -14 (-110) 2.5U

3 PICKS | 5.5U | $550
```

**CAPTION GENERATION:**
```
[DATE IN ALL CAPS] | [Dynamic content]. #sportsbetting #deptofgambling #dog
```

**Caption Logic:**
- Default: "[DATE] | Bets locked before the lines move."
- NFL focus: "[DATE] | Early week entry. NFL Week [X]."
- Adding more: "[DATE] | Adding to our [weekend/Sunday] exposure."
- Single sport: "[DATE] | [Sport] positions set."

**Caption Examples:**
```
DECEMBER 2 | Bets locked before the lines move. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 2 | Early week entry. NFL Week 14. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 4 | Adding to our Sunday exposure. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 3 | NCAAF positions set. #sportsbetting #deptofgambling #dog
```

**EARLY BETS - SLIDE 2 (EXPOSURE):**
```
EARLY BETS EXPOSURE
GAMES: [EARLIEST DATE] - [LATEST DATE]

⚫️ VECTOR: [X] PICKS | [X]U | $[X]
🟢 SHARP: [X] PICKS | [X]U | $[X]
🟠 CONTRA: [X] PICKS | [X]U | $[X]
🟣 CATALYST: [X] PICKS | [X]U | $[X]
[TOTAL PICKS] | [TOTAL UNITS]U | $[TOTAL]
```

**GROUP BY:** Sport + Game Date (e.g., "NFL - Sun Dec 8")

---

#### AFTER "update results" - COMPLETE WORKFLOW

**STEP 1: Update Data**
1. Update bets.json with results (win/loss/push)
2. Run `npx tsx scripts/daily-update.ts` to sync portfolio/chart/metrics

**STEP 2: AUTO-GENERATE ALL SOCIAL IMAGES**

Claude automatically generates all 5 images after settling results:

| # | Image | Description | Output Location |
|---|-------|-------------|-----------------|
| 1 | **picks-results.png** | Each bet with ✅/❌ and P/L | `social-images/YYYY-MM-DD/picks-results.png` |
| 2 | **daily-report.png** | Day summary + fund breakdown | `social-images/YYYY-MM-DD/daily-report.png` |
| 3 | **portfolio-chart.png** | 7-day candlestick chart | `social-images/YYYY-MM-DD/portfolio-chart.png` |
| 4 | **dayXX-YYYY-MM-DD.png** | All-time cumulative candle chart (IG Story) | `social-images/YYYY-MM-DD/dayXX-YYYY-MM-DD.png` |

**NOTE:** The cumulative candle chart is also saved to `daily-images/cumulative-candles/` for archival.

**DAY NUMBER CALCULATION (auto-calculated):**
```
Day 1 = Nov 4, 2025 (portfolio start)
Day Number = (current_date - Nov 4, 2025) + 1

Examples:
- Dec 16, 2025 = Day 43
- Dec 17, 2025 = Day 44
- Dec 18, 2025 = Day 45
```

**Story generation command (run automatically):**
```bash
npx tsx scripts/generate-cumulative-candles.ts YYYY-MM-DD
# Then copy to social-images folder:
cp daily-images/cumulative-candles/dayXX-YYYY-MM-DD.png social-images/YYYY-MM-DD/
```

**FOLDER STRUCTURE (STANDARD FOR EVERY DAY):**
```
social-images/YYYY-MM-DD/
├── picks.png               ← Feed slide 1 (today's picks)
├── exposure.png            ← Feed slide 2 (fund breakdown)
├── picks-results.png       ← Feed slide 3 (results with W/L)
├── daily-report.png        ← Feed slide 4 (day summary)
├── portfolio-chart.png     ← Feed slide 5 (7-day chart)
└── dayXX-YYYY-MM-DD.png    ← IG Story (all-time cumulative candles)

daily-images/cumulative-candles/
└── dayXX-YYYY-MM-DD.png    ← Archive copy
```

**STEP 4: Provide Captions**
- Instagram caption
- Twitter post
- Pinned comment (if applicable)

---

**DAILY REPORT - SLIDE 1:**
```
[DATE] DAILY REPORT
+$[TOTAL P/L] (or -$[TOTAL P/L] if negative)

[WINS]-[LOSSES]
⚫️ VECTOR [W]-[L] | +$[P/L]
🟢 SHARP [W]-[L] | +$[P/L]
🟠 CONTRA [W]-[L] | +$[P/L]
🟣 CATALYST [W]-[L] | +$[P/L]
```

**DAILY REPORT - SLIDE 2 (YESTERDAY'S BETS):**
```
[DATE] - RESULTS

[SPORT 1]
✅/❌ ⚫️ [PICK] ([ODDS]) [UNITS]U → +/-$[P/L]
✅/❌ 🟢 [PICK] ([ODDS]) [UNITS]U → +/-$[P/L]

[SPORT 2]
✅/❌ 🟠 [PICK] ([ODDS]) [UNITS]U → +/-$[P/L]
✅/❌ 🟣 [PICK] ([ODDS]) [UNITS]U → +/-$[P/L]

[W]-[L] | +/-$[TOTAL P/L]
```

**GROUP BY SPORT:** NFL, NCAAF, NBA, NCAAB, NHL (only show sports with bets)

**CAPTION GENERATION:**
```
[DATE IN ALL CAPS] | [Dynamic content]. #sportsbetting #deptofgambling #dog
```

**Caption Logic:**
- Winning day: "[DATE] | [W]-[L]. [Best fund] carried. +$[P/L]."
- Losing day: "[DATE] | [W]-[L]. Down day. Back tomorrow."
- Break even: "[DATE] | [W]-[L]. Flat day."
- Big win: "[DATE] | [W]-[L]. Strong day. +$[P/L]."
- Perfect day: "[DATE] | [W]-[L]. Clean sweep."

**Caption Examples:**
```
DECEMBER 8 | 4-2. Solid day. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 8 | 5-1. Vector and Sharp carried. +$340. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 8 | 2-4. Down day. Back tomorrow. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 8 | 6-0. Clean sweep. +$580. #sportsbetting #deptofgambling #dog
```
```
DECEMBER 8 | 3-3. Flat day. #sportsbetting #deptofgambling #dog
```

**DAILY REPORT - SLIDE 3 (WEEKLY CHART - Instagram POST):**
Generate a square (1080x1080) TradingView-style chart showing:
- Past 7 days including today
- Department of Gambling portfolio performance
- Green/red candles for winning/losing days
- X-axis: Date labels for each candle (11/22, 11/23, etc.)
- Stats: Record, ROI, All Time P/L
- Current portfolio value

Save chart to: `daily-images/[date]-chart.png`

**This is the INSTAGRAM POST image** - square format for feed.

---

#### INSTAGRAM STORY - CUMULATIVE PORTFOLIO CHART

**AUTO-GENERATED** as part of "update results" workflow (see STEP 2 above).

**What it shows:**
- 1080x1920 TradingView-style cumulative candle chart
- ALL candles from Day 1 to current day
- Day number and date in header
- Portfolio balance with total P/L and ROI
- Stats: Record, Net P/L, Today's P/L

**Day calculation (automatic):**
```javascript
const start = new Date('2025-11-04');
const today = new Date(betDate);
const dayNum = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
```

**Output:** `daily-images/cumulative-candles/dayXX-YYYY-MM-DD.png`

**What to deliver after "update results" (ALL AUTO-GENERATED):**
1. picks-results.png (feed)
2. daily-report.png (feed)
3. portfolio-chart.png (feed)
4. dayXX-YYYY-MM-DD.png (story)
5. Instagram caption
6. Twitter post

---

#### INSTAGRAM DELIVERABLES SCHEDULE

**EVERY DAY after "update results":**
1. Instagram CAPTION
2. Instagram POST image (1080x1080, last 7 days)
3. Instagram STORY - DAILY cumulative chart (Day X with all candles from Day 1)

**EVERY MONDAY after "update results":**
- All of the above PLUS:
4. Instagram STORY - WEEKLY report (previous Mon-Sun week)

**Weekly Report Schedule (Mon-Sun format):**
| Week | Dates | Post On |
|------|-------|---------|
| Week 1 | Nov 3-9 | Mon Nov 10 |
| Week 2 | Nov 10-16 | Mon Nov 17 |
| Week 3 | Nov 17-23 | Mon Nov 24 |
| Week 4 | Nov 24-30 | Mon Dec 1 |
| Week 5 | Dec 1-7 | Mon Dec 8 |
| Week 6 | Dec 8-14 | Mon Dec 15 |
| (continues...) |

**IMPORTANT:** Weekly reports are posted the MONDAY AFTER the week ends.
- Today is Sunday Nov 30 → Week 4 not complete yet
- Tomorrow Mon Dec 1 → Post Week 4 (Nov 24-30) recap

**Scripts:**
- Daily cumulative: `npx tsx scripts/generate-cumulative-candles.ts [DAY_NUMBER]`
- Weekly report: `npx tsx scripts/generate-weekly-reports.ts [WEEK_NUMBER]`

**Output folders:**
- Daily: `daily-images/cumulative-candles/dayXX-YYYY-MM-DD.png`
- Weekly: `daily-images/weekly-reports/weekXX-YYYY-MM-DD-to-YYYY-MM-DD.png`

**Instagram Highlights:**
- **DAILY** - Cumulative day-by-day charts
- **WEEKLY** - Mon-Sun week recaps

---

#### TWITTER VERSIONS

**Every Instagram post also gets a Twitter version.**

**Twitter Rules:**
- 280 character limit per tweet
- Can be a thread if needed
- Same info, condensed
- Hashtags: #GamblingTwitter #SportsBetting

---

**1. DAILY PICKS Twitter:**
```
[DATE] PICKS

[SPORT EMOJI] [SPORT]
• [PICK] ([ODDS]) [UNITS]U
• [PICK] ([ODDS]) [UNITS]U

[X] plays | [X]U risked

#GamblingTwitter #SportsBetting
```

**Sport Emojis for Twitter:**
- 🏀 NBA
- 🏈 NFL
- 🏀 NCAAB
- 🏈 NCAAF
- 🏒 NHL

**Example:**
```
DEC 1 PICKS

🏀 NBA
• Mavericks +11.5 (-110) 2U
• Jazz +12.5 (-114) 1.5U
• Nets +4.5 (-109) 1.5U
• Bulls +9 (-110) 1U
• Pacers +6.5 (-105) 1U
• Hawks +9.5 (-110) 1U

🏒 NHL
• Ducks ML (+130) 1U
• Jets/Sabres O6 (-115) 0.5U

🏀 NCAAB
• Iona -1.5 (-110) 1U
• North Alabama +5.5 (-104) 1U
• Middle Tenn +2.5 (-110) 0.5U

11 plays | 12U risked

#GamblingTwitter #SportsBetting
```

**Twitter Thread Reply (The Breakdown) - REQUIRED:**
```
The breakdown 🧵

🏀 NBA:
Mavs +11.5 — Model says 6-pt game. Market overcorrected on Kyrie news.
Jazz +12.5 — Model 7.7 vs market 12.5. Houston inconsistent.
Nets +4.5 — 26% bets, 30% money. Sharp divergence.
Pacers +6.5 — Sharp indicators + Cavs missing Allen.
Hawks +9.5 — Line moved 5.5→9.5. Too many points.
Bulls +9 — Model within 5. Line inflated.

🏒 NHL:
Ducks ML — 28% bets, 52% money. Follow the dollars.
Jets/Sabres O6 — Sharp money confirmed on over.

🏀 NCAAB:
Iona -1.5 — 75% bets, 90% money. 15% gap = sharp.
N. Alabama +5.5 — B+ model grade, line moved FOR us.
Middle Tenn +2.5 — B+ grade, public fading them.

Let's eat.
```

**Rules for Twitter Breakdown:**
- Keep it condensed (Twitter character limits)
- Use sport emojis before each section
- 1 sentence per pick max
- Same logic as Instagram pinned comment, just shorter
- End with "Let's eat." or "Let's work."

---

**2. EARLY BETS Twitter:**
```
EARLY BETS 📅

[SPORT] - [Game Day]
• [PICK] ([ODDS]) [UNITS]U

Locked before lines move.

#GamblingTwitter #SportsBetting
```

**Example:**
```
EARLY BETS 📅

NFL - Sunday
• Chiefs -3.5 (-110) 2U
• Giants +7 (-110) 1.5U

NCAAF - Saturday
• Georgia -14 (-110) 2.5U

Locked before lines move.

#GamblingTwitter #SportsBetting
```

---

**3. DAILY REPORT Twitter:**
```
📊 [DATE] | [W]-[L]-[P] | [+/-]$[DAY P/L]

✅ [PICK]
✅ [PICK]
❌ [PICK]
🔄 [PICK] (if push)

💰 [ALL-TIME RECORD] | [+/-]$[ALL-TIME P/L] all-time

#GamblingTwitter #SportsBetting
```

**Example:**
```
📊 DEC 1 | 9-1-1 | +$895

✅ Mavs +11.5
✅ Jazz +12.5
✅ Nets +4.5
✅ Ducks ML
✅ Bulls +9
✅ Hawks +9.5
✅ Iona -1.5
✅ UNA +5.5
✅ MTSU +2.5
🔄 Jets/Sabres O6
❌ Pacers +6.5

💰 94-68-2 | +$2,706 all-time

#GamblingTwitter #SportsBetting
```

---

**4. WEEKLY REPORT Twitter (Mondays):**
```
WEEK [X] RECAP ([DATES])

[W]-[L] | [+/-]$[P/L]

Portfolio: $[BALANCE]
All-time: [+/-]$[TOTAL P/L] ([ROI]%)

#GamblingTwitter #SportsBetting
```

**Example:**
```
WEEK 4 RECAP (Nov 24-30)

35-16 | +$2,796.88

Portfolio: $41,893.40
All-time: +$1,893.40 (+4.73%)

#GamblingTwitter #SportsBetting
```

---

#### FORMAT RULES:
- Each slide content in separate code block so I can copy/paste
- Use fund emojis: ⚫️ Vector, 🟢 Sharp, 🟠 Contra, 🟣 Catalyst
- Always show ✅ for wins, ❌ for losses
- Math must add up (fund totals = overall total)
- Include P/L for every single bet

---

## Commands Reference

| Command | What It Does |
|---------|--------------|
| "Add these picks: [list]" | Creates new pending bets |
| "Update results for Nov 27" | Settles all Nov 27 bets |
| "Check yesterday's bets" | Settles previous day's bets |
| "Update metrics" | Regenerates metrics.json |
| "What's the portfolio status?" | Shows current balance/record |
| "Show pending bets" | Lists unsettled bets |

---

## File Locations

| File | Purpose |
|------|---------|
| `data/bets.json` | All bet data (SINGLE SOURCE OF TRUTH) |
| `data/portfolio.json` | Fund balances and records (auto-synced) |
| `data/chartData.json` | Daily balance for charts (auto-synced) |
| `data/metrics.json` | Calculated metrics (auto-synced) |
| `lib/types.ts` | TypeScript type definitions |
| `scripts/sync-all-data.ts` | **Master sync script** - recalculates everything from bets.json |

---

## AUTO-UPDATING PAGES (CRITICAL)

**All these pages read directly from bets.json - they auto-update when data changes:**

| Page | Route | What It Shows |
|------|-------|---------------|
| **Bet Tracker** | `/bets` | ALL settled bets, filterable by sport/type/fund |
| **Daily Performance** | Homepage `#history` | Past 7 days of daily results with expandable bet details |
| **Portfolio History** | `/portfolio/history` | Full daily performance history (all time) |
| **Recent Bets** | Homepage `#bets` | Last 3 settled bets |
| **Fund Pages** | `/funds/[fund]` | Individual fund performance and bets |
| **Bet Detail** | `/bets/[slug]` | Individual bet analysis with thesis |

### IMPORTANT: When Adding New Bets
When you add bets to bets.json, ALL of these pages update automatically:
1. **No manual updates needed** - pages read from bets.json directly
2. **Clear Next.js cache if needed** - run `rm -rf .next && npm run dev` if data doesn't appear
3. **After settling results** - run `npx tsx scripts/sync-all-data.ts` to update portfolio/chart/metrics

### Checklist After Adding/Settling Bets:
- [ ] bets.json updated with new bets or results
- [ ] Run `npx tsx scripts/sync-all-data.ts` (updates portfolio, chart, metrics)
- [ ] If dev server was running, restart or clear cache
- [ ] Verify on `/bets` page that new bets appear
- [ ] Verify on homepage that Daily Performance shows new day

---

## DATA SYNC SYSTEM

**Single Source of Truth:** `data/bets.json`

All other data files are derived from bets.json using the sync script.

### When to Run Sync
Run `npx tsx scripts/sync-all-data.ts` after:
- Settling pending bets (updating results)
- Manual edits to bets.json
- Any time numbers seem off

### What Sync Does
1. Reads all bets from bets.json
2. Recalculates portfolio.json (fund balances, records, P/L, ROI)
3. Recalculates chartData.json (OHLC candles)
4. Recalculates metrics.json (all stats)
5. Runs verification check with ✅/❌ output

### Verification Output
```
════════════════════════════════════════════════════════════
DATA SYNC CHECK
════════════════════════════════════════════════════════════

BETS.JSON:
  Total bets: X
  Settled: X (XW-XL-XP)
  Pending: X
  Total P/L: $X

MATH CHECK:
  Wins + Losses + Pushes = Settled? ✅/❌
  Fund P/Ls add up to total? ✅/❌
  Balance = $40,000 + P/L? ✅/❌
  Chart close = Portfolio balance? ✅/❌

✅ DATA VERIFIED - All checks passed!
```

### If Sync Fails
If any check shows ❌:
1. Check bets.json for duplicate IDs
2. Check for missing fund assignments
3. Check for invalid result values (must be win/loss/push/pending)
4. Check profit calculations match odds/stake

---

## Example Update Session

**You:** "Update results for November 26"

**Me:**
1. Found 4 pending bets for Nov 26
2. Searching for results...

**Bet 1: Houston/Tennessee U135.5**
- Final: Tennessee 76, Houston 73 (Total: 149)
- Bet line: U135.5, Closed: U137.5
- Result: LOSS (over by 13.5)
- CLV: +200¢ (line moved toward us)
- Profit: -$200

**Bet 2: William & Mary -1.5**
- Final: W&M 92, ACU 58 (Won by 34)
- Bet line: -1.5, Closed: -2.0
- Result: WIN
- CLV: +50¢
- Profit: +$98.04

[... continues for each bet ...]

**Summary:**
- Record: 2-2
- Net P/L: -$103.96
- Avg CLV: +75¢
- Updated portfolio balance: $9,277.00

Running metrics update... Done!

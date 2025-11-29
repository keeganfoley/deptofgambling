# Department of Gambling - Betting Workflow

## GIT PUSH RULES

**NEVER auto-push to GitHub. User controls when the website updates.**

| User Says | Claude Does | Git Push? |
|-----------|-------------|-----------|
| **"placed"** | Save to bets.json, generate social media content | ❌ NO |
| **"update results"** | Update bets.json, run `npx tsx scripts/sync-all-data.ts`, generate social media content | ❌ NO |
| **"push"** or **"deploy"** | Run git add, git commit, git push | ✅ YES |

**Why:** Pending bets stay private until user decides to publish results to deptofgambling.com.

---

## QUICK REFERENCE - PENDING BETS SYSTEM

### When Bets Are Placed
User will say:
- "I placed these" + list of picks
- "Bets placed" + screenshot
- Just paste picks and say "placed"

**Claude's Job:** Immediately save to `data/bets.json` with `"result": "pending"`

### Next Day - Updating Results
User says "check yesterday's bets" or "update results" or "what hit?"

**Claude's Job:**
1. Find ALL pending bets in bets.json
2. Web search final scores for each game
3. Update results (win/loss/push, P/L, final score)
4. Recalculate portfolio.json, chartData.json
5. Create bet-analysis files
6. Give summary

**THE POINT:** User never re-tells what bets were placed. They're saved. Just say "update results" and Claude handles it.

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

## WORKFLOW 2: Updating Results

When you say **"update results for [date]"** or **"check yesterday's bets"**, I will:

### Step 1: Find Pending Bets

Look for bets with `result: "pending"` for the specified date.

### Step 2: Search for Each Bet's Results

For each pending bet, I'll search:

**For Spreads/Moneylines:**
```
"[Team A] vs [Team B] final score November 27 2025"
"[Team A] [Team B] closing line spread November 27"
```

**For Totals:**
```
"[Team A] [Team B] final score total points November 27"
"[Team A] [Team B] closing over under line"
```

**For Player Props:**
```
"[Player name] [stat type] November 27 2025 final stats"
"[Player name] game log November 27 2025"
```

### Step 3: Update Each Bet

For each bet, I'll update:

```json
{
  "result": "win" | "loss" | "push",
  "profit": [calculated based on odds and stake],
  "finalStat": "Final: LAL 112, SAC 108 (Won by 4)",
  "closingLine": -4.0,    // What the line closed at
  "clv": 50,              // CLV in cents (betLine vs closingLine)
  "resultDetails": {
    "finalScore": "Lakers 112, Kings 108",
    "searchedAt": "2025-11-28T10:00:00Z",
    "source": "ESPN"
  }
}
```

### CLV Calculation:

**For Spreads:**
- CLV = (closingLine - betLine) × 100 cents
- Example: Bet Lakers -3.5, closed -4.0 → CLV = +50¢ (got half point better)

**For Totals:**
- CLV = (betLine - closingLine) × 100 cents for unders
- CLV = (closingLine - betLine) × 100 cents for overs

**For Moneylines:**
- Convert odds to implied probability
- CLV = (closing implied prob - bet implied prob) × 100

### Step 4: Run Sync Script (AUTOMATIC)

**Immediately after updating bets.json**, run:
```bash
npx tsx scripts/sync-all-data.ts
```

This automatically updates:
- portfolio.json (fund balances, records, P/L, ROI)
- chartData.json (OHLC candles)
- metrics.json (all stats)

### Step 5: Show Verification (AUTOMATIC)

Display the DATA SYNC CHECK output to user:
```
════════════════════════════════════════════════════════════
DATA SYNC CHECK
════════════════════════════════════════════════════════════
[Full verification output with ✅/❌ checks]
```

### Step 6: Generate Social Media Content (AUTOMATIC)

Generate the DAILY REPORT slides (see SOCIAL MEDIA AUTO-GENERATE section)

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

#### AFTER "placed" (Daily Picks Post)

When I confirm bets are placed, automatically generate:

**DAILY PICKS - SLIDE 1:**
```
[DATE] - TODAY'S PICKS

[SPORT 1]
⚫️ [PICK] ([ODDS]) [UNITS]U
🟢 [PICK] ([ODDS]) [UNITS]U

[SPORT 2]
🟠 [PICK] ([ODDS]) [UNITS]U
🟣 [PICK] ([ODDS]) [UNITS]U

[X] PICKS | [X]U | $[X]
```

**GROUP BY SPORT:** NFL, NCAAF, NBA, NCAAB, NHL (only show sports with picks)

**DAILY PICKS - SLIDE 2 (EXPOSURE):**
```
TODAY'S EXPOSURE
FUND BREAKDOWN
⚫️ VECTOR: [X] PICKS | [X]U | $[X]
🟢 SHARP: [X] PICKS | [X]U | $[X]
🟠 CONTRA: [X] PICKS | [X]U | $[X]
🟣 CATALYST: [X] PICKS | [X]U | $[X]
[TOTAL PICKS] | [TOTAL UNITS]U | $[TOTAL]
```

---

#### AFTER "update results" (Daily Report Post)

When I update results and all bets are settled, automatically generate:

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

**DAILY REPORT - SLIDE 3 (CHART):**
Generate a square (1080x1080) TradingView-style chart showing:
- Past 7 days including today
- Department of Gambling portfolio performance
- Green/red candles for winning/losing days
- Current portfolio value

Save chart to: `daily-images/[date]-chart.png`

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

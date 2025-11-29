# Department of Gambling - Betting Workflow

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
  "thesis": "Model edge explanation...",
  "slug": "lakers-spread-vector-nov27-2025"  // AUTO-GENERATED
}
```

**Slug is auto-generated** using format: `team-bettype-fund-date`

### Key Fields to Capture:
- `betLine`: The exact line at time of bet (e.g., -3.5, O235.5, +150)
- `odds`: American odds at time of bet
- `stake`: Units (1u = $100)
- All other standard fields

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

### Step 4: Update Chart Data

Add a new entry to `data/chartData.json` with the end-of-day balance.

### Step 5: Update Portfolio

Update `data/portfolio.json` with new:
- Balance
- Net P/L
- Record
- ROI
- Units won

### Step 6: Regenerate Metrics

Run: `npx tsx scripts/update-metrics.ts`

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
| `data/bets.json` | All bet data |
| `data/portfolio.json` | Fund balances and records |
| `data/chartData.json` | Daily balance for charts |
| `data/metrics.json` | Calculated metrics (auto-generated) |
| `lib/types.ts` | TypeScript type definitions |
| `scripts/update-metrics.ts` | Metrics calculation script |

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

# DOG Daily Picks Workflow v2.0

## Quick Start
Just say: **"Let's do picks"** or drop screenshots of today's slate. That's it.

## How It Works

User drops screenshots of today's slate (Action Pro, ESPN, whatever) or just says "what's on today." Then:

### Step 1: Scan Lines (30 seconds)
Run the odds engine to find where books are off from Pinnacle consensus.
```
npx tsx scripts/odds-engine.ts --brief --save
```
This gives us the **research queue** — compact list of games where a bettable book has 1+ points better than sharp consensus. Use `--brief` for the clean research list, drop `--brief` for full detail.

### Step 2: Research Top Candidates (2-3 minutes)
For each edge the engine found, web search:
- **Injuries:** Who's out? Who's questionable? Any late scratches?
- **Rest/Travel:** Back-to-back? Road trip? Days off?
- **Recent Form:** Last 5-10 games. Hot or cold?
- **Matchup Context:** Season series? Style matchup? Pace?
- **News:** Anything unusual? Coach changes, trades, lineup shifts?

The research either **validates** the edge (there's a real reason the line is off) or **kills** it (the line is off for a good reason the market knows).

### Step 3: Cross-Reference & Pick (1 minute)
Only bet when BOTH are true:
- ✅ Line edge exists (1+ points better than Pinnacle)
- ✅ Research supports it (there's a reason the market is wrong)

Kill the bet if:
- ❌ The line is off because of a known injury/factor the market already priced in
- ❌ Research shows a reason to fade (team is tanking, resting starters, etc.)
- ❌ No clear thesis beyond "the number is off"

### Step 4: Output Picks
Format each pick as:

```
PICK: [Team] [Line] @ [Book] ([Juice])
Fund: [SharpFund/VectorFund/etc.]
Edge: [X] pts better than Pinnacle consensus ([consensus line])
Stake: 1u ($100)

WHY: [2-3 sentences of actual reasoning — injuries, matchup, form,
      why the market is wrong on this specific game]
```

Max 5 picks per day. 1u flat. No exceptions.

### Step 5: Pre-Game Close
~15 min before first game:
```
npx tsx scripts/daily-scan.ts --close
```
Captures closing lines for CLV tracking.

### Step 6: Post-Game
After settling:
```
npx tsx scripts/clv-tracker.ts update
npx tsx scripts/clv-tracker.ts report --fund
```

---

## Rules
- Max 5 bets/day
- 1u flat ($100) on everything
- Max juice: -145
- Only spreads (NBA, NCAAB, NHL, NFL) — no totals, no props
- NCAAB totals are BLACKLISTED (23% historical)
- NFL props are BLACKLISTED (44% historical)
- If the engine finds 0 edges: **no bets today.** That's fine.
- If research kills all edges: **no bets today.** That's fine.
- "No bet" is always a valid output.

## What the User Provides
- Screenshots of the day's slate (optional — engine pulls its own data)
- Any specific games they want looked at
- Any news/info they've seen
- Action Pro screenshots for Sharp Fund sharp money data (optional)

## What Gets Returned
- Picks with real reasoning (not "model says X% edge")
- Which book to bet at and what line to take
- Clear thesis for each pick
- Games that were considered but passed on (with why)

## Commands Reference
```bash
npx tsx scripts/odds-engine.ts --brief --save   # Research queue (compact)
npx tsx scripts/odds-engine.ts --save           # Full edge detail
npx tsx scripts/odds-engine.ts nba --brief      # NBA only
npx tsx scripts/daily-scan.ts --close           # Capture closing lines
npx tsx scripts/clv-tracker.ts update           # Update bets with CLV
npx tsx scripts/clv-tracker.ts report --fund    # CLV performance report
```

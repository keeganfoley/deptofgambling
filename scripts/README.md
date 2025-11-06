# Daily Update Scripts

## Overview

This directory contains automation scripts to help you update the Department of Gambling website with daily betting data.

## Scripts

### `update-daily.js`

**Purpose:** Interactive script to add daily bets and update all data files.

**Usage:**
```bash
node scripts/update-daily.js
```

**What it does:**
1. Prompts you to enter bet details interactively
2. Calculates profit/loss automatically
3. Updates all JSON data files:
   - `data/bets.json` - Adds new bets
   - `data/portfolio.json` - Updates cumulative stats
   - `data/metrics.json` - Recalculates all metrics
   - `data/chartData.json` - Adds new balance data point
4. Generates tweet copy in `reports/YYYY-MM-DD-tweet.txt`
5. Displays summary of changes

**Interactive Prompts:**

For each bet, you'll be asked:
- Player name (e.g., "Julius Randle")
- Line (e.g., "OVER 20.5 points")
- Odds (e.g., -118)
- Stake in units (e.g., 1.5)
- Result (win/loss)
- Final stat (e.g., "32 points")
- Edge % (e.g., 17)
- Expected Value % (e.g., 31.9)
- Sport (e.g., NBA)
- Bet type (props/spreads/totals)
- Game date (YYYY-MM-DD)

**Example Session:**
```
📊 COLLECT BET DATA

Enter bet details (press Ctrl+C to finish adding bets):

--- BET #1 ---
Player name: Julius Randle
Line (e.g., OVER 12.5 rebounds): OVER 20.5 points
Odds (e.g., -114): -118
Stake in units (e.g., 1.0): 1.5
Result (win/loss): win
Final stat (e.g., 8 rebounds): 32 points
Edge % (e.g., 14): 17
Expected Value % (e.g., 25.2): 31.9
Sport (e.g., NBA): NBA
Bet type (props/spreads/totals): props
Game date (YYYY-MM-DD): 2025-11-05

✅ Bet added: Julius Randle OVER 20.5 points (win) +$127.12

Add another bet? (y/n): y

--- BET #2 ---
[Enter next bet details...]
```

**Output:**
- Updated JSON files in `data/` directory
- Tweet copy in `reports/YYYY-MM-DD-tweet.txt`
- Summary in console

## Tips

### Calculating Profit/Loss

The script automatically calculates profit/loss based on:
- **Win:** `stake * 100 * (100 / abs(odds))`
- **Loss:** `-(stake * abs(odds))`

### Generating Slugs

Bet detail page slugs are auto-generated in format:
`{player-name}-{month}{day}-{year}`

Example: `julius-randle-nov5-2025`

### Best Practices

1. **Run after games complete:** Wait until all bets for the day are settled
2. **Keep comprehensive reports:** Save your detailed analysis reports in `daily-reports/`
3. **Create bet analysis files:** Manually create detailed JSON files in `data/bet-analysis/` for bets that need full analysis pages
4. **Verify data:** Check the updated website locally before deploying
5. **Backup:** Commit changes to git after each update

## Future Enhancements

Planned features for the automation script:
- Parse comprehensive report markdown files automatically
- Generate bet analysis JSON files from reports
- Automatically create DailyPlays tweet data
- Validate data integrity after updates
- Support for editing/correcting existing bets

## File Structure

```
scripts/
├── README.md           # This file
└── update-daily.js     # Interactive daily update script

data/
├── bets.json          # All bets (updated)
├── portfolio.json     # Portfolio stats (updated)
├── metrics.json       # Aggregated metrics (updated)
├── chartData.json     # Chart data points (updated)
└── bet-analysis/      # Detailed analysis files (manual)
    ├── randle-nov5-2025.json
    └── wembanyama-nov5-2025.json

reports/
├── 2025-11-06-tweet.txt    # Tweet copy (generated)
└── 2025-11-06-summary.md   # Daily summary (manual)
```

## Troubleshooting

**Error: "Cannot find module"**
- Make sure you're in the project root directory
- Run `npm install` to install dependencies

**Profit/Loss seems wrong**
- Verify odds format (use negative for favorites, e.g., -118)
- Check stake amount (use decimal, e.g., 1.5)
- Verify result (exactly "win" or "loss")

**Slug already exists**
- Each bet needs a unique player/date combination
- If same player has multiple bets, you'll need to manually adjust slugs

## Support

If you encounter issues or need enhancements:
1. Check the console output for error messages
2. Verify input data format
3. Review the updated JSON files for accuracy
4. Manually correct any issues in the JSON files if needed

---

**Last Updated:** November 6, 2025
**Version:** 1.0.0

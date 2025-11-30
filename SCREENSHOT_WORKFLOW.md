# Screenshot Processing Workflow

## Quick Start

### Step 1: Dump Screenshots
Take all your Action Network screenshots and put them in a folder:
```
Screenshots MM-DD/
```

### Step 2: Run Processor
```bash
cd ~/Department\ of\ Gambling
./scripts/process-screenshots.sh "Screenshots MM-DD"
```

This will:
- ✅ Resize any images over 1800px (prevents API errors)
- ✅ Create a sorted list of all screenshots
- ✅ Generate analysis prompt file

### Step 3: Tell Claude
After the script finishes, tell Claude:

```
Analyze screenshots from [FOLDER_PATH] for 4-fund picks.
Games after 1:30 PM ET only.
Read screenshots in batches of 10.
Extract: Sport, Page Type, Lines, Edges, Sharp Signals, Public %.
Then run full analysis and give me picks by fund.
```

---

## What Claude Should Extract

### From PRO Projections Pages
| Column | Data Point |
|--------|------------|
| OPEN | Opening line |
| PRO LINE | Model projection |
| CONS | Current consensus |
| GRADE | A+ to F |
| EDGE | % edge |
| BET % | Public tickets |
| MONEY % | Public money |

### From Public Betting Pages
| Column | Data Point |
|--------|------------|
| % OF BETS | Ticket percentage |
| % OF MONEY | Dollar percentage |
| DIFF | Money - Bets divergence |

### From PRO Report (Game Popups)
| Signal | Indicator |
|--------|-----------|
| Sharp Action | Blue icon lit |
| Big Money | Blue icon lit |
| Line Movement | OPEN vs Current |

---

## File Locations

| File | Location |
|------|----------|
| Process Script | `scripts/process-screenshots.sh` |
| Extracted Data | `data/screenshot-data/extracted-data.json` |
| Analysis Prompt | `data/screenshot-data/analysis-prompt.md` |
| Batch Reader | `data/screenshot-data/batch-reader.py` |

---

## Troubleshooting

### "Image too large" errors
The script automatically resizes images over 1800px. If you still get errors, manually resize:
```bash
sips --resampleWidth 1800 "path/to/image.png"
```

### Claude running out of context
Ask Claude to process in smaller batches:
```
Read only the first 20 screenshots, extract data, then continue with the next 20.
```

### Missing data
Make sure you captured:
1. PRO Projections page (Spread view)
2. PRO Projections page (Total view)
3. Public Betting page
4. PRO Report game popups (for sharp signals)
5. Prop Projections (Cmd+A copy/paste)

---

## Example Session

```
You: ./scripts/process-screenshots.sh "Screenshots 11-29"

[Script runs, processes 150 screenshots]

You: Analyze the screenshots in /Users/keeganfoley/Department of Gambling/Screenshots 11-29
     for 4-fund betting picks. Games after 1:30 PM ET only.
     Follow HEDGE_FUND_ARCHITECTURE.md rules.

Claude: [Reads screenshots in batches]
        [Extracts data]
        [Runs 4-fund analysis]
        [Outputs picks by fund]
```

---

*Last updated: November 28, 2025*

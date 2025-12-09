# PICKS TEMPLATE - MASTER SPECIFICATION
## LOCKED: December 7, 2025

This document defines the FINAL picks.png template. Do NOT modify unless explicitly requested.

---

## BACKGROUND
- **Gradient:** 3-stop vertical
  - Top: `#4a7cb8` (light sky blue)
  - Middle: `#3a5a8a` (medium blue)
  - Bottom: `#1a2d4a` (dark navy)
- **Grid:** 45px squares, horizontal 8% opacity, vertical 10% opacity
- **Candlesticks:** 22 candles at 12% opacity (green/red mix)
- **Line chart:** Gold line at 8% opacity
- **Volume bars:** Bottom of canvas, green/red at 10% opacity
- **Price tickers:** Scattered faint numbers at 6% opacity
- **Side accents:** Red/green bars on left/right edges at 50% opacity

---

## CARDS - GLASSMORPHISM
- **Background:** `rgba(30, 41, 59, 0.6)`
- **Backdrop blur:** 10px
- **Border:** 3px solid (fund color)
- **Border radius:** 14px
- **Shadow:** `0 4px 20px rgba(0, 0, 0, 0.25)`
- **Min height:** 100px
- **Padding:** 18px 16px

### Fund Colors
- Sharp: `#22c55e` (green)
- Vector: `#9ca3af` (gray)
- Catalyst: `#c084fc` (purple)
- Contra: `#fb923c` (orange)

### Single Card Centering
- Width: `calc(50% - 7px)` (matches paired card width)
- `justify-self: center`

---

## TYPOGRAPHY

### Header
- "TODAY'S PICKS": 20px, weight 600, letter-spacing 12px, white 50% opacity
- Date: 76px, weight 900, letter-spacing 6px, gold `#fbbf24`, underlined

### Sport Headers
- Text: 32px, weight 800, letter-spacing 8px, white `#FFFFFF`
- Background pill: `rgba(0, 0, 0, 0.3)`, padding 8px 40px, radius 4px
- Gold lines: 2px thick, 60% opacity, max-width 140px

### Team Names (Dynamic Sizing)
- 3 chars or less: 36px (LSU, SMU)
- 4-6 chars: 32px (UNLV, BEARS, DUKE)
- 7-10 chars: 30px (VIKINGS, RAIDERS, CARDINALS)
- 11+ chars: 28px (NORTHEASTERN, CREIGHTON)

### Team Name Display Logic
- College (NCAAB/NCAAF): School name only (NORTHEASTERN, not HUSKIES)
- Pro (NFL/NBA/NHL): Mascot only (VIKINGS, not MINNESOTA)

### Spread/Odds
- Font: JetBrains Mono (monospace)
- Size: 22px
- Odds color: gold `#fbbf24`

### Units Badge
- Font: JetBrains Mono
- Size: 26px, weight 700
- Background: `rgba(255,255,255,0.12)`
- Padding: 12px 16px
- Border radius: 12px

---

## STATS BAR
- **Layout:** Flexbox, 3 equal columns
- **Background:** Same glassmorphism as cards
- **Border:** 3px solid gold `#fbbf24`
- **Border radius:** 16px
- **Order:** PICKS | EXPOSURE | UNITS

### Column Values
- PICKS/UNITS: 36px, JetBrains Mono, white 85%
- Labels: 13px, Inter, white 45%, letter-spacing 2px
- EXPOSURE: 54px, JetBrains Mono, gold `#fbbf24`
- EXPOSURE label: 14px, gold, letter-spacing 3px

---

## FOOTER
- Logo: 100px container, 85px image
- URL: "DEPTOFGAMBLING.COM", 18px, weight 700, letter-spacing 5px

---

## ADAPTIVE SIZING (by sport/row count)
- 2 sports, ≤5 rows: 130px cards, 85px logos, 28px headers
- 3 sports, ≤7 rows: 115px cards, 75px logos, 24px headers
- 4+ sports: 100px cards, 65px logos, 22px headers

---

## OUTPUT
- Size: 1080x1350px (Instagram portrait)
- Format: PNG
- Location: `social-images/YYYY-MM-DD/picks.png`

---

## WORKFLOW - "PLACED"

When user says "placed":

### Step 1: Show Picks Table
Display all bets for the date in a formatted table

### Step 2: Logo Verification
List all teams with their logo URLs:
```
Team: USF → Logo: https://a.espncdn.com/i/teamlogos/ncaa/500/58.png
Team: Duke → Logo: https://a.espncdn.com/i/teamlogos/ncaa/500/150.png
```
Ask: "All logos correct?"

### Step 3: Generate on Confirmation
Run: `npx tsx scripts/generate-social-images.ts --date YYYY-MM-DD --type placed`

This generates:
1. `social-images/YYYY-MM-DD/picks.png` - Today's picks image
2. `social-images/YYYY-MM-DD/exposure.png` - Fund exposure breakdown
3. **Pinned Comment** - Text output for Instagram (displayed in terminal)
4. **Caption** - Short Instagram caption (displayed in terminal)

### Logo Verification Rules
- ALWAYS show logo URLs before generating
- College teams are easily confused (USF vs UF, USC vs South Carolina, Miami FL vs Miami OH)
- If a logo URL is wrong or missing, fix in `data/team-logos.json` FIRST
- ESPN IDs must be verified - don't guess

---

## PINNED COMMENT FORMAT

```
THE BREAKDOWN 🧵

SHARP PLAYS
Team +Spread (Odds): Thesis text...

VECTOR PLAYS
Team +Spread (Odds): Thesis text...

CONTRA PLAYS
Team +Spread (Odds): Thesis text...

CATALYST PLAYS
Team +Spread (Odds): Thesis text...
```

### Pinned Comment Rules - NEVER include:
- "PRO" or "PRO model" or "PRO projects" (remove entirely)
- Letter grades (A, A+, A-, B, B+, etc.)
- "= X% edge" patterns
- Model projection sentences

### Pinned Comment Rules - ALLOWED:
- Percentages (82%, 46% DIFF, etc.)
- Money flow data (+37% DIFF)
- Stats and numbers
- Line movement info

---

## INSTAGRAM CAPTION FORMAT

```
DECEMBER 5 | 9 picks across NFL, NBA, NCAAB, NHL. Full breakdown in pinned comment. #sportsbetting #deptofgambling
```

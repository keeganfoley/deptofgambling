# PICKS TEMPLATE - VISUAL SPECIFICATION
## LOCKED: December 16, 2025

This document defines the FINAL picks.png visual template. Do NOT modify unless explicitly requested.

**For caption formats, see:** `templates/social-post-formats.md`

---

## DIMENSIONS
- **Size:** 1080x1350px (Instagram portrait)
- **Format:** PNG
- **Location:** `social-images/YYYY-MM-DD/picks.png`

---

## BACKGROUND
- **Gradient:** 3-stop vertical
  - Top: `#4a7cb8` (light sky blue)
  - Middle: `#3a5a8a` (medium blue)
  - Bottom: `#1a2d4a` (dark navy)
- **Grid:** 45px squares, horizontal 8% opacity, vertical 10% opacity
- **Side accents:** Red/green bars on left/right edges at 50% opacity

---

## LAYOUT STRUCTURE

### Fixed Elements (never change size/position)
- **Header:** "TODAY'S PICKS" + DATE at top
- **Stats Bar:** PICKS | EXPOSURE | UNITS - anchored near bottom
- **Footer:** Logo + DEPTOFGAMBLING.COM at very bottom

### Flexible Element
- **Picks Section:** Fills middle space, scales based on pick count

---

## SCALING LOGIC (by pick count)

### 1-4 picks
- Larger cards, more vertical spacing
- Single column layout

### 5-8 picks (standard)
- Medium cards, medium spacing
- Single column layout
- Card padding: 16px 24px
- Team name: 36px
- Bet line: 32px

### 9-12 picks (LOCKED - USER APPROVED DEC 28, 2024)
- **Team logos: 70px** (key - makes logos very readable)
- **Team names: 32px** (bold, prominent)
- **Bet lines: 26px**
- **Units badge: 28px**
- **Opponent text: 14px**
- Card padding: 8px 18px
- Card gap: 3px
- Logo-text gap: 16px
- Container padding: 25px 40px 20px
- Header date: 52px
- Sport section flex = number of picks (e.g., 6 NFL picks = flex: 6)

### 13+ picks
- Smallest cards, minimal spacing
- May need 2-column grid
- Card padding: 12px 16px
- Team name: 26px
- Bet line: 22px

---

## CARDS - GLASSMORPHISM
- **Background:** `rgba(30, 41, 59, 0.7)`
- **Backdrop blur:** 10px
- **Border:** 3px solid (fund color)
- **Border radius:** 16px
- **Shadow:** `0 4px 20px rgba(0, 0, 0, 0.3)`

### Fund Colors
- Sharp: `#22c55e` (green)
- Vector: `#9ca3af` (gray)
- Catalyst: `#c084fc` (purple)
- Contra: `#fb923c` (orange)

---

## CARD LAYOUT

### Left Side
- Team logo (70px)
- Team name (36px, bold white)
- "vs [Opponent]" underneath (20px, white 45% opacity)

### Right Side
- Bet type in white (e.g., "ML", "-2.5", "+31.5")
- Odds in gold (e.g., "(+108)", "(-115)")
- Units badge (32px, white on translucent background)

---

## TYPOGRAPHY

### Header
- "TODAY'S PICKS": 18px, weight 600, letter-spacing 10px, white 50% opacity
- Date: 72px, weight 900, letter-spacing 6px, gold `#fbbf24`, underlined

### Sport Headers
- Text: 20px, weight 800, letter-spacing 6px, white 70% opacity
- Gold gradient lines on either side

### Team Names
- Font: Inter
- Weight: 800
- Color: white

### Bet Line
- Font: JetBrains Mono
- Bet type: white 90% opacity
- Odds: gold `#fbbf24`

### Units Badge
- Font: JetBrains Mono
- Weight: 800
- Background: `rgba(255,255,255,0.15)`
- Border radius: 12px

---

## STATS BAR
- **Layout:** Flexbox, 3 equal columns
- **Background:** Same glassmorphism as cards
- **Border:** 3px solid gold `#fbbf24`
- **Border radius:** 16px
- **Order:** PICKS | EXPOSURE | UNITS

### Column Values
- PICKS/UNITS: 42px, JetBrains Mono, white
- Labels: 13px, white 50%, letter-spacing 2px
- EXPOSURE: 50px, JetBrains Mono, gold `#fbbf24`
- EXPOSURE label: gold

---

## FOOTER
- Logo: 50px (inline with text)
- URL: "DEPTOFGAMBLING.COM", 18px, weight 700, letter-spacing 4px
- Layout: Centered, logo left of text

---

## ESPN LOGO CDN
```
https://a.espncdn.com/i/teamlogos/[league]/500/[team].png
```
- NCAA: `ncaa/500/[espn_id].png`
- NHL: `nhl/500/[abbrev].png`
- NFL: `nfl/500/[abbrev].png`
- NBA: `nba/500/[abbrev].png`

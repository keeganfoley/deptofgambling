# DAILY PICKS DELIVERY PROCESS

## WORKFLOW ORDER
1. Create picks.html + exposure.html
2. Screenshot to PNG (1080x1350)
3. Verify footer visible, content fills space
4. Deliver captions immediately after PNGs confirmed

---

## PICKS.HTML SIZING BY PICK COUNT

### 12 PICKS (Compact)
```css
.container { padding: 35px 50px; }
.header { margin-bottom: 25px; }
.pick-card { min-height: 90px; padding: 16px 20px; border: 3px solid; }
.team-logo { width: 55px; height: 55px; }
.team-name { font-size: 26px; }
.pick-line { font-size: 20px; }
.units { font-size: 24px; padding: 12px 16px; }
.picks-row { gap: 16px; margin-bottom: 12px; }
.sport-section { margin-bottom: 10px; }
.stats-bar { margin-top: 20px; }
.footer { margin-top: 20px; }
.logo { width: 55px; height: 55px; margin: 0 auto 8px; }
```

### 9-10 PICKS (Standard)
```css
.container { padding: 40px 50px 40px; }
.pick-card { min-height: 95px; padding: 16px 20px; border: 4px solid; }
.team-logo { width: 60px; height: 60px; }
.team-name { font-size: 32px; }
.pick-line { font-size: 26px; }
.units { font-size: 28px; padding: 14px 20px; }
.picks-row { gap: 16px; margin-bottom: 10px; }
```

### 6-8 PICKS (Spacious)
```css
.container { padding: 50px 60px; }
.pick-card { min-height: 100px; padding: 20px 24px; border: 4px solid; }
.team-logo { width: 65px; height: 65px; }
.team-name { font-size: 34px; }
.pick-line { font-size: 28px; }
.units { font-size: 30px; padding: 16px 24px; }
```

---

## CRITICAL CSS RULES (ALWAYS)
```css
body { background: #1a2d4a; } /* Match gradient end - NO white bar */
.picks-container { /* NO flex: 1 - causes overflow */ }
.footer { /* Inline flow, NOT absolute positioned */ }
```

---

## CAPTIONS TO DELIVER WITH EVERY PNG SET

### 1. THE ANALYSIS (Instagram Pinned Comment)
```
THE ANALYSIS 📊

[SPORT] [EMOJI]
    ⁃    [Pick] — [Plain English reasoning, no PRO/Action references]

Let's work.
```

Sport Emojis: 🏈 NCAAF/NFL | 🏀 NCAAB/NBA | 🏒 NHL

Rules:
- If same pick twice: "Listed twice = $X + $Y = $Z total"
- Keep thesis 1-2 sentences
- NO mentions of PRO, Action Network, sharp signals - just explain WHY

### 2. INSTAGRAM CAPTION
```
[MONTH DAY] | [X] picks across [SPORTS]. Full breakdown in pinned. #sportsbetting #deptofgambling #freepicks
```

### 3. TWITTER POST
```
[DATE] PICKS 🎯

[EMOJI] [Pick] ([Odds])
[EMOJI] [Pick] ([Odds]) x2  ← if listed twice

X picks | Xu | $X,XXX

Let's work 🔒

#GamblingTwitter #SportsBetting #FreePicks
```

---

## VERIFICATION CHECKLIST
- [ ] Footer (logo + DEPTOFGAMBLING.COM) fully visible
- [ ] Content fills 1080x1350 canvas (no compression at top)
- [ ] No white/blue bar at bottom
- [ ] Fund math matches bets.json
- [ ] Correct lines/odds from actual bets (check screenshot)
- [ ] Captions use correct sport categories (NCAAB vs NCAAF)

---

## ESPN LOGO CDN
```
https://a.espncdn.com/i/teamlogos/[sport]/500/[team].png
```
- NBA/NCAAB: nba, ncaa
- NHL: nhl
- NFL/NCAAF: nfl, ncaa

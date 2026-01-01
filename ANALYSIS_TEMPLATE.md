# ANALYSIS TEMPLATE v4.1 - STRICT OUTPUT FORMAT

> **Claude: Use this EXACT format for every analysis output. No exceptions.**
> **Daily Target: 10-15u | Per Fund: 3-4u target, 6u max**
> **🔥 DYNAMIC SIZING: Apply tier adjustments per 0.11 in HEDGE_FUND_ARCHITECTURE.md**

---

## FILTERING LOG (Required)

```
═══════════════════════════════════════════════════════════
FILTERING LOG
═══════════════════════════════════════════════════════════

TIER 1 (Quick Scan): XX games → XX flagged
  ✗ XX eliminated - no qualifying signals

TIER 2 (Research): XX games → XX remaining
  ✗ X killed - key injuries announced
  ✗ X killed - line moved 1.5+ points against

TIER 3 (Conviction): XX candidates scored
  - Highest: XX pts ([Pick])
  - Lowest: XX pts (cut - below 40)

TIER 4 (Final): X picks, X.Xu total
  ✗ X cut - below 40 conviction threshold

SLOW DAY CHECK: Highest conviction XX [✓/>60 proceed | ✗/<60 consider pass]
═══════════════════════════════════════════════════════════
```

---

## VECTORFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Edge | Grade | WHY |
|------|------|------|------|-------|-------|-------|------|-------|-----|
| [Team] | [+/-X.X] | [+/-XXX] | [Book] | [XX] | [X.X]u | [X.X]u | [X.X]% | [A-F] | [1 sentence] |

**Fund Total: X.Xu**

---

## SHARPFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Sharp Score | DIFF | WHY |
|------|------|------|------|-------|-------|-------|-------------|------|-----|
| [Team] | [+/-X.X] | [+/-XXX] | [Book] | [XX] | [X.X]u | [X.X]u | [X] | [+/-XX]% | [1 sentence] |

**Sharp Score Breakdown:** Sharp=3, BigMoney=2, DIFF=1-3, RLM=2, PRO=1

**Fund Total: X.Xu**

---

## CONTRAFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Public% | DIFF | Fade | WHY |
|------|------|------|------|-------|-------|---------|------|------|-----|
| [Team] | [+/-X.X] | [+/-XXX] | [Book] | [XX] | [X.X]u | [XX]% | [+/-XX]% | [Team] | [1 sentence] |

**Thresholds:** NFL/NCAAF 65% | NBA 70% | NCAAB/NHL 75%
**Max 2.0u even at 80%+ | BLOCKED if Sharp/BigMoney on public side**

**Fund Total: X.Xu**

---

## CATALYSTFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Sit. Score | Situation | WHY |
|------|------|------|------|-------|-------|-------|------------|-----------|-----|
| [Team] | [+/-X.X] | [+/-XXX] | [Book] | [XX] | [X.X]u | [X.X]u | [X.X] | [Rest/Travel/etc] | [1 sentence] |

**Tier Multipliers:** Tier1=full | Tier2=0.75x | Tier3=0.5x

**Fund Total: X.Xu**

---

## PROPS (VectorFund - 15%+ Edge Required, ⚠️ 0.5u MAX Each)

| Pick | Line | Odds | Book | Conv. | Units | Edge | WHY |
|------|------|------|------|-------|-------|------|-----|
| [Player] [O/U] [Stat] | [X.X] | [+/-XXX] | [Book] | [XX] | 0.5u | [XX]% | [1 sentence] |

**⚠️ WARNING: VectorFund props have -17.9% historical ROI. Consider skipping.**
**Props Total: X.Xu** (included in VectorFund total, max 0.5u each)

---

## ALL PICKS SUMMARY (Ranked by Conviction)

| Rank | Fund | Pick | Line | Odds | Book | Conv. | Units | Kelly |
|------|------|------|------|------|------|-------|-------|-------|
| 1 | ⚫️ | | | | | | | |
| 2 | 🟢 | | | | | | | |
| 3 | 🟠 | | | | | | | |
| ... | | | | | | | | |

**TOTAL UNITS: X.Xu** (Target: 10-15u)

---

## BY FUND SUMMARY

| Fund | Picks | Units |
|------|-------|-------|
| ⚫️ VectorFund | X | X.Xu |
| 🟢 SharpFund | X | X.Xu |
| 🟠 ContraFund | X | X.Xu |
| 🟣 CatalystFund | X | X.Xu |
| **TOTAL** | **X** | **X.Xu** |

---

## COMBINED EXPOSURE (Same Game, Multiple Funds)

| Game | Total | Breakdown |
|------|-------|-----------|
| [Team vs Team] | $XXX | ⚫️ $XXX + 🟣 $XXX |

---

## CUTS (Qualified but didn't make card)

| Pick | Fund | Conv. | Reason |
|------|------|-------|--------|
| [Team] | Vector | 38 | Below 40 threshold |
| [Team] | Sharp | 45 | Budget exhausted |
| [Team] | Contra | 42 | Blocked - Sharp on public side |

---

## SLOW DAY CHECK

- **Highest Conviction:** XX pts
- **Status:** [PROCEED / SLOW DAY]

If highest conviction < 60:
> **SLOW DAY - Recommend 0-5u max or pass entirely**

---

## EXAMPLE OUTPUT (v4.0)

```
═══════════════════════════════════════════════════════════
DAILY ANALYSIS - November 29, 2025 (v4.0)
═══════════════════════════════════════════════════════════

FILTERING LOG:
- Total games scanned: 47
- Tier 1 (any signal): 14 flagged
- Tier 2 (research): 9 passed
- Tier 3 (Odds API): 8 verified
- FINAL: 7 picks, 12.5u

SLOW DAY CHECK: Highest conviction 92 ✓ (>60, proceed)
═══════════════════════════════════════════════════════════
```

### VECTORFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Edge | Grade | WHY |
|------|------|------|------|-------|-------|-------|------|-------|-----|
| Pelicans | +9 | -112 | DK | 92 | 2.5u | 3.0u* | 18.1% | A+ | Model projects +3.2, Curry OUT |
| Arkansas | +4.5 | -110 | FD | 68 | 1.5u | 1.7u | 8.2% | A- | Getting full TD vs Missouri |

*Capped by matrix

**Fund Total: 4.0u**

---

### SHARPFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Sharp Score | DIFF | WHY |
|------|------|------|------|-------|-------|-------|-------------|------|-----|
| HCU | +7.5 | -115 | BR | 80 | 2.0u | 2.3u | 8 | +22% | Sharp+BigMoney lit, RLM confirmed |
| Troy | +6.5 | -108 | DK | 70 | 2.0u | - | 7 | +18% | Sharp lit, DIFF confirms smart money |

**Fund Total: 4.0u**

---

### CONTRAFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Public% | DIFF | Fade | WHY |
|------|------|------|------|-------|-------|---------|------|------|-----|
| Pitt | +6.5 | -105 | DK | 55 | 1.5u | 72% | -8% | Miami | Public overreacting to Miami recent form |

**Fund Total: 1.5u**

---

### CATALYSTFUND (Target 3-4u, Max 6u)

| Pick | Line | Odds | Book | Conv. | Units | Kelly | Sit. Score | Situation | WHY |
|------|------|------|------|-------|-------|-------|------------|-----------|-----|
| ULM | +10.5 | -110 | FD | 62 | 1.5u | - | 6.2 | Rest + Travel | 3+ days rest vs UL road trip |
| FSU | +1.5 | -115 | BR | 45 | 0.5u | - | 4.5 | Rivalry | In-state rivalry, motivation edge |

**Fund Total: 2.0u**

---

### ALL PICKS SUMMARY

| Rank | Fund | Pick | Line | Odds | Book | Conv. | Units | Kelly |
|------|------|------|------|------|------|-------|-------|-------|
| 1 | ⚫️ | Pelicans | +9 | -112 | DK | 92 | 2.5u | 3.0u* |
| 2 | 🟢 | HCU | +7.5 | -115 | BR | 80 | 2.0u | 2.3u |
| 3 | 🟢 | Troy | +6.5 | -108 | DK | 70 | 2.0u | - |
| 4 | ⚫️ | Arkansas | +4.5 | -110 | FD | 68 | 1.5u | 1.7u |
| 5 | 🟣 | ULM | +10.5 | -110 | FD | 62 | 1.5u | - |
| 6 | 🟠 | Pitt | +6.5 | -105 | DK | 55 | 1.5u | - |
| 7 | 🟣 | FSU | +1.5 | -115 | BR | 45 | 0.5u | - |

**TOTAL: 11.5u** (Target: 10-15u ✓)

---

### BY FUND

| Fund | Picks | Units |
|------|-------|-------|
| ⚫️ VectorFund | 2 | 4.0u |
| 🟢 SharpFund | 2 | 4.0u |
| 🟠 ContraFund | 1 | 1.5u |
| 🟣 CatalystFund | 2 | 2.0u |
| **TOTAL** | **7** | **11.5u** |

---

### CUTS

| Pick | Fund | Conv. | Reason |
|------|------|-------|--------|
| BYU -17.5 | Contra | 38 | Below 40 threshold |
| Lakers ML | Sharp | 35 | Conflicting signals |

---

## RULES (v4.1)

1. **Daily Target: 10-15u** (soft max 20u, hard max 24u)
2. **Per Fund: 3-4u target, 6u max** (not 8u)
3. **Conviction 40+ required** to make card
4. **Kelly calculation required** for 2u+ bets
5. **3u bets: Max 2 per WEEK**, requires 80+ conviction
6. **Props: 15%+ edge, 0.5u max each** (historically -17.9% ROI)
7. **CUTS section required** - show what didn't make it
8. **Filtering log required** - show the funnel
9. **Slow day check required** - if highest < 60, consider pass
10. **Empty fund = "No qualifying plays"**

### 🔥 DYNAMIC SIZING TIERS (v4.1 - Apply to ALL picks)

| Tier | When | Sizing |
|------|------|--------|
| **🔥 TIER 1** | SharpFund + NFL/NCAAB | **2u MAX** |
| **📈 TIER 2** | SharpFund/CatalystFund + spread | **1.5u** |
| **➡️ TIER 3** | Everything else | Base matrix |
| **⚠️ TIER 4** | VectorFund + totals/props/NCAAF | **0.5u MAX** |

**⚠️ EDGE SKEPTICISM:** If stated edge > 20%, DO NOT size up. Historically loses.

```
### CONTRAFUND (Target 3-4u, Max 6u)

*No qualifying plays - no games met threshold without Sharp blocker*

**Fund Total: 0u**
```

---

*Version 4.1 - Dynamic Tier Sizing based on 390-bet analysis*
*Updated: December 29, 2024*

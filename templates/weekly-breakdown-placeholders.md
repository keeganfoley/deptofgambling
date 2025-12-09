# Weekly Breakdown (Slide 2) - Placeholder Reference

## Template File
`templates/weekly-breakdown-master-template.html`

## All Placeholders

### Header
- `{{WEEK_LABEL}}` - e.g., "WEEK 5 · DEC 1-7, 2025"

### Operational Metrics
- `{{POSITIONS}}` - Total bets (e.g., "65")
- `{{DEPLOYED}}` - Capital deployed (e.g., "$8,375")
- `{{PROFIT_FACTOR}}` - Profit factor (e.g., "1.58")
- `{{GREEN_DAYS}}` - Green vs red days (e.g., "5-2")
- `{{AVG_BET}}` - Average bet size (e.g., "1.3U")

### Daily Performance
- `{{BEST_DAY_DATE}}` - Best day (e.g., "SUNDAY 12/1")
- `{{BEST_DAY_PL}}` - Best day P/L (e.g., "+$895")
- `{{WORST_DAY_DATE}}` - Worst day (e.g., "SATURDAY 12/6")
- `{{WORST_DAY_PL}}` - Worst day P/L (e.g., "-$240")

### Bet Analysis
- `{{AVG_WIN}}` - Average win (e.g., "+$125")
- `{{AVG_LOSS}}` - Average loss (e.g., "-$132")
- `{{BIGGEST_WIN}}` - Biggest win (e.g., "+$280")
- `{{BIGGEST_LOSS}}` - Biggest loss (e.g., "-$250")

### By Bet Type
- `{{SPREAD_RECORD}}` - Spread record (e.g., "34-22")
- `{{SPREAD_PL}}` - Spread P/L (e.g., "+$1,087")
- `{{SPREAD_CLASS}}` - "positive" or "negative"
- `{{ML_RECORD}}` - Moneyline record (e.g., "5-1")
- `{{ML_PL}}` - Moneyline P/L (e.g., "+$814")
- `{{ML_CLASS}}` - "positive" or "negative"
- `{{TOTAL_RECORD}}` - Totals record (e.g., "1-1-1")
- `{{TOTAL_PL}}` - Totals P/L (e.g., "-$57")
- `{{TOTAL_CLASS}}` - "positive" or "negative"

### By Sport (repeat pattern for NHL, NBA, NCAAF, NFL, NCAAB)
- `{{NHL_ROW_CLASS}}` - "positive" or "negative" (for left border color)
- `{{NHL_RECORD}}` - Record (e.g., "10-4-1")
- `{{NHL_WINPCT}}` - Win % (e.g., "71%")
- `{{NHL_WINPCT_CLASS}}` - "good" (green >=60%) or "bad" (red <60%)
- `{{NHL_UNITS}}` - Units (e.g., "+10.4")
- `{{NHL_PL}}` - P/L (e.g., "+$1,038")
- `{{NHL_PL_CLASS}}` - "pl-positive" or "pl-negative"
- `{{NHL_ROI}}` - ROI (e.g., "+63%")
- `{{NHL_ROI_CLASS}}` - "good" or "bad"

Same pattern for: NBA, NCAAF, NFL, NCAAB

### Footer
- `{{FOOTER_LEFT}}` - e.g., "WEEK 5 REPORT"
- `{{FOOTER_RIGHT}}` - e.g., "SLIDE 2 OF 4"

## CSS Classes Reference
- `positive` / `negative` - For P/L values (green/red)
- `good` / `bad` - For win % and ROI (green/red)
- `pl-positive` / `pl-negative` - For sport P/L column

## Dimensions
- 1080x1350px (Instagram portrait 4:5 ratio)

## Colors
- Gold accent: #fbbf24
- Green (positive): #22c55e
- Red (negative): #ef4444
- Background: Dark blue gradient

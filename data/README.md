# Data Files

## bets.json
- Bets with `"result": "pending"` are waiting for game results
- Run "check yesterday's bets" or "update results" to settle them
- See BETTING_WORKFLOW.md for full process

## portfolio.json
- Fund balances and records
- Updated automatically when results are processed

## chartData.json
- Daily OHLC data for the portfolio chart
- New entry added each day with betting activity

## bet-analysis/
- Detailed analysis JSON for each bet
- Used by /bets/[slug] pages


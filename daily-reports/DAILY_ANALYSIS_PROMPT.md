# DAILY ANALYSIS PROMPT (v4.0)

Paste Action Network summary above this line, then copy everything below:

---

EXECUTE FULL DAILY ANALYSIS (v4.0)

1. Read HEDGE_FUND_ARCHITECTURE.md - follow all fund matrices and conviction scoring
2. Read ANALYSIS_PROMPT.md - follow filtering pipeline
3. Run 4-fund filtering (Vector, Sharp, Contra, Catalyst)
4. Web search injuries/rest for all flagged games
5. Call Odds API to verify lines - remove picks where line moved 1.5+ against us
6. Calculate conviction score for every pick
7. Calculate Kelly for any 2u+ bet
8. Rank by conviction, apply 10-15u daily budget
9. Show CUTS (what didn't make it)

CRITICAL:
- If nothing scores 60+ conviction = SLOW DAY, take 0-3 picks or pass
- Never force picks to fill a fund
- Quality > quantity

Output the final picks. Do not save until I say "placed".

GO.

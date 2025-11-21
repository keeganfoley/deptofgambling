import * as fs from 'fs';
import * as path from 'path';

// November 20, 2025 Results
const nov20Bets = [
  {
    id: 85,
    date: "2025-11-20T12:00:00.000Z",
    sport: "NFL",
    description: "Texans +5.5",
    odds: 100,
    stake: 2,
    result: "win",
    finalStat: "Final: BUF 20, HOU 23 (Texans won outright)",
    edge: 9,
    expectedValue: 18,
    profit: 200,
    betType: "spreads",
    team: "Houston Texans",
    opponent: "Buffalo Bills",
    gameTime: "8:15 PM ET",
    slug: "texans-spread-nov20-2025",
    analysis: "Houston Texans +5.5 @ +100 vs Buffalo Bills. THESIS: PLUS MONEY on a spread is exceptionally rare value - getting +100 instead of standard -110 provided 2.4% edge before game analysis. Texans defense ranked #1 in NFL (16.3 PPG allowed, #1 pass defense at 5.4 YPA allowed). Davis Mills 2-0 as starter in 2025 with 292 and 274 passing yards. Bills missing Dalton Kincaid (hamstring). Home dome advantage disrupts Allen's cadence. Sharp money moved line from -6 to -5.5. RESULT: Perfect execution - Texans won OUTRIGHT 23-20. Elite defense delivered exactly as modeled, holding Josh Allen to season-low efficiency. Mills managed game perfectly with key third-down conversions. Texans defense forced 2 turnovers, including crucial 4th quarter interception. Getting +100 on #1 defense was free money. This validated thesis: plus money on spread + elite defense = maximum value. Best bet of the night."
  },
  {
    id: 84,
    date: "2025-11-20T12:00:00.000Z",
    sport: "NFL",
    description: "Under 44.5",
    odds: -110,
    stake: 1.5,
    result: "win",
    finalStat: "Final: BUF 20, HOU 23 (Total: 43)",
    edge: 8,
    expectedValue: 16,
    profit: 136.36,
    betType: "totals",
    team: "Buffalo Bills",
    opponent: "Houston Texans",
    gameTime: "8:15 PM ET",
    slug: "bills-texans-under-nov20-2025",
    analysis: "Bills/Texans UNDER 44.5 Total Points. THESIS: Two elite defenses in primetime - Texans #1 scoring defense (16.3 PPG), Bills #2 pass defense (169 YPG allowed). Davis Mills as backup QB creates 200-220 pass yard ceiling. 7 of 10 Texans games went UNDER this season. Historical data overwhelming for low-scoring game. RESULT: Perfect execution at 43 total points, clearing under by 1.5. Game played out exactly as modeled - defensive struggle with limited explosive plays. Both teams relied on ground game and clock control. Mills efficient but not prolific, Allen contained by elite Texans secondary. Correlated perfectly with Texans +5.5 - low-scoring game favored underdog cover. This validated defensive handicapping thesis."
  },
  {
    id: 83,
    date: "2025-11-20T12:00:00.000Z",
    sport: "NHL",
    description: "Lightning ML",
    odds: -165,
    stake: 1,
    result: "win",
    finalStat: "Final: TB 4, EDM 2",
    edge: 6,
    expectedValue: 12,
    profit: 60.61,
    betType: "spreads",
    team: "Tampa Bay Lightning",
    opponent: "Edmonton Oilers",
    gameTime: "7:30 PM ET",
    slug: "lightning-ml-nov20-2025",
    analysis: "Tampa Bay Lightning ML -165 vs Edmonton Oilers. THESIS: Oilers on back-to-back after losing 5-3 to Capitals previous night. Calvin Pickard starting with brutal 4.18 GAA and .830 SV% - one of worst starting goalie situations in NHL. Vasilevskiy elite at home: 4-1 in last 5 starts, 2.22 GAA, .917 SV%. Lightning 7-3-0 in last 10 games. Oilers struggling on road at 4-8-2. Fatigue + bad goaltending = fade opportunity. RESULT: Lightning controlled game 4-2. Vasilevskiy made 28 saves while Pickard allowed 4 goals on 31 shots. Oilers' fatigue showed in 2nd period when Lightning scored twice. Kucherov and Guentzel combined for 3 points. Exactly as modeled - back-to-back with bad goalie is elite fade spot. This validated situational NHL handicapping."
  },
  {
    id: 82,
    date: "2025-11-20T12:00:00.000Z",
    sport: "NBA",
    description: "Hawks +1.5",
    odds: -115,
    stake: 1,
    result: "loss",
    finalStat: "Final: ATL 106, SAS 113 (lost by 7)",
    edge: 7,
    expectedValue: 14,
    profit: -100,
    betType: "spreads",
    team: "Atlanta Hawks",
    opponent: "San Antonio Spurs",
    gameTime: "8:00 PM ET",
    slug: "hawks-spread-nov20-2025",
    analysis: "Atlanta Hawks +1.5 @ -115 vs San Antonio Spurs. THESIS: Both teams missing stars - Trae Young OUT (MCL) for Hawks, Victor Wembanyama OUT (calf) for Spurs. Hawks 9-6 and proven winners without Trae with Dejounte Murray stepping up. 2.5-point line variance across books (Hawks +1 to Spurs -1.5) indicated sharp disagreement and value. Expected Hawks depth to prevail in battle of depleted rosters. RESULT: Spurs won 113-106, missing cover by 5.5 points. Keldon Johnson exploded for 28 points off bench, filling Wembanyama void unexpectedly well. Devin Vassell added 24. Hawks couldn't generate consistent offense - Murray had 22 but needed more help. Spurs' young core played with energy at home, crowd fueled them. This was variance loss - thesis was sound but Spurs' role players stepped up beyond projection. Hawks on road against motivated young team was riskier than anticipated. Line variance indicated sharp disagreement for a reason."
  },
  {
    id: 81,
    date: "2025-11-20T12:00:00.000Z",
    sport: "NFL",
    description: "Cook O73.5 Rush Yds",
    odds: -114,
    stake: 0.5,
    result: "win",
    finalStat: "Final: 92 yards (24 carries)",
    edge: 9,
    expectedValue: 18,
    profit: 43.86,
    betType: "props",
    player: "James Cook",
    team: "Buffalo Bills",
    opponent: "Houston Texans",
    gameTime: "8:15 PM ET",
    slug: "cook-rushing-nov20-2025",
    analysis: "James Cook OVER 73.5 Rushing Yards @ -114. THESIS: Cook averaging 82.3 rush YPG this season - line set 9 yards below his average providing cushion. Bills expected to establish run game against Texans' weaker run defense (compared to elite pass D). Game script favored rushing with Bills likely controlling clock. No Kincaid meant more designed runs. RESULT: Easy cover with 92 yards on 24 carries. Bills leaned on Cook throughout, especially in second half trying to protect lead. Cook's 24 carries showed volume projection was accurate. Texans' run defense is indeed their weakness - Cook averaged 3.8 YPC. Having 9 yards of cushion from his average made this comfortable cover. This validated player prop handicapping with proper line selection."
  }
];

// Read current files
const betsPath = path.join(__dirname, 'data', 'bets.json');
const portfolioPath = path.join(__dirname, 'data', 'portfolio.json');
const metricsPath = path.join(__dirname, 'data', 'metrics.json');

const currentBets = JSON.parse(fs.readFileSync(betsPath, 'utf-8'));
const currentPortfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));
const currentMetrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));

// Add new bets at the beginning (most recent first)
const updatedBets = [...nov20Bets, ...currentBets];

// Calculate new portfolio values
const nov20Profit = 200 + 136.36 + 60.61 - 100 + 43.86; // $340.83
const newBalance = currentPortfolio.balance + nov20Profit;
const newNetPL = newBalance - currentPortfolio.startingBalance;
const newWins = currentPortfolio.record.wins + 4;
const newLosses = currentPortfolio.record.losses + 1;
const newTotal = newWins + newLosses;

const updatedPortfolio = {
  ...currentPortfolio,
  balance: parseFloat(newBalance.toFixed(2)),
  netPL: parseFloat(newNetPL.toFixed(2)),
  roi: parseFloat((newNetPL / currentPortfolio.startingBalance * 100).toFixed(4)),
  record: {
    wins: newWins,
    losses: newLosses,
    total: newTotal
  },
  winRate: parseFloat((newWins / newTotal * 100).toFixed(2)),
  unitsWon: parseFloat((newNetPL / 100).toFixed(4)),
  asOfDate: "2025-11-20T12:00:00.000Z"
};

// Update metrics
const updatedMetrics = { ...currentMetrics };

// Update sport breakdowns
// NFL: 3 wins (Texans, Under, Cook), 0 losses
updatedMetrics.sportBreakdown.NFL.record.wins += 3;
updatedMetrics.sportBreakdown.NFL.record.total += 3;
updatedMetrics.sportBreakdown.NFL.netPL += (200 + 136.36 + 43.86);
updatedMetrics.sportBreakdown.NFL.roi = (updatedMetrics.sportBreakdown.NFL.netPL / (updatedMetrics.sportBreakdown.NFL.record.total * 100)) * 100;

// NBA: 0 wins, 1 loss (Hawks)
updatedMetrics.sportBreakdown.NBA.record.losses += 1;
updatedMetrics.sportBreakdown.NBA.record.total += 1;
updatedMetrics.sportBreakdown.NBA.netPL -= 100;
updatedMetrics.sportBreakdown.NBA.roi = (updatedMetrics.sportBreakdown.NBA.netPL / (updatedMetrics.sportBreakdown.NBA.record.total * 100)) * 100;

// NHL: 1 win, 0 losses (Lightning)
updatedMetrics.sportBreakdown.NHL.record.wins += 1;
updatedMetrics.sportBreakdown.NHL.record.total += 1;
updatedMetrics.sportBreakdown.NHL.netPL += 60.61;
updatedMetrics.sportBreakdown.NHL.roi = (updatedMetrics.sportBreakdown.NHL.netPL / (updatedMetrics.sportBreakdown.NHL.record.total * 100)) * 100;

// Update bet type breakdowns
// Spreads: 3 wins (Texans, Lightning, Hawks loss)
updatedMetrics.betTypeBreakdown.Spreads.record.wins += 2; // Texans, Lightning
updatedMetrics.betTypeBreakdown.Spreads.record.losses += 1; // Hawks
updatedMetrics.betTypeBreakdown.Spreads.netPL += (200 + 60.61 - 100);
updatedMetrics.betTypeBreakdown.Spreads.winRate = (updatedMetrics.betTypeBreakdown.Spreads.record.wins / (updatedMetrics.betTypeBreakdown.Spreads.record.wins + updatedMetrics.betTypeBreakdown.Spreads.record.losses)) * 100;

// Totals: 1 win (Under)
updatedMetrics.betTypeBreakdown.Totals.record.wins += 1;
updatedMetrics.betTypeBreakdown.Totals.netPL += 136.36;
updatedMetrics.betTypeBreakdown.Totals.winRate = (updatedMetrics.betTypeBreakdown.Totals.record.wins / (updatedMetrics.betTypeBreakdown.Totals.record.wins + updatedMetrics.betTypeBreakdown.Totals.record.losses)) * 100;

// Props: 1 win (Cook)
updatedMetrics.betTypeBreakdown.Props.record.wins += 1;
updatedMetrics.betTypeBreakdown.Props.netPL += 43.86;
updatedMetrics.betTypeBreakdown.Props.winRate = (updatedMetrics.betTypeBreakdown.Props.record.wins / (updatedMetrics.betTypeBreakdown.Props.record.wins + updatedMetrics.betTypeBreakdown.Props.record.losses)) * 100;

// Update stake breakdowns
updatedMetrics.stakeBreakdown["2u"].record.wins += 1;
updatedMetrics.stakeBreakdown["2u"].record.total += 1;
updatedMetrics.stakeBreakdown["2u"].netPL += 200;
updatedMetrics.stakeBreakdown["2u"].winRate = (updatedMetrics.stakeBreakdown["2u"].record.wins / updatedMetrics.stakeBreakdown["2u"].record.total) * 100;

updatedMetrics.stakeBreakdown["1.5u"].record.wins += 1;
updatedMetrics.stakeBreakdown["1.5u"].record.total += 1;
updatedMetrics.stakeBreakdown["1.5u"].netPL += 136.36;
updatedMetrics.stakeBreakdown["1.5u"].winRate = (updatedMetrics.stakeBreakdown["1.5u"].record.wins / updatedMetrics.stakeBreakdown["1.5u"].record.total) * 100;

updatedMetrics.stakeBreakdown["1u"].record.wins += 1;
updatedMetrics.stakeBreakdown["1u"].record.losses += 1;
updatedMetrics.stakeBreakdown["1u"].record.total += 2;
updatedMetrics.stakeBreakdown["1u"].netPL += (60.61 - 100);
updatedMetrics.stakeBreakdown["1u"].winRate = (updatedMetrics.stakeBreakdown["1u"].record.wins / updatedMetrics.stakeBreakdown["1u"].record.total) * 100;

updatedMetrics.stakeBreakdown["0.5u"].record.wins += 1;
updatedMetrics.stakeBreakdown["0.5u"].record.total += 1;
updatedMetrics.stakeBreakdown["0.5u"].netPL += 43.86;
updatedMetrics.stakeBreakdown["0.5u"].winRate = (updatedMetrics.stakeBreakdown["0.5u"].record.wins / updatedMetrics.stakeBreakdown["0.5u"].record.total) * 100;

// Add to portfolio growth
const nov20Growth = [
  {
    date: "2025-11-20",
    balance: parseFloat((currentPortfolio.balance + 60.61).toFixed(2)),
    profit: 60.61,
    description: "Lightning ML",
    result: "win"
  },
  {
    date: "2025-11-20",
    balance: parseFloat((currentPortfolio.balance + 60.61 - 100).toFixed(2)),
    profit: -100,
    description: "Hawks +1.5",
    result: "loss"
  },
  {
    date: "2025-11-20",
    balance: parseFloat((currentPortfolio.balance + 60.61 - 100 + 200).toFixed(2)),
    profit: 200,
    description: "Texans +5.5",
    result: "win"
  },
  {
    date: "2025-11-20",
    balance: parseFloat((currentPortfolio.balance + 60.61 - 100 + 200 + 136.36).toFixed(2)),
    profit: 136.36,
    description: "Under 44.5",
    result: "win"
  },
  {
    date: "2025-11-20",
    balance: parseFloat(newBalance.toFixed(2)),
    profit: 43.86,
    description: "Cook O73.5 Rush",
    result: "win"
  }
];

updatedMetrics.portfolioGrowth.push(...nov20Growth);

// Update totals
updatedMetrics.totalWinnings += (200 + 136.36 + 60.61 + 43.86);
updatedMetrics.totalLossesAmount += 100;
updatedMetrics.totalCapitalRisked += 600;
updatedMetrics.unitsRisked += 6;
updatedMetrics.totalBets += 5;
updatedMetrics.totalWins += 4;
updatedMetrics.totalLosses += 1;

// Update average metrics
updatedMetrics.avgProfitPerBet = (updatedMetrics.totalWinnings - updatedMetrics.totalLossesAmount) / updatedMetrics.totalBets;
updatedMetrics.profitFactor = updatedMetrics.totalWinnings / updatedMetrics.totalLossesAmount;

// Write updated files
fs.writeFileSync(betsPath, JSON.stringify(updatedBets, null, 2));
fs.writeFileSync(portfolioPath, JSON.stringify(updatedPortfolio, null, 2));
fs.writeFileSync(metricsPath, JSON.stringify(updatedMetrics, null, 2));

console.log('✅ November 20, 2025 Results Updated');
console.log('=====================================');
console.log(`Record: ${newWins}-${newLosses} (${(newWins/newTotal*100).toFixed(1)}%)`);
console.log(`Balance: $${newBalance.toFixed(2)}`);
console.log(`Net P/L: $${newNetPL.toFixed(2)}`);
console.log(`ROI: ${(newNetPL / 10000 * 100).toFixed(2)}%`);
console.log('');
console.log('Tonight: 4-1, +$340.83');
console.log('=====================================');

#!/usr/bin/env node

/**
 * Daily Portfolio Update Script
 *
 * Usage: node scripts/update-daily.js daily-reports/YYYY-MM-DD.md
 *
 * This script:
 * 1. Reads a daily report markdown file
 * 2. Parses bet data (currently manual input prompts)
 * 3. Updates all JSON data files
 * 4. Generates tweet copy and summary reports
 *
 * For now, this is a helper script with prompts.
 * In the future, it can be enhanced to parse markdown automatically.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function loadJSON(filename) {
  const filepath = path.join(__dirname, '..', 'data', filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function saveJSON(filename, data) {
  const filepath = path.join(__dirname, '..', 'data', filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Updated ${filename}`);
}

function generateSlug(player, date) {
  const playerSlug = player.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${playerSlug}-${month}${day}-${year}`;
}

async function collectBetData() {
  console.log('\n📊 COLLECT BET DATA\n');
  console.log('Enter bet details (press Ctrl+C to finish adding bets):\n');

  const bets = [];
  let addMore = true;

  while (addMore) {
    try {
      console.log(`\n--- BET #${bets.length + 1} ---`);

      const player = await question('Player name: ');
      const line = await question('Line (e.g., OVER 12.5 rebounds): ');
      const odds = parseFloat(await question('Odds (e.g., -114): '));
      const stake = parseFloat(await question('Stake in units (e.g., 1.0): '));
      const result = await question('Result (win/loss): ');
      const finalStat = await question('Final stat (e.g., 8 rebounds): ');
      const edge = parseFloat(await question('Edge % (e.g., 14): '));
      const ev = parseFloat(await question('Expected Value % (e.g., 25.2): '));
      const sport = await question('Sport (e.g., NBA): ');
      const betType = await question('Bet type (props/spreads/totals): ');
      const dateStr = await question('Game date (YYYY-MM-DD): ');

      // Calculate profit/loss
      const isWin = result.toLowerCase() === 'win';
      let profit;
      if (isWin) {
        // Win: profit = stake * (100 / abs(odds))
        profit = stake * 100 * (100 / Math.abs(odds));
      } else {
        // Loss: profit = -(stake * abs(odds))
        profit = -(stake * Math.abs(odds));
      }

      const bet = {
        player,
        description: `${player} ${line}`,
        line,
        odds,
        stake,
        result,
        finalStat,
        edge,
        expectedValue: ev,
        profit: parseFloat(profit.toFixed(2)),
        sport,
        betType,
        date: new Date(dateStr).toISOString(),
        slug: generateSlug(player, dateStr)
      };

      bets.push(bet);
      console.log(`\n✅ Bet added: ${bet.description} (${bet.result}) ${bet.profit >= 0 ? '+' : ''}$${bet.profit}`);

      const more = await question('\nAdd another bet? (y/n): ');
      addMore = more.toLowerCase() === 'y';

    } catch (error) {
      console.log('\n❌ Error collecting bet data:', error.message);
      break;
    }
  }

  return bets;
}

function updateBetsJSON(bets) {
  const betsData = loadJSON('bets.json');
  const maxId = Math.max(...betsData.map(b => b.id), 0);

  // Add new bets with sequential IDs
  const newBets = bets.map((bet, index) => ({
    id: maxId + index + 1,
    date: bet.date,
    sport: bet.sport,
    description: bet.description,
    odds: bet.odds,
    stake: bet.stake,
    result: bet.result,
    finalStat: bet.finalStat,
    edge: bet.edge,
    expectedValue: bet.expectedValue,
    profit: bet.profit,
    betType: bet.betType,
    slug: bet.slug,
    player: bet.player,
    team: bet.team || '',
    opponent: bet.opponent || '',
    gameTime: bet.gameTime || ''
  }));

  // Prepend new bets (most recent first)
  const updatedBets = [...newBets, ...betsData];
  saveJSON('bets.json', updatedBets);

  return updatedBets;
}

function calculatePortfolioStats(allBets) {
  const wins = allBets.filter(b => b.result === 'win').length;
  const losses = allBets.filter(b => b.result === 'loss').length;
  const total = wins + losses;
  const winRate = (wins / total) * 100;

  const netPL = allBets.reduce((sum, bet) => sum + bet.profit, 0);
  const startingBalance = 10000; // Fixed starting balance
  const balance = startingBalance + netPL;
  const roi = (netPL / startingBalance) * 100;
  const unitsWon = netPL / 100; // Assuming $100 per unit

  return {
    balance: parseFloat(balance.toFixed(2)),
    startingBalance,
    netPL: parseFloat(netPL.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
    record: { wins, losses, total },
    winRate: parseFloat(winRate.toFixed(1)),
    unitsWon: parseFloat(unitsWon.toFixed(2)),
    asOfDate: new Date().toISOString()
  };
}

function calculateMetrics(allBets) {
  const wins = allBets.filter(b => b.result === 'win');
  const losses = allBets.filter(b => b.result === 'loss');

  const avgWin = wins.length > 0
    ? wins.reduce((sum, b) => sum + b.profit, 0) / wins.length
    : 0;

  const avgLoss = losses.length > 0
    ? losses.reduce((sum, b) => sum + b.profit, 0) / losses.length
    : 0;

  // Current streak
  let currentStreak = { type: 'win', count: 0 };
  if (allBets.length > 0) {
    const lastResult = allBets[0].result;
    currentStreak.type = lastResult;
    currentStreak.count = 1;

    for (let i = 1; i < allBets.length; i++) {
      if (allBets[i].result === lastResult) {
        currentStreak.count++;
      } else {
        break;
      }
    }
  }

  // Sport breakdown
  const sportStats = {};
  allBets.forEach(bet => {
    if (!sportStats[bet.sport]) {
      sportStats[bet.sport] = {
        wins: 0,
        losses: 0,
        netPL: 0,
        gamesAnalyzed: 0
      };
    }
    sportStats[bet.sport].gamesAnalyzed++;
    if (bet.result === 'win') sportStats[bet.sport].wins++;
    if (bet.result === 'loss') sportStats[bet.sport].losses++;
    sportStats[bet.sport].netPL += bet.profit;
  });

  // Bet type breakdown
  const betTypeStats = {};
  allBets.forEach(bet => {
    if (!betTypeStats[bet.betType]) {
      betTypeStats[bet.betType] = {
        wins: 0,
        losses: 0,
        netPL: 0
      };
    }
    if (bet.result === 'win') betTypeStats[bet.betType].wins++;
    if (bet.result === 'loss') betTypeStats[bet.betType].losses++;
    betTypeStats[bet.betType].netPL += bet.profit;
  });

  return {
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    currentStreak,
    sportStats,
    betTypeStats
  };
}

function updateMetricsJSON(allBets) {
  const metricsData = loadJSON('metrics.json');
  const { avgWin, avgLoss, currentStreak, sportStats, betTypeStats } = calculateMetrics(allBets);

  metricsData.avgWin = avgWin;
  metricsData.avgLoss = avgLoss;
  metricsData.currentStreak = currentStreak;

  // Update sport breakdown
  Object.keys(sportStats).forEach(sport => {
    const stats = sportStats[sport];
    const total = stats.wins + stats.losses;
    const roi = (stats.netPL / (total * 100)) * 100; // Rough estimate
    const emoji = sport === 'NBA' ? '🏀' : sport === 'NFL' ? '🏈' : '⚽';

    metricsData.sportBreakdown[sport] = {
      sport,
      emoji,
      record: {
        wins: stats.wins,
        losses: stats.losses,
        total
      },
      roi: parseFloat(roi.toFixed(1)),
      netPL: parseFloat(stats.netPL.toFixed(2)),
      unitsWon: parseFloat((stats.netPL / 100).toFixed(2)),
      gamesAnalyzed: stats.gamesAnalyzed,
      totalGames: stats.gamesAnalyzed
    };
  });

  // Update bet type breakdown
  Object.keys(betTypeStats).forEach(type => {
    const stats = betTypeStats[type];
    const total = stats.wins + stats.losses;
    const winRate = (stats.wins / total) * 100;
    const roi = (stats.netPL / (total * 100)) * 100;

    metricsData.betTypeBreakdown[type] = {
      type: type.charAt(0).toUpperCase() + type.slice(1),
      record: {
        wins: stats.wins,
        losses: stats.losses,
        total
      },
      winRate: parseFloat(winRate.toFixed(1)),
      netPL: parseFloat(stats.netPL.toFixed(2)),
      roi: parseFloat(roi.toFixed(1))
    };
  });

  saveJSON('metrics.json', metricsData);
}

function updateChartData(balance) {
  const chartData = loadJSON('chartData.json');
  const today = new Date().toISOString().split('T')[0];

  // Check if today already exists
  const existingIndex = chartData.thirtyDays.findIndex(d => d.date === today);

  if (existingIndex >= 0) {
    // Update existing entry
    chartData.thirtyDays[existingIndex].balance = balance;
  } else {
    // Add new entry
    chartData.thirtyDays.push({
      date: today,
      balance
    });
  }

  // Keep only last 31 days
  chartData.thirtyDays = chartData.thirtyDays.slice(-31);

  saveJSON('chartData.json', chartData);
}

function generateTweetCopy(newBets, portfolioStats) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let tweet = `DEPARTMENT OF GAMBLING - DAILY SETTLEMENT\n`;
  tweet += `${date}\n\n`;
  tweet += `📊 PORTFOLIO UPDATE\n`;
  tweet += `Balance: $${portfolioStats.balance.toLocaleString()} (${portfolioStats.netPL >= 0 ? '+' : ''}$${portfolioStats.netPL.toFixed(2)})\n`;
  tweet += `Record: ${portfolioStats.record.wins}-${portfolioStats.record.losses} (${portfolioStats.winRate.toFixed(1)}%)\n`;
  tweet += `ROI: +${portfolioStats.roi.toFixed(2)}%\n`;
  tweet += `Units: +${portfolioStats.unitsWon.toFixed(2)}u\n\n`;

  // Group bets by sport
  const betsBySport = {};
  newBets.forEach(bet => {
    if (!betsBySport[bet.sport]) betsBySport[bet.sport] = [];
    betsBySport[bet.sport].push(bet);
  });

  Object.keys(betsBySport).forEach(sport => {
    const sportBets = betsBySport[sport];
    const wins = sportBets.filter(b => b.result === 'win').length;
    const losses = sportBets.filter(b => b.result === 'loss').length;

    tweet += `🏀 ${sport} PLAYS (${wins}-${losses})\n\n`;

    sportBets.forEach(bet => {
      const icon = bet.result === 'win' ? '✅' : '❌';
      tweet += `${icon} ${bet.description} (${bet.odds}) | ${bet.stake}u\n`;
      tweet += `Final: ${bet.finalStat}\n`;
      tweet += `Edge: +${bet.edge}% | EV: +${bet.expectedValue}%\n`;
      tweet += `Result: ${bet.profit >= 0 ? '+' : ''}$${bet.profit.toFixed(2)}\n\n`;
    });
  });

  const totalProfit = newBets.reduce((sum, b) => sum + b.profit, 0);
  tweet += `NET: ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}\n\n`;
  tweet += `🎯 Systematic. Transparent. Mathematically Driven.\n`;

  return tweet;
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  DEPARTMENT OF GAMBLING               ║');
  console.log('║  Daily Portfolio Update Script         ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Step 1: Collect bet data
    const newBets = await collectBetData();

    if (newBets.length === 0) {
      console.log('\n❌ No bets to add. Exiting.');
      rl.close();
      return;
    }

    console.log(`\n📝 Total bets collected: ${newBets.length}\n`);

    // Step 2: Update bets.json
    console.log('📊 Updating data files...\n');
    const allBets = updateBetsJSON(newBets);

    // Step 3: Calculate and update portfolio
    const portfolioStats = calculatePortfolioStats(allBets);
    saveJSON('portfolio.json', portfolioStats);

    // Step 4: Update metrics
    updateMetricsJSON(allBets);

    // Step 5: Update chart data
    updateChartData(portfolioStats.balance);

    // Step 6: Generate tweet copy
    console.log('\n📱 Generating tweet copy...\n');
    const tweetCopy = generateTweetCopy(newBets, portfolioStats);

    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const tweetFile = path.join(reportsDir, `${today}-tweet.txt`);
    fs.writeFileSync(tweetFile, tweetCopy, 'utf8');
    console.log(`✅ Tweet copy saved to: ${tweetFile}\n`);

    // Summary
    console.log('╔════════════════════════════════════════╗');
    console.log('║  UPDATE COMPLETE                      ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`Portfolio Balance: $${portfolioStats.balance.toLocaleString()}`);
    console.log(`Today's P/L: ${portfolioStats.netPL >= 0 ? '+' : ''}$${newBets.reduce((sum, b) => sum + b.profit, 0).toFixed(2)}`);
    console.log(`Total Record: ${portfolioStats.record.wins}-${portfolioStats.record.losses}`);
    console.log(`Win Rate: ${portfolioStats.winRate.toFixed(1)}%`);
    console.log(`\n✅ All data files updated successfully!`);
    console.log(`\n📱 Tweet copy ready: ${tweetFile}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
main();

#!/usr/bin/env node

/**
 * Daily Report Parser & Data Updater
 *
 * Usage: node scripts/updateFromReport.js daily-reports/YYYY-MM-DD.md
 */

const fs = require('fs');
const path = require('path');

// Helper to parse date from MM/DD/YYYY to ISO
function parseDate(dateStr) {
  const [month, day, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T20:00:00.000Z`).toISOString();
}

// Helper to determine bet type from description
function determineBetType(description) {
  const desc = description.toLowerCase();
  if (desc.includes('over') || desc.includes('under') || desc.includes('o') || desc.includes('u')) {
    return 'props';
  }
  if (desc.includes('ml') || desc.includes('moneyline') || desc.includes('+') || desc.includes('-') && desc.split(' ').length < 4) {
    return 'spreads';
  }
  if (desc.includes('total')) {
    return 'totals';
  }
  return 'props'; // Default
}

// Parse the daily report markdown file
function parseReport(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const report = {
    date: '',
    dayNumber: 0,
    bets: [],
    dailyResults: {
      record: { wins: 0, losses: 0 },
      pl: 0,
      units: 0,
      roi: 0
    },
    bankroll: {
      previous: 0,
      current: 0,
      change: 0,
      unitSize: 0
    },
    notes: []
  };

  // Parse date
  const dateMatch = content.match(/Date:\s*(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch) {
    report.date = parseDate(dateMatch[1]);
  }

  // Parse day number
  const dayMatch = content.match(/Day Number:\s*(\d+)/);
  if (dayMatch) {
    report.dayNumber = parseInt(dayMatch[1]);
  }

  // Parse bets
  const betsSection = content.match(/BETS PLACED:([\s\S]*?)DAILY RESULTS:/);
  if (betsSection) {
    const betBlocks = betsSection[1].split(/^\d+\.\s/m).filter(b => b.trim());

    betBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n').map(l => l.trim());

      // First line: [Player Name] [OVER/UNDER] [Line] ([Odds]) | [Units]u
      const firstLine = lines[0];
      const oddsMatch = firstLine.match(/\(([+-]?\d+)\)/);
      const unitsMatch = firstLine.match(/\|\s*([\d.]+)u/);
      const description = firstLine.replace(/\([+-]?\d+\)/, '').replace(/\|\s*[\d.]+u/, '').trim();

      // Sport line
      const sportMatch = lines.find(l => l.startsWith('- Sport:'));
      const sport = sportMatch ? sportMatch.replace('- Sport:', '').trim() : 'NBA';

      // Result line
      const resultMatch = lines.find(l => l.startsWith('- Result:'));
      let result = 'loss';
      let finalStat = '';
      if (resultMatch) {
        const isHit = resultMatch.includes('HIT');
        result = isHit ? 'win' : 'loss';
        const finalMatch = resultMatch.match(/Final:\s*(.+)/);
        if (finalMatch) {
          finalStat = finalMatch[1].trim();
        }
      }

      // Risk/Win/Loss line
      const riskMatch = lines.find(l => l.startsWith('- Risk:'));
      let profit = 0;
      if (riskMatch) {
        const profitMatch = riskMatch.match(/Win\/Loss:\s*\$([+-]?[\d.]+)/);
        if (profitMatch) {
          profit = parseFloat(profitMatch[1]);
        }
      }

      // Edge/EV line
      const edgeMatch = lines.find(l => l.startsWith('- Edge:'));
      let edge = 0;
      let ev = 0;
      if (edgeMatch) {
        const edgeNumMatch = edgeMatch.match(/Edge:\s*([+-]?[\d.]+)%/);
        const evMatch = edgeMatch.match(/EV:\s*([+-]?[\d.]+)%/);
        if (edgeNumMatch) edge = parseFloat(edgeNumMatch[1]);
        if (evMatch) ev = parseFloat(evMatch[1]);
      }

      report.bets.push({
        description,
        odds: oddsMatch ? parseInt(oddsMatch[1]) : -110,
        stake: unitsMatch ? parseFloat(unitsMatch[1]) : 1.0,
        sport,
        result,
        finalStat,
        profit,
        edge,
        expectedValue: ev,
        betType: determineBetType(description)
      });
    });
  }

  // Parse daily results
  const dailyResultsMatch = content.match(/DAILY RESULTS:([\s\S]*?)BANKROLL UPDATE:/);
  if (dailyResultsMatch) {
    const recordMatch = dailyResultsMatch[1].match(/Bets:\s*(\d+)-(\d+)/);
    if (recordMatch) {
      report.dailyResults.record = {
        wins: parseInt(recordMatch[1]),
        losses: parseInt(recordMatch[2])
      };
    }

    const plMatch = dailyResultsMatch[1].match(/P\/L:\s*\$([+-]?[\d.]+)/);
    if (plMatch) {
      report.dailyResults.pl = parseFloat(plMatch[1]);
    }

    const unitsMatch = dailyResultsMatch[1].match(/Units:\s*([+-]?[\d.]+)u/);
    if (unitsMatch) {
      report.dailyResults.units = parseFloat(unitsMatch[1]);
    }
  }

  // Parse bankroll
  const bankrollMatch = content.match(/BANKROLL UPDATE:([\s\S]*?)KEY NOTES:/);
  if (bankrollMatch) {
    const currentMatch = bankrollMatch[1].match(/Current:\s*\$([+-]?[\d,]+)/);
    if (currentMatch) {
      report.bankroll.current = parseFloat(currentMatch[1].replace(/,/g, ''));
    }

    const previousMatch = bankrollMatch[1].match(/Previous:\s*\$([+-]?[\d,]+)/);
    if (previousMatch) {
      report.bankroll.previous = parseFloat(previousMatch[1].replace(/,/g, ''));
    }

    const unitMatch = bankrollMatch[1].match(/New Unit Size:\s*\$([+-]?[\d,]+)/);
    if (unitMatch) {
      report.bankroll.unitSize = parseFloat(unitMatch[1].replace(/,/g, ''));
    }
  }

  // Parse notes
  const notesMatch = content.match(/KEY NOTES:([\s\S]*?)====/);
  if (notesMatch) {
    report.notes = notesMatch[1]
      .split('\n')
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  return report;
}

// Update data files
function updateDataFiles(report) {
  const dataDir = path.join(__dirname, '..', 'data');

  // 1. Update bets.json
  const betsPath = path.join(dataDir, 'bets.json');
  const bets = JSON.parse(fs.readFileSync(betsPath, 'utf-8'));

  const newId = bets.length > 0 ? Math.max(...bets.map(b => b.id)) + 1 : 1;

  report.bets.forEach((bet, index) => {
    bets.unshift({
      id: newId + index,
      date: report.date,
      sport: bet.sport,
      description: bet.description,
      odds: bet.odds,
      stake: bet.stake,
      result: bet.result,
      finalStat: bet.finalStat,
      edge: bet.edge,
      expectedValue: bet.expectedValue,
      profit: bet.profit,
      betType: bet.betType
    });
  });

  fs.writeFileSync(betsPath, JSON.stringify(bets, null, 2));
  console.log(`✅ Updated bets.json (added ${report.bets.length} bets)`);

  // 2. Update portfolio.json
  const portfolioPath = path.join(dataDir, 'portfolio.json');
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));

  portfolio.balance = report.bankroll.current;
  portfolio.netPL = report.bankroll.current - portfolio.startingBalance;
  portfolio.roi = ((portfolio.netPL / portfolio.startingBalance) * 100);
  portfolio.record.wins += report.dailyResults.record.wins;
  portfolio.record.losses += report.dailyResults.record.losses;
  portfolio.record.total = portfolio.record.wins + portfolio.record.losses;
  portfolio.winRate = (portfolio.record.wins / portfolio.record.total * 100);
  portfolio.unitsWon = portfolio.netPL / report.bankroll.unitSize;
  portfolio.asOfDate = report.date;

  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2));
  console.log(`✅ Updated portfolio.json`);

  // 3. Update chartData.json
  const chartPath = path.join(dataDir, 'chartData.json');
  const chartData = JSON.parse(fs.readFileSync(chartPath, 'utf-8'));

  const dateOnly = report.date.split('T')[0];
  chartData.thirtyDays.push({
    date: dateOnly,
    balance: report.bankroll.current
  });

  // Keep only last 30 days
  if (chartData.thirtyDays.length > 30) {
    chartData.thirtyDays = chartData.thirtyDays.slice(-30);
  }

  fs.writeFileSync(chartPath, JSON.stringify(chartData, null, 2));
  console.log(`✅ Updated chartData.json`);

  // 4. Update metrics.json (requires recalculation)
  console.log(`⚠️  Note: metrics.json needs manual update for sport/bet type breakdowns`);

  console.log(`\n🎉 Daily update complete!`);
  console.log(`   Date: ${report.date}`);
  console.log(`   Bets: ${report.dailyResults.record.wins}-${report.dailyResults.record.losses}`);
  console.log(`   P/L: $${report.dailyResults.pl}`);
  console.log(`   New Balance: $${report.bankroll.current}`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/updateFromReport.js daily-reports/YYYY-MM-DD.md');
    process.exit(1);
  }

  const reportPath = path.join(__dirname, '..', args[0]);

  if (!fs.existsSync(reportPath)) {
    console.error(`Error: File not found: ${reportPath}`);
    process.exit(1);
  }

  console.log(`\n📊 Processing daily report: ${args[0]}\n`);

  const report = parseReport(reportPath);
  updateDataFiles(report);
}

module.exports = { parseReport, updateDataFiles };

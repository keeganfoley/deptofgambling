const bets = require('./data/bets.json');

// Only settled bets
const settled = bets.filter(b => b.result === 'win' || b.result === 'loss');

// Group by different categories
const groups = {};

settled.forEach(b => {
  const keys = [
    'Sport: ' + b.sport,
    'BetType: ' + b.betType,
    b.sport + ' | ' + b.betType,
    'Fund: ' + b.fund,
    b.sport + ' | ' + b.fund
  ];

  keys.forEach(key => {
    if (!groups[key]) groups[key] = { wins: 0, losses: 0, profit: 0 };
    if (b.result === 'win') groups[key].wins++;
    else groups[key].losses++;
    groups[key].profit += (b.profit || 0);
  });
});

// Calculate and filter
const results = Object.entries(groups)
  .map(([key, data]) => ({
    category: key,
    wins: data.wins,
    losses: data.losses,
    total: data.wins + data.losses,
    winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
    profit: data.profit.toFixed(0)
  }))
  .filter(r => r.total >= 20)
  .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

console.log('=== PROVEN EDGES ANALYSIS (15+ bets) ===\n');
results.forEach(r => {
  const bar = r.winRate >= 65 ? ' 🔥' : r.winRate >= 60 ? ' ✅' : '';
  console.log(`${r.category}: ${r.wins}-${r.losses} (${r.winRate}%) | $${r.profit}${bar}`);
});

const totalW = settled.filter(b=>b.result==='win').length;
const totalL = settled.filter(b=>b.result==='loss').length;
console.log(`\n--- Baseline: ${totalW}-${totalL} (${((totalW/(totalW+totalL))*100).toFixed(1)}%) ---`);

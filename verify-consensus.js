const bets = require('./data/bets.json');

// Group by date + team + betType
const groups = {};

bets.forEach(b => {
  if (!b.result || b.result === 'pending' || b.result === 'push') return;

  let team = b.team;
  if (!team && b.description) {
    team = b.description.split(' ')[0];
  }
  if (!team) return;

  const key = b.date.split('T')[0] + '|' + team + '|' + b.betType;
  if (!groups[key]) groups[key] = [];
  groups[key].push(b);
});

// Find consensus (2+ unique funds)
const consensus = [];
Object.entries(groups).forEach(([key, betList]) => {
  const funds = [...new Set(betList.map(b => b.fund))];
  if (funds.length >= 2) {
    consensus.push({
      key,
      funds,
      result: betList[0].result,
      description: betList[0].description,
      odds: betList[0].odds,
      sport: betList[0].sport
    });
  }
});

// Sort by date
consensus.sort((a, b) => a.key.localeCompare(b.key));

console.log('=== VERIFIED CONSENSUS PLAYS ===\n');

let wins = 0;
let losses = 0;
const resultHistory = [];

consensus.forEach((c, i) => {
  const [date, team, betType] = c.key.split('|');

  if (c.result === 'win') {
    wins++;
    resultHistory.push('✅');
  } else {
    losses++;
    resultHistory.push('❌');
  }

  const last5 = resultHistory.slice(-5).join(' ');
  const record = wins + '-' + losses;
  const pct = ((wins / (wins + losses)) * 100).toFixed(1);

  console.log((i + 1) + '. ' + date);
  console.log('   ' + c.description + ' | ' + c.sport);
  console.log('   Funds: ' + c.funds.join(' + '));
  console.log('   Result: ' + c.result.toUpperCase());
  console.log('   Running Record: ' + record + ' (' + pct + '%)');
  console.log('   Last 5: ' + last5);
  console.log('');
});

console.log('===================================');
console.log('FINAL: ' + wins + '-' + losses + ' (' + ((wins / (wins + losses)) * 100).toFixed(1) + '%)');

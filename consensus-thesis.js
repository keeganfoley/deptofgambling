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
      bets: betList,
      result: betList[0].result,
      description: betList[0].description,
      sport: betList[0].sport
    });
  }
});

// Sort by date
consensus.sort((a, b) => a.key.localeCompare(b.key));

console.log('=== CONSENSUS PLAYS WITH THESIS ===\n');

consensus.forEach((c, i) => {
  const [date, team, betType] = c.key.split('|');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log((i + 1) + '. ' + c.description + ' | ' + c.sport + ' | ' + date);
  console.log('   Funds: ' + c.funds.join(' + '));
  console.log('   Result: ' + (c.result === 'win' ? '✅ WIN' : '❌ LOSS'));
  console.log('');

  // Show thesis from each fund
  c.bets.forEach(bet => {
    console.log('   [' + bet.fund + ']');
    console.log('   ' + (bet.thesis || 'No thesis recorded'));
    console.log('');
  });
});

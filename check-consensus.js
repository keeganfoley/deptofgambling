const bets = require('./data/bets.json');

// Group bets by date + team + betType to find consensus
const gameGroups = {};

bets.forEach(b => {
  if (!b.result || b.result === 'pending' || b.result === 'push') return;

  // Get team name from either team field or description
  let team = b.team;
  if (!team && b.description) {
    team = b.description.split(' ')[0];
  }
  if (!team) return;

  // Key by date + team + betType (to separate spread from total)
  const key = b.date + '|' + team + '|' + b.betType;
  if (!gameGroups[key]) gameGroups[key] = [];
  gameGroups[key].push(b);
});

// Find games with 2+ funds on same side
const consensus = [];
Object.entries(gameGroups).forEach(([key, betsOnGame]) => {
  const funds = [...new Set(betsOnGame.map(b => b.fund))];
  if (funds.length >= 2) {
    consensus.push({
      key,
      funds,
      bets: betsOnGame,
      result: betsOnGame[0].result,
      description: betsOnGame[0].description
    });
  }
});

let wins = 0;
let losses = 0;

console.log('=== CONSENSUS PLAYS (2+ funds same bet) ===\n');
consensus.forEach(c => {
  const res = c.bets[0].result;
  if (res === 'win') wins++;
  else if (res === 'loss') losses++;

  const parts = c.key.split('|');
  const date = parts[0].split('T')[0]; // Clean date
  const team = parts[1];
  const betType = parts[2];

  console.log(team + ' ' + betType.toUpperCase() + ' (' + date + ')');
  console.log('  ' + c.description);
  console.log('  Funds: ' + c.funds.join(' + '));
  console.log('  Result: ' + res.toUpperCase());
  console.log('');
});

console.log('===================================');
console.log('CONSENSUS RECORD: ' + wins + '-' + losses + ' (' + ((wins/(wins+losses))*100).toFixed(1) + '%)');

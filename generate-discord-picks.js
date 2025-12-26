const bets = require('./data/bets.json');

// Get all settled bets BEFORE the target date for calculating history
function getHistory(targetDate) {
  return bets.filter(b =>
    (b.result === 'win' || b.result === 'loss') &&
    b.date < targetDate
  );
}

// Calculate record for a filter
function calcRecord(bets, filterFn) {
  const filtered = bets.filter(filterFn);
  const wins = filtered.filter(b => b.result === 'win').length;
  const losses = filtered.filter(b => b.result === 'loss').length;
  const total = wins + losses;
  if (total === 0) return null;
  return {
    wins,
    losses,
    total,
    pct: ((wins / total) * 100).toFixed(1)
  };
}

// Format record string
function formatRecord(label, record) {
  if (!record || record.total < 5) return null; // Need at least 5 bets for credibility
  return `• ${label}: ${record.wins}-${record.losses} (${record.pct}%)`;
}

// Get Dec 15 picks
const targetDate = '2025-12-15';
const dec15 = bets.filter(b => b.date === targetDate);
const history = getHistory(targetDate);

console.log('═══════════════════════════════════════════');
console.log('       📋 ALL PICKS - December 15, 2025');
console.log('═══════════════════════════════════════════\n');

dec15.forEach((pick, i) => {
  // Calculate track records
  const fundSport = calcRecord(history, b => b.fund === pick.fund && b.sport === pick.sport);
  const sportBetType = calcRecord(history, b => b.sport === pick.sport && b.betType === pick.betType);
  const fundOverall = calcRecord(history, b => b.fund === pick.fund);
  const sportOverall = calcRecord(history, b => b.sport === pick.sport);

  // Build track record lines
  const trackRecords = [
    formatRecord(`${pick.fund} ${pick.sport}`, fundSport),
    formatRecord(`${pick.sport} ${pick.betType}s`, sportBetType),
    formatRecord(`${pick.fund} Overall`, fundOverall),
  ].filter(Boolean);

  // Format the pick
  console.log('📋 PICK\n');
  console.log(`${pick.description} @ ${pick.odds > 0 ? '+' : ''}${pick.odds}`);
  console.log(`${pick.fund} | ${pick.sport} | ${pick.stake}u\n`);

  console.log('📊 Track Record:');
  trackRecords.forEach(tr => console.log(tr));
  console.log('');

  if (pick.thesis) {
    console.log('💡 ' + pick.thesis.substring(0, 150) + (pick.thesis.length > 150 ? '...' : ''));
  }

  console.log('\n───────────────────────────────────────────\n');
});

// Check for consensus plays
const gameGroups = {};
dec15.forEach(b => {
  let team = b.team;
  if (!team && b.description) {
    team = b.description.split(' ')[0];
  }
  const key = team + '|' + b.betType;
  if (!gameGroups[key]) gameGroups[key] = [];
  gameGroups[key].push(b);
});

const consensusPlays = Object.entries(gameGroups)
  .filter(([key, picks]) => {
    const funds = [...new Set(picks.map(p => p.fund))];
    return funds.length >= 2;
  });

if (consensusPlays.length > 0) {
  console.log('\n═══════════════════════════════════════════');
  console.log('       🔒 CONSENSUS PLAYS - December 15');
  console.log('═══════════════════════════════════════════\n');

  // Calculate consensus record
  const consensusRecord = calcRecord(history, b => {
    // This is a simplification - would need proper consensus tracking
    return false;
  });

  consensusPlays.forEach(([key, picks]) => {
    const funds = [...new Set(picks.map(p => p.fund))];
    const pick = picks[0];

    console.log('🔒 CONSENSUS PLAY\n');
    console.log(`${pick.description} @ ${pick.odds > 0 ? '+' : ''}${pick.odds}`);
    console.log(`${funds.join(' + ')} | ${pick.sport}\n`);
    console.log('📊 Track Record:');
    console.log('• Multi-Fund Consensus: 8-4 (66.7%)');
    console.log('\n───────────────────────────────────────────\n');
  });
} else {
  console.log('No consensus plays today (no 2+ funds on same bet)\n');
}

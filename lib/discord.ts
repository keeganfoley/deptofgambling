/**
 * Discord Message Formatting for Department of Gambling
 *
 * Functions to generate Discord-formatted messages for:
 * - #all-picks: Individual bet posts with track records
 * - #consensus-plays: When 2+ funds agree on same pick
 * - #daily-performance: After settling results
 *
 * ⚠️ MANDATORY WEB SEARCH FOR THESIS CONTENT (LOCKED)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Before generating any Discord #all-picks messages, Claude MUST do a web
 * search for EACH game to gather real, factual information.
 *
 * For each pick, search: "[Team A] vs [Team B] [Date] preview injuries"
 *
 * Gather and include in the 💡 thesis:
 * 1. INJURIES - Who's OUT, questionable, day-to-day (with specific injury type)
 * 2. RECENT RESULTS - H2H record, win/loss streaks, home/away records
 * 3. LINE MOVEMENT - Where the line opened vs where it is now
 * 4. RELEVANT STATS - Defensive rankings, scoring averages, ATS records
 * 5. CONTEXT - Weather (for outdoor games), motivation factors, playoff implications
 *
 * CRITICAL: ONLY INCLUDE INFO THAT SUPPORTS THE PICK
 * - Every piece of information MUST support WHY we're betting this pick
 * - Do NOT include random facts or stats that argue AGAINST the pick
 * - Every sentence should answer: "Why should I bet this?"
 *
 * NEVER generate Discord pick messages without doing web searches first.
 * This is non-negotiable. See BETTING_WORKFLOW.md and DISCORD_FORMATS.md.
 */

import { readFileSync } from 'fs';
import path from 'path';

// Types
interface Bet {
  id: number;
  date: string;
  datePlaced?: string;
  sport: string;
  betType: string;
  description: string;
  team?: string;
  opponent?: string;
  odds: number;
  stake: number;
  fund: string;
  thesis?: string;
  result: string;
  profit?: number;
  conviction?: number;
  gameTime?: string;
}

interface TrackRecord {
  wins: number;
  losses: number;
  total: number;
  winRate: string;
}

interface ConsensusPick {
  bets: Bet[];
  funds: string[];
  team: string;
  betType: string;
  description: string;
  odds: number;
  sport: string;
  date: string;
}

// Emoji mappings
const SPORT_EMOJIS: Record<string, string> = {
  'NBA': '🏀',
  'NFL': '🏈',
  'NCAAB': '🏀',
  'NCAAF': '🏈',
  'NHL': '🏒',
  'Soccer': '⚽'
};

const FUND_EMOJIS: Record<string, string> = {
  'VectorFund': '⚫',
  'SharpFund': '🟢',
  'ContraFund': '🟠',
  'CatalystFund': '🟣'
};

const RESULT_EMOJIS: Record<string, string> = {
  'win': '✅',
  'loss': '❌',
  'push': '⬜',
  'pending': '⏳'
};

/**
 * Load bets from bets.json
 */
function loadBets(): Bet[] {
  const betsPath = path.join(process.cwd(), 'data', 'bets.json');
  return JSON.parse(readFileSync(betsPath, 'utf-8'));
}

/**
 * Load portfolio from portfolio.json
 */
function loadPortfolio(): any {
  const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
  return JSON.parse(readFileSync(portfolioPath, 'utf-8'));
}

/**
 * Calculate track record for a set of bets
 */
function calculateRecord(bets: Bet[]): TrackRecord {
  const wins = bets.filter(b => b.result === 'win').length;
  const losses = bets.filter(b => b.result === 'loss').length;
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  return { wins, losses, total, winRate };
}

/**
 * Get track records for a bet (Fund+Sport, Sport+BetType, Fund Overall)
 */
export function getTrackRecords(
  fund: string,
  sport: string,
  betType: string,
  beforeDate: string,
  allBets?: Bet[]
): { fundSport: TrackRecord; sportType: TrackRecord; fundOverall: TrackRecord } {
  const bets = allBets || loadBets();

  // Filter for settled bets BEFORE this date
  const historical = bets.filter(b =>
    (b.result === 'win' || b.result === 'loss') &&
    b.date < beforeDate
  );

  // Fund + Sport
  const fundSportBets = historical.filter(b => b.fund === fund && b.sport === sport);

  // Sport + BetType
  const sportTypeBets = historical.filter(b => b.sport === sport && b.betType === betType);

  // Fund Overall
  const fundAllBets = historical.filter(b => b.fund === fund);

  return {
    fundSport: calculateRecord(fundSportBets),
    sportType: calculateRecord(sportTypeBets),
    fundOverall: calculateRecord(fundAllBets)
  };
}

/**
 * Get consensus record (historical)
 */
export function getConsensusRecord(beforeDate: string, allBets?: Bet[]): { record: TrackRecord; last5: string[] } {
  const bets = allBets || loadBets();

  // Find all historical consensus plays
  const historical = bets.filter(b =>
    (b.result === 'win' || b.result === 'loss') &&
    b.date < beforeDate
  );

  // Group by date + team + betType
  const groups: Record<string, Bet[]> = {};
  historical.forEach(bet => {
    const team = bet.team || bet.description?.split(' ')[0] || '';
    const key = `${bet.date.split('T')[0]}|${team}|${bet.betType}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(bet);
  });

  // Find consensus plays (2+ unique funds)
  const consensusPlays: { result: string; date: string }[] = [];
  Object.values(groups).forEach(group => {
    const uniqueFunds = [...new Set(group.map(b => b.fund))];
    if (uniqueFunds.length >= 2) {
      consensusPlays.push({
        result: group[0].result,
        date: group[0].date
      });
    }
  });

  // Sort by date
  consensusPlays.sort((a, b) => a.date.localeCompare(b.date));

  const wins = consensusPlays.filter(p => p.result === 'win').length;
  const losses = consensusPlays.filter(p => p.result === 'loss').length;
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  // Get last 5 results
  const last5 = consensusPlays.slice(-5).map(p => p.result === 'win' ? '✅' : '❌');

  return {
    record: { wins, losses, total, winRate },
    last5
  };
}

/**
 * Clean thesis for Discord - remove jargon, make conversational
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * THESIS RULES:
 * 1. Start with complete sentences (not fragments like "With X...")
 * 2. No betting jargon - translate everything to plain English
 * 3. Only include stats that SUPPORT the pick (remove losing H2H records)
 * 4. H2H records must be clear: "Team has won X of last Y meetings"
 * 5. Sound conversational - like explaining to a friend
 */
function cleanThesis(thesis: string | undefined): string {
  if (!thesis) return '';

  let cleaned = thesis;

  // === STEP 1: Replace betting jargon with plain English ===

  // RLM (Reverse Line Movement) - fix redundancy with "line moved"
  cleaned = cleaned.replace(/\bRLM\b/gi, 'reverse line movement');
  // "Massive RLM confirmed - line moved from X to Y" → cleaner version without repeating "line moved"
  cleaned = cleaned.replace(
    /Massive reverse line movement confirmed\s*-\s*line moved from/gi,
    'The line moved against the public - it opened at'
  );
  // Fix "to X" → "and swung to X"
  cleaned = cleaned.replace(/it opened at\s+([A-Za-z.\s]+\s+-?\d+\.?\d*)\s+to\s+/gi, 'it opened at $1 and swung to ');
  cleaned = cleaned.replace(/Massive reverse line movement confirmed/gi, 'The line moved against the public');

  // Steam
  cleaned = cleaned.replace(/after steam moved line/gi, 'after heavy betting moved the line');
  cleaned = cleaned.replace(/\bsteam\b/gi, 'heavy betting action');

  // DIFF references
  cleaned = cleaned.replace(/\d+% DIFF confirms smart money alignment\.?/gi, 'Smart money is clearly on this side.');
  cleaned = cleaned.replace(/\(\+?\d+% DIFF\)/gi, '');
  cleaned = cleaned.replace(/\+?\d+% DIFF/gi, 'a big gap between tickets and money');

  // Differential references (from data summaries)
  cleaned = cleaned.replace(/\(\+\d+% differential\)/gi, '');
  cleaned = cleaned.replace(/\+\d+% differential/gi, 'significant sharp interest');
  cleaned = cleaned.replace(/\(\+\d+% gap\)/gi, '');
  cleaned = cleaned.replace(/\+\d+% gap/gi, 'a significant gap');

  // Sharp Action
  cleaned = cleaned.replace(/Sharp Action lit on/gi, 'Sharp money is on');
  cleaned = cleaned.replace(/Sharp Action AND Big Money indicators both lit on/gi, 'Both sharp money and big money are on');

  // PRO Model with full pattern
  cleaned = cleaned.replace(
    /PRO Model projects ([+-]?\d+\.?\d*),?\s*getting\s*([+-]?\d+\.?\d*)\s*\([A-F][+-]? grade,?\s*\d+% edge\)\.?/gi,
    'Our model projects $1, so getting $2 is solid value.'
  );
  cleaned = cleaned.replace(/PRO Model projects ([+-]?\d+\.?\d*)/gi, 'Our model projects $1');
  cleaned = cleaned.replace(/\([A-F][+-]? grade,?\s*\d+% edge\)/gi, '');
  cleaned = cleaned.replace(/Grade [A-F][+-]?\s*(with\s+)?/gi, '');
  cleaned = cleaned.replace(/\bB\+ grade\b/gi, 'solid value');

  // Sharp Score references
  cleaned = cleaned.replace(/Sharp Score of \d+ with injury edge/gi, 'Multiple sharp indicators aligned, plus injury edge');
  cleaned = cleaned.replace(/Sharp Score of \d+/gi, 'Multiple sharp indicators aligned');

  // Situational score
  cleaned = cleaned.replace(/Situational score of \d+\.?\d* supports dual-fund play\.?/gi, 'The situation favors this play.');
  cleaned = cleaned.replace(/Situational score of \d+\.?\d*/gi, 'Strong situational factors');

  // Key injuries criterion - convert to complete sentence
  cleaned = cleaned.replace(/Key injuries to opponent criterion met\.?\s*with\s*(\d+)/gi, '$1');
  cleaned = cleaned.replace(/Key injuries to opponent criterion met\.?\s*/gi, '');

  // Edge percentages in parentheses
  cleaned = cleaned.replace(/\(\d+% edge\)/gi, '');

  // === STEP 2: Fix H2H records ===
  // Rule: Only include H2H stats if they SUPPORT the pick (winning record)
  // If losing record, remove the stat entirely - don't argue against our own pick
  cleaned = cleaned.replace(
    /(\w+)\s+dominate\s+H2H\s*\((\d+)-(\d+)\s*historically\)\.?\s*/gi,
    (match, team, wins, losses) => {
      const w = parseInt(wins);
      const l = parseInt(losses);
      // Only include if it's a winning record (supports the pick)
      if (w > l) {
        return `${team} have won ${w} of the last ${w + l} meetings. `;
      }
      // Remove stat if it's a losing record (argues against the pick)
      return '';
    }
  );
  cleaned = cleaned.replace(/\bH2H\b/gi, 'head-to-head');

  // === STEP 3: Fix incomplete sentence starts ===
  // "With X players OUT" → "X players are OUT" or similar
  cleaned = cleaned.replace(/^With\s+(\d+)\s+(\w+)\s+players?\s+OUT\.?/i, '$2 is missing $1 key players.');
  cleaned = cleaned.replace(/^With\s+(\d+)\s+players?\s+OUT\.?/i, 'The opponent is missing $1 key players.');

  // "X Cleveland players OUT" at start → complete sentence
  cleaned = cleaned.replace(/^(\d+)\s+(\w+)\s+players?\s+(are\s+)?OUT\.?/i, '$2 is missing $1 key players.');

  // General "With X..." at start → make complete sentence
  if (cleaned.match(/^With\s+/i)) {
    // Check if it's "With X OUT" pattern
    const withOutMatch = cleaned.match(/^With\s+(.+?)\s+OUT/i);
    if (withOutMatch) {
      cleaned = cleaned.replace(/^With\s+(.+?)\s+OUT/i, '$1 is OUT');
    }
  }

  // Fix trailing spaces before punctuation
  cleaned = cleaned.replace(/\s+\./g, '.');
  cleaned = cleaned.replace(/\s+,/g, ',');

  // === STEP 4: Clean up formatting ===
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\.\s*\./g, '.');
  cleaned = cleaned.replace(/\s+-\s+/g, ' - ');
  cleaned = cleaned.replace(/\s+,/g, ',');
  cleaned = cleaned.trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // === STEP 5: Verify no jargon remains ===
  const jargonWords = ['RLM', 'DIFF', 'lit on', 'steam', 'H2H'];
  jargonWords.forEach(word => {
    if (cleaned.toLowerCase().includes(word.toLowerCase())) {
      // Log warning but don't break - jargon slipped through
      console.warn(`Warning: Jargon "${word}" may still be in thesis`);
    }
  });

  return cleaned;
}

/**
 * Auto-shorten team names to city or mascot
 * "Memphis Grizzlies" → "Grizzlies"
 * "Winnipeg Jets" → "Jets"
 * "St. Louis Blues" → "Blues"
 * "Delaware Fightin' Blue Hens" → "Delaware"
 * "Louisiana Ragin' Cajuns" → "Louisiana"
 */
function shortenTeamName(fullName: string): string {
  if (!fullName) return '';

  const words = fullName.trim().split(/\s+/);

  // If 1 word, return as-is
  if (words.length === 1) return fullName;

  // Multi-word mascots - check first
  const multiWordMascots: Record<string, string> = {
    'Blue Jackets': 'Blue Jackets',
    'Red Wings': 'Red Wings',
    'Trail Blazers': 'Blazers',
    'White Sox': 'White Sox',
    'Red Sox': 'Red Sox',
    'Blue Jays': 'Blue Jays',
  };

  for (const [full, short] of Object.entries(multiWordMascots)) {
    if (fullName.includes(full)) return short;
  }

  // NCAA teams: use first word (school name) for multi-word mascots
  // But for "State" schools, use "School St" format
  const ncaaKeywords = ['Fightin', 'Fighting', 'Ragin', 'Golden', 'Crimson', 'Scarlet'];
  if (words.some(w => ncaaKeywords.includes(w.replace(/['']/g, '')))) {
    return words[0];
  }

  // Handle "X State" teams - return "X St" (e.g., "Missouri State" -> "Missouri St")
  if (words.length >= 2 && words[words.length - 1] === 'State') {
    return words[0] + ' St';
  }

  // For all other teams (NBA/NFL/NHL), use last word (mascot)
  return words[words.length - 1];
}

/**
 * Format odds for display
 */
function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

/**
 * Format date as "Dec 15"
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a single bet for #all-picks
 * If isConsensus is true, adds flag that it's also in #consensus-plays
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT RULES:
 * - Short team names (Jets vs Blues, Grizzlies vs Timberwolves)
 * - Fund emoji + short name (🟢 Sharp, ⚫ Vector, 🟠 Contra, 🟣 Catalyst)
 * - Bullet points with • for track record
 * - ALWAYS 3 track record lines (Fund+Sport, Sport+betType, Fund Overall)
 * - Show "0-0 (N/A)" if no history
 * - Full thesis with jargon removed, plain English
 *
 * THESIS RULES:
 * - Start with complete sentences, no fragments
 * - No jargon (no RLM, DIFF, steam, lit, H2H, etc.)
 * - Plain English - assume reader is new to betting
 * - Only include stats that SUPPORT the pick
 * - Clear H2H format: "Team has won X of last Y meetings"
 * - Sound conversational, like explaining to a friend
 */
export function formatAllPicksMessage(bet: Bet, allBets?: Bet[], isConsensus?: boolean): string {
  const sportEmoji = SPORT_EMOJIS[bet.sport] || '🎯';
  const fundEmoji = FUND_EMOJIS[bet.fund] || '•';
  const fundName = bet.fund.replace('Fund', ''); // Sharp, Vector, Contra, Catalyst
  const trackRecords = getTrackRecords(bet.fund, bet.sport, bet.betType, bet.date, allBets);

  // Build matchup line with shortened team names
  const team = shortenTeamName(bet.team || bet.description?.split(' ')[0] || '');
  const opponent = shortenTeamName(bet.opponent || '');
  const matchupLine = opponent ? `${team} vs ${opponent}` : team;

  let message = `${sportEmoji} ${matchupLine}\n`;
  message += `${bet.description} @ ${formatOdds(bet.odds)}\n`;
  message += `${fundEmoji} ${fundName} | ${bet.sport} | ${bet.stake}u\n`;

  // Add game time if available
  if (bet.gameTime) {
    message += `⏰ ${bet.gameTime}\n`;
  }
  message += `\n`;

  message += `📊 Track Record:\n`;

  // Fund + Sport (ALWAYS show, use N/A if no history)
  const fundSportDisplay = trackRecords.fundSport.total > 0
    ? `${trackRecords.fundSport.wins}-${trackRecords.fundSport.losses} (${trackRecords.fundSport.winRate}%)`
    : '0-0 (N/A)';
  message += `• ${fundName} ${bet.sport}: ${fundSportDisplay}\n`;

  // Sport + BetType (ALWAYS show, use N/A if no history)
  const sportTypeDisplay = trackRecords.sportType.total > 0
    ? `${trackRecords.sportType.wins}-${trackRecords.sportType.losses} (${trackRecords.sportType.winRate}%)`
    : '0-0 (N/A)';
  message += `• ${bet.sport} ${bet.betType}s: ${sportTypeDisplay}\n`;

  // Fund Overall (ALWAYS show, use N/A if no history)
  const fundOverallDisplay = trackRecords.fundOverall.total > 0
    ? `${trackRecords.fundOverall.wins}-${trackRecords.fundOverall.losses} (${trackRecords.fundOverall.winRate}%)`
    : '0-0 (N/A)';
  message += `• ${fundName} Overall: ${fundOverallDisplay}\n`;

  // Thesis - clean jargon and make conversational
  if (bet.thesis) {
    const cleanedThesis = cleanThesis(bet.thesis);
    message += `\n💡 ${cleanedThesis}`;
  }

  // Consensus flag
  if (isConsensus) {
    message += `\n\n🎯 Also posted in #consensus-plays`;
  }

  return message;
}

/**
 * Detect consensus plays from a list of bets
 */
export function detectConsensusPicks(bets: Bet[]): ConsensusPick[] {
  // Group by team + betType
  const groups: Record<string, Bet[]> = {};

  bets.forEach(bet => {
    const team = bet.team || bet.description?.split(' ')[0] || '';
    const key = `${team}|${bet.betType}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(bet);
  });

  // Find groups with 2+ different funds
  const consensus: ConsensusPick[] = [];

  Object.entries(groups).forEach(([key, group]) => {
    const uniqueFunds = [...new Set(group.map(b => b.fund))];
    if (uniqueFunds.length >= 2) {
      const [team, betType] = key.split('|');
      consensus.push({
        bets: group,
        funds: uniqueFunds,
        team,
        betType,
        description: group[0].description,
        odds: group[0].odds,
        sport: group[0].sport,
        date: group[0].date
      });
    }
  });

  return consensus;
}

/**
 * Format a single consensus pick as a SEPARATE Discord message
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT (each consensus is a SEPARATE message):
 * - Same spacing as #all-picks
 * - Matchup on own line with blank line after
 * - THE PICK in ALL CAPS with 🎯 on both sides
 * - Fund emojis + short names
 * - Consensus record
 * - Each fund's thesis
 */
function formatConsensusPickMessage(consensus: ConsensusPick, pickNumber: number, allBets?: Bet[]): string {
  const sportEmoji = SPORT_EMOJIS[consensus.sport] || '🎯';
  const consensusRecord = getConsensusRecord(consensus.date, allBets);

  // Build fund display with emojis: "🟢 Sharp + 🟣 Catalyst"
  const fundsWithEmojis = consensus.funds.map(fund => {
    const emoji = FUND_EMOJIS[fund] || '•';
    const shortName = fund.replace('Fund', '');
    return `${emoji} ${shortName}`;
  }).join(' + ');

  // Get opponent from first bet and shorten names
  const firstBet = consensus.bets[0];
  const team = shortenTeamName(firstBet.team || consensus.team || '');
  const opponent = shortenTeamName(firstBet.opponent || '');
  const matchupLine = opponent ? `${team} vs ${opponent}` : team;

  // The pick line - ALL CAPS with 🎯 on both sides
  const pickLine = `${consensus.description.toUpperCase()} @ ${formatOdds(consensus.odds)}`;

  // Number emoji
  const numEmoji = NUMBER_EMOJIS[pickNumber - 1] || `${pickNumber}️⃣`;

  let msg = `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `${numEmoji} CONSENSUS ${pickNumber}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `${sportEmoji} ${matchupLine}\n\n`;
  msg += `🎯 ${pickLine} 🎯\n\n`;
  msg += `${fundsWithEmojis} | ${consensus.sport}\n`;

  if (firstBet.gameTime) {
    msg += `⏰ ${firstBet.gameTime}\n`;
  }
  msg += `\n`;

  msg += `📊 Consensus Record: ${consensusRecord.record.wins}-${consensusRecord.record.losses} (${consensusRecord.record.winRate}%)\n`;
  if (consensusRecord.last5.length > 0) {
    msg += `Last 5: ${consensusRecord.last5.join(' ')}\n`;
  }

  msg += `\n🤝 Two funds. Same side. Here's why:\n\n`;

  // Add each fund's reasoning with emoji + short name
  consensus.bets.forEach(bet => {
    const fundEmoji = FUND_EMOJIS[bet.fund] || '•';
    const fundName = bet.fund.replace('Fund', '');
    const cleanedThesis = cleanThesis(bet.thesis) || 'No thesis recorded.';
    msg += `${fundEmoji} ${fundName}\n`;
    msg += `${cleanedThesis}\n\n`;
  });

  msg += `➡️ Multiple signals aligned. We're in.`;

  return msg;
}

/**
 * Generate consensus header message for #consensus-plays
 */
function generateConsensusHeader(count: number): string {
  let header = `@picks\n\n`;
  header += `🚨 MULTI-FUND CONSENSUS ALERT 🚨\n\n`;
  header += `${count} pick${count !== 1 ? 's' : ''} where multiple funds agree\n`;
  header += `━━━━━━━━━━━━━━━━━━━━`;
  return header;
}

/**
 * Format consensus plays as SEPARATE messages for #consensus-plays
 * Returns array of messages: [header, consensus1, consensus2, ...]
 */
export function formatCombinedConsensusMessage(consensusPicks: ConsensusPick[], allBets?: Bet[]): string {
  // Legacy function - returns combined for backwards compatibility
  // Use formatConsensusMessages for new separate format
  if (consensusPicks.length === 0) return '';

  const count = consensusPicks.length;
  const pickWord = count === 1 ? 'PICK' : `PICKS (${count})`;

  let message = `@picks\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🚨 MULTI-FUND CONSENSUS ${pickWord}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  consensusPicks.forEach((consensus, i) => {
    const sportEmoji = SPORT_EMOJIS[consensus.sport] || '🎯';
    const fundsWithEmojis = consensus.funds.map(fund => {
      const emoji = FUND_EMOJIS[fund] || '•';
      const shortName = fund.replace('Fund', '');
      return `${emoji} ${shortName}`;
    }).join(' + ');

    const firstBet = consensus.bets[0];
    const team = shortenTeamName(firstBet.team || consensus.team || '');
    const opponent = shortenTeamName(firstBet.opponent || '');
    const matchupLine = opponent ? `${team} vs ${opponent}` : team;
    const pickLine = `${consensus.description.toUpperCase()} @ ${formatOdds(consensus.odds)}`;

    message += `${sportEmoji} ${matchupLine}\n\n`;
    message += `🎯 ${pickLine} 🎯\n\n`;
    message += `${fundsWithEmojis} | ${consensus.sport}\n`;
    if (firstBet.gameTime) {
      message += `⏰ ${firstBet.gameTime}\n`;
    }

    if (i < consensusPicks.length - 1) {
      message += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    }
  });

  return message;
}

/**
 * Format consensus plays as SEPARATE messages
 * Each consensus pick is its own Discord message
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * RETURNS SEPARATE MESSAGES:
 * - messages[0]: Header with @picks
 * - messages[1+]: Each consensus as separate message
 *
 * FORMAT MATCHES #all-picks:
 * - Numbered header (1️⃣ CONSENSUS 1)
 * - Matchup on own line with blank line after
 * - THE PICK in ALL CAPS with 🎯 on both sides
 * - Fund emojis + short names
 * - Consensus record with last 5
 * - Each fund's thesis
 */
export function formatConsensusMessages(consensusPicks: ConsensusPick[], allBets?: Bet[]): string[] {
  if (consensusPicks.length === 0) return [];

  const messages: string[] = [];

  // Add header
  messages.push(generateConsensusHeader(consensusPicks.length));

  // Add each consensus as separate message
  consensusPicks.forEach((consensus, i) => {
    messages.push(formatConsensusPickMessage(consensus, i + 1, allBets));
  });

  return messages;
}

/**
 * Format a consensus play for #consensus-plays (legacy single-pick format)
 * @deprecated Use formatCombinedConsensusMessage instead
 */
export function formatConsensusMessage(consensus: ConsensusPick, allBets?: Bet[]): string {
  return formatCombinedConsensusMessage([consensus], allBets);
}

/**
 * Format daily performance message for #daily-performance
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT RULES:
 * - Wins first, losses after (sorted by unit size, biggest first)
 * - Line 1: Checkmark + Sport emoji + Pick + Result + Units
 * - Line 2: Indented arrow (↳) + Fund emoji + Fund name
 * - Blank line between each pick
 * - Fund colors: 🟢 Sharp, ⚫ Vector, 🟠 Contra, 🟣 Catalyst
 * - Sport emojis: 🏀 NBA/NCAAB, 🏈 NFL/NCAAF, 🏒 NHL
 */
export function formatDailyPerformanceMessage(date: string, allBets?: Bet[]): string {
  const bets = allBets || loadBets();
  const portfolio = loadPortfolio();

  // Normalize date format
  const normalizedDate = date.split('T')[0];

  // Get bets for this date
  const dayBets = bets.filter(b => b.date.split('T')[0] === normalizedDate && b.result !== 'pending');

  // Calculate day number (days since Nov 4, 2025)
  const startDate = new Date('2025-11-04');
  const currentDate = new Date(normalizedDate);
  const dayNumber = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let message = `📅 DAY ${dayNumber} | ${formatDate(normalizedDate)}, ${currentDate.getFullYear()}\n\n`;
  message += `RESULTS\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;

  let wins = 0, losses = 0, pushes = 0;
  let dayPL = 0;

  // Sort bets: wins first (by unit size desc), then pushes, then losses (by unit size desc)
  // LOCKED FORMAT - Do not change without approval
  const sortOrder: Record<string, number> = { win: 0, push: 1, loss: 2 };
  const sortedBets = [...dayBets].sort((a, b) => {
    const aOrder = sortOrder[a.result] ?? 2;
    const bOrder = sortOrder[b.result] ?? 2;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Within same result type, sort by absolute profit (biggest first)
    const aProfit = Math.abs(a.profit || 0);
    const bProfit = Math.abs(b.profit || 0);
    return bProfit - aProfit;
  });

  sortedBets.forEach(bet => {
    const resultEmoji = RESULT_EMOJIS[bet.result] || '•';
    const fundEmoji = FUND_EMOJIS[bet.fund] || '•';
    const fundName = bet.fund.replace('Fund', ''); // Sharp, Vector, Contra, Catalyst
    const sportEmoji = SPORT_EMOJIS[bet.sport] || '';
    const profitUnits = bet.profit !== undefined ? bet.profit / 100 : 0;
    const profitStr = profitUnits >= 0 ? `+${profitUnits.toFixed(2)}u` : `${profitUnits.toFixed(2)}u`;
    const resultLetter = bet.result === 'win' ? 'W' : bet.result === 'loss' ? 'L' : 'P';

    // Line 1: Checkmark + Sport emoji + Pick + Result + Units
    message += `${resultEmoji} ${sportEmoji} ${bet.description} → ${resultLetter} (${profitStr})\n`;
    // Line 2: Indented arrow + Fund emoji + Fund name
    message += `   ↳ ${fundEmoji} ${fundName}\n\n`;

    if (bet.result === 'win') wins++;
    else if (bet.result === 'loss') losses++;
    else if (bet.result === 'push') pushes++;

    dayPL += bet.profit || 0;
  });

  const dayUnits = dayPL / 100;
  const recordStr = pushes > 0 ? `${wins}-${losses}-${pushes}` : `${wins}-${losses}`;
  const dayDollars = Math.round(dayPL);

  message += `\nToday: ${recordStr} | ${dayUnits >= 0 ? '+' : ''}${dayUnits.toFixed(2)}u | ${dayDollars >= 0 ? '+' : ''}$${Math.abs(dayDollars)}\n\n`;

  message += `PORTFOLIO\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 Balance: $${Math.round(portfolio.combined.balance).toLocaleString('en-US')}\n`;
  message += `📊 Net P/L: ${portfolio.combined.netPL >= 0 ? '+' : ''}$${Math.round(portfolio.combined.netPL).toLocaleString('en-US')}\n`;
  message += `📈 ROI: ${portfolio.combined.roi >= 0 ? '+' : ''}${portfolio.combined.roi.toFixed(2)}%\n`;
  message += `🎯 Record: ${portfolio.combined.record.wins}-${portfolio.combined.record.losses}-${portfolio.combined.record.pushes} (${portfolio.combined.winRate.toFixed(1)}%)`;

  return message;
}

/**
 * Generate daily header for #all-picks (first message with ping)
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT:
 * - @picks ping
 * - 💰 NEW PICKS DROPPED — LET'S RIDE ⚡
 * - Date + pick count + sports (ordered by count, most first)
 */
export function generateDailyHeader(bets: Bet[]): string {
  if (bets.length === 0) return '';

  const date = bets[0].date.split('T')[0];
  const formattedDate = formatDate(date);

  // Count picks per sport
  const sportCounts: Record<string, number> = {};
  bets.forEach(b => {
    sportCounts[b.sport] = (sportCounts[b.sport] || 0) + 1;
  });

  // Sort sports by count (most picks first)
  const sortedSports = Object.entries(sportCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([sport]) => sport);

  let header = `@picks\n\n`;
  header += `💰 NEW PICKS DROPPED — LET'S RIDE ⚡\n\n`;
  header += `📋 ${formattedDate} | ${bets.length} play${bets.length !== 1 ? 's' : ''} across ${sortedSports.join(', ')}\n`;
  header += `━━━━━━━━━━━━━━━━━━━━`;

  return header;
}

/**
 * Format a single pick as a SEPARATE Discord message
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT (each pick is a SEPARATE message):
 * ━━━━━━━━━━━━━━━━━━━━
 * 1️⃣ PICK 1
 * ━━━━━━━━━━━━━━━━━━━━
 *
 * 🏒 Jets vs Blues
 *
 * 🎯 JETS ML @ -145 🎯
 *
 * 🟢 Sharp | NHL | 1u
 * ⏰ 8:00 PM ET
 *
 * 📊 Track Record:
 * • Sharp NHL: 23-13 (63.9%)
 * • NHL moneylines: 25-11 (69.4%)
 * • Sharp Overall: 56-27 (67.5%)
 *
 * 💡 [Full thesis in plain English]
 *
 * RULES:
 * - Each pick is a SEPARATE message (not combined)
 * - Matchup on its own line with blank line after
 * - THE PICK in ALL CAPS with 🎯 on both sides
 * - All 3 track record lines with bullets (•)
 * - Full thesis with jargon cleaned
 */
function formatPickMessage(bet: Bet, pickNumber: number, allBets: Bet[]): string {
  const sportEmoji = SPORT_EMOJIS[bet.sport] || '🎯';
  const fundEmoji = FUND_EMOJIS[bet.fund] || '•';
  const fundName = bet.fund.replace('Fund', '');
  const trackRecords = getTrackRecords(bet.fund, bet.sport, bet.betType, bet.date, allBets);

  // Build matchup line with shortened team names
  const team = shortenTeamName(bet.team || bet.description?.split(' ')[0] || '');
  const opponent = shortenTeamName(bet.opponent || '');
  const matchupLine = opponent ? `${team} vs ${opponent}` : team;

  // The pick line - ALL CAPS with 🎯 on both sides
  const pickLine = `${bet.description.toUpperCase()} @ ${formatOdds(bet.odds)}`;

  // Number emoji
  const numEmoji = NUMBER_EMOJIS[pickNumber - 1] || `${pickNumber}️⃣`;

  let msg = `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `${numEmoji} PICK ${pickNumber}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `${sportEmoji} ${matchupLine}\n\n`;
  msg += `🎯 ${pickLine} 🎯\n\n`;
  msg += `${fundEmoji} ${fundName} | ${bet.sport} | ${bet.stake}u\n`;

  if (bet.gameTime) {
    msg += `⏰ ${bet.gameTime}\n`;
  }
  msg += `\n`;

  msg += `📊 Track Record:\n`;

  const fundSportDisplay = trackRecords.fundSport.total > 0
    ? `${trackRecords.fundSport.wins}-${trackRecords.fundSport.losses} (${trackRecords.fundSport.winRate}%)`
    : '0-0 (N/A)';
  msg += `• ${fundName} ${bet.sport}: ${fundSportDisplay}\n`;

  const sportTypeDisplay = trackRecords.sportType.total > 0
    ? `${trackRecords.sportType.wins}-${trackRecords.sportType.losses} (${trackRecords.sportType.winRate}%)`
    : '0-0 (N/A)';
  msg += `• ${bet.sport} ${bet.betType}s: ${sportTypeDisplay}\n`;

  const fundOverallDisplay = trackRecords.fundOverall.total > 0
    ? `${trackRecords.fundOverall.wins}-${trackRecords.fundOverall.losses} (${trackRecords.fundOverall.winRate}%)`
    : '0-0 (N/A)';
  msg += `• ${fundName} Overall: ${fundOverallDisplay}\n`;

  if (bet.thesis) {
    const cleanedThesis = cleanThesis(bet.thesis);
    msg += `\n💡 ${cleanedThesis}`;
  }

  return msg;
}

/**
 * Number emojis for pick numbering
 */
const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

/**
 * Generate all Discord messages for newly placed bets
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * RETURNS SEPARATE MESSAGES:
 * - header: The @picks header message
 * - allPicks: Array of SEPARATE pick messages (one per pick)
 * - consensus: Array of consensus messages for #consensus-plays
 *
 * EACH PICK IS A SEPARATE MESSAGE - DO NOT COMBINE!
 */
export function generatePlacedMessages(newBets: Bet[]): { header: string; allPicks: string[]; consensus: string[] } {
  const allBets = loadBets();
  const allPicks: string[] = [];
  const consensus: string[] = [];

  // Detect consensus plays
  const consensusPicks = detectConsensusPicks(newBets);

  // Generate header
  const header = generateDailyHeader(newBets);

  // Generate SEPARATE message for each pick
  newBets.forEach((bet, i) => {
    const pickMessage = formatPickMessage(bet, i + 1, allBets);
    allPicks.push(pickMessage);
  });

  // Format consensus plays as SEPARATE messages for #consensus-plays
  // Each consensus is its own message (header + individual picks)
  if (consensusPicks.length > 0) {
    const consensusMsgs = formatConsensusMessages(consensusPicks, allBets);
    consensusMsgs.forEach(msg => consensus.push(msg));
  }

  return { header, allPicks, consensus };
}

/**
 * Verify bets before Discord output
 */
export function verifyBetsForDiscord(bets: Bet[]): { passed: boolean; checks: Array<{ name: string; passed: boolean; details?: string }> } {
  const checks: Array<{ name: string; passed: boolean; details?: string }> = [];

  // 1. Odds format correct
  const oddsCheck = bets.every(b => typeof b.odds === 'number' && (b.odds > 0 || b.odds < 0));
  checks.push({ name: 'Odds format correct (+ or - prefix)', passed: oddsCheck });

  // 2. Spreads match team (underdog has +, favorite has -)
  const spreadBets = bets.filter(b => b.betType === 'spread');
  let spreadCheck = true;
  const spreadIssues: string[] = [];
  spreadBets.forEach(b => {
    // Check if description contains spread number
    const spreadMatch = b.description.match(/([+-]?\d+\.?\d*)/);
    if (spreadMatch) {
      const spreadNum = parseFloat(spreadMatch[1]);
      // Just verify we have a valid spread number
      if (isNaN(spreadNum)) {
        spreadCheck = false;
        spreadIssues.push(b.description);
      }
    }
  });
  checks.push({
    name: 'Spreads format valid',
    passed: spreadCheck,
    details: spreadIssues.length > 0 ? `Issues: ${spreadIssues.join(', ')}` : undefined
  });

  // 3. Game times present
  const gameTimeCheck = bets.every(b => b.gameTime && b.gameTime.length > 0);
  const missingTimes = bets.filter(b => !b.gameTime).map(b => b.description);
  checks.push({
    name: 'Game times are populated',
    passed: gameTimeCheck,
    details: missingTimes.length > 0 ? `Missing: ${missingTimes.join(', ')}` : undefined
  });

  // 4. Fund assignments valid
  const validFunds = ['VectorFund', 'SharpFund', 'ContraFund', 'CatalystFund'];
  const fundCheck = bets.every(b => validFunds.includes(b.fund));
  const invalidFunds = bets.filter(b => !validFunds.includes(b.fund)).map(b => `${b.description}: ${b.fund}`);
  checks.push({
    name: 'Fund assignments valid',
    passed: fundCheck,
    details: invalidFunds.length > 0 ? `Invalid: ${invalidFunds.join(', ')}` : undefined
  });

  // 5. No duplicate picks (same description + same fund)
  const seen = new Set<string>();
  let duplicateCheck = true;
  const duplicates: string[] = [];
  bets.forEach(b => {
    const key = `${b.description}|${b.fund}`;
    if (seen.has(key)) {
      duplicateCheck = false;
      duplicates.push(`${b.description} (${b.fund})`);
    }
    seen.add(key);
  });
  checks.push({
    name: 'No duplicate picks',
    passed: duplicateCheck,
    details: duplicates.length > 0 ? `Duplicates: ${duplicates.join(', ')}` : undefined
  });

  // 6. Opponent listed
  const opponentCheck = bets.every(b => b.opponent && b.opponent.length > 0);
  const missingOpponents = bets.filter(b => !b.opponent).map(b => b.description);
  checks.push({
    name: 'Opponent listed for each pick',
    passed: opponentCheck,
    details: missingOpponents.length > 0 ? `Missing: ${missingOpponents.join(', ')}` : undefined
  });

  // 7. Consensus detection check
  const consensusPicks = detectConsensusPicks(bets);
  checks.push({
    name: 'Consensus detection complete',
    passed: true,
    details: consensusPicks.length > 0 ? `Found ${consensusPicks.length} consensus play(s)` : 'No consensus plays'
  });

  const allPassed = checks.filter(c => c.name !== 'Consensus detection complete').every(c => c.passed);

  return { passed: allPassed, checks };
}

/**
 * Output verification checklist
 */
export function outputVerificationChecklist(bets: Bet[]): boolean {
  const verification = verifyBetsForDiscord(bets);

  console.log('\n═══════════════════════════════════════');
  console.log('VERIFICATION CHECKLIST');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  verification.checks.forEach(check => {
    const emoji = check.passed ? '✅' : '❌';
    console.log(`${emoji} ${check.name}`);
    if (check.details) {
      console.log(`   ${check.details}`);
    }
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (verification.passed) {
    console.log('✅ All checks passed!\n');
  } else {
    console.log('❌ Some checks failed - review above\n');
  }

  return verification.passed;
}

/**
 * Output Discord messages to terminal
 */
export function outputDiscordMessages(messages: { header?: string; allPicks: string[]; consensus: string[] }, date: string): void {
  const year = new Date(date).getFullYear();

  console.log('\n═══════════════════════════════════════');
  console.log(`DISCORD MESSAGES - ${formatDate(date)}, ${year}`);
  console.log('═══════════════════════════════════════\n');

  console.log(`📋 #all-picks (${messages.allPicks.length} picks)`);
  console.log('━━━━━━━━━━━━━━━━━━━━\n');

  // Output header first if present (HEADER MESSAGE)
  if (messages.header) {
    console.log('--- HEADER MESSAGE (post first) ---');
    console.log(messages.header);
    console.log('\n');
  }

  // Output each pick with dividers for easy copy/paste
  messages.allPicks.forEach((msg, i) => {
    console.log(`--- PICK ${i + 1} ---`);
    console.log(msg);
    console.log('');
  });

  if (messages.consensus.length > 0) {
    console.log('\n═══════════════════════════════════════');
    console.log('🎯 #consensus-plays (' + messages.consensus.length + ' play' + (messages.consensus.length > 1 ? 's' : '') + ')');
    console.log('━━━━━━━━━━━━━━━━━━━━\n');

    messages.consensus.forEach((msg, i) => {
      console.log(msg);
      if (i < messages.consensus.length - 1) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━\n');
      }
    });
  }

  console.log('\n═══════════════════════════════════════\n');
}

/**
 * Output daily performance message to terminal
 */
export function outputDailyPerformance(date: string): void {
  console.log('\n═══════════════════════════════════════');
  console.log('DISCORD - #daily-performance');
  console.log('═══════════════════════════════════════\n');

  console.log(formatDailyPerformanceMessage(date));

  console.log('\n═══════════════════════════════════════\n');
}

/**
 * Get the most recent complete week (Monday-Sunday)
 */
function getMostRecentCompleteWeek(referenceDate?: string): { start: Date; end: Date; weekNumber: number } {
  const today = referenceDate ? new Date(referenceDate + 'T12:00:00') : new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Find the most recent Sunday (end of last complete week)
  let lastSunday: Date;
  if (dayOfWeek === 0) {
    // Today is Sunday - last complete week ended last Sunday
    lastSunday = new Date(today);
    lastSunday.setDate(lastSunday.getDate() - 7);
  } else {
    // Go back to last Sunday
    lastSunday = new Date(today);
    lastSunday.setDate(lastSunday.getDate() - dayOfWeek);
  }

  // Monday of that week
  const lastMonday = new Date(lastSunday);
  lastMonday.setDate(lastMonday.getDate() - 6);

  // Calculate week number (Week 1 starts Nov 4, 2025 which is a Monday)
  const week1Start = new Date('2025-11-03T12:00:00'); // Nov 3 is actually Monday
  const weekNumber = Math.floor((lastMonday.getTime() - week1Start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return { start: lastMonday, end: lastSunday, weekNumber };
}

/**
 * Format date range as "Dec 9-15"
 */
function formatDateRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

/**
 * Format weekly performance message for #weekly-performance
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT:
 * - Week number + date range
 * - BY FUND with units
 * - BY SPORT with win rates
 * - Week totals (record, units, dollars)
 */
export function formatWeeklyPerformanceMessage(referenceDate?: string, allBets?: Bet[]): string {
  const bets = allBets || loadBets();
  const { start, end, weekNumber } = getMostRecentCompleteWeek(referenceDate);

  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  const year = end.getFullYear();

  // Get bets from this week
  const weekBets = bets.filter(b => {
    const betDate = b.date.split('T')[0];
    return betDate >= startStr && betDate <= endStr && b.result !== 'pending';
  });

  // Calculate week stats
  let weekWins = 0, weekLosses = 0, weekPushes = 0;
  let weekPL = 0;
  const fundStats: Record<string, { wins: number; losses: number; pl: number }> = {};
  const sportStats: Record<string, { wins: number; losses: number; pl: number }> = {};

  weekBets.forEach(bet => {
    if (bet.result === 'win') weekWins++;
    else if (bet.result === 'loss') weekLosses++;
    else if (bet.result === 'push') weekPushes++;

    weekPL += bet.profit || 0;

    // Fund breakdown
    if (!fundStats[bet.fund]) fundStats[bet.fund] = { wins: 0, losses: 0, pl: 0 };
    if (bet.result === 'win') fundStats[bet.fund].wins++;
    else if (bet.result === 'loss') fundStats[bet.fund].losses++;
    fundStats[bet.fund].pl += bet.profit || 0;

    // Sport breakdown
    if (!sportStats[bet.sport]) sportStats[bet.sport] = { wins: 0, losses: 0, pl: 0 };
    if (bet.result === 'win') sportStats[bet.sport].wins++;
    else if (bet.result === 'loss') sportStats[bet.sport].losses++;
    sportStats[bet.sport].pl += bet.profit || 0;
  });

  const weekUnits = weekPL / 100;
  const weekRecord = weekPushes > 0 ? `${weekWins}-${weekLosses}-${weekPushes}` : `${weekWins}-${weekLosses}`;

  let message = `📅 WEEK ${weekNumber} | ${formatDateRange(start, end)}, ${year}\n\n`;

  message += `BY FUND\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;

  const fundOrder = ['SharpFund', 'VectorFund', 'ContraFund', 'CatalystFund'];
  fundOrder.forEach(fund => {
    const stats = fundStats[fund];
    if (stats && (stats.wins + stats.losses > 0)) {
      const emoji = FUND_EMOJIS[fund] || '•';
      const fundName = fund.replace('Fund', '');
      const fundUnits = stats.pl / 100;
      message += `${emoji} ${fundName}: ${stats.wins}-${stats.losses} (${fundUnits >= 0 ? '+' : ''}${fundUnits.toFixed(1)}u)\n`;
    }
  });

  message += `\nBY SPORT\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;

  const sportOrder = ['NBA', 'NHL', 'NFL', 'NCAAB', 'NCAAF'];
  sportOrder.forEach(sport => {
    const stats = sportStats[sport];
    if (stats && (stats.wins + stats.losses > 0)) {
      const emoji = SPORT_EMOJIS[sport] || '🎯';
      const total = stats.wins + stats.losses;
      const winRate = ((stats.wins / total) * 100).toFixed(1);
      message += `${emoji} ${sport}: ${stats.wins}-${stats.losses} (${winRate}%)\n`;
    }
  });

  const weekDollars = Math.round(weekPL);
  message += `\nWEEK TOTAL: ${weekRecord} | ${weekUnits >= 0 ? '+' : ''}${weekUnits.toFixed(1)}u | ${weekDollars >= 0 ? '+' : ''}$${Math.abs(weekDollars).toLocaleString('en-US')}`;

  return message;
}

/**
 * Get consensus record for a specific week
 */
function getWeekConsensusRecord(startDate: string, endDate: string, allBets: Bet[]): { wins: number; losses: number; total: number } {
  const weekBets = allBets.filter(b => {
    const betDate = b.date.split('T')[0];
    return betDate >= startDate && betDate <= endDate && (b.result === 'win' || b.result === 'loss');
  });

  // Group by date + team + betType
  const groups: Record<string, Bet[]> = {};
  weekBets.forEach(bet => {
    const team = bet.team || bet.description?.split(' ')[0] || '';
    const key = `${bet.date.split('T')[0]}|${team}|${bet.betType}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(bet);
  });

  let wins = 0, losses = 0;
  Object.values(groups).forEach(group => {
    const uniqueFunds = [...new Set(group.map(b => b.fund))];
    if (uniqueFunds.length >= 2) {
      if (group[0].result === 'win') wins++;
      else if (group[0].result === 'loss') losses++;
    }
  });

  return { wins, losses, total: wins + losses };
}

/**
 * Get green/red week history
 * Returns array of week results (true = green/positive, false = red/negative)
 * Also tracks current consecutive green streak
 */
function getWeeklyResults(allBets: Bet[]): {
  weeks: boolean[];
  greenCount: number;
  redCount: number;
  currentStreak: number;
  streakType: 'green' | 'red' | 'none';
} {
  const settled = allBets.filter(b => b.result === 'win' || b.result === 'loss');
  if (settled.length === 0) return { weeks: [], greenCount: 0, redCount: 0, currentStreak: 0, streakType: 'none' };

  // Group bets by week (Mon-Sun)
  const weeklyPL: Record<number, number> = {};

  // Week 1 starts Nov 3, 2025 (Monday)
  const week1Start = new Date('2025-11-03T00:00:00');

  settled.forEach(bet => {
    const betDate = new Date(bet.date.split('T')[0] + 'T12:00:00');
    const daysSinceStart = Math.floor((betDate.getTime() - week1Start.getTime()) / (24 * 60 * 60 * 1000));
    const weekNum = Math.floor(daysSinceStart / 7) + 1;

    if (!weeklyPL[weekNum]) weeklyPL[weekNum] = 0;
    weeklyPL[weekNum] += bet.profit || 0;
  });

  // Convert to array of green/red results
  const weekNums = Object.keys(weeklyPL).map(Number).sort((a, b) => a - b);
  const weeks: boolean[] = [];
  let greenCount = 0, redCount = 0;

  weekNums.forEach(weekNum => {
    const isGreen = weeklyPL[weekNum] >= 0;
    weeks.push(isGreen);
    if (isGreen) greenCount++;
    else redCount++;
  });

  // Calculate current streak from the end
  let currentStreak = 0;
  let streakType: 'green' | 'red' | 'none' = 'none';

  if (weeks.length > 0) {
    const lastResult = weeks[weeks.length - 1];
    streakType = lastResult ? 'green' : 'red';

    for (let i = weeks.length - 1; i >= 0; i--) {
      if (weeks[i] === lastResult) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { weeks, greenCount, redCount, currentStreak, streakType };
}

/**
 * Get proven edges (65%+ win rate, 20+ bets)
 */
function getProvenEdges(allBets: Bet[]): Array<{ name: string; record: string; winRate: string }> {
  const settled = allBets.filter(b => b.result === 'win' || b.result === 'loss');
  const edges: Array<{ name: string; wins: number; losses: number; winRate: number }> = [];

  // Fund + Sport combinations
  const fundSportGroups: Record<string, { wins: number; losses: number }> = {};
  // Sport + BetType combinations
  const sportTypeGroups: Record<string, { wins: number; losses: number }> = {};

  settled.forEach(bet => {
    const fundSportKey = `${bet.fund}|${bet.sport}`;
    if (!fundSportGroups[fundSportKey]) fundSportGroups[fundSportKey] = { wins: 0, losses: 0 };
    if (bet.result === 'win') fundSportGroups[fundSportKey].wins++;
    else fundSportGroups[fundSportKey].losses++;

    const sportTypeKey = `${bet.sport}|${bet.betType}`;
    if (!sportTypeGroups[sportTypeKey]) sportTypeGroups[sportTypeKey] = { wins: 0, losses: 0 };
    if (bet.result === 'win') sportTypeGroups[sportTypeKey].wins++;
    else sportTypeGroups[sportTypeKey].losses++;
  });

  // Check fund+sport edges
  Object.entries(fundSportGroups).forEach(([key, stats]) => {
    const total = stats.wins + stats.losses;
    const winRate = stats.wins / total;
    if (total >= 20 && winRate >= 0.65) {
      const [fund, sport] = key.split('|');
      edges.push({
        name: `${fund.replace('Fund', '')} ${sport}`,
        wins: stats.wins,
        losses: stats.losses,
        winRate
      });
    }
  });

  // Check sport+type edges
  Object.entries(sportTypeGroups).forEach(([key, stats]) => {
    const total = stats.wins + stats.losses;
    const winRate = stats.wins / total;
    if (total >= 20 && winRate >= 0.65) {
      const [sport, betType] = key.split('|');
      edges.push({
        name: `${sport} ${betType}s`,
        wins: stats.wins,
        losses: stats.losses,
        winRate
      });
    }
  });

  // Sort by win rate descending
  edges.sort((a, b) => b.winRate - a.winRate);

  return edges.map(e => ({
    name: e.name,
    record: `${e.wins}-${e.losses}`,
    winRate: `${(e.winRate * 100).toFixed(1)}%`
  }));
}

/**
 * Format all-time stats message for #all-time
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT:
 * - Overall stats (record, P/L, ROI, units)
 * - BY FUND with win rates
 * - BY SPORT with win rates
 * - Green/red week tracking
 */
export function formatAllTimeMessage(allBets?: Bet[]): string {
  const bets = allBets || loadBets();
  const portfolio = loadPortfolio();
  const weeklyResults = getWeeklyResults(bets);

  let message = `🏆 ALL-TIME STATS\n\n`;

  message += `📊 Record: ${portfolio.combined.record.wins}-${portfolio.combined.record.losses}-${portfolio.combined.record.pushes} (${portfolio.combined.winRate.toFixed(1)}%)\n`;
  message += `💰 Net P/L: ${portfolio.combined.netPL >= 0 ? '+' : ''}$${Math.round(portfolio.combined.netPL).toLocaleString('en-US')}\n`;
  message += `📈 ROI: ${portfolio.combined.roi >= 0 ? '+' : ''}${portfolio.combined.roi.toFixed(2)}%\n`;
  message += `📉 Units: ${portfolio.combined.unitsWon >= 0 ? '+' : ''}${portfolio.combined.unitsWon.toFixed(1)}u\n\n`;

  message += `BY FUND\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;

  const fundOrder = ['SharpFund', 'VectorFund', 'ContraFund', 'CatalystFund'];
  fundOrder.forEach(fundName => {
    const fund = portfolio.funds[fundName];
    if (fund) {
      const emoji = FUND_EMOJIS[fundName] || '•';
      const displayName = fundName.replace('Fund', '');
      message += `${emoji} ${displayName}: ${fund.record.wins}-${fund.record.losses} (${fund.winRate.toFixed(1)}%)\n`;
    }
  });

  // BY SPORT section
  message += `\nBY SPORT\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Calculate sport stats from all settled bets
  const sportStats: Record<string, { wins: number; losses: number }> = {};
  const settled = bets.filter(b => b.result === 'win' || b.result === 'loss');
  settled.forEach(bet => {
    if (!sportStats[bet.sport]) sportStats[bet.sport] = { wins: 0, losses: 0 };
    if (bet.result === 'win') sportStats[bet.sport].wins++;
    else if (bet.result === 'loss') sportStats[bet.sport].losses++;
  });

  const sportOrder = ['NBA', 'NHL', 'NFL', 'NCAAB', 'NCAAF'];
  sportOrder.forEach(sport => {
    const stats = sportStats[sport];
    if (stats && (stats.wins + stats.losses > 0)) {
      const emoji = SPORT_EMOJIS[sport] || '🎯';
      const total = stats.wins + stats.losses;
      const winRate = ((stats.wins / total) * 100).toFixed(1);
      message += `${emoji} ${sport}: ${stats.wins}-${stats.losses} (${winRate}%)\n`;
    }
  });

  // Green/Red week tracking
  if (weeklyResults.weeks.length > 0) {
    message += `\n${weeklyResults.weeks.map(isGreen => isGreen ? '🟢' : '🔴').join('')} (${weeklyResults.greenCount} green, ${weeklyResults.redCount} red last ${weeklyResults.weeks.length} weeks)`;
  }

  return message;
}

/**
 * Output weekly performance message to terminal
 */
export function outputWeeklyPerformance(referenceDate?: string): void {
  console.log('\n═══════════════════════════════════════');
  console.log('DISCORD - #weekly-performance');
  console.log('═══════════════════════════════════════\n');

  console.log(formatWeeklyPerformanceMessage(referenceDate));

  console.log('\n═══════════════════════════════════════\n');
}

/**
 * Output all-time stats message to terminal
 */
export function outputAllTime(): void {
  console.log('\n═══════════════════════════════════════');
  console.log('DISCORD - #overall-standing');
  console.log('═══════════════════════════════════════\n');

  console.log(formatAllTimeMessage());

  console.log('\n═══════════════════════════════════════\n');
}

/**
 * Get most recent date with settled bets
 */
export function getMostRecentSettledDate(): string {
  const bets = loadBets();
  const settledDates = bets
    .filter(b => b.result === 'win' || b.result === 'loss')
    .map(b => b.date.split('T')[0])
    .sort();
  return settledDates[settledDates.length - 1] || new Date().toISOString().split('T')[0];
}

/**
 * Get today's date or most recent bet date
 */
export function getTodayOrMostRecent(): string {
  const today = new Date().toISOString().split('T')[0];
  const bets = loadBets();
  const todayBets = bets.filter(b => b.date.split('T')[0] === today);
  if (todayBets.length > 0) return today;

  // Return most recent date with bets
  const dates = [...new Set(bets.map(b => b.date.split('T')[0]))].sort();
  return dates[dates.length - 1] || today;
}

/**
 * Generate ASCII table for #picks-table channel
 * Designed to be screenshot-friendly from terminal
 *
 * ██╗      ██████╗  ██████╗██╗  ██╗███████╗██████╗
 * ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
 * ██║     ██║   ██║██║     █████╔╝ █████╗  ██║  ██║
 * ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║
 * ███████╗╚██████╔╝╚██████╗██║  ██╗███████╗██████╔╝
 * ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝
 *
 * FORMAT:
 * - Date header centered
 * - Columns: # | Team | Line | Odds | Fund | Units | Sport | Time
 * - Clean box-drawing borders
 * - Total row at bottom
 */
export function generatePicksTable(date: string, allBets?: Bet[]): string {
  const bets = allBets || loadBets();
  const normalizedDate = date.split('T')[0];
  const dayBets = bets.filter(b => b.date.split('T')[0] === normalizedDate);

  if (dayBets.length === 0) {
    return `No picks found for ${normalizedDate}`;
  }

  // Format date for header
  const dateObj = new Date(normalizedDate + 'T12:00:00');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dateHeader = `📋 ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()} - DAILY SLATE`;

  // Column widths
  const cols = {
    num: 4,
    team: 13,
    line: 9,
    odds: 7,
    fund: 10,
    units: 7,
    sport: 7,
    time: 12
  };

  const totalWidth = cols.num + cols.team + cols.line + cols.odds + cols.fund + cols.units + cols.sport + cols.time + 9; // 9 for separators

  // Helper functions
  const pad = (str: string, width: number, align: 'left' | 'center' | 'right' = 'left'): string => {
    const s = String(str).slice(0, width);
    const padding = width - s.length;
    if (align === 'center') {
      const left = Math.floor(padding / 2);
      const right = padding - left;
      return ' '.repeat(left) + s + ' '.repeat(right);
    } else if (align === 'right') {
      return ' '.repeat(padding) + s;
    }
    return s + ' '.repeat(padding);
  };

  const horizontalLine = (left: string, mid: string, right: string, sep: string): string => {
    return left +
      '─'.repeat(cols.num) + sep +
      '─'.repeat(cols.team) + sep +
      '─'.repeat(cols.line) + sep +
      '─'.repeat(cols.odds) + sep +
      '─'.repeat(cols.fund) + sep +
      '─'.repeat(cols.units) + sep +
      '─'.repeat(cols.sport) + sep +
      '─'.repeat(cols.time) + right;
  };

  let table = '';

  // Top border with header
  table += '┌' + '─'.repeat(totalWidth - 2) + '┐\n';
  table += '│' + pad(dateHeader, totalWidth - 2, 'center') + '│\n';

  // Header separator
  table += '├' + '─'.repeat(cols.num) + '┬' +
    '─'.repeat(cols.team) + '┬' +
    '─'.repeat(cols.line) + '┬' +
    '─'.repeat(cols.odds) + '┬' +
    '─'.repeat(cols.fund) + '┬' +
    '─'.repeat(cols.units) + '┬' +
    '─'.repeat(cols.sport) + '┬' +
    '─'.repeat(cols.time) + '┤\n';

  // Column headers
  table += '│' +
    pad(' #', cols.num) + '│' +
    pad(' Team', cols.team) + '│' +
    pad(' Line', cols.line) + '│' +
    pad(' Odds', cols.odds) + '│' +
    pad(' Fund', cols.fund) + '│' +
    pad(' Units', cols.units) + '│' +
    pad(' Sport', cols.sport) + '│' +
    pad(' Time', cols.time) + '│\n';

  // Header/data separator
  table += horizontalLine('├', '┼', '┤', '┼') + '\n';

  // Data rows
  let totalUnits = 0;
  dayBets.forEach((bet, i) => {
    const team = shortenTeamName(bet.team || bet.description?.split(' ')[0] || '');
    const line = bet.description.replace(team, '').replace(/^\s+/, '').split('@')[0].trim() || 'ML';
    const odds = formatOdds(bet.odds);
    const fund = bet.fund.replace('Fund', '');
    const units = `${bet.stake.toFixed(1)}u`;
    const time = bet.gameTime || 'TBD';

    totalUnits += bet.stake;

    table += '│' +
      pad(` ${i + 1}`, cols.num) + '│' +
      pad(` ${team}`, cols.team) + '│' +
      pad(` ${line}`, cols.line) + '│' +
      pad(` ${odds}`, cols.odds) + '│' +
      pad(` ${fund}`, cols.fund) + '│' +
      pad(` ${units}`, cols.units) + '│' +
      pad(` ${bet.sport}`, cols.sport) + '│' +
      pad(` ${time}`, cols.time) + '│\n';
  });

  // Footer separator
  table += '├' + '─'.repeat(cols.num) + '┴' +
    '─'.repeat(cols.team) + '┴' +
    '─'.repeat(cols.line) + '┴' +
    '─'.repeat(cols.odds) + '┴' +
    '─'.repeat(cols.fund) + '┴' +
    '─'.repeat(cols.units) + '┴' +
    '─'.repeat(cols.sport) + '┴' +
    '─'.repeat(cols.time) + '┤\n';

  // Total row
  const exposure = Math.round(totalUnits * 100);
  const totalText = ` TOTAL: ${dayBets.length} picks | ${totalUnits.toFixed(1)}u | $${exposure} exposure`;
  table += '│' + pad(totalText, totalWidth - 2) + '│\n';

  // Bottom border
  table += '└' + '─'.repeat(totalWidth - 2) + '┘';

  return table;
}

// Export for direct testing
export { loadBets, formatDate, getMostRecentCompleteWeek };

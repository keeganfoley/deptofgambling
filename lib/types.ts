/**
 * Core type definitions for the Department of Gambling betting system
 */

// Bet result types
export type BetResult = 'win' | 'loss' | 'push' | 'pending';

// Bet type categories (singular form - matches actual data)
export type BetType = 'spread' | 'total' | 'moneyline' | 'props';

// Fund identifiers
export type FundKey = 'VectorFund' | 'SharpFund' | 'ContraFund' | 'CatalystFund';

// Sport categories
export type Sport = 'NBA' | 'NFL' | 'NCAAB' | 'NCAAF' | 'NHL' | 'Soccer' | 'MLB';

/**
 * Result details captured when updating bet results
 */
export interface ResultDetails {
  finalScore: string;        // e.g., "Eagles 28, Cowboys 23"
  searchedAt: string;        // ISO timestamp when result was looked up
  source: string;            // e.g., "ESPN", "Action Network"
}

/**
 * Complete bet object structure
 */
export interface Bet {
  // Core identification
  id: number;
  date: string;              // ISO date string
  slug?: string;             // URL slug for detail page

  // Game info
  sport: Sport;
  team: string;
  opponent: string;
  gameTime?: string;         // e.g., "9:00 PM ET"

  // Bet details
  description: string;       // e.g., "Eagles -3.5" or "Hurts O250.5 pass yds"
  betType: BetType;
  odds: number;              // American odds, e.g., -110, +150
  stake: number;             // Units, e.g., 1, 1.5, 2

  // Line tracking (NEW)
  betLine?: number;          // The line when bet was placed (e.g., -3.5)
  openingLine?: number;      // Opening line if available
  closingLine?: number;      // Final line before game (captured during results update)
  clv?: number;              // Closing Line Value in cents (calculated)

  // For player props
  player?: string;           // Player name for props

  // Result data
  result: BetResult;
  profit: number;            // Dollar amount won/lost
  finalStat: string;         // e.g., "Final: PHI 28, DAL 23 (Won by 5)"
  resultDetails?: ResultDetails;

  // Model/edge data
  edge: number;              // Model edge percentage
  expectedValue: number;     // Expected value percentage

  // Analysis
  analysis?: string;         // Full analysis text

  // Fund assignment
  fund: FundKey;
}

/**
 * Stake conviction tiers (consolidated from 7 to 3)
 */
export type ConvictionTier = 'low' | 'standard' | 'high';

export interface StakeTierBreakdown {
  tier: ConvictionTier;
  label: string;             // "Low Conviction", "Standard", "High Conviction"
  range: string;             // "< 1u", "1-1.5u", "2u+"
  record: {
    wins: number;
    losses: number;
    pushes: number;
    total: number;
  };
  winRate: number;
  netPL: number;
  roi: number;
}

/**
 * Get conviction tier from stake amount
 */
export function getConvictionTier(stake: number): ConvictionTier {
  if (stake < 1) return 'low';
  if (stake <= 1.5) return 'standard';
  return 'high';
}

/**
 * Portfolio metrics with proper tracking states
 */
export interface PortfolioMetrics {
  // Core performance
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalPushes: number;
  winRate: number;

  // Financial
  totalWinnings: number;
  totalLossesAmount: number;
  avgWin: number;
  avgLoss: number;
  avgProfitPerBet: number;
  medianProfit: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;

  // Risk metrics (properly calculated)
  maxDrawdown: number;           // Peak-to-trough in dollars
  maxDrawdownPercent: number;    // Peak-to-trough as percentage
  maxDrawdownPeak: string;       // Date of peak
  maxDrawdownTrough: string;     // Date of trough

  // Sharpe Ratio - null if insufficient data
  sharpeRatio: number | null;
  sharpeRatioNote: string;       // Explanation if null

  // CLV - null if no closing line data
  closingLineValue: number | null;
  closingLineValueNote: string;  // e.g., "Based on 45 bets with closing data"
  clvBetsTracked: number;        // How many bets have CLV data
  clvTrackingStartDate: string;  // When CLV tracking began

  // Streaks
  maxWinStreak: number;
  maxLossStreak: number;
  currentStreak: number;         // Positive = wins, negative = losses

  // Exposure
  totalCapitalRisked: number;
  unitsRisked: number;

  // Breakdowns
  sportBreakdown: Record<string, SportBreakdown>;
  betTypeBreakdown: Record<string, BetTypeBreakdown>;
  stakeBreakdown: Record<string, StakeTierBreakdown>;

  // Growth timeline
  portfolioGrowth: PortfolioGrowthEntry[];

  // Meta
  lastUpdated: string;
}

export interface SportBreakdown {
  sport: string;
  emoji: string;
  record: {
    wins: number;
    losses: number;
    pushes: number;
    total: number;
  };
  roi: number;
  netPL: number;
  unitsWon: number;
}

export interface BetTypeBreakdown {
  type: string;
  record: {
    wins: number;
    losses: number;
    pushes: number;
  };
  winRate: number;
  netPL: number;
  roi: number;
}

export interface PortfolioGrowthEntry {
  date: string;
  balance: number;
  profit: number;
  description: string;
  result: BetResult;
}

/**
 * Fund data structure
 */
export interface FundData {
  name: string;
  tagline: string;
  balance: number;
  startingBalance: number;
  netPL: number;
  roi: number;
  record: {
    wins: number;
    losses: number;
    pushes: number;
  };
  winRate: number;
  unitsWon: number;
  color: string;
  status: 'active' | 'deploying';
}

/**
 * Daily chart data point
 */
export interface ChartDataPoint {
  date: string;
  value: number;
}

/**
 * Calculate CLV from bet line and closing line
 * Positive CLV = got a better line than close
 * Returns value in cents
 */
export function calculateCLV(
  betLine: number,
  closingLine: number,
  betType: BetType
): number {
  if (betType === 'moneyline') {
    // For moneyline, CLV is odds improvement in cents
    // Convert American odds to implied probability difference
    const betProb = americanToImplied(betLine);
    const closeProb = americanToImplied(closingLine);
    return Math.round((closeProb - betProb) * 100); // In cents
  }

  // For spreads/totals, CLV is line movement in half-points (as cents)
  // e.g., bet -3.5, closed -4.0 = +0.5 points = +50 cents of value
  return Math.round((closingLine - betLine) * 100);
}

/**
 * Convert American odds to implied probability
 */
export function americanToImplied(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

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
 * Action Network Signals - BACKEND ONLY (never display raw to frontend)
 * These are stored for analysis/learning purposes
 */
export interface BetIndicators {
  // Sharp money signals
  sharpAction: boolean;      // Sharp Action indicator lit
  bigMoney: boolean;         // Big Money indicator lit
  sharpScore: number;        // 0-10+ calculated sharp score
  proSystems: boolean;       // PRO Systems triggered

  // Model signals
  grade: string;             // A+, A, A-, B+, B, B-, C+, etc.
  statedEdge: number;        // Action Network's stated edge %

  // Public betting data
  publicPct: number;         // % of bets on this side
  moneyPct: number;          // % of money on this side
  diff: number;              // Money% - Bet% (positive = sharp money)

  // Line movement
  lineOpen: number;          // Opening line
  lineCurrent: number;       // Line when we bet
  lineMovement: number;      // Current - Open (positive = moved our way for favorites)
  rlm: boolean;              // Reverse line movement detected
}

/**
 * External Research Data - gathered from web searches
 * Used to compare projections and validate signals
 */
export interface BetResearch {
  // College Basketball (NCAAB)
  kenpomRating?: number;     // KenPom adjusted efficiency rating
  kenpomRank?: number;       // KenPom national rank
  kenpomProjection?: number; // KenPom projected spread

  // Power Ratings (all sports)
  sagarinRating?: number;    // Sagarin power rating
  espnBpi?: number;          // ESPN BPI (NBA) or FPI (NFL)

  // Consensus/Market
  coversConsensus?: string;  // Covers expert consensus (e.g., "65% on Team A")

  // ATS Performance
  atsLast10?: string;        // e.g., "7-3"
  atsSituation?: string;     // e.g., "5-1 as home underdog"
  atsMargin?: number;        // Average cover margin in recent games

  // Situational
  restAdvantage?: string;    // e.g., "2 days rest vs B2B"
  travelSituation?: string;  // e.g., "3rd road game in 4 nights"

  // Injuries (last 48 hours only)
  injuries?: string[];       // Array of recent injury updates

  // Timestamp
  researchedAt?: string;     // ISO timestamp when research was done
}

/**
 * Decision Quality Metrics - for learning what works
 * Tracks the quality of our decision-making process
 */
export interface DecisionMetrics {
  // Conviction/sizing
  convictionScore: number;   // 40-100 calculated conviction
  kellyRecommended?: number; // What Kelly criterion suggested
  actualUnits: number;       // What we actually bet

  // Line shopping
  bestLineAvailable: number; // Best line we found
  lineWeGot: number;         // Line we actually got
  lineEdge: number;          // Points better than consensus
  bookUsed?: string;         // Which book we used

  // Fund assignment rationale
  fundReason?: string;       // Why this fund (e.g., "Sharp Score 8+")
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
  thesis?: string;           // Frontend-safe thesis (no source names)

  // Fund assignment
  fund: FundKey;

  // NEW: Learning System Fields (Jan 2026)
  // These capture detailed data for analysis of what actually works

  // Action Network signals - BACKEND ONLY (never show raw on frontend)
  indicators?: BetIndicators;

  // External research data (KenPom, Sagarin, Covers, etc.)
  research?: BetResearch;

  // Decision quality metrics (for learning)
  decisionMetrics?: DecisionMetrics;

  // Date tracking
  datePlaced?: string;       // When bet was placed (may differ from game date)
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

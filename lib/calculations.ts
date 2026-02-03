/**
 * Centralized Calculation Library
 *
 * All portfolio metrics are calculated here.
 * Pages import these functions - no duplicate logic.
 *
 * Usage:
 *   import { calculateDrawdown, calculateRollingPerformance } from '@/lib/calculations';
 *   const drawdown = calculateDrawdown(bets, 10000);
 *   const rolling = calculateRollingPerformance(bets, 7);
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'push' | 'pending' | 'no_action' | 'void';
  profit: number;
  betType: string;
  edge: number;
  expectedValue: number;
  fund?: string;
}

export interface DrawdownResult {
  maxDrawdown: number;
  maxDrawdownPercent: number;
  peakDate: string;
  troughDate: string;
  peakBalance: number;
  troughBalance: number;
}

export interface CurrentDrawdownResult {
  amount: number;
  percentage: number;
  daysSincePeak: number;
  peakBalance: number;
  peakDate: string;
  currentBalance: number;
}

export interface RollingPerformanceResult {
  last7Days: { wins: number; losses: number; pushes: number; pnl: number; roi: number; bets: number };
  last30Days: { wins: number; losses: number; pushes: number; pnl: number; roi: number; bets: number };
  last3Days: { wins: number; losses: number; pushes: number; pnl: number; roi: number; bets: number };
}

export interface EdgeTierResult {
  min: number;
  max: number;
  wins: number;
  losses: number;
  pushes: number;
  roi: number;
  pnl: number;
  bets: number;
  winRate: number;
}

export interface EdgeValidationResult {
  lowEdge: EdgeTierResult;   // 3-5%
  midEdge: EdgeTierResult;   // 5-8%
  highEdge: EdgeTierResult;  // 8%+
  isCorrelated: boolean;     // true if higher edge = higher ROI
}

export interface EVAnalysisResult {
  totalExpectedValue: number;
  actualPL: number;
  variance: number;
  runningHot: boolean;
}

export interface SportBreakdownItem {
  sport: string;
  emoji: string;
  record: { wins: number; losses: number; pushes: number; total: number };
  wins: number;
  losses: number;
  winRate: number;
  roi: number;
  pnl: number;
  unitsWon: number;
}

export interface BetTypeBreakdownItem {
  type: string;
  record: { wins: number; losses: number; pushes: number };
  winRate: number;
  pnl: number;
  roi: number;
}

export interface ConvictionTierItem {
  tier: string;
  label: string;
  range: string;
  record: { wins: number; losses: number; pushes: number; total: number };
  winRate: number;
  pnl: number;
  roi: number;
}

export interface FundMetrics {
  wins: number;
  losses: number;
  pushes: number;
  pnl: number;
  roi: number;
  winRate: number;
  totalStaked: number;
  maxDrawdown: DrawdownResult | null;
  currentDrawdown: CurrentDrawdownResult | null;
  rollingPerformance: RollingPerformanceResult | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function filterSettledBets(bets: Bet[]): Bet[] {
  return bets.filter(b => b.result === 'win' || b.result === 'loss' || b.result === 'push');
}

function sortByDate(bets: Bet[]): Bet[] {
  return [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

// ============================================================================
// DRAWDOWN CALCULATIONS
// ============================================================================

/**
 * Calculate max drawdown (peak-to-trough)
 */
export function calculateDrawdown(bets: Bet[], startingBalance: number): DrawdownResult {
  const settled = sortByDate(filterSettledBets(bets));

  if (settled.length === 0) {
    return {
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      peakDate: '',
      troughDate: '',
      peakBalance: startingBalance,
      troughBalance: startingBalance
    };
  }

  let balance = startingBalance;
  let peak = startingBalance;
  let peakDate = '';
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let troughDate = '';
  let troughBalance = startingBalance;

  for (const bet of settled) {
    balance += bet.profit;
    const dateStr = bet.date.split('T')[0];

    if (balance > peak) {
      peak = balance;
      peakDate = dateStr;
    }

    const drawdown = balance - peak;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = (drawdown / peak) * 100;
      troughDate = dateStr;
      troughBalance = balance;
    }
  }

  return {
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    maxDrawdownPercent: Math.round(maxDrawdownPercent * 100) / 100,
    peakDate,
    troughDate,
    peakBalance: Math.round(peak * 100) / 100,
    troughBalance: Math.round(troughBalance * 100) / 100
  };
}

/**
 * Calculate current drawdown from peak
 */
export function calculateCurrentDrawdown(
  bets: Bet[],
  startingBalance: number,
  currentBalance: number
): CurrentDrawdownResult {
  const settled = sortByDate(filterSettledBets(bets));

  if (settled.length === 0) {
    return {
      amount: 0,
      percentage: 0,
      daysSincePeak: 0,
      peakBalance: startingBalance,
      peakDate: '',
      currentBalance: startingBalance
    };
  }

  let balance = startingBalance;
  let peak = startingBalance;
  let peakDate = '';

  for (const bet of settled) {
    balance += bet.profit;
    if (balance > peak) {
      peak = balance;
      peakDate = bet.date.split('T')[0];
    }
  }

  const amount = currentBalance - peak;
  const percentage = peak > 0 ? (amount / peak) * 100 : 0;

  // Calculate days since peak
  let daysSincePeak = 0;
  if (peakDate) {
    const peakTime = new Date(peakDate).getTime();
    const now = new Date().getTime();
    daysSincePeak = Math.floor((now - peakTime) / (1000 * 60 * 60 * 24));
  }

  return {
    amount: Math.round(amount * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    daysSincePeak,
    peakBalance: Math.round(peak * 100) / 100,
    peakDate,
    currentBalance: Math.round(currentBalance * 100) / 100
  };
}

// ============================================================================
// ROLLING PERFORMANCE
// ============================================================================

/**
 * Calculate rolling performance (last 7/30 days, last 10 bets)
 */
export function calculateRollingPerformance(bets: Bet[]): RollingPerformanceResult {
  const settled = sortByDate(filterSettledBets(bets));
  const now = new Date();

  const calculatePeriod = (filterFn: (bet: Bet) => boolean) => {
    const filtered = settled.filter(filterFn);
    const wins = filtered.filter(b => b.result === 'win').length;
    const losses = filtered.filter(b => b.result === 'loss').length;
    const pushes = filtered.filter(b => b.result === 'push').length;
    const pnl = filtered.reduce((sum, b) => sum + b.profit, 0);
    const totalStaked = filtered.reduce((sum, b) => sum + (b.stake * 100), 0);
    const roi = totalStaked > 0 ? (pnl / totalStaked) * 100 : 0;

    return {
      wins,
      losses,
      pushes,
      pnl: Math.round(pnl * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      bets: filtered.length
    };
  };

  const threeDaysAgo = getDaysAgo(3);
  const sevenDaysAgo = getDaysAgo(7);
  const thirtyDaysAgo = getDaysAgo(30);

  const last3Days = calculatePeriod(b => new Date(b.date) >= threeDaysAgo);
  const last7Days = calculatePeriod(b => new Date(b.date) >= sevenDaysAgo);
  const last30Days = calculatePeriod(b => new Date(b.date) >= thirtyDaysAgo);

  return { last7Days, last30Days, last3Days };
}

// ============================================================================
// EDGE VALIDATION
// ============================================================================

/**
 * Group bets by edge tier and calculate performance
 */
export function calculateEdgeValidation(bets: Bet[]): EdgeValidationResult {
  const settled = filterSettledBets(bets);

  const calculateTier = (min: number, max: number): EdgeTierResult => {
    const filtered = settled.filter(b => b.edge >= min && b.edge < max);
    const wins = filtered.filter(b => b.result === 'win').length;
    const losses = filtered.filter(b => b.result === 'loss').length;
    const pushes = filtered.filter(b => b.result === 'push').length;
    const pnl = filtered.reduce((sum, b) => sum + b.profit, 0);
    const totalStaked = filtered.reduce((sum, b) => sum + (b.stake * 100), 0);
    const roi = totalStaked > 0 ? (pnl / totalStaked) * 100 : 0;
    const total = wins + losses + pushes;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      min,
      max,
      wins,
      losses,
      pushes,
      roi: Math.round(roi * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      bets: filtered.length,
      winRate: Math.round(winRate * 100) / 100
    };
  };

  const lowEdge = calculateTier(0, 5);
  const midEdge = calculateTier(5, 8);
  const highEdge = calculateTier(8, 100);

  // Check correlation: is higher edge = higher ROI?
  const rois = [
    { tier: 'low', roi: lowEdge.roi, bets: lowEdge.bets },
    { tier: 'mid', roi: midEdge.roi, bets: midEdge.bets },
    { tier: 'high', roi: highEdge.roi, bets: highEdge.bets }
  ].filter(t => t.bets > 0);

  let isCorrelated = false;
  if (rois.length >= 2) {
    // Simple check: is high > mid > low (or high > low if mid is empty)?
    if (rois.length === 3) {
      isCorrelated = highEdge.roi > midEdge.roi && midEdge.roi > lowEdge.roi;
    } else if (rois.length === 2) {
      isCorrelated = rois[1].roi > rois[0].roi;
    }
  }

  return { lowEdge, midEdge, highEdge, isCorrelated };
}

// ============================================================================
// EV ANALYSIS
// ============================================================================

/**
 * Compare expected value vs actual results
 */
export function calculateEVAnalysis(bets: Bet[]): EVAnalysisResult {
  const settled = filterSettledBets(bets);

  // EV is stored as percentage, convert to dollars based on stake
  // bet.expectedValue is % EV, so expected profit = stake * 100 * (EV/100) = stake * EV
  const totalExpectedValue = settled.reduce((sum, b) => {
    const expectedProfit = b.stake * b.expectedValue; // EV% * stake in units
    return sum + expectedProfit;
  }, 0);

  const actualPL = settled.reduce((sum, b) => sum + b.profit, 0);
  const variance = actualPL - totalExpectedValue;

  return {
    totalExpectedValue: Math.round(totalExpectedValue * 100) / 100,
    actualPL: Math.round(actualPL * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    runningHot: variance > 0
  };
}

// ============================================================================
// SPORT BREAKDOWN
// ============================================================================

const SPORT_EMOJIS: Record<string, string> = {
  NBA: '🏀',
  NFL: '🏈',
  NCAAB: '🎓',
  NCAAF: '🏟️',
  NHL: '🏒',
  Soccer: '⚽',
  MLB: '⚾'
};

/**
 * Calculate performance by sport
 */
export function calculateSportBreakdown(bets: Bet[]): Record<string, SportBreakdownItem> {
  const settled = filterSettledBets(bets);
  const stats: Record<string, { wins: number; losses: number; pushes: number; pnl: number; staked: number }> = {};

  for (const bet of settled) {
    if (!stats[bet.sport]) {
      stats[bet.sport] = { wins: 0, losses: 0, pushes: 0, pnl: 0, staked: 0 };
    }
    if (bet.result === 'win') stats[bet.sport].wins++;
    else if (bet.result === 'loss') stats[bet.sport].losses++;
    else if (bet.result === 'push') stats[bet.sport].pushes++;
    stats[bet.sport].pnl += bet.profit;
    stats[bet.sport].staked += bet.stake * 100;
  }

  const breakdown: Record<string, SportBreakdownItem> = {};
  for (const [sport, s] of Object.entries(stats)) {
    const total = s.wins + s.losses + s.pushes;
    const winLossTotal = s.wins + s.losses;
    breakdown[sport] = {
      sport,
      emoji: SPORT_EMOJIS[sport] || '🎯',
      record: { wins: s.wins, losses: s.losses, pushes: s.pushes, total },
      wins: s.wins,
      losses: s.losses,
      winRate: winLossTotal > 0 ? Math.round((s.wins / winLossTotal) * 10000) / 100 : 0,
      roi: s.staked > 0 ? Math.round((s.pnl / s.staked) * 10000) / 100 : 0,
      pnl: Math.round(s.pnl * 100) / 100,
      unitsWon: Math.round((s.pnl / 100) * 100) / 100
    };
  }

  return breakdown;
}

// ============================================================================
// BET TYPE BREAKDOWN
// ============================================================================

const TYPE_LABELS: Record<string, string> = {
  props: 'Props',
  spreads: 'Spreads',
  totals: 'Totals',
  moneyline: 'Moneyline'
};

/**
 * Calculate performance by bet type
 */
export function calculateBetTypeBreakdown(bets: Bet[]): Record<string, BetTypeBreakdownItem> {
  const settled = filterSettledBets(bets);
  const stats: Record<string, { wins: number; losses: number; pushes: number; pnl: number; staked: number }> = {};

  for (const bet of settled) {
    const type = TYPE_LABELS[bet.betType] || bet.betType;
    if (!stats[type]) {
      stats[type] = { wins: 0, losses: 0, pushes: 0, pnl: 0, staked: 0 };
    }
    if (bet.result === 'win') stats[type].wins++;
    else if (bet.result === 'loss') stats[type].losses++;
    else if (bet.result === 'push') stats[type].pushes++;
    stats[type].pnl += bet.profit;
    stats[type].staked += bet.stake * 100;
  }

  const breakdown: Record<string, BetTypeBreakdownItem> = {};
  for (const [type, s] of Object.entries(stats)) {
    const total = s.wins + s.losses + s.pushes;
    breakdown[type] = {
      type,
      record: { wins: s.wins, losses: s.losses, pushes: s.pushes },
      winRate: total > 0 ? Math.round((s.wins / total) * 10000) / 100 : 0,
      pnl: Math.round(s.pnl * 100) / 100,
      roi: s.staked > 0 ? Math.round((s.pnl / s.staked) * 10000) / 100 : 0
    };
  }

  return breakdown;
}

// ============================================================================
// CONVICTION TIERS (Stake Size)
// ============================================================================

/**
 * Calculate performance by conviction tier (stake size)
 */
export function calculateConvictionTiers(bets: Bet[]): Record<string, ConvictionTierItem> {
  const settled = filterSettledBets(bets);

  const tiers = [
    { key: 'Low Conviction', label: 'Low Conviction', range: '< 1u', min: 0, max: 1 },
    { key: 'Standard', label: 'Standard', range: '1-1.5u', min: 1, max: 1.51 },
    { key: 'High Conviction', label: 'High Conviction', range: '2u+', min: 2, max: Infinity }
  ];

  const breakdown: Record<string, ConvictionTierItem> = {};

  for (const tier of tiers) {
    const filtered = settled.filter(b => b.stake >= tier.min && b.stake < tier.max);
    const wins = filtered.filter(b => b.result === 'win').length;
    const losses = filtered.filter(b => b.result === 'loss').length;
    const pushes = filtered.filter(b => b.result === 'push').length;
    const total = wins + losses + pushes;
    const pnl = filtered.reduce((sum, b) => sum + b.profit, 0);
    const staked = filtered.reduce((sum, b) => sum + (b.stake * 100), 0);

    breakdown[tier.key] = {
      tier: tier.key.toLowerCase().replace(' ', '_'),
      label: tier.label,
      range: tier.range,
      record: { wins, losses, pushes, total },
      winRate: total > 0 ? Math.round((wins / total) * 10000) / 100 : 0,
      pnl: Math.round(pnl * 100) / 100,
      roi: staked > 0 ? Math.round((pnl / staked) * 10000) / 100 : 0
    };
  }

  return breakdown;
}

// ============================================================================
// FUND METRICS
// ============================================================================

/**
 * Calculate metrics for a specific fund
 */
export function calculateFundMetrics(
  bets: Bet[],
  fundKey: string,
  startingBalance: number
): FundMetrics {
  const fundBets = bets.filter(b => b.fund === fundKey);
  const settled = filterSettledBets(fundBets);

  if (settled.length === 0) {
    return {
      wins: 0,
      losses: 0,
      pushes: 0,
      pnl: 0,
      roi: 0,
      winRate: 0,
      totalStaked: 0,
      maxDrawdown: null,
      currentDrawdown: null,
      rollingPerformance: null
    };
  }

  const wins = settled.filter(b => b.result === 'win').length;
  const losses = settled.filter(b => b.result === 'loss').length;
  const pushes = settled.filter(b => b.result === 'push').length;
  const total = wins + losses + pushes;
  const pnl = settled.reduce((sum, b) => sum + b.profit, 0);
  const totalStaked = settled.reduce((sum, b) => sum + (b.stake * 100), 0);
  const roi = totalStaked > 0 ? (pnl / totalStaked) * 100 : 0;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const currentBalance = startingBalance + pnl;

  return {
    wins,
    losses,
    pushes,
    pnl: Math.round(pnl * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    totalStaked: Math.round(totalStaked * 100) / 100,
    maxDrawdown: calculateDrawdown(fundBets, startingBalance),
    currentDrawdown: calculateCurrentDrawdown(fundBets, startingBalance, currentBalance),
    rollingPerformance: calculateRollingPerformance(fundBets)
  };
}

// ============================================================================
// AGGREGATE METRICS (for all funds)
// ============================================================================

export interface AllFundMetrics {
  VectorFund: FundMetrics;
  SharpFund: FundMetrics;
  ContraFund: FundMetrics;
  CatalystFund: FundMetrics;
}

/**
 * Calculate metrics for all funds
 */
export function calculateAllFundMetrics(
  bets: Bet[],
  fundStartingBalances: Record<string, number>
): AllFundMetrics {
  return {
    VectorFund: calculateFundMetrics(bets, 'VectorFund', fundStartingBalances.VectorFund || 10000),
    SharpFund: calculateFundMetrics(bets, 'SharpFund', fundStartingBalances.SharpFund || 10000),
    ContraFund: calculateFundMetrics(bets, 'ContraFund', fundStartingBalances.ContraFund || 10000),
    CatalystFund: calculateFundMetrics(bets, 'CatalystFund', fundStartingBalances.CatalystFund || 10000)
  };
}

// ============================================================================
// SHARPE RATIO
// ============================================================================

export interface SharpeResult {
  value: number | null;
  note: string;
}

/**
 * Calculate Sharpe Ratio from daily returns
 *
 * Uses √365 annualization factor (not √252) because:
 * - √252 is for equity markets that trade 252 days/year
 * - Sports betting operates 365 days/year
 * - Our daily returns are measured every calendar day
 *
 * Formula: (Mean Daily Return / Std Dev of Daily Returns) × √365
 * Risk-free rate assumed to be 0 (standard for betting analysis)
 *
 * Accepts either { value } or { close } format (OHLC data)
 */
export function calculateSharpeRatio(chartData: { date: string; value?: number; close?: number }[]): SharpeResult {
  if (chartData.length < 30) {
    return {
      value: null,
      note: `Requires 30+ days (currently ${chartData.length} days)`
    };
  }

  const dailyReturns: number[] = [];
  for (let i = 1; i < chartData.length; i++) {
    // Support both { value } and { close } (OHLC) formats
    const prev = chartData[i - 1].value ?? chartData[i - 1].close ?? 0;
    const curr = chartData[i].value ?? chartData[i].close ?? 0;
    if (prev === 0) continue; // Skip invalid data
    dailyReturns.push((curr - prev) / prev);
  }

  const meanReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const squaredDiffs = dailyReturns.map(r => Math.pow(r - meanReturn, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return { value: null, note: 'Zero variance in returns' };
  }

  // Annualized Sharpe using √365 (betting operates 365 days/year, not 252 trading days)
  const sharpe = (meanReturn / stdDev) * Math.sqrt(365);

  return {
    value: Math.round(sharpe * 100) / 100,
    note: `${dailyReturns.length}-day sample`
  };
}

// ============================================================================
// CLV (Closing Line Value)
// ============================================================================

export interface CLVResult {
  value: number | null;
  note: string;
  betsTracked: number;
  trackingStartDate: string;
}

/**
 * Calculate average CLV from bets with closing line data
 */
export function calculateCLV(bets: Bet[]): CLVResult {
  const betsWithCLV = bets.filter(b =>
    (b as any).closingLine !== undefined &&
    (b as any).betLine !== undefined &&
    (b as any).clv !== undefined
  );

  if (betsWithCLV.length === 0) {
    return {
      value: null,
      note: 'CLV tracking started Nov 27, 2025',
      betsTracked: 0,
      trackingStartDate: '2025-11-27'
    };
  }

  const totalCLV = betsWithCLV.reduce((sum, b) => sum + ((b as any).clv || 0), 0);
  const avgCLV = totalCLV / betsWithCLV.length;

  const sorted = [...betsWithCLV].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startDate = sorted[0]?.date.split('T')[0] || '2025-11-27';

  return {
    value: Math.round(avgCLV * 100) / 100,
    note: `Average across ${betsWithCLV.length} bets`,
    betsTracked: betsWithCLV.length,
    trackingStartDate: startDate
  };
}

// ============================================================================
// CORE STATS
// ============================================================================

export interface CoreStats {
  totalBets: number;
  wins: number;
  losses: number;
  pushes: number;
  winRate: number;
  totalWinnings: number;
  totalLossesAmount: number;
  avgWin: number;
  avgLoss: number;
  avgProfitPerBet: number;
  medianProfit: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  maxWinStreak: number;
  maxLossStreak: number;
  currentStreak: number;
  totalCapitalRisked: number;
  unitsRisked: number;
}

/**
 * Calculate core stats from bets
 */
export function calculateCoreStats(bets: Bet[]): CoreStats {
  const settled = sortByDate(filterSettledBets(bets));

  const wins = settled.filter(b => b.result === 'win');
  const losses = settled.filter(b => b.result === 'loss');
  const pushes = settled.filter(b => b.result === 'push');

  const totalWinnings = wins.reduce((sum, b) => sum + b.profit, 0);
  const totalLossesAmount = losses.reduce((sum, b) => sum + Math.abs(b.profit), 0);

  const avgWin = wins.length > 0 ? totalWinnings / wins.length : 0;
  const avgLoss = losses.length > 0 ? -totalLossesAmount / losses.length : 0;

  const netPL = settled.reduce((sum, b) => sum + b.profit, 0);
  const avgProfitPerBet = settled.length > 0 ? netPL / settled.length : 0;

  const profits = settled.map(b => b.profit).sort((a, b) => a - b);
  const medianProfit = profits.length > 0 ? profits[Math.floor(profits.length / 2)] : 0;

  const largestWin = wins.length > 0 ? Math.max(...wins.map(b => b.profit)) : 0;
  const largestLoss = losses.length > 0 ? Math.min(...losses.map(b => b.profit)) : 0;

  const profitFactor = totalLossesAmount > 0 ? totalWinnings / totalLossesAmount : 0;

  // Streaks
  let maxWinStreak = 0, maxLossStreak = 0, currentWinStreak = 0, currentLossStreak = 0;
  for (const bet of settled) {
    if (bet.result === 'win') {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (bet.result === 'loss') {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    }
  }
  const currentStreak = currentWinStreak > 0 ? currentWinStreak : -currentLossStreak;

  const totalCapitalRisked = settled.reduce((sum, b) => sum + (b.stake * 100), 0);
  const unitsRisked = settled.reduce((sum, b) => sum + b.stake, 0);
  const total = wins.length + losses.length + pushes.length;
  const winRate = total > 0 ? (wins.length / total) * 100 : 0;

  return {
    totalBets: settled.length,
    wins: wins.length,
    losses: losses.length,
    pushes: pushes.length,
    winRate: Math.round(winRate * 100) / 100,
    totalWinnings: Math.round(totalWinnings * 100) / 100,
    totalLossesAmount: Math.round(totalLossesAmount * 100) / 100,
    avgWin: Math.round(avgWin * 100) / 100,
    avgLoss: Math.round(avgLoss * 100) / 100,
    avgProfitPerBet: Math.round(avgProfitPerBet * 100) / 100,
    medianProfit: Math.round(medianProfit * 100) / 100,
    largestWin: Math.round(largestWin * 100) / 100,
    largestLoss: Math.round(largestLoss * 100) / 100,
    profitFactor: Math.round(profitFactor * 1000) / 1000,
    maxWinStreak,
    maxLossStreak,
    currentStreak,
    totalCapitalRisked: Math.round(totalCapitalRisked * 100) / 100,
    unitsRisked: Math.round(unitsRisked * 100) / 100
  };
}

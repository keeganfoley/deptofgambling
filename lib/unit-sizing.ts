/**
 * Dynamic Unit Sizing System
 * Based on historical performance analysis of 390 bets
 *
 * Optimal sizing increases allocation to high-edge scenarios
 * and reduces exposure to underperforming combinations
 */

import { FundKey, Sport } from './types';

// Actual bet types used in the data (singular form)
export type ActualBetType = 'spread' | 'total' | 'moneyline' | 'props';

// Unit sizing tiers based on historical ROI analysis
// BLOCKED = do not bet (props/totals historically negative ROI)
export type SizingTier = 'max' | 'elevated' | 'standard' | 'reduced' | 'blocked';

export interface SizingRule {
  tier: SizingTier;
  units: number;
  description: string;
  conditions: {
    funds?: FundKey[];
    sports?: Sport[];
    betTypes?: ActualBetType[];
  };
  historicalROI: number;  // For reference
  historicalWinRate: number;
}

/**
 * Sizing configuration based on historical performance
 * Last updated: Dec 29, 2024 (390 bets analyzed)
 */
export const SIZING_RULES: SizingRule[] = [
  // TIER 1: MAX (2u) - Highest edge combinations
  {
    tier: 'max',
    units: 2.0,
    description: 'SharpFund NFL/NCAAB - Elite edge spots',
    conditions: {
      funds: ['SharpFund'],
      sports: ['NFL', 'NCAAB'],
    },
    historicalROI: 45.5,
    historicalWinRate: 76.1,
  },

  // TIER 2: ELEVATED (1.5u) - Strong edge combinations
  {
    tier: 'elevated',
    units: 1.5,
    description: 'SharpFund spreads (any sport)',
    conditions: {
      funds: ['SharpFund'],
      betTypes: ['spread'],
    },
    historicalROI: 32.7,
    historicalWinRate: 70.5,
  },
  {
    tier: 'elevated',
    units: 1.5,
    description: 'CatalystFund spreads',
    conditions: {
      funds: ['CatalystFund'],
      betTypes: ['spread'],
    },
    historicalROI: 49.2,
    historicalWinRate: 68.4,
  },

  // TIER 4: REDUCED (0.5u) - Underperforming combinations
  {
    tier: 'reduced',
    units: 0.5,
    description: 'VectorFund NCAAF - historically negative ROI',
    conditions: {
      funds: ['VectorFund'],
      sports: ['NCAAF'],
    },
    historicalROI: -13.8,
    historicalWinRate: 35.7,
  },

  // BLOCKED (0u) - DO NOT BET - Negative ROI bet types
  // Updated Jan 2026: 509 bets analyzed, props -$1,179, totals -$928
  {
    tier: 'blocked',
    units: 0,
    description: 'ALL PROPS BLOCKED - 45.8% WR, -$1,179 all-time',
    conditions: {
      betTypes: ['props'],
    },
    historicalROI: -24.5,
    historicalWinRate: 45.8,
  },
  {
    tier: 'blocked',
    units: 0,
    description: 'ALL TOTALS BLOCKED - 45.5% WR, -$928 all-time',
    conditions: {
      betTypes: ['total'],
    },
    historicalROI: -21.1,
    historicalWinRate: 45.5,
  },
];

// Default sizing for anything not matching a rule
export const DEFAULT_SIZING: SizingRule = {
  tier: 'standard',
  units: 1.0,
  description: 'Standard sizing',
  conditions: {},
  historicalROI: 11.1,
  historicalWinRate: 57.2,
};

/**
 * Calculate optimal unit size for a bet
 * Rules are checked in order - first match wins (more specific rules first)
 */
export function getOptimalUnits(
  fund: FundKey,
  sport: Sport,
  betType: ActualBetType
): { units: number; tier: SizingTier; reason: string } {

  // Check rules in order (most specific first)
  for (const rule of SIZING_RULES) {
    const { conditions } = rule;

    // Check fund match
    const fundMatch = !conditions.funds || conditions.funds.includes(fund);

    // Check sport match
    const sportMatch = !conditions.sports || conditions.sports.includes(sport);

    // Check bet type match
    const betTypeMatch = !conditions.betTypes || conditions.betTypes.includes(betType);

    // All specified conditions must match
    if (fundMatch && sportMatch && betTypeMatch) {
      // Make sure at least one condition was actually specified
      const hasConditions = conditions.funds || conditions.sports || conditions.betTypes;
      if (hasConditions) {
        return {
          units: rule.units,
          tier: rule.tier,
          reason: rule.description,
        };
      }
    }
  }

  // No rule matched - use default
  return {
    units: DEFAULT_SIZING.units,
    tier: DEFAULT_SIZING.tier,
    reason: DEFAULT_SIZING.description,
  };
}

/**
 * Get sizing recommendation with full context
 */
export function getSizingRecommendation(
  fund: FundKey,
  sport: Sport,
  betType: ActualBetType
): {
  units: number;
  tier: SizingTier;
  reason: string;
  stake: number;  // Dollar amount at $100/unit
  emoji: string;
} {
  const UNIT_VALUE = 100;
  const result = getOptimalUnits(fund, sport, betType);

  const tierEmojis: Record<SizingTier, string> = {
    max: '🔥',
    elevated: '📈',
    standard: '➡️',
    reduced: '⚠️',
    blocked: '🚫',
  };

  return {
    ...result,
    stake: result.units * UNIT_VALUE,
    emoji: tierEmojis[result.tier],
  };
}

/**
 * Display all current sizing rules
 */
export function displaySizingMatrix(): void {
  console.log('\n=== DYNAMIC UNIT SIZING MATRIX ===\n');

  const tiers = ['max', 'elevated', 'standard', 'reduced'] as SizingTier[];

  for (const tier of tiers) {
    const rules = SIZING_RULES.filter(r => r.tier === tier);
    if (rules.length === 0 && tier === 'standard') {
      console.log(`${tier.toUpperCase()} (1.0u):`);
      console.log(`  - Everything else not matching above/below rules`);
      continue;
    }

    if (rules.length > 0) {
      console.log(`${tier.toUpperCase()} (${rules[0].units}u):`);
      for (const rule of rules) {
        console.log(`  - ${rule.description}`);
        console.log(`    Historical: ${rule.historicalWinRate}% WR, ${rule.historicalROI > 0 ? '+' : ''}${rule.historicalROI}% ROI`);
      }
    }
    console.log('');
  }
}

/**
 * Quick lookup table for common combinations
 */
export const QUICK_SIZING: Record<string, number> = {
  // Max (2u)
  'SharpFund-NFL-spread': 2.0,
  'SharpFund-NFL-moneyline': 2.0,
  'SharpFund-NCAAB-spread': 2.0,
  'SharpFund-NCAAB-moneyline': 2.0,

  // Elevated (1.5u)
  'SharpFund-NBA-spread': 1.5,
  'SharpFund-NHL-spread': 1.5,
  'SharpFund-NCAAF-spread': 1.5,
  'CatalystFund-NBA-spread': 1.5,
  'CatalystFund-NFL-spread': 1.5,
  'CatalystFund-NHL-spread': 1.5,
  'CatalystFund-NCAAB-spread': 1.5,
  'CatalystFund-NCAAF-spread': 1.5,

  // Reduced (0.5u)
  'VectorFund-NCAAF-spread': 0.5,
  'VectorFund-NCAAF-moneyline': 0.5,

  // BLOCKED (0u) - DO NOT BET
  'any-any-total': 0,
  'any-any-props': 0,
};

/**
 * Fast lookup using quick table
 */
export function getQuickUnits(fund: FundKey, sport: Sport, betType: ActualBetType): number {
  // BLOCKED BET TYPES - check first (props and totals are blocked)
  if (betType === 'props' || betType === 'total') {
    return 0; // BLOCKED - do not bet
  }

  // Try exact match first
  const exactKey = `${fund}-${sport}-${betType}`;
  if (QUICK_SIZING[exactKey] !== undefined) {
    return QUICK_SIZING[exactKey];
  }

  // Try with 'any' sport
  const anyKey = `${fund}-any-${betType}`;
  if (QUICK_SIZING[anyKey] !== undefined) {
    return QUICK_SIZING[anyKey];
  }

  // Fall back to full calculation
  return getOptimalUnits(fund, sport, betType).units;
}

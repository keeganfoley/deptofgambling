/**
 * Utility functions for Department of Gambling
 */

/**
 * Format currency with proper sign and decimal places
 */
export function formatCurrency(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}$${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format percentage with proper sign
 */
export function formatPercent(value: number, showSign: boolean = true, decimals: number = 2): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format units with proper sign
 */
export function formatUnits(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}u`;
}

/**
 * Format record as W-L
 */
export function formatRecord(wins: number, losses: number): string {
  return `${wins}-${losses}`;
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time to readable format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Get color class based on value (positive/negative)
 */
export function getValueColor(value: number): string {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-loss';
  return 'text-text';
}

/**
 * Calculate win percentage
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return (wins / total) * 100;
}

/**
 * Format American odds
 */
export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

/**
 * Calculate implied probability from American odds
 */
export function oddsToImpliedProb(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Animate number counting up
 */
export function animateValue(
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void
): void {
  const startTime = performance.now();
  const diff = end - start;

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + diff * easeOut;

    onUpdate(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      onUpdate(end);
    }
  }

  requestAnimationFrame(update);
}

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatRecord } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';
import metricsData from '@/data/metrics.json';

export default function PortfolioBreakdownPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  // Destructure all metrics
  const {
    sharpeRatio,
    sharpeRatioNote,
    maxDrawdown,
    maxDrawdownPercent,
    maxDrawdownPeak,
    maxDrawdownTrough,
    currentDrawdown,
    avgWin,
    avgLoss,
    largestWin,
    largestLoss,
    profitFactor,
    totalCapitalRisked,
    unitsRisked,
    closingLineValue,
    closingLineValueNote,
    clvBetsTracked,
    maxWinStreak,
    maxLossStreak,
    totalWinnings,
    totalLossesAmount,
    stakeBreakdown,
    sportBreakdown,
    betTypeBreakdown,
    portfolioGrowth,
    totalBets,
    wins: totalWins,
    losses: totalLosses,
    // NEW metrics
    rollingPerformance,
    edgeValidation,
    evAnalysis,
    fundMetrics,
    daysGreenStreak,
  } = metricsData as any;

  const portfolio = portfolioData as any;

  return (
    <div className="min-h-screen bg-background py-16 sm:py-20 px-4 relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto opacity-0 relative">
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Complete Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Portfolio Breakdown
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Full mathematical analysis and performance metrics across all funds
          </p>
        </div>

        {/* Portfolio Overview - Hero Section */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Portfolio Overview
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Balance - Hero Card */}
            <div className="stat-hero p-5 sm:p-6 rounded-xl">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Current Balance</div>
              <div className="text-2xl sm:text-4xl font-bold text-white mono-number">
                {formatCurrency(portfolio.combined.balance, false)}
              </div>
              <div className="text-xs sm:text-sm text-white/50 mt-2 mono-number">
                Starting: {formatCurrency(portfolio.combined.startingBalance, false)}
              </div>
            </div>

            <div className="stat-card p-5 sm:p-6">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">Net P/L</div>
              <div className={`text-xl sm:text-3xl font-bold mono-number ${
                portfolio.combined.netPL >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatCurrency(portfolio.combined.netPL)}
              </div>
              <div className="text-xs sm:text-sm text-text-light mt-2 mono-number">
                {portfolio.combined.unitsWon >= 0 ? '+' : ''}{typeof portfolio.combined.unitsWon === 'number' ? portfolio.combined.unitsWon.toFixed(2) : portfolio.combined.unitsWon}u won
              </div>
            </div>

            <div className="stat-card p-5 sm:p-6">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">Record (W-L-P)</div>
              <div className="text-xl sm:text-3xl font-bold text-primary mono-number">
                {formatRecord(portfolio.combined.record.wins, portfolio.combined.record.losses, portfolio.combined.record.pushes)}
              </div>
              <div className="text-xs sm:text-sm text-text-light mt-2 mono-number">
                {Number(portfolio.combined.winRate).toFixed(2)}% Win Rate
              </div>
            </div>

            <div className="stat-card p-5 sm:p-6">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">ROI</div>
              <div className={`text-xl sm:text-3xl font-bold mono-number ${
                portfolio.combined.roi >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatPercent(portfolio.combined.roi)}
              </div>
              <div className="text-xs sm:text-sm text-text-light mt-2">
                Return on capital
              </div>
            </div>
          </div>
        </div>

        {/* Fund Performance Comparison */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-secondary rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Fund Performance
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-3 font-semibold text-text-muted uppercase text-xs tracking-wider">Fund</th>
                  <th className="text-center py-4 px-3 font-semibold text-text-muted uppercase text-xs tracking-wider">Record</th>
                  <th className="text-right py-4 px-3 font-semibold text-text-muted uppercase text-xs tracking-wider">Net P/L</th>
                  <th className="text-right py-4 px-3 font-semibold text-text-muted uppercase text-xs tracking-wider">ROI</th>
                  <th className="text-right py-4 px-3 font-semibold text-text-muted uppercase text-xs tracking-wider">Win %</th>
                </tr>
              </thead>
              <tbody>
                {fundMetrics && Object.entries(fundMetrics).map(([fundKey, fm]: [string, any]) => (
                  <tr key={fundKey} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-3 font-bold text-primary">{fundKey.replace('Fund', '')}</td>
                    <td className="py-4 px-3 text-center mono-number font-medium">
                      {fm.wins > 0 || fm.losses > 0
                        ? formatRecord(fm.wins, fm.losses)
                        : <span className="text-text-light">—</span>
                      }
                    </td>
                    <td className={`py-4 px-3 text-right mono-number font-bold ${
                      fm.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {fm.wins > 0 || fm.losses > 0
                        ? formatCurrency(fm.pnl)
                        : <span className="text-text-light">—</span>
                      }
                    </td>
                    <td className={`py-4 px-3 text-right mono-number font-medium ${
                      fm.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {fm.wins > 0 || fm.losses > 0
                        ? formatPercent(fm.roi)
                        : <span className="text-text-light">—</span>
                      }
                    </td>
                    <td className="py-4 px-3 text-right mono-number font-medium text-primary">
                      {fm.wins > 0 || fm.losses > 0
                        ? `${Number(fm.winRate).toFixed(1)}%`
                        : <span className="text-text-light italic text-xs">Deploying</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {fundMetrics && Object.entries(fundMetrics).map(([fundKey, fm]: [string, any]) => (
              <div key={fundKey} className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-primary">{fundKey.replace('Fund', '')}</span>
                  <span className="mono-number font-medium text-sm bg-white px-2 py-1 rounded">
                    {fm.wins > 0 || fm.losses > 0 ? formatRecord(fm.wins, fm.losses) : '—'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white rounded-md p-2 text-center">
                    <div className="text-text-muted text-[10px] uppercase tracking-wide">P/L</div>
                    <div className={`mono-number font-bold ${fm.pnl >= 0 ? 'text-success' : 'text-loss'}`}>
                      {fm.wins > 0 || fm.losses > 0 ? formatCurrency(fm.pnl) : '—'}
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 text-center">
                    <div className="text-text-muted text-[10px] uppercase tracking-wide">ROI</div>
                    <div className={`mono-number font-bold ${fm.roi >= 0 ? 'text-success' : 'text-loss'}`}>
                      {fm.wins > 0 || fm.losses > 0 ? formatPercent(fm.roi) : '—'}
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 text-center">
                    <div className="text-text-muted text-[10px] uppercase tracking-wide">Win %</div>
                    <div className="mono-number font-bold text-primary">
                      {fm.wins > 0 || fm.losses > 0 ? `${Number(fm.winRate).toFixed(1)}%` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rolling Performance */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-success rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Rolling Performance
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {rollingPerformance && (
              <>
                <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">Last 7 Days</div>
                  <div className="text-lg sm:text-2xl font-bold mono-number text-primary">
                    {formatRecord(rollingPerformance.last7Days.wins, rollingPerformance.last7Days.losses)}
                  </div>
                  <div className={`text-sm sm:text-lg font-bold mono-number mt-1 ${
                    rollingPerformance.last7Days.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatCurrency(rollingPerformance.last7Days.pnl)}
                  </div>
                  <div className={`text-[10px] sm:text-xs mono-number ${
                    rollingPerformance.last7Days.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    ({formatPercent(rollingPerformance.last7Days.roi)})
                  </div>
                  <div className="text-[10px] sm:text-xs text-text-light mt-2">
                    {rollingPerformance.last7Days.bets} positions
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">Last 30 Days</div>
                  <div className="text-lg sm:text-2xl font-bold mono-number text-primary">
                    {formatRecord(rollingPerformance.last30Days.wins, rollingPerformance.last30Days.losses)}
                  </div>
                  <div className={`text-sm sm:text-lg font-bold mono-number mt-1 ${
                    rollingPerformance.last30Days.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatCurrency(rollingPerformance.last30Days.pnl)}
                  </div>
                  <div className={`text-[10px] sm:text-xs mono-number ${
                    rollingPerformance.last30Days.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    ({formatPercent(rollingPerformance.last30Days.roi)})
                  </div>
                  <div className="text-[10px] sm:text-xs text-text-light mt-2">
                    {rollingPerformance.last30Days.bets} positions
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-2">Last 3 Days</div>
                  <div className="text-lg sm:text-2xl font-bold mono-number text-primary">
                    {rollingPerformance.last3Days
                      ? formatRecord(rollingPerformance.last3Days.wins, rollingPerformance.last3Days.losses)
                      : '—'}
                  </div>
                  <div className={`text-sm sm:text-lg font-bold mono-number mt-1 ${
                    rollingPerformance.last3Days?.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {rollingPerformance.last3Days
                      ? formatCurrency(rollingPerformance.last3Days.pnl)
                      : '—'}
                  </div>
                  <div className={`text-[10px] sm:text-xs mono-number ${
                    rollingPerformance.last3Days?.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {rollingPerformance.last3Days
                      ? `(${formatPercent(rollingPerformance.last3Days.roi)})`
                      : ''}
                  </div>
                  <div className="text-[10px] sm:text-xs text-text-light mt-2">
                    {rollingPerformance.last3Days?.bets || 0} positions
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Drawdown Analysis */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-loss rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Drawdown Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Drawdown */}
            <div className="bg-loss/5 p-5 sm:p-6 rounded-xl border border-loss/20">
              <h3 className="font-bold text-loss mb-4 text-sm uppercase tracking-wide">Maximum Drawdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-loss/70 mb-1 uppercase tracking-wide">Amount</div>
                  <div className="text-xl sm:text-2xl font-bold mono-number text-loss">
                    {formatCurrency(maxDrawdown)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-loss/70 mb-1 uppercase tracking-wide">Percent</div>
                  <div className="text-xl sm:text-2xl font-bold mono-number text-loss">
                    {maxDrawdownPercent?.toFixed(1) || '0'}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-loss/60 mt-4 pt-3 border-t border-loss/10">
                Peak: {maxDrawdownPeak || 'N/A'} → Trough: {maxDrawdownTrough || 'N/A'}
              </div>
            </div>

            {/* Current Drawdown */}
            <div className="bg-accent/5 p-5 sm:p-6 rounded-xl border border-accent/20">
              <h3 className="font-bold text-accent mb-4 text-sm uppercase tracking-wide">Current Drawdown</h3>
              {currentDrawdown && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-accent/70 mb-1 uppercase tracking-wide">Amount</div>
                    <div className={`text-xl sm:text-2xl font-bold mono-number ${
                      currentDrawdown.amount === 0 ? 'text-success' : 'text-accent'
                    }`}>
                      {currentDrawdown.amount === 0 ? 'At Peak' : formatCurrency(currentDrawdown.amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-accent/70 mb-1 uppercase tracking-wide">Days Since Peak</div>
                    <div className="text-xl sm:text-2xl font-bold mono-number text-accent">
                      {currentDrawdown.daysSincePeak}
                    </div>
                  </div>
                </div>
              )}
              {currentDrawdown && currentDrawdown.amount !== 0 && (
                <div className="text-xs text-accent/60 mt-4 pt-3 border-t border-accent/10">
                  Peak was ${currentDrawdown.peakBalance?.toFixed(2)} on {currentDrawdown.peakDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edge Validation */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-secondary rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Edge Validation
            </h2>
          </div>
          <p className="text-text-muted text-sm mb-6 ml-3">
            Does higher edge correlate with better results?
          </p>

          {edgeValidation && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div className="bg-gray-50/50 p-5 rounded-xl border-l-4 border-secondary">
                  <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Low Edge (0-5%)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.lowEdge.wins, edgeValidation.lowEdge.losses)}
                  </div>
                  <div className={`text-lg font-bold mono-number ${
                    edgeValidation.lowEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.lowEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-text-light mt-2">
                    {edgeValidation.lowEdge.bets} positions
                  </div>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border-l-4 border-accent">
                  <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Mid Edge (5-8%)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.midEdge.wins, edgeValidation.midEdge.losses)}
                  </div>
                  <div className={`text-lg font-bold mono-number ${
                    edgeValidation.midEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.midEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-text-light mt-2">
                    {edgeValidation.midEdge.bets} positions
                  </div>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border-l-4 border-success">
                  <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">High Edge (8%+)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.highEdge.wins, edgeValidation.highEdge.losses)}
                  </div>
                  <div className={`text-lg font-bold mono-number ${
                    edgeValidation.highEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.highEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-text-light mt-2">
                    {edgeValidation.highEdge.bets} positions
                  </div>
                </div>
              </div>

              <div className={`text-center p-4 rounded-xl ${
                edgeValidation.isCorrelated
                  ? 'bg-success/10 border border-success/30'
                  : 'bg-accent/10 border border-accent/30'
              }`}>
                <span className={`text-sm sm:text-base font-bold ${
                  edgeValidation.isCorrelated ? 'text-success' : 'text-accent'
                }`}>
                  {edgeValidation.isCorrelated
                    ? 'Correlation Working: Higher edge = Higher ROI'
                    : 'Needs Review: Edge not correlating with ROI'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* EV Analysis */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Expected Value Analysis
            </h2>
          </div>

          {evAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-secondary/5 p-5 rounded-xl border border-secondary/20">
                <div className="text-xs text-secondary/70 mb-2 uppercase tracking-wide">Total Expected</div>
                <div className="text-xl sm:text-2xl font-bold mono-number text-secondary">
                  {formatCurrency(evAnalysis.totalExpectedValue, true)}
                </div>
                <div className="text-xs text-secondary/50 mt-2">
                  Sum of all position EV
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Actual Result</div>
                <div className={`text-xl sm:text-2xl font-bold mono-number ${
                  evAnalysis.actualPL >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(evAnalysis.actualPL)}
                </div>
                <div className="text-xs text-text-light mt-2">
                  Real P/L
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Variance</div>
                <div className={`text-xl sm:text-2xl font-bold mono-number ${
                  evAnalysis.variance >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(evAnalysis.variance)}
                </div>
                <div className="text-xs text-text-light mt-2">
                  Actual - Expected
                </div>
              </div>

              <div className={`p-5 rounded-xl ${
                evAnalysis.variance >= 0 ? 'bg-success/10 border border-success/20' : 'bg-accent/10 border border-accent/20'
              }`}>
                <div className={`text-xs mb-2 uppercase tracking-wide ${
                  evAnalysis.variance >= 0 ? 'text-success/70' : 'text-accent/70'
                }`}>Status</div>
                <div className={`text-lg sm:text-xl font-bold ${
                  evAnalysis.variance >= 0 ? 'text-success' : 'text-accent'
                }`}>
                  {evAnalysis.variance >= 0 ? 'Running Hot' : 'Below EV'}
                </div>
                <div className={`text-xs mt-2 ${
                  evAnalysis.variance >= 0 ? 'text-success/60' : 'text-accent/60'
                }`}>
                  by {formatCurrency(Math.abs(evAnalysis.variance), false)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Capital Deployment */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Capital Deployment
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Total Capital Risked</div>
              <div className="text-xl sm:text-2xl font-bold mono-number text-primary">
                {formatCurrency(totalCapitalRisked, false)}
              </div>
              <div className="text-xs text-text-light mt-2 mono-number">
                {unitsRisked?.toFixed(2) || '0'}u total
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Capital Deployed %</div>
              <div className="text-xl sm:text-2xl font-bold mono-number text-primary">
                {((totalCapitalRisked / portfolio.combined.startingBalance) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-text-light mt-2">
                Of ${portfolio.combined.startingBalance.toLocaleString()} starting
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Avg Stake</div>
              <div className="text-xl sm:text-2xl font-bold mono-number text-primary">
                {formatCurrency(totalCapitalRisked / totalBets, false)}
              </div>
              <div className="text-xs text-text-light mt-2 mono-number">
                {(unitsRisked / totalBets).toFixed(2)}u per position
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Profit Factor</div>
              <div className={`text-xl sm:text-2xl font-bold mono-number ${
                profitFactor >= 1 ? 'text-success' : 'text-loss'
              }`}>
                {profitFactor?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-xs text-text-light mt-2">
                Win$ / Loss$
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-success rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Performance Metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-success/5 p-5 rounded-xl border border-success/20">
              <div className="text-xs text-success/70 mb-2 uppercase tracking-wide">Total Won</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-success">
                {formatCurrency(totalWinnings, false)}
              </div>
            </div>

            <div className="bg-loss/5 p-5 rounded-xl border border-loss/20">
              <div className="text-xs text-loss/70 mb-2 uppercase tracking-wide">Total Lost</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-loss">
                {formatCurrency(totalLossesAmount, false)}
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Avg Win</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-success">
                {formatCurrency(avgWin, false)}
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Avg Loss</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-loss">
                {formatCurrency(avgLoss)}
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Largest Win</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-success">
                {formatCurrency(largestWin, false)}
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Largest Loss</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-loss">
                {formatCurrency(largestLoss)}
              </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Sharpe Ratio</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-primary">
                {sharpeRatio !== null ? sharpeRatio.toFixed(2) : 'N/A'}
              </div>
              {sharpeRatioNote && (
                <div className="text-[10px] sm:text-xs text-text-light mt-2 leading-tight">{sharpeRatioNote}</div>
              )}
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">CLV</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-primary">
                {closingLineValue !== null && closingLineValue !== undefined
                  ? `+${closingLineValue.toFixed(1)}¢`
                  : 'Tracking'}
              </div>
              <div className="text-[10px] sm:text-xs text-text-light mt-2">
                {closingLineValue !== null ? `${clvBetsTracked} positions` : 'Started Nov 27'}
              </div>
            </div>
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6">
            <div className="bg-success/5 p-5 rounded-xl border border-success/20">
              <div className="text-xs text-success/70 mb-2 uppercase tracking-wide">Best Win Streak</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-success">
                {maxWinStreak} Wins
              </div>
            </div>
            <div className="bg-success/10 p-5 rounded-xl border-2 border-success/30">
              <div className="text-xs text-success/70 mb-2 uppercase tracking-wide">Days Green Streak</div>
              <div className="text-lg sm:text-2xl font-bold mono-number text-success">
                {daysGreenStreak?.current || 0} Days
              </div>
              <div className="text-[10px] sm:text-xs text-success/60 mt-2">
                Best: {daysGreenStreak?.best || 0} days
              </div>
            </div>
          </div>
        </div>

        {/* Sport Breakdown */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-secondary rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Performance by Sport
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sportBreakdown && Object.entries(sportBreakdown).map(([sport, data]: [string, any]) => (
              <div key={sport} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {sport}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">Record</span>
                    <span className="font-bold mono-number text-primary">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">Net P/L</span>
                    <span className={`font-bold mono-number ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">ROI</span>
                    <span className={`font-bold mono-number ${
                      data.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatPercent(data.roi)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bet Type Breakdown */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Performance by Position Type
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {betTypeBreakdown && Object.entries(betTypeBreakdown).map(([type, data]: [string, any]) => (
              <div key={type} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 hover:border-accent/20 transition-colors">
                <h3 className="text-base font-bold text-primary mb-4">{type}</h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs uppercase tracking-wide">Record</span>
                    <span className="font-bold mono-number text-sm">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs uppercase tracking-wide">Win Rate</span>
                    <span className={`font-bold mono-number text-sm ${
                      Number(data.winRate) >= 50 ? 'text-success' : 'text-loss'
                    }`}>
                      {Number(data.winRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs uppercase tracking-wide">Net P/L</span>
                    <span className={`font-bold mono-number text-sm ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs uppercase tracking-wide">ROI</span>
                    <span className={`font-bold mono-number text-sm ${
                      data.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatPercent(data.roi)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conviction Tier Analysis */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Conviction Tier Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {stakeBreakdown && Object.entries(stakeBreakdown).map(([tierName, data]: [string, any]) => (
              <div key={tierName} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                <h3 className="text-lg font-bold text-primary mb-1">{data.label || tierName}</h3>
                <p className="text-xs text-text-muted mb-4 uppercase tracking-wide">{data.range || tierName}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">Record</span>
                    <span className="font-bold mono-number text-primary">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">Win Rate</span>
                    <span className={`font-bold mono-number ${
                      Number(data.winRate) >= 50 ? 'text-success' : 'text-loss'
                    }`}>
                      {Number(data.winRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">Net P/L</span>
                    <span className={`font-bold mono-number ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">ROI</span>
                    <span className={`font-bold mono-number ${
                      data.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatPercent(data.roi)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="stat-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-success rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wide">
              Recent Activity
            </h2>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block space-y-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-5 gap-3 text-xs font-semibold text-text-muted uppercase tracking-wider pb-3 border-b border-gray-200 sticky top-0 bg-white">
              <div>Date</div>
              <div>Position</div>
              <div className="text-center">Result</div>
              <div className="text-right">P/L</div>
              <div className="text-right">Balance</div>
            </div>
            {portfolioGrowth && portfolioGrowth.slice().reverse().slice(0, 15).map((entry: any, index: number) => (
              <div key={index} className="grid grid-cols-5 gap-3 text-sm py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <div className="text-text-muted mono-number text-xs">{entry.date}</div>
                <div className="text-primary truncate text-xs font-medium">{entry.description}</div>
                <div className="text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    entry.result === 'win' ? 'bg-success/10 text-success' : entry.result === 'push' ? 'bg-gray-200 text-gray-500' : 'bg-loss/10 text-loss'
                  }`}>
                    {entry.result === 'win' ? 'W' : entry.result === 'push' ? 'P' : 'L'}
                  </span>
                </div>
                <div className={`text-right mono-number font-bold ${
                  entry.profit >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(entry.profit)}
                </div>
                <div className="text-right mono-number font-bold text-primary">
                  {formatCurrency(entry.balance, false)}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3 max-h-[400px] overflow-y-auto">
            {portfolioGrowth && portfolioGrowth.slice().reverse().slice(0, 15).map((entry: any, index: number) => (
              <div key={index} className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-text-muted mono-number uppercase tracking-wide">{entry.date}</div>
                    <div className="text-sm text-primary font-medium line-clamp-2">{entry.description}</div>
                  </div>
                  <span className={`ml-3 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    entry.result === 'win' ? 'bg-success/10 text-success' : entry.result === 'push' ? 'bg-gray-200 text-gray-500' : 'bg-loss/10 text-loss'
                  }`}>
                    {entry.result === 'win' ? 'W' : entry.result === 'push' ? 'P' : 'L'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">P/L</div>
                    <div className={`mono-number font-bold ${
                      entry.profit >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(entry.profit)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">Balance</div>
                    <div className="mono-number font-bold text-primary">
                      {formatCurrency(entry.balance, false)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency Statement */}
        <div className="stat-hero rounded-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-100" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">Complete Transparency</h2>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-white/90">
              <p>
                Every statistic on this page is calculated from <strong className="text-white">real data</strong>.
                We track every dollar risked, every position taken, and every outcome with complete accuracy.
              </p>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/20">
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wide">Total Positions</div>
                  <div className="text-xl font-bold text-white mono-number">{totalBets}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wide">Period</div>
                  <div className="text-sm font-medium text-white">Nov 4, 2025 - Present</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wide">Starting Capital</div>
                  <div className="text-lg font-bold text-white mono-number">{formatCurrency(portfolio.combined.startingBalance, false)}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wide">Current Balance</div>
                  <div className="text-lg font-bold text-accent mono-number">{formatCurrency(portfolio.combined.balance, false)}</div>
                </div>
              </div>
              <p className="text-xs text-white/60">
                All formulas are publicly disclosed. No simulation. No fake positions. 100% transparency.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

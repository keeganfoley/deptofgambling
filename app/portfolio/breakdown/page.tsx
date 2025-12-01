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
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-16 px-4">
      <div ref={containerRef} className="max-w-7xl mx-auto opacity-0">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4">
            COMPLETE PORTFOLIO BREAKDOWN
          </h1>
          <p className="text-text-muted text-lg">
            Full mathematical analysis and performance metrics
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-sm border-2 border-primary p-4 sm:p-8 mb-6 sm:mb-8 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 border-b-2 border-primary pb-3">
            PORTFOLIO OVERVIEW
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="data-label text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Current Balance</div>
              <div className="text-lg sm:text-3xl font-bold text-primary mono-number">
                {formatCurrency(portfolio.combined.balance, false)}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-600 mt-1 sm:mt-2 mono-number">
                Starting: {formatCurrency(portfolio.combined.startingBalance, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="data-label text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Net P/L</div>
              <div className={`text-lg sm:text-3xl font-bold mono-number ${
                portfolio.combined.netPL >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatCurrency(portfolio.combined.netPL)}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-600 mt-1 sm:mt-2 mono-number">
                {portfolio.combined.unitsWon >= 0 ? '+' : ''}{typeof portfolio.combined.unitsWon === 'number' ? portfolio.combined.unitsWon.toFixed(2) : portfolio.combined.unitsWon}u won
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="data-label text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Record</div>
              <div className="text-lg sm:text-3xl font-bold text-primary mono-number">
                {formatRecord(portfolio.combined.record.wins, portfolio.combined.record.losses)}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-600 mt-1 sm:mt-2 mono-number">
                {Number(portfolio.combined.winRate).toFixed(2)}% Win Rate
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="data-label text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">ROI</div>
              <div className={`text-lg sm:text-3xl font-bold mono-number ${
                portfolio.combined.roi >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatPercent(portfolio.combined.roi)}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-600 mt-1 sm:mt-2">
                Return on capital
              </div>
            </div>
          </div>
        </div>

        {/* Fund Performance Comparison (NEW) */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3">
            FUND PERFORMANCE
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-2 font-bold text-primary">Fund</th>
                  <th className="text-center py-3 px-2 font-bold text-primary">Record</th>
                  <th className="text-right py-3 px-2 font-bold text-primary">Net P/L</th>
                  <th className="text-right py-3 px-2 font-bold text-primary">ROI</th>
                  <th className="text-right py-3 px-2 font-bold text-primary">Win %</th>
                </tr>
              </thead>
              <tbody>
                {fundMetrics && Object.entries(fundMetrics).map(([fundKey, fm]: [string, any]) => (
                  <tr key={fundKey} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 font-semibold">{fundKey.replace('Fund', '')}</td>
                    <td className="py-3 px-2 text-center mono-number">
                      {fm.wins > 0 || fm.losses > 0
                        ? formatRecord(fm.wins, fm.losses)
                        : <span className="text-gray-400 italic">—</span>
                      }
                    </td>
                    <td className={`py-3 px-2 text-right mono-number font-semibold ${
                      fm.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {fm.wins > 0 || fm.losses > 0
                        ? formatCurrency(fm.pnl)
                        : <span className="text-gray-400 italic">—</span>
                      }
                    </td>
                    <td className={`py-3 px-2 text-right mono-number ${
                      fm.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {fm.wins > 0 || fm.losses > 0
                        ? formatPercent(fm.roi)
                        : <span className="text-gray-400 italic">—</span>
                      }
                    </td>
                    <td className="py-3 px-2 text-right mono-number">
                      {fm.wins > 0 || fm.losses > 0
                        ? `${Number(fm.winRate).toFixed(1)}%`
                        : <span className="text-gray-400 italic">Deploying</span>
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
              <div key={fundKey} className="border-2 border-gray-200 rounded-sm p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary text-lg">{fundKey.replace('Fund', '')}</span>
                  <span className="mono-number font-semibold">
                    {fm.wins > 0 || fm.losses > 0 ? formatRecord(fm.wins, fm.losses) : '—'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">P/L</div>
                    <div className={`mono-number font-semibold ${fm.pnl >= 0 ? 'text-success' : 'text-loss'}`}>
                      {fm.wins > 0 || fm.losses > 0 ? formatCurrency(fm.pnl) : '—'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">ROI</div>
                    <div className={`mono-number ${fm.roi >= 0 ? 'text-success' : 'text-loss'}`}>
                      {fm.wins > 0 || fm.losses > 0 ? formatPercent(fm.roi) : '—'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">Win %</div>
                    <div className="mono-number">
                      {fm.wins > 0 || fm.losses > 0 ? `${Number(fm.winRate).toFixed(1)}%` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rolling Performance (NEW) */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3">
            ROLLING PERFORMANCE
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {rollingPerformance && (
              <>
                <div className="bg-gray-50 p-2 sm:p-5 rounded-sm">
                  <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Last 7 Days</div>
                  <div className="text-base sm:text-2xl font-bold mono-number text-primary">
                    {formatRecord(rollingPerformance.last7Days.wins, rollingPerformance.last7Days.losses)}
                  </div>
                  <div className={`text-xs sm:text-lg font-semibold mono-number mt-1 ${
                    rollingPerformance.last7Days.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatCurrency(rollingPerformance.last7Days.pnl)}
                  </div>
                  <div className={`text-[9px] sm:text-xs mono-number ${
                    rollingPerformance.last7Days.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    ({formatPercent(rollingPerformance.last7Days.roi)})
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-500 mt-1">
                    {rollingPerformance.last7Days.bets} bets
                  </div>
                </div>

                <div className="bg-gray-50 p-2 sm:p-5 rounded-sm">
                  <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Last 30 Days</div>
                  <div className="text-base sm:text-2xl font-bold mono-number text-primary">
                    {formatRecord(rollingPerformance.last30Days.wins, rollingPerformance.last30Days.losses)}
                  </div>
                  <div className={`text-xs sm:text-lg font-semibold mono-number mt-1 ${
                    rollingPerformance.last30Days.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatCurrency(rollingPerformance.last30Days.pnl)}
                  </div>
                  <div className={`text-[9px] sm:text-xs mono-number ${
                    rollingPerformance.last30Days.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    ({formatPercent(rollingPerformance.last30Days.roi)})
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-500 mt-1">
                    {rollingPerformance.last30Days.bets} bets
                  </div>
                </div>

                <div className="bg-gray-50 p-2 sm:p-5 rounded-sm">
                  <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Last 3 Days</div>
                  <div className="text-base sm:text-2xl font-bold mono-number text-primary">
                    {rollingPerformance.last3Days
                      ? formatRecord(rollingPerformance.last3Days.wins, rollingPerformance.last3Days.losses)
                      : '—'}
                  </div>
                  <div className={`text-xs sm:text-lg font-semibold mono-number mt-1 ${
                    rollingPerformance.last3Days?.pnl >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {rollingPerformance.last3Days
                      ? formatCurrency(rollingPerformance.last3Days.pnl)
                      : '—'}
                  </div>
                  <div className={`text-[9px] sm:text-xs mono-number ${
                    rollingPerformance.last3Days?.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {rollingPerformance.last3Days
                      ? `(${formatPercent(rollingPerformance.last3Days.roi)})`
                      : ''}
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-500 mt-1">
                    {rollingPerformance.last3Days?.bets || 0} bets
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Drawdown Analysis */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            📉 DRAWDOWN ANALYSIS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Drawdown */}
            <div className="bg-red-50 p-6 rounded-sm border-2 border-red-200">
              <h3 className="font-bold text-red-800 mb-4">Maximum Drawdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-red-700 mb-1">Amount</div>
                  <div className="text-2xl font-bold mono-number text-red-600">
                    {formatCurrency(maxDrawdown)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-red-700 mb-1">Percent</div>
                  <div className="text-2xl font-bold mono-number text-red-600">
                    {maxDrawdownPercent?.toFixed(1) || '0'}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-red-600 mt-3">
                Peak: {maxDrawdownPeak || 'N/A'} → Trough: {maxDrawdownTrough || 'N/A'}
              </div>
            </div>

            {/* Current Drawdown */}
            <div className="bg-orange-50 p-6 rounded-sm border-2 border-orange-200">
              <h3 className="font-bold text-orange-800 mb-4">Current Drawdown</h3>
              {currentDrawdown && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-orange-700 mb-1">Amount</div>
                    <div className={`text-2xl font-bold mono-number ${
                      currentDrawdown.amount === 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {currentDrawdown.amount === 0 ? 'At Peak' : formatCurrency(currentDrawdown.amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-orange-700 mb-1">Days Since Peak</div>
                    <div className="text-2xl font-bold mono-number text-orange-600">
                      {currentDrawdown.daysSincePeak}
                    </div>
                  </div>
                </div>
              )}
              {currentDrawdown && currentDrawdown.amount !== 0 && (
                <div className="text-xs text-orange-600 mt-3">
                  Peak was ${currentDrawdown.peakBalance?.toFixed(2)} on {currentDrawdown.peakDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edge Validation (NEW) */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            🎯 EDGE VALIDATION
            <span className="text-sm font-normal text-gray-500 ml-3">
              Does Higher Edge = Better Results?
            </span>
          </h2>

          {edgeValidation && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-5 rounded-sm border-l-4 border-blue-400">
                  <div className="text-sm text-gray-600 mb-1">Low Edge (0-5%)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.lowEdge.wins, edgeValidation.lowEdge.losses)}
                  </div>
                  <div className={`text-lg font-semibold mono-number ${
                    edgeValidation.lowEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.lowEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {edgeValidation.lowEdge.bets} bets
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-sm border-l-4 border-yellow-400">
                  <div className="text-sm text-gray-600 mb-1">Mid Edge (5-8%)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.midEdge.wins, edgeValidation.midEdge.losses)}
                  </div>
                  <div className={`text-lg font-semibold mono-number ${
                    edgeValidation.midEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.midEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {edgeValidation.midEdge.bets} bets
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-sm border-l-4 border-green-400">
                  <div className="text-sm text-gray-600 mb-1">High Edge (8%+)</div>
                  <div className="text-xl font-bold mono-number text-primary">
                    {formatRecord(edgeValidation.highEdge.wins, edgeValidation.highEdge.losses)}
                  </div>
                  <div className={`text-lg font-semibold mono-number ${
                    edgeValidation.highEdge.roi >= 0 ? 'text-success' : 'text-loss'
                  }`}>
                    {formatPercent(edgeValidation.highEdge.roi)} ROI
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {edgeValidation.highEdge.bets} bets
                  </div>
                </div>
              </div>

              <div className={`text-center p-4 rounded-sm ${
                edgeValidation.isCorrelated
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-yellow-100 border-2 border-yellow-300'
              }`}>
                <span className="text-lg font-bold">
                  {edgeValidation.isCorrelated
                    ? '✅ Correlation Working: Higher edge = Higher ROI'
                    : '⚠️ Needs Review: Edge not correlating with ROI'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* EV Analysis (NEW) */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            💰 EXPECTED VALUE ANALYSIS
          </h2>

          {evAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-5 rounded-sm">
                <div className="text-sm text-blue-700 mb-1">Total Expected</div>
                <div className="text-2xl font-bold mono-number text-blue-600">
                  {formatCurrency(evAnalysis.totalExpectedValue, true)}
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  Sum of all bet EV
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-sm">
                <div className="text-sm text-gray-600 mb-1">Actual Result</div>
                <div className={`text-2xl font-bold mono-number ${
                  evAnalysis.actualPL >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(evAnalysis.actualPL)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Real P/L
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-sm">
                <div className="text-sm text-gray-600 mb-1">Variance</div>
                <div className={`text-2xl font-bold mono-number ${
                  evAnalysis.variance >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(evAnalysis.variance)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Actual - Expected
                </div>
              </div>

              <div className={`p-5 rounded-sm ${
                evAnalysis.variance >= 0 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <div className={`text-sm mb-1 ${
                  evAnalysis.variance >= 0 ? 'text-green-700' : 'text-yellow-700'
                }`}>Status</div>
                <div className={`text-xl font-bold ${
                  evAnalysis.variance >= 0 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {evAnalysis.variance >= 0 ? '🔥 Running Hot' : '📊 Below EV'}
                </div>
                <div className={`text-xs mt-1 ${
                  evAnalysis.variance >= 0 ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  by {formatCurrency(Math.abs(evAnalysis.variance), false)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Risk & Exposure */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            ⚠️ CAPITAL DEPLOYMENT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Total Capital Risked</div>
              <div className="text-2xl font-bold mono-number text-primary">
                {formatCurrency(totalCapitalRisked, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1 mono-number">
                {unitsRisked?.toFixed(2) || '0'}u total
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Capital Deployed %</div>
              <div className="text-2xl font-bold mono-number text-primary">
                {((totalCapitalRisked / portfolio.combined.startingBalance) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Of ${portfolio.combined.startingBalance.toLocaleString()} starting
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Avg Stake</div>
              <div className="text-2xl font-bold mono-number text-primary">
                {formatCurrency(totalCapitalRisked / totalBets, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1 mono-number">
                {(unitsRisked / totalBets).toFixed(2)}u per bet
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Profit Factor</div>
              <div className={`text-2xl font-bold mono-number ${
                profitFactor >= 1 ? 'text-success' : 'text-loss'
              }`}>
                {profitFactor?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Win$ / Loss$
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3">
            PERFORMANCE METRICS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-green-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-green-700 mb-1">Total Won</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-green-600">
                {formatCurrency(totalWinnings, false)}
              </div>
            </div>

            <div className="bg-red-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-red-700 mb-1">Total Lost</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-red-600">
                {formatCurrency(totalLossesAmount, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Avg Win</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-success">
                {formatCurrency(avgWin, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Avg Loss</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-loss">
                {formatCurrency(avgLoss)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Largest Win</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-success">
                {formatCurrency(largestWin, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Largest Loss</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-loss">
                {formatCurrency(largestLoss)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">Sharpe Ratio</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-primary">
                {sharpeRatio !== null ? sharpeRatio.toFixed(2) : 'N/A'}
              </div>
              {sharpeRatioNote && (
                <div className="text-[9px] sm:text-xs text-gray-500 mt-1 leading-tight">{sharpeRatioNote}</div>
              )}
            </div>

            <div className="bg-gray-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-gray-600 mb-1">CLV</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-primary">
                {closingLineValue !== null && closingLineValue !== undefined
                  ? `+${closingLineValue.toFixed(1)}¢`
                  : 'Tracking'}
              </div>
              <div className="text-[9px] sm:text-xs text-gray-500 mt-1">
                {closingLineValue !== null ? `${clvBetsTracked} bets` : 'Started Nov 27'}
              </div>
            </div>
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
            <div className="bg-green-50 p-3 sm:p-5 rounded-sm">
              <div className="text-[10px] sm:text-sm text-green-700 mb-1">Best Win Streak</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-green-600">
                {maxWinStreak} Wins
              </div>
            </div>
            <div className="bg-green-50 p-3 sm:p-5 rounded-sm border-2 border-green-300">
              <div className="text-[10px] sm:text-sm text-green-700 mb-1">Days Green Streak</div>
              <div className="text-base sm:text-2xl font-bold mono-number text-green-600">
                {daysGreenStreak?.current || 0} Days
              </div>
              <div className="text-[9px] sm:text-xs text-green-500 mt-1">
                Best: {daysGreenStreak?.best || 0} days
              </div>
            </div>
          </div>
        </div>

        {/* Sport Breakdown */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            🏆 PERFORMANCE BY SPORT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportBreakdown && Object.entries(sportBreakdown).map(([sport, data]: [string, any]) => (
              <div key={sport} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <span>{data.emoji}</span>
                  <span>{sport}</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Record</span>
                    <span className="font-bold mono-number">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net P/L</span>
                    <span className={`font-bold mono-number ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI</span>
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
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            📋 PERFORMANCE BY BET TYPE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {betTypeBreakdown && Object.entries(betTypeBreakdown).map(([type, data]: [string, any]) => (
              <div key={type} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <h3 className="text-lg font-bold text-primary mb-4">{type}</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Record</span>
                    <span className="font-bold mono-number">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Win Rate</span>
                    <span className={`font-bold mono-number ${
                      Number(data.winRate) >= 50 ? 'text-success' : 'text-loss'
                    }`}>
                      {Number(data.winRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Net P/L</span>
                    <span className={`font-bold mono-number ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">ROI</span>
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

        {/* Conviction Tier Analysis */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            💪 CONVICTION TIER ANALYSIS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakeBreakdown && Object.entries(stakeBreakdown).map(([tierName, data]: [string, any]) => (
              <div key={tierName} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-1">{data.label || tierName}</h3>
                <p className="text-sm text-gray-500 mb-4">{data.range || tierName}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Record</span>
                    <span className="font-bold mono-number">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate</span>
                    <span className={`font-bold mono-number ${
                      Number(data.winRate) >= 50 ? 'text-success' : 'text-loss'
                    }`}>
                      {Number(data.winRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net P/L</span>
                    <span className={`font-bold mono-number ${
                      data.pnl >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(data.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI</span>
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

        {/* Portfolio Growth Timeline */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-8 mb-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3">
            RECENT ACTIVITY
          </h2>

          {/* Desktop Table Layout */}
          <div className="hidden md:block space-y-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 text-xs font-bold text-gray-600 uppercase pb-2 border-b-2 border-gray-300 sticky top-0 bg-white">
              <div>Date</div>
              <div>Bet</div>
              <div className="text-right">Result</div>
              <div className="text-right">P/L</div>
              <div className="text-right">Balance</div>
            </div>
            {portfolioGrowth && portfolioGrowth.slice().reverse().slice(0, 15).map((entry: any, index: number) => (
              <div key={index} className="grid grid-cols-5 gap-2 text-sm py-2 border-b border-gray-200 hover:bg-gray-50">
                <div className="text-gray-600 mono-number">{entry.date}</div>
                <div className="text-gray-900 truncate text-xs">{entry.description}</div>
                <div className="text-right">
                  {entry.result === 'win' ? '✅' : entry.result === 'push' ? '🔄' : '❌'}
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
              <div key={index} className="border-2 border-gray-200 rounded-sm p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs text-gray-500 mono-number">{entry.date}</div>
                    <div className="text-sm text-gray-900 line-clamp-2">{entry.description}</div>
                  </div>
                  <span className="text-lg ml-2">
                    {entry.result === 'win' ? '✅' : entry.result === 'push' ? '🔄' : '❌'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">P/L</div>
                    <div className={`mono-number font-bold ${
                      entry.profit >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(entry.profit)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase">Balance</div>
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
        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-sm p-4 sm:p-8 shadow-xl">
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">COMPLETE TRANSPARENCY</h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <p>
              Every statistic on this page is calculated from <strong>real betting data</strong>.
              We track every dollar risked, every position taken, and every outcome with complete accuracy.
            </p>
            <p>
              <strong>Total Bets Tracked:</strong> {totalBets} positions<br />
              <strong>Period:</strong> November 4, 2025 - Present<br />
              <strong>Starting Capital:</strong> {formatCurrency(portfolio.combined.startingBalance, false)}<br />
              <strong>Current Balance:</strong> {formatCurrency(portfolio.combined.balance, false)}
            </p>
            <p className="text-[10px] sm:text-xs pt-3 sm:pt-4 border-t border-white/30">
              All formulas are publicly disclosed. No simulation. No fake bets. 100% transparency.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

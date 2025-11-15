'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatRecord } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';
import metricsData from '@/data/metrics.json';
import betsData from '@/data/bets.json';

export default function PortfolioBreakdownPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  const {
    sharpeRatio,
    sharpeRatioNote,
    maxDrawdown,
    avgWin,
    avgLoss,
    avgProfitPerBet,
    medianProfit,
    largestWin,
    largestLoss,
    profitFactor,
    totalCapitalRisked,
    unitsRisked,
    unitEfficiency,
    closingLineValue,
    kellyUtilization,
    maxWinStreak,
    maxLossStreak,
    totalWinnings,
    totalLosses,
    stakeBreakdown,
    sportBreakdown,
    betTypeBreakdown,
    portfolioGrowth,
    totalBets,
    totalWins,
    totalLosses: lossCount,
  } = metricsData as any;

  const allBets = betsData as any[];

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
          <div className="mt-6">
            <Link
              href="/"
              className="text-secondary hover:text-accent font-bold transition-colors inline-flex items-center gap-2"
            >
              <span>←</span> Back to Portfolio
            </Link>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-sm border-2 border-primary p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-primary pb-3">
            📊 PORTFOLIO OVERVIEW
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="data-label text-xs uppercase mb-2">Current Balance</div>
              <div className="text-3xl font-bold text-primary mono-number">
                {formatCurrency(portfolioData.balance, false)}
              </div>
              <div className="text-sm text-gray-600 mt-2 mono-number">
                Starting: {formatCurrency(portfolioData.startingBalance, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="data-label text-xs uppercase mb-2">Net P/L</div>
              <div className={`text-3xl font-bold mono-number ${
                portfolioData.netPL >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatCurrency(portfolioData.netPL)}
              </div>
              <div className="text-sm text-gray-600 mt-2 mono-number">
                {portfolioData.unitsWon >= 0 ? '+' : ''}{portfolioData.unitsWon.toFixed(2)}u won
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="data-label text-xs uppercase mb-2">Record</div>
              <div className="text-3xl font-bold text-primary mono-number">
                {formatRecord(portfolioData.record.wins, portfolioData.record.losses)}
              </div>
              <div className="text-sm text-gray-600 mt-2 mono-number">
                {portfolioData.winRate.toFixed(2)}% Win Rate
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="data-label text-xs uppercase mb-2">ROI</div>
              <div className={`text-3xl font-bold mono-number ${
                portfolioData.roi >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatPercent(portfolioData.roi)}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Since Nov 4, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Risk & Exposure Metrics */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            ⚠️ RISK & EXPOSURE ANALYSIS
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="font-bold text-primary mb-4">Capital Deployment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Capital Risked</div>
                  <div className="text-2xl font-bold mono-number text-primary">
                    {formatCurrency(totalCapitalRisked, false)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 mono-number">
                    {unitsRisked.toFixed(2)}u total
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Exposure % of Bankroll</div>
                  <div className="text-2xl font-bold mono-number text-primary">
                    {((totalCapitalRisked / portfolioData.startingBalance) * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Of ${portfolioData.startingBalance.toFixed(2)} starting
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Stake Per Bet</div>
                  <div className="text-2xl font-bold mono-number text-primary">
                    {formatCurrency(totalCapitalRisked / allBets.length, false)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 mono-number">
                    {(unitsRisked / allBets.length).toFixed(2)}u average
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="font-bold text-primary mb-4">Drawdown & Variance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Max Drawdown</div>
                  <div className="text-2xl font-bold mono-number text-loss">
                    {formatCurrency(maxDrawdown)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Largest single loss amount
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Unit Efficiency</div>
                  <div className="text-2xl font-bold mono-number text-success">
                    {unitEfficiency.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (Units won ÷ Units risked) × 100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            📈 PERFORMANCE METRICS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Avg Win</div>
              <div className="text-2xl font-bold mono-number text-success">
                {formatCurrency(avgWin, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Per winning bet
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Avg Loss</div>
              <div className="text-2xl font-bold mono-number text-loss">
                {formatCurrency(avgLoss, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Per losing bet
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Largest Win</div>
              <div className="text-2xl font-bold mono-number text-success">
                {formatCurrency(largestWin, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Best single result
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Largest Loss</div>
              <div className="text-2xl font-bold mono-number text-loss">
                {formatCurrency(largestLoss, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Worst single result
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Profit Factor</div>
              <div className="text-2xl font-bold mono-number text-primary">
                {profitFactor.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total wins ÷ Total losses
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Avg Profit/Bet</div>
              <div className={`text-2xl font-bold mono-number ${
                avgProfitPerBet >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatCurrency(avgProfitPerBet, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Per bet placed
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">CLV</div>
              <div className="text-2xl font-bold mono-number text-success">
                +{closingLineValue.toFixed(2)}¢
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Closing line value
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Sharpe Ratio</div>
              <div className="text-2xl font-bold mono-number text-gray-400">
                {sharpeRatio || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sharpeRatioNote}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Median Profit</div>
              <div className={`text-2xl font-bold mono-number ${
                medianProfit >= 0 ? 'text-success' : 'text-loss'
              }`}>
                {formatCurrency(medianProfit, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Middle result value
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Max Win Streak</div>
              <div className="text-2xl font-bold mono-number text-success">
                {maxWinStreak}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Consecutive wins
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Max Loss Streak</div>
              <div className="text-2xl font-bold mono-number text-loss">
                {maxLossStreak}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Consecutive losses
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Total Winnings</div>
              <div className="text-2xl font-bold mono-number text-success">
                {formatCurrency(totalWinnings, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Sum of all wins
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <div className="text-sm text-gray-600 mb-1">Total Losses</div>
              <div className="text-2xl font-bold mono-number text-loss">
                {formatCurrency(-totalLosses, false)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Sum of all losses
              </div>
            </div>
          </div>
        </div>

        {/* Win/Loss Distribution */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            📊 WIN/LOSS DISTRIBUTION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-sm border-2 border-green-200">
              <div className="text-sm text-green-800 mb-2 font-bold">WINS</div>
              <div className="text-4xl font-bold text-success mono-number mb-2">
                {totalWins}
              </div>
              <div className="text-sm text-green-700 mono-number">
                {((totalWins / totalBets) * 100).toFixed(2)}% of all bets
              </div>
              <div className="mt-4 pt-4 border-t border-green-300">
                <div className="text-xs text-green-700 mb-1">Average Win</div>
                <div className="text-2xl font-bold text-success mono-number">
                  {formatCurrency(avgWin, false)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-sm border-2 border-red-200">
              <div className="text-sm text-red-800 mb-2 font-bold">LOSSES</div>
              <div className="text-4xl font-bold text-loss mono-number mb-2">
                {lossCount}
              </div>
              <div className="text-sm text-red-700 mono-number">
                {((lossCount / totalBets) * 100).toFixed(2)}% of all bets
              </div>
              <div className="mt-4 pt-4 border-t border-red-300">
                <div className="text-xs text-red-700 mb-1">Average Loss</div>
                <div className="text-2xl font-bold text-loss mono-number">
                  {formatCurrency(avgLoss, false)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-sm border-2 border-blue-200">
              <div className="text-sm text-blue-800 mb-2 font-bold">PROFIT FACTOR</div>
              <div className="text-4xl font-bold text-primary mono-number mb-2">
                {profitFactor.toFixed(3)}
              </div>
              <div className="text-sm text-blue-700">
                Wins ÷ Losses ratio
              </div>
              <div className="mt-4 pt-4 border-t border-blue-300">
                <div className="text-xs text-blue-700 mb-1">Target: 1.50+</div>
                <div className="text-sm text-blue-800">
                  {profitFactor >= 1.5 ? '✅ Excellent' : profitFactor >= 1.0 ? '✓ Positive' : '⚠️ Below Target'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sport Breakdown */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            🏀 SPORT-BY-SPORT BREAKDOWN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(sportBreakdown).map((sport: any) => (
              <div key={sport.sport} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary">{sport.sport}</h3>
                  <span className="text-3xl">{sport.emoji}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Record</div>
                    <div className="text-2xl font-bold mono-number text-primary">
                      {formatRecord(sport.record.wins, sport.record.losses)}
                    </div>
                    <div className="text-sm text-gray-600 mono-number">
                      {((sport.record.wins / sport.record.total) * 100).toFixed(2)}% Win Rate
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Net P/L</div>
                    <div className={`text-xl font-bold mono-number ${
                      sport.netPL >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(sport.netPL)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">ROI</div>
                    <div className={`text-xl font-bold mono-number ${
                      sport.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatPercent(sport.roi)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Units Won</div>
                    <div className={`text-xl font-bold mono-number ${
                      sport.unitsWon >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {sport.unitsWon >= 0 ? '+' : ''}{sport.unitsWon.toFixed(2)}u
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bet Type Breakdown */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            🎯 BET TYPE BREAKDOWN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(betTypeBreakdown).map((betType: any) => (
              <div key={betType.type} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-4">{betType.type}</h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Record</div>
                    <div className="text-2xl font-bold mono-number text-primary">
                      {formatRecord(betType.record.wins, betType.record.losses)}
                    </div>
                    <div className="text-sm text-gray-600 mono-number">
                      {betType.winRate.toFixed(2)}% Win Rate
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Net P/L</div>
                    <div className={`text-xl font-bold mono-number ${
                      betType.netPL >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatCurrency(betType.netPL)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">ROI</div>
                    <div className={`text-xl font-bold mono-number ${
                      betType.roi >= 0 ? 'text-success' : 'text-loss'
                    }`}>
                      {formatPercent(betType.roi)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stake Size Analysis */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            💰 STAKE SIZE ANALYSIS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(stakeBreakdown).map(([stake, data]: [string, any]) => (
              <div key={stake} className="bg-gray-50 p-6 rounded-sm border-2 border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-4">{stake} Bets</h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Record</div>
                    <div className="text-2xl font-bold mono-number text-primary">
                      {formatRecord(data.record.wins, data.record.losses)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Win Rate</div>
                    <div className={`text-xl font-bold mono-number ${
                      data.winRate >= 50 ? 'text-success' : 'text-loss'
                    }`}>
                      {data.winRate.toFixed(2)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 uppercase mb-1">Total Bets</div>
                    <div className="text-xl font-bold mono-number text-primary">
                      {data.record.total}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Growth Timeline */}
        <div className="bg-white rounded-sm border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gray-300 pb-3">
            📈 PORTFOLIO GROWTH TIMELINE
          </h2>

          <div className="bg-gray-50 p-6 rounded-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Starting Balance</div>
                <div className="text-2xl font-bold text-primary mono-number">
                  {formatCurrency(portfolioData.startingBalance, false)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Balance</div>
                <div className={`text-2xl font-bold mono-number ${
                  portfolioData.balance >= portfolioData.startingBalance ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(portfolioData.balance, false)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Change</div>
                <div className={`text-2xl font-bold mono-number ${
                  portfolioData.netPL >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(portfolioData.netPL)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Change %</div>
                <div className={`text-2xl font-bold mono-number ${
                  portfolioData.roi >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatPercent(portfolioData.roi)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 text-xs font-bold text-gray-600 uppercase pb-2 border-b-2 border-gray-300 sticky top-0 bg-white">
              <div>Date</div>
              <div>Bet</div>
              <div className="text-right">Result</div>
              <div className="text-right">P/L</div>
              <div className="text-right">Balance</div>
            </div>
            {portfolioGrowth && portfolioGrowth.slice().reverse().slice(0, 7).map((entry: any, index: number) => (
              <div key={index} className="grid grid-cols-5 gap-2 text-sm py-2 border-b border-gray-200 hover:bg-gray-50">
                <div className="text-gray-600 mono-number">{entry.date}</div>
                <div className="text-gray-900 truncate text-xs">{entry.description}</div>
                <div className="text-right">
                  {entry.result === 'win' ? '✅' : '❌'}
                </div>
                <div className={`text-right mono-number font-bold ${
                  entry.profit >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(entry.profit)}
                </div>
                <div className={`text-right mono-number font-bold ${
                  entry.balance >= portfolioData.startingBalance ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(entry.balance, false)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency Statement */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-sm p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">🔒 COMPLETE TRANSPARENCY</h2>
          <div className="space-y-3 text-sm">
            <p>
              Every statistic on this page is calculated from <strong>real betting data</strong>.
              We track every dollar risked, every position taken, and every outcome with complete accuracy.
            </p>
            <p>
              <strong>Total Bets Tracked:</strong> {allBets.length} positions<br />
              <strong>Period:</strong> November 4, 2025 - Present<br />
              <strong>Starting Capital:</strong> {formatCurrency(portfolioData.startingBalance, false)}<br />
              <strong>Current Balance:</strong> {formatCurrency(portfolioData.balance, false)}
            </p>
            <p className="text-xs pt-4 border-t border-white/30">
              All formulas are publicly disclosed. No simulation. No fake bets. 100% transparency.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-secondary hover:bg-accent text-white font-bold text-lg uppercase tracking-wide transition-all duration-300 rounded-sm"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

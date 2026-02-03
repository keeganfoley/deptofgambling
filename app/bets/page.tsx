'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatOdds, formatDate, formatRecord } from '@/lib/utils';
import betsData from '@/data/bets.json';
import portfolioData from '@/data/portfolio.json';
import metricsData from '@/data/metrics.json';
import CheckCircle from '@/components/icons/CheckCircle';
import XCircle from '@/components/icons/XCircle';
import MinusCircle from '@/components/icons/MinusCircle';

// Fund display info
const fundInfo: Record<string, { label: string; color: string; slug: string }> = {
  VectorFund: { label: 'Vector', color: portfolioData.funds.VectorFund.color, slug: 'vector' },
  SharpFund: { label: 'Sharp', color: portfolioData.funds.SharpFund.color, slug: 'sharp' },
  ContraFund: { label: 'Contra', color: portfolioData.funds.ContraFund.color, slug: 'contra' },
  CatalystFund: { label: 'Catalyst', color: portfolioData.funds.CatalystFund.color, slug: 'catalyst' },
};

gsap.registerPlugin(ScrollTrigger);

interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'push' | 'pending' | 'no_action' | 'void';
  finalStat: string;
  edge: number;
  expectedValue: number;
  profit: number;
  betType: string;
  slug?: string;
  fund?: string;
}

interface BetCardProps {
  bet: Bet;
  index: number;
}

function BetCard({ bet, index }: BetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const isWin = bet.result === 'win';
  const isPush = bet.result === 'push';
  const hasDetailPage = !!bet.slug;
  const fund = bet.fund ? fundInfo[bet.fund] : null;

  // Determine icon color: green for win, red for loss, gray for push
  const getResultColor = () => {
    if (isWin) return 'text-success';
    if (isPush) return 'text-gray-400';
    return 'text-loss';
  };

  // Determine which icon to show
  const getResultIcon = () => {
    if (isWin) return <CheckCircle className="w-8 h-8" />;
    if (isPush) return <MinusCircle className="w-8 h-8" />;
    return <XCircle className="w-8 h-8" />;
  };

  const cardContent = (
    <>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className={getResultColor()}>
            {getResultIcon()}
          </div>
          <div>
            <div className="text-sm text-text-muted">{formatDate(bet.date)}</div>
            <div className="text-xs font-semibold text-secondary uppercase tracking-wide">
              {bet.sport}
            </div>
          </div>
        </div>
        {fund && (
          <span
            className="px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-sm text-white"
            style={{ backgroundColor: fund.color }}
          >
            {fund.label}
          </span>
        )}
      </div>

      {/* Bet Details */}
      <div className="mb-4">
        <div className="text-base sm:text-lg font-bold text-primary mb-1">
          {bet.description} ({formatOdds(bet.odds)})
        </div>
        <div className="text-sm text-text-muted">
          Stake: <span className="font-semibold mono-number">{bet.stake.toFixed(1)}u</span>
        </div>
        <div className="text-sm font-semibold text-primary mt-2">
          Final: {bet.finalStat}
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="data-label text-xs uppercase mb-1">Edge</div>
          <div className="text-sm data-value text-primary mono-number">
            {formatPercent(bet.edge, true, 0)}
          </div>
        </div>
        <div>
          <div className="data-label text-xs uppercase mb-1">EV</div>
          <div className="text-sm data-value text-primary mono-number">
            {formatPercent(bet.expectedValue)}
          </div>
        </div>
        <div>
          <div className="data-label text-xs uppercase mb-1">Result</div>
          <div
            className={`text-sm data-value mono-number ${
              bet.profit >= 0 ? 'text-success' : 'text-loss'
            }`}
          >
            {formatCurrency(bet.profit, true)}
          </div>
        </div>
      </div>

      {/* View Full Analysis Link */}
      {hasDetailPage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-accent hover:text-accent/80 font-semibold flex items-center gap-2 group">
            <span>CLICK TO VIEW FULL ANALYSIS</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      )}
    </>
  );

  if (hasDetailPage) {
    return (
      <Link href={`/bets/${bet.slug}`}>
        <div
          ref={cardRef}
          className="stat-card p-5 sm:p-6 cursor-pointer group"
        >
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      className="stat-card p-5 sm:p-6"
    >
      {cardContent}
    </div>
  );
}

function BetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sportFilter = searchParams?.get('sport') || 'All';
  const typeFilter = searchParams?.get('type') || 'All';
  const fundFilter = searchParams?.get('fund') || 'All';
  const [currentSportFilter, setCurrentSportFilter] = useState(sportFilter);
  const [currentTypeFilter, setCurrentTypeFilter] = useState(typeFilter);
  const [currentFundFilter, setCurrentFundFilter] = useState(fundFilter);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerLineTopRef = useRef<HTMLDivElement>(null);
  const headerLineBottomRef = useRef<HTMLDivElement>(null);

  // Filter out pending bets - only show settled bets on public site
  // Sort by date (newest first), then by ID (highest first)
  const allBets = (betsData as Bet[])
    .filter(bet => bet.result !== 'pending' && bet.result !== 'no_action')
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.id - a.id;
    });

  // Map display names to actual betType values in data
  const betTypeMap: Record<string, string> = {
    'Spreads': 'spread',
    'Props': 'props',
    'Totals': 'total',
    'Moneyline': 'moneyline',
  };

  // Filter bets based on sport, type, and fund
  const filteredBets = allBets.filter(bet => {
    const matchesSport = currentSportFilter === 'All' || bet.sport === currentSportFilter;
    const expectedBetType = currentTypeFilter === 'All' ? null : betTypeMap[currentTypeFilter];
    const matchesType = currentTypeFilter === 'All' || bet.betType === expectedBetType;
    const matchesFund = currentFundFilter === 'All' || bet.fund === currentFundFilter;
    return matchesSport && matchesType && matchesFund;
  });

  const sports = ['All', 'NBA', 'NFL', 'NCAAB', 'NCAAF', 'NHL', 'Soccer'];
  const betTypes = ['All', 'Spreads', 'Props', 'Totals', 'Moneyline'];
  const funds = ['All', 'VectorFund', 'SharpFund', 'ContraFund', 'CatalystFund'];

  // Calculate stats for current filter
  const calculateFilteredStats = () => {
    const wins = filteredBets.filter(b => b.result === 'win').length;
    const losses = filteredBets.filter(b => b.result === 'loss').length;
    const pushes = filteredBets.filter(b => b.result === 'push').length;
    const total = wins + losses; // Pushes don't count toward W/L total for win rate
    const netPL = filteredBets.reduce((sum, bet) => sum + bet.profit, 0);
    const totalExposure = filteredBets.reduce((sum, bet) => sum + (bet.stake * 100), 0);
    const unitsRisked = filteredBets.reduce((sum, bet) => sum + bet.stake, 0);
    const roi = totalExposure > 0 ? (netPL / totalExposure) * 100 : 0;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const unitsWon = netPL / 100;

    return {
      record: { wins, losses, pushes, total },
      netPL,
      roi,
      winRate,
      unitsWon,
      totalExposure,
      unitsRisked,
    };
  };

  const stats = calculateFilteredStats();

  useEffect(() => {
    setCurrentSportFilter(sportFilter);
  }, [sportFilter]);

  useEffect(() => {
    setCurrentTypeFilter(typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    setCurrentFundFilter(fundFilter);
  }, [fundFilter]);

  useEffect(() => {
    gsap.fromTo(
      [headerLineTopRef.current, headerLineBottomRef.current],
      { scaleX: 0, transformOrigin: 'center' },
      {
        scaleX: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div
            ref={headerLineTopRef}
            className="h-[2px] bg-primary mb-6"
            style={{ transformOrigin: 'center' }}
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center mb-2">
            BET TRACKER
          </h1>
          <p className="text-center text-text-muted text-sm sm:text-base mb-4">
            {filteredBets.length} positions · {formatRecord(stats.record.wins, stats.record.losses, stats.record.pushes)} · {formatPercent(stats.roi)} ROI
          </p>
          <div
            ref={headerLineBottomRef}
            className="h-[2px] bg-primary"
            style={{ transformOrigin: 'center' }}
          />
        </div>

        {/* Combined Filter Bar - Responsive Design */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          {/* Active Filters Display */}
          {(currentSportFilter !== 'All' || currentTypeFilter !== 'All' || currentFundFilter !== 'All') && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-200">
              <span className="text-[10px] sm:text-xs text-gray-500 uppercase">Active:</span>
              {currentSportFilter !== 'All' && (
                <span className="px-2 py-0.5 bg-secondary text-white text-[10px] sm:text-xs font-bold rounded">{currentSportFilter}</span>
              )}
              {currentTypeFilter !== 'All' && (
                <span className="px-2 py-0.5 bg-primary text-white text-[10px] sm:text-xs font-bold rounded">{currentTypeFilter}</span>
              )}
              {currentFundFilter !== 'All' && fundInfo[currentFundFilter] && (
                <span
                  className="px-2 py-0.5 text-white text-[10px] sm:text-xs font-bold rounded"
                  style={{ backgroundColor: fundInfo[currentFundFilter].color }}
                >
                  {fundInfo[currentFundFilter].label}
                </span>
              )}
              <button
                onClick={() => {
                  setCurrentSportFilter('All');
                  setCurrentTypeFilter('All');
                  setCurrentFundFilter('All');
                  router.replace('/bets', { scroll: false });
                }}
                className="px-2 py-0.5 text-[10px] sm:text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Filter Controls - Stack on Mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            {/* Sport & Type Dropdowns - Side by side on mobile */}
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold whitespace-nowrap">Sport:</span>
                <select
                  value={currentSportFilter}
                  onChange={(e) => {
                    const sport = e.target.value;
                    setCurrentSportFilter(sport);
                    const params = new URLSearchParams();
                    if (sport !== 'All') params.set('sport', sport);
                    if (currentTypeFilter !== 'All') params.set('type', currentTypeFilter);
                    if (currentFundFilter !== 'All') params.set('fund', currentFundFilter);
                    const url = params.toString() ? `/bets?${params.toString()}` : '/bets';
                    router.replace(url, { scroll: false });
                  }}
                  className="flex-1 sm:flex-initial px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-semibold bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold whitespace-nowrap">Type:</span>
                <select
                  value={currentTypeFilter}
                  onChange={(e) => {
                    const type = e.target.value;
                    setCurrentTypeFilter(type);
                    const params = new URLSearchParams();
                    if (currentSportFilter !== 'All') params.set('sport', currentSportFilter);
                    if (type !== 'All') params.set('type', type);
                    if (currentFundFilter !== 'All') params.set('fund', currentFundFilter);
                    const url = params.toString() ? `/bets?${params.toString()}` : '/bets';
                    router.replace(url, { scroll: false });
                  }}
                  className="flex-1 sm:flex-initial px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-semibold bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  {betTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fund Pills - Visual & Clickable */}
            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold whitespace-nowrap">Fund:</span>
              <div className="flex flex-wrap gap-1 justify-center">
                <button
                  onClick={() => {
                    setCurrentFundFilter('All');
                    const params = new URLSearchParams();
                    if (currentSportFilter !== 'All') params.set('sport', currentSportFilter);
                    if (currentTypeFilter !== 'All') params.set('type', currentTypeFilter);
                    const url = params.toString() ? `/bets?${params.toString()}` : '/bets';
                    router.replace(url, { scroll: false });
                  }}
                  className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all ${
                    currentFundFilter === 'All'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                {Object.entries(fundInfo).map(([key, fund]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentFundFilter(key);
                      const params = new URLSearchParams();
                      if (currentSportFilter !== 'All') params.set('sport', currentSportFilter);
                      if (currentTypeFilter !== 'All') params.set('type', currentTypeFilter);
                      params.set('fund', key);
                      router.replace(`/bets?${params.toString()}`, { scroll: false });
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all ${
                      currentFundFilter === key
                        ? 'text-white ring-2 ring-offset-1'
                        : 'text-white opacity-50 hover:opacity-80'
                    }`}
                    style={{ backgroundColor: fund.color }}
                  >
                    {fund.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar - Compact on Mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-2xl font-bold text-primary mono-number">{formatRecord(stats.record.wins, stats.record.losses, stats.record.pushes)}</div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase">W-L-P</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 text-center">
            <div className={`text-base sm:text-2xl font-bold mono-number ${stats.netPL >= 0 ? 'text-success' : 'text-loss'}`}>
              {formatCurrency(stats.netPL)}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase">P/L</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 text-center">
            <div className={`text-base sm:text-2xl font-bold mono-number ${stats.roi >= 0 ? 'text-success' : 'text-loss'}`}>
              {formatPercent(stats.roi)}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase">ROI</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-2xl font-bold text-primary mono-number">{stats.winRate.toFixed(1)}%</div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase">Win %</div>
          </div>
        </div>

        {/* Detailed Analysis Section (Expandable) */}
        <div className="mb-8 border-2 border-gray-200 rounded-sm overflow-hidden">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary uppercase tracking-wide">
                📊 Detailed Mathematical Analysis
              </span>
            </div>
            <span className={`text-2xl transition-transform duration-300 ${showAnalysis ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </button>

          {showAnalysis && (
            <div className="px-6 py-8 bg-white border-t-2 border-gray-200">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-xl font-bold text-primary mb-4">
                  {currentSportFilter === 'All' && currentTypeFilter === 'All' ? 'Full Portfolio Analysis' : `${currentTypeFilter !== 'All' ? currentTypeFilter : ''} ${currentSportFilter !== 'All' ? currentSportFilter : ''} Performance Breakdown`.trim()}
                </h3>

                {/* Performance Metrics */}
                <div className="bg-gray-50 p-6 rounded-sm mb-6">
                  <h4 className="font-bold text-primary mb-3">Performance Metrics</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Win Rate:</strong> {stats.winRate.toFixed(2)}%
                      ({stats.record.wins} wins out of {stats.record.total} total bets)
                    </li>
                    <li>
                      <strong>Net Profit/Loss:</strong> {formatCurrency(stats.netPL)}
                      ({stats.netPL >= 0 ? 'profit' : 'loss'})
                    </li>
                    <li>
                      <strong>Return on Investment (ROI):</strong> {formatPercent(stats.roi)}
                      <br />
                      <span className="text-gray-600 text-xs">
                        Formula: (Net P/L ÷ Total Exposure) × 100 = ({formatCurrency(stats.netPL)} ÷ {formatCurrency(stats.totalExposure)}) × 100
                      </span>
                    </li>
                    <li>
                      <strong>Units Won:</strong> {stats.unitsWon >= 0 ? '+' : ''}{stats.unitsWon.toFixed(2)}u
                      <br />
                      <span className="text-gray-600 text-xs">
                        Units are calculated as: Profit ÷ 100 (since 1 unit = $100)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Exposure Analysis */}
                <div className="bg-gray-50 p-6 rounded-sm mb-6">
                  <h4 className="font-bold text-primary mb-3">Exposure & Risk Management</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Total Capital Risked:</strong> {formatCurrency(stats.totalExposure)}
                      <br />
                      <span className="text-gray-600 text-xs">
                        Sum of all stake amounts across {filteredBets.length} bets
                      </span>
                    </li>
                    <li>
                      <strong>Units Risked:</strong> {stats.unitsRisked.toFixed(2)}u
                      <br />
                      <span className="text-gray-600 text-xs">
                        Average stake per bet: {(stats.unitsRisked / filteredBets.length).toFixed(2)}u ({formatCurrency((stats.totalExposure / filteredBets.length), false)} per bet)
                      </span>
                    </li>
                    <li>
                      <strong>Exposure as % of Starting Bankroll:</strong> {((stats.totalExposure / 10000) * 100).toFixed(2)}%
                      <br />
                      <span className="text-gray-600 text-xs">
                        Starting bankroll: $10,000. Total risked represents {((stats.totalExposure / 10000) * 100).toFixed(2)}% of initial capital.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Bet Distribution */}
                <div className="bg-gray-50 p-6 rounded-sm">
                  <h4 className="font-bold text-primary mb-3">Betting History & Context</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Total Bets Placed:</strong> {filteredBets.length} positions
                    </li>
                    <li>
                      <strong>Wins:</strong> {stats.record.wins} ({stats.winRate.toFixed(2)}% success rate)
                    </li>
                    <li>
                      <strong>Losses:</strong> {stats.record.losses} ({(100 - stats.winRate).toFixed(2)}% of bets)
                    </li>
                    {currentSportFilter === 'All' && currentTypeFilter === 'All' && (
                      <>
                        <li>
                          <strong>Sport Distribution:</strong>
                          <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-600">
                            <li>NBA: {allBets.filter(b => b.sport === 'NBA').length} bets</li>
                            <li>NFL: {allBets.filter(b => b.sport === 'NFL').length} bets</li>
                            <li>NCAAB: {allBets.filter(b => b.sport === 'NCAAB').length} bets</li>
                            <li>NCAAF: {allBets.filter(b => b.sport === 'NCAAF').length} bets</li>
                          </ul>
                        </li>
                      </>
                    )}
                    <li className="pt-2 border-t border-gray-300">
                      <strong className="text-primary">Transparency Note:</strong>
                      <br />
                      <span className="text-gray-600 text-xs">
                        All calculations are based on actual betting data. Every bet shown represents a real position taken with actual capital at risk.
                        We maintain complete transparency with our portfolio - no fake or simulated bets.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bet Timeline */}
        <div className="space-y-5 sm:space-y-6">
          {filteredBets.length > 0 ? (
            filteredBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} index={index} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">No bets found for selected filters</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default function BetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BetsContent />
    </Suspense>
  );
}

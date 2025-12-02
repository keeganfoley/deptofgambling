'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import gsap from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatPercent, formatUnits, formatRecord, formatDate, formatOdds } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';
import betsData from '@/data/bets.json';
import metricsData from '@/data/metrics.json';
import CheckCircle from '@/components/icons/CheckCircle';
import XCircle from '@/components/icons/XCircle';
import MinusCircle from '@/components/icons/MinusCircle';
import FundChart from '@/components/FundChart';
import {
  calculateDrawdown,
  calculateCurrentDrawdown,
  calculateRollingPerformance,
  calculateSportBreakdown,
  type Bet as CalcBet,
} from '@/lib/calculations';

// Map URL slugs to fund keys
const slugToFundKey: Record<string, string> = {
  vector: 'VectorFund',
  sharp: 'SharpFund',
  contra: 'ContraFund',
  catalyst: 'CatalystFund',
};

// Map fund keys to logo paths
const fundLogoMap: Record<string, string> = {
  VectorFund: '/logos/vector-logo.png',
  SharpFund: '/logos/sharp-logo.png',
  ContraFund: '/logos/contra-logo.png',
  CatalystFund: '/logos/catalyst-logo.png',
};

// Collapsible Section Component for Mobile
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-sm border-2 border-primary mb-4 md:mb-12 shadow-xl overflow-hidden">
      {/* Mobile: Clickable Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-8 flex items-center justify-between md:cursor-default"
      >
        <h2 className="text-lg md:text-2xl font-bold text-primary flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        <span className={`md:hidden text-2xl text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>

      {/* Content - Always visible on desktop, collapsible on mobile */}
      <div
        ref={contentRef}
        className={`
          px-4 md:px-8 pb-4 md:pb-8
          md:block
          ${isOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <div className="border-t-2 border-primary pt-4 md:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'push' | 'pending';
  finalStat: string;
  edge: number;
  expectedValue: number;
  profit: number;
  betType: string;
  slug?: string;
  fund?: string;
}

interface FundData {
  name: string;
  tagline: string;
  balance: number;
  startingBalance: number;
  netPL: number;
  roi: number;
  record: { wins: number; losses: number; pushes: number };
  winRate: number;
  unitsWon: number;
  color: string;
  status: 'active' | 'deploying';
}

function BetCard({ bet, index }: { bet: Bet; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: index * 0.1,
        ease: 'power2.out',
      }
    );
  }, [index]);

  const isWin = bet.result === 'win';
  const isPush = bet.result === 'push';
  const hasDetailPage = !!bet.slug;

  // Determine icon color and icon based on result
  const getResultColor = () => {
    if (isWin) return 'text-success';
    if (isPush) return 'text-gray-400';
    return 'text-loss';
  };

  const getResultIcon = () => {
    if (isWin) return <CheckCircle className="w-8 h-8" />;
    if (isPush) return <MinusCircle className="w-8 h-8" />;
    return <XCircle className="w-8 h-8" />;
  };

  const cardContent = (
    <>
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
      </div>

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

      {hasDetailPage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-accent hover:text-accent/80 font-semibold flex items-center gap-2 group">
            <span>VIEW FULL ANALYSIS</span>
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

export default function FundPage() {
  const params = useParams();
  const fundSlug = params.fund as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const fundKey = slugToFundKey[fundSlug];

  if (!fundKey) {
    notFound();
  }

  const fund = (portfolioData.funds as Record<string, FundData>)[fundKey];

  if (!fund) {
    notFound();
  }

  // Filter bets for this fund
  const allFundBets = (betsData as Bet[]).filter((bet) => bet.fund === fundKey);
  const settledFundBets = allFundBets.filter((bet) => bet.result !== 'pending') as CalcBet[];

  const fundBets = [...allFundBets]
    .filter((bet) => bet.result !== 'pending')
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      return dateCompare !== 0 ? dateCompare : b.id - a.id;
    })
    .slice(0, 5);

  // Calculate fund-specific metrics
  const fundDrawdown = settledFundBets.length > 0
    ? calculateDrawdown(settledFundBets, fund.startingBalance)
    : null;

  const fundCurrentDrawdown = settledFundBets.length > 0
    ? calculateCurrentDrawdown(settledFundBets, fund.startingBalance, fund.balance)
    : null;

  const fundRolling = settledFundBets.length > 0
    ? calculateRollingPerformance(settledFundBets)
    : null;

  const fundSportBreakdown = settledFundBets.length > 0
    ? calculateSportBreakdown(settledFundBets)
    : {};

  const isDeploying = fund.status === 'deploying';
  const hasActivity = fund.record.wins > 0 || fund.record.losses > 0;

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-16 px-4">
      <div ref={containerRef} className="max-w-6xl mx-auto opacity-0">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-secondary hover:text-accent font-bold transition-colors inline-flex items-center gap-2"
          >
            <span>←</span> Back to Portfolio
          </Link>
        </div>

        {/* 1. Fund Header */}
        <div className="mb-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src={fundLogoMap[fundKey]}
              alt={`${fund.name} logo`}
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div
            className="w-16 h-1 mx-auto mb-6 rounded"
            style={{ backgroundColor: fund.color }}
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4">
            {fund.name.toUpperCase()}
          </h1>
          <p className="text-text-muted text-lg">{fund.tagline}</p>
          {isDeploying && !hasActivity && (
            <div className="mt-4 inline-block px-4 py-2 bg-gray-100 text-text-muted rounded-sm text-sm font-semibold uppercase tracking-wide">
              Currently Deploying
            </div>
          )}
        </div>

        {/* 2. Fund Overview */}
        <CollapsibleSection title="FUND OVERVIEW" defaultOpen={true}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-gray-50 p-3 md:p-5 rounded-sm">
              <div className="data-label text-[10px] md:text-xs uppercase mb-1 md:mb-2">Balance</div>
              <div className="text-lg md:text-3xl font-bold text-primary mono-number">
                {formatCurrency(fund.balance, false)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-1 md:mt-2 mono-number">
                Starting: {formatCurrency(fund.startingBalance, false)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 md:p-5 rounded-sm">
              <div className="data-label text-[10px] md:text-xs uppercase mb-1 md:mb-2">Net P/L</div>
              <div
                className={`text-lg md:text-3xl font-bold mono-number ${
                  isDeploying && !hasActivity
                    ? 'text-text-muted'
                    : fund.netPL >= 0
                    ? 'text-success'
                    : 'text-loss'
                }`}
              >
                {isDeploying && !hasActivity ? '-' : formatCurrency(fund.netPL)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-1 md:mt-2 mono-number">
                {isDeploying && !hasActivity
                  ? 'Awaiting first bet'
                  : `${fund.unitsWon >= 0 ? '+' : ''}${fund.unitsWon.toFixed(2)}u won`}
              </div>
            </div>

            <div className="bg-gray-50 p-3 md:p-5 rounded-sm">
              <div className="data-label text-[10px] md:text-xs uppercase mb-1 md:mb-2">Record (W-L-P)</div>
              <div className="text-lg md:text-3xl font-bold text-primary mono-number">
                {isDeploying && !hasActivity
                  ? '-'
                  : formatRecord(fund.record.wins, fund.record.losses, fund.record.pushes)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-1 md:mt-2 mono-number">
                {isDeploying && !hasActivity
                  ? 'No bets yet'
                  : `${fund.winRate.toFixed(2)}% Win Rate`}
              </div>
            </div>

            <div className="bg-gray-50 p-3 md:p-5 rounded-sm">
              <div className="data-label text-[10px] md:text-xs uppercase mb-1 md:mb-2">ROI</div>
              <div
                className={`text-lg md:text-3xl font-bold mono-number ${
                  isDeploying && !hasActivity
                    ? 'text-text-muted'
                    : fund.roi >= 0
                    ? 'text-success'
                    : 'text-loss'
                }`}
              >
                {isDeploying && !hasActivity ? '-' : formatPercent(fund.roi)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-1 md:mt-2">
                {isDeploying && !hasActivity ? 'Deploying capital' : 'Since inception'}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. Drawdown Analysis */}
        {hasActivity && fundDrawdown && fundCurrentDrawdown && (
          <CollapsibleSection title="DRAWDOWN ANALYSIS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Max Drawdown */}
              <div className="bg-red-50 p-4 md:p-6 rounded-sm border-l-4 border-red-400">
                <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Maximum Drawdown</div>
                <div className="text-xl md:text-3xl font-bold mono-number text-loss">
                  {formatCurrency(fundDrawdown.maxDrawdown)}
                </div>
                <div className="text-sm md:text-lg font-semibold mono-number text-loss mt-1">
                  {fundDrawdown.maxDrawdownPercent.toFixed(2)}% of peak
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-2 md:mt-3">
                  Peak: {formatCurrency(fundDrawdown.peakBalance)} ({fundDrawdown.peakDate})
                </div>
                <div className="text-[10px] md:text-xs text-gray-500">
                  Trough: {formatCurrency(fundDrawdown.troughBalance)} ({fundDrawdown.troughDate})
                </div>
              </div>

              {/* Current Drawdown */}
              <div className={`p-4 md:p-6 rounded-sm border-l-4 ${
                fundCurrentDrawdown.amount < 0 ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-400'
              }`}>
                <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Current Drawdown</div>
                {fundCurrentDrawdown.amount < 0 ? (
                  <>
                    <div className="text-xl md:text-3xl font-bold mono-number text-yellow-600">
                      {formatCurrency(fundCurrentDrawdown.amount)}
                    </div>
                    <div className="text-sm md:text-lg font-semibold mono-number text-yellow-600 mt-1">
                      {fundCurrentDrawdown.percentage.toFixed(2)}% from peak
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-2 md:mt-3">
                      Peak: {formatCurrency(fundCurrentDrawdown.peakBalance)} ({fundCurrentDrawdown.peakDate})
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500">
                      {fundCurrentDrawdown.daysSincePeak} days since peak
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xl md:text-3xl font-bold mono-number text-success">
                      At Peak
                    </div>
                    <div className="text-sm md:text-lg font-semibold mono-number text-success mt-1">
                      No drawdown
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-2 md:mt-3">
                      Current balance: {formatCurrency(fundCurrentDrawdown.currentBalance)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* 4. Rolling Performance */}
        {hasActivity && fundRolling && (
          <CollapsibleSection title="ROLLING PERFORMANCE">
            <div className="grid grid-cols-3 gap-2 md:gap-6">
              {/* Last 7 Days */}
              <div className="bg-gray-50 p-2 md:p-5 rounded-sm">
                <div className="text-[10px] md:text-sm text-gray-600 mb-1 md:mb-2">Last 7 Days</div>
                <div className="text-base md:text-2xl font-bold mono-number text-primary">
                  {fundRolling.last7Days.wins}-{fundRolling.last7Days.losses}
                </div>
                <div className={`text-sm md:text-xl font-semibold mono-number mt-1 ${
                  fundRolling.last7Days.pnl >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(fundRolling.last7Days.pnl)}
                </div>
                <div className={`text-[10px] md:text-sm mono-number ${
                  fundRolling.last7Days.roi >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  ({formatPercent(fundRolling.last7Days.roi)})
                </div>
              </div>

              {/* Last 30 Days */}
              <div className="bg-gray-50 p-2 md:p-5 rounded-sm">
                <div className="text-[10px] md:text-sm text-gray-600 mb-1 md:mb-2">Last 30 Days</div>
                <div className="text-base md:text-2xl font-bold mono-number text-primary">
                  {fundRolling.last30Days.wins}-{fundRolling.last30Days.losses}
                </div>
                <div className={`text-sm md:text-xl font-semibold mono-number mt-1 ${
                  fundRolling.last30Days.pnl >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(fundRolling.last30Days.pnl)}
                </div>
                <div className={`text-[10px] md:text-sm mono-number ${
                  fundRolling.last30Days.roi >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  ({formatPercent(fundRolling.last30Days.roi)})
                </div>
              </div>

              {/* Last 3 Days */}
              <div className="bg-gray-50 p-2 md:p-5 rounded-sm">
                <div className="text-[10px] md:text-sm text-gray-600 mb-1 md:mb-2">Last 3 Days</div>
                <div className="text-base md:text-2xl font-bold mono-number text-primary">
                  {fundRolling.last3Days.wins}-{fundRolling.last3Days.losses}
                </div>
                <div className={`text-sm md:text-xl font-semibold mono-number mt-1 ${
                  fundRolling.last3Days.pnl >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  {formatCurrency(fundRolling.last3Days.pnl)}
                </div>
                <div className={`text-[10px] md:text-sm mono-number ${
                  fundRolling.last3Days.roi >= 0 ? 'text-success' : 'text-loss'
                }`}>
                  ({formatPercent(fundRolling.last3Days.roi)})
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* 5. Performance by Sport */}
        {Object.keys(fundSportBreakdown).length > 0 && (
          <CollapsibleSection title="THE SPORTS">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {Object.values(fundSportBreakdown).map((sport) => (
                <div
                  key={sport.sport}
                  className="bg-gray-50 p-3 md:p-5 rounded-sm hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-sm md:text-xl font-bold text-primary mb-2 md:mb-4">{sport.sport}</h3>

                  <div className="space-y-2 md:space-y-3">
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-600 uppercase mb-1">Record</div>
                      <div className="text-sm md:text-lg font-bold mono-number text-primary">
                        {formatRecord(sport.wins, sport.losses)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] md:text-xs text-gray-600 uppercase mb-1">P/L</div>
                      <div
                        className={`text-sm md:text-lg font-bold mono-number ${
                          sport.pnl >= 0 ? 'text-success' : 'text-loss'
                        }`}
                      >
                        {formatCurrency(sport.pnl)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] md:text-xs text-gray-600 uppercase mb-1">ROI</div>
                      <div
                        className={`text-sm md:text-lg font-bold mono-number ${
                          sport.roi >= 0 ? 'text-success' : 'text-loss'
                        }`}
                      >
                        {formatPercent(sport.roi)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* 6. Portfolio Growth Chart */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="h-[2px] bg-primary mb-6" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center">
              PORTFOLIO GROWTH
            </h2>
            <div className="h-[2px] bg-primary mt-6" />
          </div>
          <FundChart fundKey={fundKey} fundColor={fund.color} />
        </div>

        {/* 7. Recent Positions */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="h-[2px] bg-primary mb-6" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center">
              RECENT POSITIONS
            </h2>
            <div className="h-[2px] bg-primary mt-6" />
          </div>

          {fundBets.length > 0 ? (
            <div className="space-y-5 sm:space-y-6">
              {fundBets.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-sm border-2 border-gray-200">
              <p className="text-text-muted text-lg mb-2">No positions yet</p>
              <p className="text-sm text-gray-500">
                This fund is currently deploying. Check back soon for our first bets.
              </p>
            </div>
          )}

          {fundBets.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href={`/bets?fund=${fundKey}`}
                className="text-secondary hover:text-accent font-bold text-lg tracking-wide transition-colors duration-300 group inline-flex items-center gap-2"
              >
                See All {fund.name} Bets
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}
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

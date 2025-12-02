'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatOdds, formatDate } from '@/lib/utils';
import betsData from '@/data/bets.json';
import portfolioData from '@/data/portfolio.json';
import CheckCircle from './icons/CheckCircle';
import XCircle from './icons/XCircle';
import MinusCircle from './icons/MinusCircle';

gsap.registerPlugin(ScrollTrigger);

// Fund display info
const fundInfo: Record<string, { label: string; color: string }> = {
  VectorFund: { label: 'Vector', color: portfolioData.funds.VectorFund.color },
  SharpFund: { label: 'Sharp', color: portfolioData.funds.SharpFund.color },
  ContraFund: { label: 'Contra', color: portfolioData.funds.ContraFund.color },
  CatalystFund: { label: 'Catalyst', color: portfolioData.funds.CatalystFund.color },
};

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
  analysis?: string;
  fund?: string;
}

interface BetCardProps {
  bet: Bet;
  index: number;
}

function BetCard({ bet, index }: BetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Minimal animation on mobile for performance
      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          delay: index * 0.05,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [index]);

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

export default function RecentBets() {
  const sectionRef = useRef<HTMLElement>(null);

  // Show only the most recent 3 settled bets (filter out pending, sort by date descending, then ID descending)
  const recentBets = (betsData as Bet[])
    .filter(bet => bet.result !== 'pending')
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      return dateCompare !== 0 ? dateCompare : b.id - a.id;
    })
    .slice(0, 3);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 bg-background relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header - Premium Style */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Recent Activity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Recent Positions
          </h2>
          <p className="text-text-muted text-sm sm:text-base">
            Latest settled positions across all funds
          </p>
        </div>

        {/* Bet Timeline */}
        <div className="space-y-5 sm:space-y-6">
          {recentBets.map((bet, index) => (
            <BetCard key={bet.id} bet={bet} index={index} />
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center mt-12">
          <Link
            href="/bets"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-primary font-semibold text-sm uppercase tracking-wide transition-all duration-300 rounded-lg border border-gray-200 hover:border-primary/20 shadow-sm hover:shadow-md"
          >
            <span>View All Positions</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

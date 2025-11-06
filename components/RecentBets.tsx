'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatOdds, formatDate } from '@/lib/utils';
import betsData from '@/data/bets.json';
import CheckCircle from './icons/CheckCircle';
import XCircle from './icons/XCircle';

gsap.registerPlugin(ScrollTrigger);

interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss';
  finalStat: string;
  edge: number;
  expectedValue: number;
  profit: number;
  betType: string;
  slug?: string;
}

interface BetCardProps {
  bet: Bet;
  index: number;
}

function BetCard({ bet, index }: BetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [index]);

  const isWin = bet.result === 'win';
  const hasDetailPage = !!bet.slug;

  const cardContent = (
    <>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`${isWin ? 'text-success' : 'text-loss'}`}>
            {isWin ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="text-sm text-text-muted">{formatDate(bet.date)}</div>
            <div className="text-xs font-semibold text-secondary uppercase tracking-wide">
              {bet.sport}
            </div>
          </div>
        </div>
      </div>

      {/* Bet Details */}
      <div className="mb-4">
        <div className="text-lg font-bold text-primary mb-1">
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
          className="bg-white rounded-sm border border-gray-200 p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300 cursor-pointer"
        >
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      {cardContent}
    </div>
  );
}

export default function RecentBets() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLineTopRef = useRef<HTMLDivElement>(null);
  const headerLineBottomRef = useRef<HTMLDivElement>(null);

  // Show only the most recent 5 bets
  const recentBets = (betsData as Bet[]).slice(0, 5);

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
    <section ref={sectionRef} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div
            ref={headerLineTopRef}
            className="h-[2px] bg-primary mb-6"
            style={{ transformOrigin: 'center' }}
          />
          <h2 className="text-4xl md:text-5xl font-semibold text-primary text-center">
            RECENT POSITIONS
          </h2>
          <div
            ref={headerLineBottomRef}
            className="h-[2px] bg-primary mt-6"
            style={{ transformOrigin: 'center' }}
          />
        </div>

        {/* Bet Timeline */}
        <div className="space-y-6">
          {recentBets.map((bet, index) => (
            <BetCard key={bet.id} bet={bet} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="text-secondary hover:text-accent font-bold text-lg tracking-wide transition-colors duration-300 group">
            Load More
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

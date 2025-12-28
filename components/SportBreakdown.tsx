'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCurrency, formatPercent, formatUnits, formatRecord } from '@/lib/utils';
import metricsData from '@/data/metrics.json';
import Basketball from './icons/Basketball';
import Football from './icons/Football';
import Hockey from './icons/Hockey';
import Soccer from './icons/Soccer';

gsap.registerPlugin(ScrollTrigger);

// Map sport names to their icons
function getSportIcon(sport: string, className: string = "w-7 h-7 text-accent") {
  switch (sport) {
    case 'NBA':
    case 'NCAAB':
      return <Basketball className={className} />;
    case 'NFL':
    case 'NCAAF':
      return <Football className={className} />;
    case 'NHL':
      return <Hockey className={className} />;
    case 'Soccer':
      return <Soccer className={className} />;
    default:
      return <Football className={className} />;
  }
}

interface SportCardProps {
  sport: string;
  record: { wins: number; losses: number; pushes?: number; total: number };
  roi: number;
  netPL: number;
  unitsWon: number;
  gamesAnalyzed: number;
  totalGames: number;
  index: number;
}

function SportCard({
  sport,
  record,
  roi,
  netPL,
  unitsWon,
  gamesAnalyzed,
  totalGames,
  index,
}: SportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Simpler mobile animations
      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else {
      // Full desktop animations
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="stat-card overflow-hidden opacity-0"
    >
      {/* Header with icon */}
      <div className="bg-primary px-6 py-5 flex items-center justify-center">
        <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full">
          {getSportIcon(sport, "w-7 h-7 text-accent")}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 tracking-tight">{sport}</h3>

        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-1">Record</div>
              <div className="text-lg font-bold text-primary mono-number">
                {formatRecord(record.wins, record.losses, record.pushes)}
              </div>
              <div className="text-xs text-text-light mt-1 mono-number">
                {((record.wins / record.total) * 100).toFixed(1)}% Win Rate
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-1">ROI</div>
              <div
                className={`text-lg font-bold mono-number ${
                  roi >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatPercent(roi)}
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-1">P/L</div>
              <div
                className={`text-lg font-bold mono-number ${
                  netPL >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatCurrency(netPL)}
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-1">Units</div>
              <div
                className={`text-lg font-bold mono-number ${
                  unitsWon >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatUnits(unitsWon)}
              </div>
            </div>
          </div>
        </div>

        {/* View Bets CTA */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a
            href={`/bets?sport=${sport}`}
            className="flex items-center justify-center gap-2 w-full text-center px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 rounded-lg group"
          >
            <span>View {sport} Positions</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Mobile Sport Accordion
function MobileSportAccordion({ sport, record, roi, netPL, unitsWon }: {
  sport: string;
  record: { wins: number; losses: number; pushes?: number; total: number };
  roi: number;
  netPL: number;
  unitsWon: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(contentRef.current, { height: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [isOpen]);

  return (
    <div className="stat-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-full">
            {getSportIcon(sport, "w-5 h-5 text-accent")}
          </div>
          <div className="text-left">
            <div className="font-bold text-primary">{sport}</div>
            <div className="text-xs text-text-muted">{formatRecord(record.wins, record.losses, record.pushes)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold mono-number text-sm ${roi >= 0 ? 'text-success' : 'text-loss'}`}>
            {formatPercent(roi)}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-[10px] text-gray-500 uppercase">Win Rate</div>
              <div className="text-sm font-bold text-primary mono-number">
                {((record.wins / record.total) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-[10px] text-gray-500 uppercase">P/L</div>
              <div className={`text-sm font-bold mono-number ${netPL >= 0 ? 'text-success' : 'text-loss'}`}>
                {formatCurrency(netPL)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-[10px] text-gray-500 uppercase">Units</div>
              <div className={`text-sm font-bold mono-number ${unitsWon >= 0 ? 'text-success' : 'text-loss'}`}>
                {formatUnits(unitsWon)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-[10px] text-gray-500 uppercase">Total Bets</div>
              <div className="text-sm font-bold text-primary mono-number">{record.total}</div>
            </div>
          </div>
          <a
            href={`/bets?sport=${sport}`}
            className="block mt-3 text-center py-2 bg-secondary text-white font-bold text-xs rounded-md"
          >
            View {sport} Bets
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SportBreakdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Filter out Soccer from main page display (only 1 bet)
  const sports = Object.fromEntries(
    Object.entries(metricsData.sportBreakdown).filter(([key]) => key !== 'Soccer')
  );

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
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
    <section ref={sectionRef} id="sports" className="py-16 sm:py-24 px-4 bg-background relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header - Premium Style */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-16 opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Performance by Sport</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Sport Breakdown
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Detailed performance metrics across each sport we analyze
          </p>
        </div>

        {/* Mobile: Accordion Style */}
        <div className="md:hidden space-y-3">
          {Object.entries(sports).map(([sportName, sport]) => (
            <MobileSportAccordion
              key={sportName}
              sport={sportName}
              record={{ ...sport.record, total: sport.record.wins + sport.record.losses }}
              roi={sport.roi}
              netPL={sport.pnl}
              unitsWon={sport.pnl / 100}
            />
          ))}
        </div>

        {/* Desktop: Sport Cards Grid */}
        <div className="hidden md:grid grid-cols-2 gap-6 max-w-5xl mx-auto">
          {Object.entries(sports).map(([sportName, sport], index) => (
            <SportCard
              key={sportName}
              sport={sportName}
              record={{ ...sport.record, total: sport.record.wins + sport.record.losses }}
              roi={sport.roi}
              netPL={sport.pnl}
              unitsWon={sport.pnl / 100}
              gamesAnalyzed={sport.totalBets || (sport.record.wins + sport.record.losses)}
              totalGames={sport.totalBets || (sport.record.wins + sport.record.losses)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

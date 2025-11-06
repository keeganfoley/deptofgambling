'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCurrency, formatPercent, formatUnits, formatRecord } from '@/lib/utils';
import metricsData from '@/data/metrics.json';
import Basketball from './icons/Basketball';
import Football from './icons/Football';

gsap.registerPlugin(ScrollTrigger);

interface SportCardProps {
  sport: string;
  record: { wins: number; losses: number; total: number };
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
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Card fade in from bottom
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

    // Progress bar animation
    const progressPercent = (gamesAnalyzed / totalGames) * 100;
    gsap.fromTo(
      progressBarRef.current,
      { width: '0%' },
      {
        width: `${progressPercent}%`,
        duration: 1.5,
        delay: index * 0.2 + 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index, gamesAnalyzed, totalGames]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-sm overflow-hidden card-float magenta-glow opacity-0"
    >
      {/* Header with icon and progress */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between">
        <div className="w-12 h-12 flex items-center justify-center bg-secondary bg-opacity-20 rounded-full">
          {sport === 'NBA' ? (
            <Basketball className="w-7 h-7 text-accent" />
          ) : (
            <Football className="w-7 h-7 text-accent" />
          )}
        </div>
        <div className="text-white text-right">
          <div className="text-sm font-semibold opacity-80">Games Analyzed</div>
          <div className="text-lg font-bold mono-number">
            {gamesAnalyzed}/{totalGames}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div ref={progressRef} className="h-2 bg-gray-200 relative">
        <div
          ref={progressBarRef}
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: '0%' }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-medium text-primary mb-4" style={{ letterSpacing: '0.02em' }}>{sport}</h3>

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="data-label text-xs uppercase mb-1">Record</div>
              <div className="text-lg data-value text-primary mono-number">
                {formatRecord(record.wins, record.losses)}
              </div>
            </div>
            <div>
              <div className="data-label text-xs uppercase mb-1">ROI</div>
              <div
                className={`text-lg data-value mono-number ${
                  roi >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatPercent(roi)}
              </div>
            </div>
            <div>
              <div className="data-label text-xs uppercase mb-1">P/L</div>
              <div
                className={`text-lg data-value mono-number ${
                  netPL >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatCurrency(netPL)}
              </div>
            </div>
            <div>
              <div className="data-label text-xs uppercase mb-1">Units</div>
              <div
                className={`text-lg data-value mono-number ${
                  unitsWon >= 0 ? 'text-success' : 'text-loss'
                }`}
              >
                {formatUnits(unitsWon)}
              </div>
            </div>
          </div>
        </div>

        {/* View Bets CTA */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="text-secondary hover:text-accent font-semibold text-sm transition-colors duration-300 flex items-center group">
            View Bets
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SportBreakdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLineTopRef = useRef<HTMLDivElement>(null);
  const headerLineBottomRef = useRef<HTMLDivElement>(null);

  const sports = metricsData.sportBreakdown;

  useEffect(() => {
    // Header lines animation
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
        {/* Section Header with Lines (Government Doc Aesthetic) */}
        <div className="mb-16">
          <div
            ref={headerLineTopRef}
            className="h-[2px] bg-primary mb-6"
            style={{ transformOrigin: 'center' }}
          />
          <h2 className="text-4xl md:text-5xl font-semibold text-primary text-center">
            THE SPORTS
          </h2>
          <div
            ref={headerLineBottomRef}
            className="h-[2px] bg-primary mt-6"
            style={{ transformOrigin: 'center' }}
          />
        </div>

        {/* Sport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(sports).map((sport, index) => (
            <SportCard
              key={sport.sport}
              sport={sport.sport}
              record={sport.record}
              roi={sport.roi}
              netPL={sport.netPL}
              unitsWon={sport.unitsWon}
              gamesAnalyzed={sport.gamesAnalyzed}
              totalGames={sport.totalGames}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

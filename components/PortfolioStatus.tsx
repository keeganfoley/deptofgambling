'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCurrency, formatPercent, formatUnits, formatRecord, formatDate } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
  colorClass?: string;
  index: number;
  variant?: 'default' | 'hero';
}

function StatCard({ label, value, subLabel, subValue, colorClass = 'text-primary', index, variant = 'default' }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      cardRef.current,
      { y: isMobile ? 15 : 30, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: isMobile ? 0.5 : 0.7,
        delay: index * (isMobile ? 0.06 : 0.08),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );

    setTimeout(() => {
      setDisplayValue(value);
    }, 250 + index * (isMobile ? 60 : 80));
  }, [value, index]);

  if (variant === 'hero') {
    return (
      <div
        ref={cardRef}
        className="stat-hero rounded-xl p-6 sm:p-8 animate-[fadeIn_0.15s_ease-out_forwards]"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 font-medium">
            {label}
          </span>
        </div>
        <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mono-number tracking-tight ${colorClass}`}>
          {displayValue || value}
        </div>
        {subLabel && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-500">{subLabel}</span>
              <span className="text-sm font-semibold text-gray-300 mono-number">{subValue}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="stat-card p-5 sm:p-6 animate-[fadeIn_0.15s_ease-out_forwards]"
    >
      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-medium mb-3">
        {label}
      </div>
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mono-number tracking-tight ${colorClass}`}>
        {displayValue || value}
      </div>
      {subLabel && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wide text-text-light">{subLabel}</span>
            <span className="text-sm font-semibold text-text-muted mono-number">{subValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioStatus() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const combined = portfolioData.combined;
  const balance = combined.balance;
  const startingBalance = combined.startingBalance;
  const netPL = combined.netPL;
  const roi = combined.roi;
  const record = combined.record;
  const winRate = combined.winRate;
  const unitsWon = combined.unitsWon;
  const sharpe = combined.sharpe as number | null;
  const asOfDate = portfolioData.asOfDate;

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
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="py-16 sm:py-24 px-4 bg-background relative">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-14 animate-[fadeIn_0.15s_ease-out_forwards]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Live Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Combined Portfolio
          </h2>
          <p className="text-text-muted text-sm sm:text-base font-normal">
            Total AUM across all funds • Updated {formatDate(asOfDate)}
          </p>
        </div>

        {/* Hero Stats Row - Balance prominently displayed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <StatCard
            label="Total Balance"
            value={formatCurrency(balance, false)}
            subLabel="Starting Capital"
            subValue={formatCurrency(startingBalance, false)}
            colorClass="text-white"
            index={0}
            variant="hero"
          />
          <StatCard
            label="Net Profit/Loss"
            value={formatCurrency(netPL)}
            subLabel="Status"
            subValue="Active"
            colorClass={netPL >= 0 ? 'text-success-light' : 'text-loss-light'}
            index={1}
          />
          <StatCard
            label="Return on Investment"
            value={formatPercent(roi)}
            subLabel="Sharpe Ratio"
            subValue={sharpe !== null ? sharpe.toFixed(2) : 'Calculating...'}
            colorClass={roi >= 0 ? 'text-success' : 'text-loss'}
            index={2}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            label="Record (W-L-P)"
            value={formatRecord(record.wins, record.losses, record.pushes)}
            colorClass="text-primary"
            index={3}
          />
          <StatCard
            label="Win Rate"
            value={formatPercent(winRate, false)}
            colorClass={winRate >= 50 ? 'text-success' : 'text-loss'}
            index={4}
          />
          <StatCard
            label="Units Profited"
            value={formatUnits(unitsWon)}
            colorClass={unitsWon >= 0 ? 'text-success' : 'text-loss'}
            index={5}
          />
        </div>

        {/* View Full Breakdown CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="/portfolio/breakdown"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-light text-white font-semibold text-sm sm:text-base uppercase tracking-wide transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>View Full Breakdown</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

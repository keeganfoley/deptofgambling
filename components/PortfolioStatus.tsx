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
}

function StatCard({ label, value, subLabel, subValue, colorClass = 'text-primary', index }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Lighter animation on mobile for performance
    gsap.fromTo(
      cardRef.current,
      { y: isMobile ? 20 : -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.4 : 0.6,
        delay: index * (isMobile ? 0.05 : 0.1),
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animate the value counting up
    setTimeout(() => {
      setDisplayValue(value);
    }, 200 + index * (isMobile ? 50 : 100));
  }, [value, index]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-sm shadow-md border-2 border-gray-200 p-5 sm:p-6 card-float opacity-0"
    >
      <div className="data-label text-xs sm:text-sm uppercase mb-3">
        {label}
      </div>
      <div className={`text-2xl sm:text-3xl md:text-4xl data-value mono-number mb-2 ${colorClass}`}>
        {displayValue || value}
      </div>
      {subLabel && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="data-label text-xs uppercase mb-1">{subLabel}</div>
          <div className="text-base font-medium text-text mono-number">{subValue}</div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioStatus() {
  const sectionRef = useRef<HTMLElement>(null);

  const balance = portfolioData.balance;
  const startingBalance = portfolioData.startingBalance;
  const netPL = portfolioData.netPL;
  const roi = portfolioData.roi;
  const record = portfolioData.record;
  const winRate = portfolioData.winRate;
  const unitsWon = portfolioData.unitsWon;
  const asOfDate = portfolioData.asOfDate;

  return (
    <section id="portfolio" ref={sectionRef} className="py-16 sm:py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary mb-4">
            PORTFOLIO STATUS
          </h2>
          <p className="text-text-muted text-base sm:text-lg font-normal">
            As of {formatDate(asOfDate)}
          </p>
        </div>

        {/* Top Row: 3 Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-5 sm:mb-6">
          <StatCard
            label="Balance"
            value={formatCurrency(balance, false)}
            subLabel="Starting"
            subValue={formatCurrency(startingBalance, false)}
            colorClass="text-primary"
            index={0}
          />
          <StatCard
            label="Net P/L"
            value={formatCurrency(netPL)}
            subLabel="30 Days"
            subValue="Active"
            colorClass={netPL >= 0 ? 'text-success' : 'text-loss'}
            index={1}
          />
          <StatCard
            label="ROI"
            value={formatPercent(roi)}
            subLabel="Sharpe"
            subValue="1.84"
            colorClass={roi >= 0 ? 'text-success' : 'text-loss'}
            index={2}
          />
        </div>

        {/* Bottom Row: 3 Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <StatCard
            label="Record"
            value={formatRecord(record.wins, record.losses)}
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
            label="Units Won"
            value={formatUnits(unitsWon)}
            colorClass={unitsWon >= 0 ? 'text-success' : 'text-loss'}
            index={5}
          />
        </div>

        {/* View Full Breakdown CTA */}
        <div className="text-center mt-12">
          <a
            href="/portfolio/breakdown"
            className="inline-block px-8 py-4 bg-secondary hover:bg-accent text-white font-bold text-lg uppercase tracking-wide transition-all duration-300 rounded-sm shadow-lg hover:shadow-xl"
          >
            View Full Breakdown →
          </a>
        </div>
      </div>
    </section>
  );
}

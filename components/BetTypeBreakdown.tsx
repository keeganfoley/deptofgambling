'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCurrency, formatPercent, formatRecord } from '@/lib/utils';
import metricsData from '@/data/metrics.json';

gsap.registerPlugin(ScrollTrigger);

interface BetTypeCardProps {
  type: string;
  record: { wins: number; losses: number };
  winRate: number;
  netPL: number;
  roi: number;
  index: number;
}

function BetTypeCard({ type, record, winRate, netPL, roi, index }: BetTypeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slide in from right with staggered delay
    gsap.fromTo(
      cardRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  // Add subtle glow for best performer (Props has highest ROI)
  const isBest = roi > 14; // Props has 15.3% ROI

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-sm border-2 p-6 transition-all duration-300 opacity-0 ${
        isBest
          ? 'border-accent shadow-[0_0_20px_rgba(255,0,128,0.2)]'
          : 'border-gray-200 card-float'
      }`}
    >
      <h3 className="text-2xl font-medium text-primary mb-6" style={{ letterSpacing: '0.02em' }}>{type}</h3>

      <div className="space-y-4">
        <div>
          <div className="data-label text-xs uppercase mb-1">Record</div>
          <div className="text-2xl data-value text-primary mono-number">
            {formatRecord(record.wins, record.losses)}
          </div>
        </div>

        <div>
          <div className="data-label text-xs uppercase mb-1">Win Rate</div>
          <div
            className={`text-2xl data-value mono-number ${
              winRate >= 60 ? 'text-success' : winRate >= 50 ? 'text-primary' : 'text-loss'
            }`}
          >
            {formatPercent(winRate, false)}
          </div>
        </div>

        <div>
          <div className="data-label text-xs uppercase mb-1">P/L</div>
          <div
            className={`text-2xl data-value mono-number ${
              netPL >= 0 ? 'text-success' : 'text-loss'
            }`}
          >
            {formatCurrency(netPL)}
          </div>
        </div>

        <div>
          <div className="data-label text-xs uppercase mb-1">ROI</div>
          <div
            className={`text-2xl data-value mono-number ${roi >= 0 ? 'text-success' : 'text-loss'}`}
          >
            {formatPercent(roi)} ROI
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BetTypeBreakdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const betTypes = metricsData.betTypeBreakdown;

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-primary mb-4">
            PERFORMANCE BY CATEGORY
          </h2>
        </div>

        {/* Bet Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(betTypes).map((betType, index) => (
            <BetTypeCard
              key={betType.type}
              type={betType.type}
              record={betType.record}
              winRate={betType.winRate}
              netPL={betType.netPL}
              roi={betType.roi}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

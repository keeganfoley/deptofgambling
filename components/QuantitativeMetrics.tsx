'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCurrency } from '@/lib/utils';
import metricsData from '@/data/metrics.json';

gsap.registerPlugin(ScrollTrigger);

export default function QuantitativeMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  const {
    sharpeRatio,
    sharpeRatioNote,
    maxDrawdown,
    avgWin,
    avgLoss,
    avgProfitPerBet,
    largestWin,
    largestLoss,
    profitFactor,
    unitEfficiency,
    closingLineValue,
    closingLineValueNote,
    kellyUtilization,
  } = metricsData as {
    sharpeRatio: number | null;
    sharpeRatioNote: string;
    maxDrawdown: number;
    avgWin: number;
    avgLoss: number;
    avgProfitPerBet: number;
    largestWin: number;
    largestLoss: number;
    profitFactor: number;
    unitEfficiency: number;
    closingLineValue: number;
    closingLineValueNote: string;
    kellyUtilization: number;
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-primary grid-background relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          ref={contentRef}
          className="bg-primary-dark bg-opacity-40 backdrop-blur-sm border border-secondary-light border-opacity-20 rounded-sm p-6 sm:p-8 md:p-12 opacity-0"
        >
          {/* Header */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white text-center mb-8 md:mb-12">
            QUANTITATIVE ANALYSIS
          </h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-10">
            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Sharpe Ratio
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">
                {sharpeRatio ? sharpeRatio.toFixed(2) : (sharpeRatioNote || 'N/A')}
              </div>
              {!sharpeRatio && sharpeRatioNote && (
                <div className="text-xs text-secondary-light mt-1">
                  {sharpeRatioNote}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Max Drawdown
              </div>
              <div className="text-2xl sm:text-3xl data-value text-loss mono-number">
                {formatCurrency(maxDrawdown)}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Avg Win
              </div>
              <div className="text-2xl sm:text-3xl data-value text-success mono-number">
                {formatCurrency(avgWin, false)}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Avg Loss
              </div>
              <div className="text-2xl sm:text-3xl data-value text-loss mono-number">
                {formatCurrency(avgLoss)}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Profit Factor
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">{profitFactor.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Unit Efficiency
              </div>
              <div className="text-2xl sm:text-3xl data-value text-success mono-number">
                {unitEfficiency.toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Closing Line Value
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">
                +{closingLineValue.toFixed(1)}¢
              </div>
              {closingLineValueNote && (
                <div className="text-xs text-secondary-light mt-1">
                  {closingLineValueNote}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Kelly Utilization
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">{kellyUtilization}%</div>
            </div>
          </div>

          {/* Download Report Button */}
          <div className="text-center mt-10 pt-8 border-t border-secondary-light border-opacity-20">
            <button className="px-8 py-4 bg-transparent border-2 border-accent text-white font-bold text-lg tracking-wide transition-all duration-300 hover:bg-accent hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] group">
              Download Full Report
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
                ↓
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

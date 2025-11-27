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
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      contentRef.current,
      { y: isMobile ? 20 : 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.5 : 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  const {
    sharpeRatio,
    sharpeRatioNote,
    maxDrawdown,
    maxDrawdownPercent,
    avgWin,
    avgLoss,
    largestWin,
    largestLoss,
    profitFactor,
    closingLineValue,
    closingLineValueNote,
    clvBetsTracked,
    maxWinStreak,
    maxLossStreak,
  } = metricsData as {
    sharpeRatio: number | null;
    sharpeRatioNote?: string;
    maxDrawdown: number;
    maxDrawdownPercent?: number;
    avgWin?: number;
    avgLoss?: number;
    largestWin?: number;
    largestLoss?: number;
    profitFactor?: number;
    closingLineValue?: number | null;
    closingLineValueNote?: string;
    clvBetsTracked?: number;
    maxWinStreak?: number;
    maxLossStreak?: number;
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-primary grid-background relative">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-10">
            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Max Drawdown
              </div>
              <div className="text-2xl sm:text-3xl data-value text-loss mono-number">
                {formatCurrency(maxDrawdown)}
              </div>
              {maxDrawdownPercent !== undefined && (
                <div className="text-xs text-secondary-light mt-1">
                  {maxDrawdownPercent.toFixed(1)}% from peak
                </div>
              )}
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Sharpe Ratio
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">
                {sharpeRatio !== null ? sharpeRatio.toFixed(2) : 'N/A'}
              </div>
              {sharpeRatioNote && (
                <div className="text-xs text-secondary-light mt-1">
                  {sharpeRatio === null ? sharpeRatioNote : `${sharpeRatioNote}`}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Avg Win
              </div>
              <div className="text-2xl sm:text-3xl data-value text-success mono-number">
                {avgWin !== undefined ? formatCurrency(avgWin, false) : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Avg Loss
              </div>
              <div className="text-2xl sm:text-3xl data-value text-loss mono-number">
                {avgLoss !== undefined ? formatCurrency(avgLoss) : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Profit Factor
              </div>
              <div className={`text-2xl sm:text-3xl data-value mono-number ${profitFactor !== undefined && profitFactor >= 1 ? 'text-success' : 'text-loss'}`}>
                {profitFactor !== undefined ? profitFactor.toFixed(2) : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Closing Line Value
              </div>
              <div className="text-2xl sm:text-3xl data-value text-white mono-number">
                {closingLineValue !== null && closingLineValue !== undefined
                  ? `+${closingLineValue.toFixed(1)}¢`
                  : 'Tracking'}
              </div>
              <div className="text-xs text-secondary-light mt-1">
                {closingLineValue !== null && closingLineValue !== undefined
                  ? `${clvBetsTracked || 0} bets tracked`
                  : closingLineValueNote || 'Started Nov 27'}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Best Streak
              </div>
              <div className="text-2xl sm:text-3xl data-value text-success mono-number">
                {maxWinStreak !== undefined ? `${maxWinStreak}W` : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-secondary-light uppercase font-normal mb-2" style={{ letterSpacing: '0.08em' }}>
                Worst Streak
              </div>
              <div className="text-2xl sm:text-3xl data-value text-loss mono-number">
                {maxLossStreak !== undefined ? `${maxLossStreak}L` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

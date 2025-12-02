'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import FundCard from './FundCard';
import MobileFundCard from './MobileFundCard';
import portfolioData from '@/data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

// Map fund keys to URL slugs
const fundSlugMap: Record<string, string> = {
  VectorFund: 'vector',
  SharpFund: 'sharp',
  ContraFund: 'contra',
  CatalystFund: 'catalyst',
};

export default function FundGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeFund, setActiveFund] = useState(0);

  const funds = portfolioData.funds;
  const fundEntries = Object.entries(funds);

  useEffect(() => {
    // Header animation
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
    <section ref={sectionRef} id="funds" className="py-16 sm:py-24 px-4 bg-white relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header - Premium Style */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-16 opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Multi-Strategy Approach</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            The Funds
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Four specialized strategies working in parallel to capture edge across different market conditions
          </p>
        </div>

        {/* Mobile: Horizontal Swiper with Dots */}
        <div className="md:hidden">
          {/* Fund Selector Pills - Active fund is clickable to go to fund page */}
          <div className="flex justify-center gap-2 mb-4 overflow-x-auto pb-2">
            {fundEntries.map(([key, fund]: [string, any], index) => {
              const isActive = activeFund === index;
              const slug = fundSlugMap[key];

              if (isActive) {
                // Active fund pill is a link to the fund page
                return (
                  <Link
                    key={key}
                    href={`/funds/${slug}`}
                    className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-primary text-white hover:bg-secondary"
                  >
                    {key.replace('Fund', '')} →
                  </Link>
                );
              }

              // Non-active pills just switch the view
              return (
                <button
                  key={key}
                  onClick={() => setActiveFund(index)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {key.replace('Fund', '')}
                </button>
              );
            })}
          </div>

          {/* Active Fund Card */}
          <div className="relative overflow-hidden">
            {fundEntries.map(([key, fund], index) => (
              <div
                key={key}
                className={`transition-all duration-300 ${
                  activeFund === index ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                <MobileFundCard fundKey={key} fund={fund as any} />
              </div>
            ))}
          </div>

          {/* Swipe Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {fundEntries.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFund(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeFund === index ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Fund Cards Grid - 2x2 */}
        <div className="hidden md:grid grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {fundEntries.map(([key, fund], index) => (
            <FundCard
              key={key}
              fundKey={key}
              fund={fund as any}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

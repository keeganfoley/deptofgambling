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
  const headerLineTopRef = useRef<HTMLDivElement>(null);
  const headerLineBottomRef = useRef<HTMLDivElement>(null);
  const [activeFund, setActiveFund] = useState(0);

  const funds = portfolioData.funds;
  const fundEntries = Object.entries(funds);

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
    <section ref={sectionRef} id="funds" className="py-12 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Lines */}
        <div className="mb-8 sm:mb-16">
          <div
            ref={headerLineTopRef}
            className="h-[2px] bg-primary mb-4 sm:mb-6"
            style={{ transformOrigin: 'center' }}
          />
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
            THE FUNDS
          </h2>
          <div
            ref={headerLineBottomRef}
            className="h-[2px] bg-primary mt-4 sm:mt-6"
            style={{ transformOrigin: 'center' }}
          />
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

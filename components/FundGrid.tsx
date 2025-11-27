'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FundCard from './FundCard';
import portfolioData from '@/data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

export default function FundGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLineTopRef = useRef<HTMLDivElement>(null);
  const headerLineBottomRef = useRef<HTMLDivElement>(null);

  const funds = portfolioData.funds;

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
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Lines */}
        <div className="mb-16">
          <div
            ref={headerLineTopRef}
            className="h-[2px] bg-primary mb-6"
            style={{ transformOrigin: 'center' }}
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
            THE FUNDS
          </h2>
          <div
            ref={headerLineBottomRef}
            className="h-[2px] bg-primary mt-6"
            style={{ transformOrigin: 'center' }}
          />
        </div>

        {/* Fund Cards Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {Object.entries(funds).map(([key, fund], index) => (
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

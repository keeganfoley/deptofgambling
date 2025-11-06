'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Disclaimer() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-primary-dark">
      <div className="max-w-5xl mx-auto">
        <div
          ref={contentRef}
          className="border-l-4 border-accent pl-8 pr-6 py-8 bg-primary bg-opacity-40 backdrop-blur-sm opacity-0"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="inline-block px-4 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider mb-4">
              Research Disclosure
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Independent Algorithmic Research
            </h3>
          </div>

          {/* Content */}
          <div className="space-y-4 text-secondary-light leading-relaxed">
            <p className="text-base md:text-lg">
              This portfolio represents <span className="text-white font-semibold">proprietary quantitative research</span> into
              sports betting market inefficiencies. All positions are derived from systematic analysis of
              statistical models, market movements, and probability calculations.
            </p>

            <p className="text-base">
              <span className="text-white font-semibold">No paid services.</span> No affiliate relationships.
              No promotional agreements. This is purely a research initiative tracking the performance of
              algorithmic decision-making in real-world market conditions.
            </p>

            <p className="text-sm text-gray-400 italic border-t border-secondary-light border-opacity-20 pt-4 mt-6">
              All content is for informational and research purposes. Past performance does not guarantee
              future results. Gambling involves risk. This is not financial or betting advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

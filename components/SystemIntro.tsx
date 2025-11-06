'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SystemIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    } else {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0a1f44] to-[#061429]">
      <div className="max-w-4xl mx-auto">
        <div
          ref={containerRef}
          className="relative bg-white/[0.02] backdrop-blur-sm border border-[#2a4a7c]/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c5a572] via-[#d4b886] to-[#c5a572] rounded-t-xl sm:rounded-t-2xl" />

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-100 font-light text-center">
            We&apos;re using <span className="font-semibold text-[#d4b886]">advanced statistical modeling</span>, <span className="font-semibold text-[#d4b886]">large-scale data analysis</span>, and <span className="font-semibold text-[#d4b886]">AI-trained qualitative insights</span> to build the most mathematically disciplined betting system in sports. Every pick is driven by probability, designed for long-term, compounding profitability.
          </p>
        </div>
      </div>
    </section>
  );
}

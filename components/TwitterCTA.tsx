'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TwitterX from './icons/TwitterX';

gsap.registerPlugin(ScrollTrigger);

export default function TwitterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      contentRef.current,
      { y: isMobile ? 15 : 0, scale: isMobile ? 1 : 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: isMobile ? 0.4 : 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-background relative overflow-hidden">
      {/* Accent background element */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div
          ref={contentRef}
          className="bg-white border-2 border-accent rounded-sm p-6 sm:p-8 md:p-12 shadow-[0_0_40px_rgba(255,0,128,0.15)] opacity-0"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                <TwitterX className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-3 sm:mb-4 px-2">
              FOLLOW OUR LIVE RESEARCH
            </h2>
            <p className="text-base sm:text-lg text-text-muted font-normal leading-relaxed max-w-2xl mx-auto px-2">
              All positions are posted in real-time on X (Twitter) before placement.
              Track our algorithmic approach, analysis methodology, and results as they happen.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center items-center">
            <a
              href="https://x.com/DeptOfGambling"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-accent text-white font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:bg-primary hover:shadow-[0_0_30px_rgba(255,0,128,0.4)] relative overflow-hidden"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Content */}
              <TwitterX className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              <span className="relative z-10">@DeptOfGambling</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>

          {/* Subtext */}
          <p className="text-center text-xs sm:text-sm text-text-muted mt-4 sm:mt-6 font-medium px-2">
            Live positions • Pre-placement analysis • Transparent results
          </p>
        </div>
      </div>
    </section>
  );
}

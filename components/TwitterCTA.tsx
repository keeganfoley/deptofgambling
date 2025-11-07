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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="https://x.com/DeptOfGambling"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-accent text-white font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:bg-primary hover:shadow-[0_0_30px_rgba(255,0,128,0.4)] relative overflow-hidden w-full sm:w-auto"
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

            <a
              href="https://www.instagram.com/deptofgambling/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] relative overflow-hidden w-full sm:w-auto"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Instagram Icon */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="relative z-10">@deptofgambling</span>
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

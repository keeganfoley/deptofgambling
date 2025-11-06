'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SystemIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

      // Subtle glow pulse animation on desktop
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#0a1f44] via-[#061429] to-[#0a1f44] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#c5a572]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#2a4a7c]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div
          ref={containerRef}
          className="relative group"
        >
          {/* Outer glow effect */}
          <div
            ref={glowRef}
            className="absolute -inset-[1px] bg-gradient-to-r from-[#c5a572] via-[#d4b886] to-[#c5a572] rounded-2xl sm:rounded-3xl opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-500"
          />

          {/* Main card with glass morphism */}
          <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-14 shadow-2xl overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a572]/10 via-transparent to-[#2a4a7c]/10 opacity-50" />

            {/* Top accent bars */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4b886] to-transparent" />
            <div className="absolute top-[2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white font-light text-center drop-shadow-lg">
                We&apos;re using{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4b886] to-[#f4e4c1] drop-shadow-[0_0_20px_rgba(212,184,134,0.5)]">
                  advanced statistical modeling
                </span>
                ,{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4b886] to-[#f4e4c1] drop-shadow-[0_0_20px_rgba(212,184,134,0.5)]">
                  large-scale data analysis
                </span>
                , and{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4b886] to-[#f4e4c1] drop-shadow-[0_0_20px_rgba(212,184,134,0.5)]">
                  AI-trained qualitative insights
                </span>{' '}
                to build the most mathematically disciplined betting system in sports. Every pick is driven by probability, designed for long-term, compounding profitability.
              </p>
            </div>

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Decorative corner accents */}
          <div className="absolute -top-1 -left-1 w-20 h-20 border-t-2 border-l-2 border-[#d4b886]/50 rounded-tl-2xl sm:rounded-tl-3xl" />
          <div className="absolute -bottom-1 -right-1 w-20 h-20 border-b-2 border-r-2 border-[#d4b886]/50 rounded-br-2xl sm:rounded-br-3xl" />
        </div>
      </div>
    </section>
  );
}

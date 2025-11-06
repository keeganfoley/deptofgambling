'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Hero() {
  const sealRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Seal fade in
    tl.fromTo(
      sealRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1 }
    );

    // Lines draw from center outward
    tl.fromTo(
      [lineTopRef.current, lineBottomRef.current],
      { scaleX: 0, transformOrigin: 'center' },
      { scaleX: 1, duration: 0.8 },
      '-=0.5'
    );

    // Title type-in effect (character by character would be too complex, so we'll use a reveal)
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

    // Subtitle fade in
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );

    // Tagline fade in
    tl.fromTo(
      taglineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    // CTA button
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.1'
    );
  }, []);

  const handleScrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-primary grid-background overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Government Seal */}
        <div ref={sealRef} className="mb-6 md:mb-8 flex justify-center opacity-0">
          <Image
            src="/logo.png"
            alt="Department of Gambling Official Seal"
            width={120}
            height={120}
            priority
            className="filter drop-shadow-2xl md:w-[180px] md:h-[180px]"
          />
        </div>

        {/* Top horizontal line */}
        <div
          ref={lineTopRef}
          className="h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent mb-12 max-w-2xl mx-auto"
          style={{ transformOrigin: 'center' }}
        />

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-8xl font-semibold text-white mb-4 opacity-0 leading-tight"
        >
          DEPARTMENT OF
          <br />
          GAMBLING
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl font-medium text-secondary-light mb-6 opacity-0"
          style={{ letterSpacing: '0.04em' }}
        >
          Office of Odds & Wagers
        </p>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-base md:text-lg text-gray-300 mb-12 font-medium italic opacity-0"
        >
          &ldquo;Systematic. Transparent. Mathematically Driven.&rdquo;
        </p>

        {/* Bottom horizontal line */}
        <div
          ref={lineBottomRef}
          className="h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent mb-12 max-w-2xl mx-auto"
          style={{ transformOrigin: 'center' }}
        />

        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={handleScrollToPortfolio}
          className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-accent text-white font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:bg-accent hover:border-accent hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] opacity-0"
        >
          VIEW PORTFOLIO
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
            ↓
          </span>
        </button>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-20 pointer-events-none" />
    </section>
  );
}

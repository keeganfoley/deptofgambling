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
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Simpler, faster animations for mobile
      gsap.set([sealRef.current, lineTopRef.current, lineBottomRef.current, titleRef.current, subtitleRef.current, taglineRef.current, ctaRef.current], { opacity: 1 });
      gsap.fromTo(
        [sealRef.current, titleRef.current, subtitleRef.current, taglineRef.current, ctaRef.current],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
      gsap.fromTo(
        [lineTopRef.current, lineBottomRef.current],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      // Full desktop animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        sealRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1 }
      );

      tl.fromTo(
        [lineTopRef.current, lineBottomRef.current],
        { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 0.8 },
        '-=0.5'
      );

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );

      tl.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.1'
      );
    }
  }, []);

  const handleScrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSignup = () => {
    const signupSection = document.getElementById('email-signup');
    signupSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-primary grid-background overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Government Seal */}
        <div ref={sealRef} className="mb-6 md:mb-8 flex justify-center opacity-0">
          <Image
            src="/logo.png"
            alt="Department of Gambling Official Seal"
            width={180}
            height={180}
            quality={95}
            priority
            className="filter drop-shadow-2xl w-[120px] h-[120px] md:w-[180px] md:h-[180px]"
          />
        </div>

        {/* Top horizontal line */}
        <div
          ref={lineTopRef}
          className="h-[1.5px] sm:h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto"
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
          className="h-[1.5px] sm:h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto"
          style={{ transformOrigin: 'center' }}
        />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0" ref={ctaRef}>
          <button
            onClick={handleScrollToPortfolio}
            className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-accent text-white font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:bg-accent hover:border-accent hover:shadow-[0_0_30px_rgba(255,0,128,0.5)]"
          >
            VIEW PORTFOLIO
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </button>
          <button
            onClick={handleScrollToSignup}
            className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#c5a572] to-[#d4b886] border-2 border-[#d4b886] text-[#0a1f44] font-bold text-base sm:text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,184,134,0.5)]"
          >
            GET EARLY ACCESS
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </button>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-20 pointer-events-none" />
    </section>
  );
}

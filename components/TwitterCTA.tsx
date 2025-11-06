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
    gsap.fromTo(
      contentRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
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
    <section ref={sectionRef} className="py-16 px-4 bg-background relative overflow-hidden">
      {/* Accent background element */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div
          ref={contentRef}
          className="bg-white border-2 border-accent rounded-sm p-10 md:p-12 shadow-[0_0_40px_rgba(255,0,128,0.15)] opacity-0"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <TwitterX className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              FOLLOW OUR LIVE RESEARCH
            </h2>
            <p className="text-lg text-text-muted font-normal leading-relaxed max-w-2xl mx-auto">
              All positions are posted in real-time on X (Twitter) before placement.
              Track our algorithmic approach, analysis methodology, and results as they happen.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="https://x.com/DeptOfGambling"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-accent text-white font-bold text-lg tracking-wide transition-all duration-300 hover:bg-primary hover:shadow-[0_0_30px_rgba(255,0,128,0.4)] relative overflow-hidden"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Content */}
              <TwitterX className="w-6 h-6 relative z-10" />
              <span className="relative z-10">@DeptOfGambling</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>

          {/* Subtext */}
          <p className="text-center text-sm text-text-muted mt-6 font-medium">
            Live positions • Pre-placement analysis • Transparent results
          </p>
        </div>
      </div>
    </section>
  );
}

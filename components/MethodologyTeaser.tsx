'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function MethodologyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 grid-background" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div
          ref={contentRef}
          className="text-center opacity-0"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block bg-accent px-4 py-1 rounded-sm mb-4">
              <span className="text-white text-xs uppercase tracking-widest font-bold">
                Educational Framework
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Mathematics of<br />Disciplined Sports Betting
            </h2>
            <p className="text-secondary-light text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Learn the quantitative framework that separates professionals who generate consistent returns
              from amateurs who inevitably destroy their capital.
            </p>
          </div>

          {/* Key Topics Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-secondary-light border-opacity-20 rounded-sm p-6">
              <div className="text-accent text-3xl font-bold mb-2">1</div>
              <h3 className="text-white font-bold mb-2">Expected Value</h3>
              <p className="text-secondary-light text-sm">
                Calculate edge and identify profitable betting opportunities
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-secondary-light border-opacity-20 rounded-sm p-6">
              <div className="text-accent text-3xl font-bold mb-2">2</div>
              <h3 className="text-white font-bold mb-2">Position Sizing</h3>
              <p className="text-secondary-light text-sm">
                Fixed unit methodology and Kelly Criterion optimization
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-secondary-light border-opacity-20 rounded-sm p-6">
              <div className="text-accent text-3xl font-bold mb-2">3</div>
              <h3 className="text-white font-bold mb-2">Variance Management</h3>
              <p className="text-secondary-light text-sm">
                Surviving inevitable drawdowns with disciplined risk controls
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mono-number mb-1">6</div>
              <div className="text-xs uppercase tracking-wide text-secondary-light">Core Principles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mono-number mb-1">1000+</div>
              <div className="text-xs uppercase tracking-wide text-secondary-light">Sample Size Required</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mono-number mb-1">2%</div>
              <div className="text-xs uppercase tracking-wide text-secondary-light">Professional Unit Standard</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/methodology"
            className="inline-block px-10 py-5 bg-accent text-white font-bold text-lg tracking-wide rounded-sm transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_0_40px_rgba(255,0,128,0.6)] hover:scale-105 group"
          >
            <span>Learn Our Complete Framework</span>
            <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>

          {/* Subtext */}
          <p className="text-secondary-light text-sm mt-6 italic">
            Comprehensive guide covering bankroll management, probability assessment, expected value calculation, and optimal bet sizing
          </p>
        </div>
      </div>
    </section>
  );
}

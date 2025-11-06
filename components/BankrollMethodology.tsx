'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BankrollMethodology() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.methodology-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="govt-rule w-32 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-semibold text-primary mb-4">
            Bankroll Management Framework
          </h2>
          <p className="text-steel text-sm uppercase tracking-widest">
            Mathematical Approach to Risk Allocation
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-8">
          {/* Bankroll Definition */}
          <div className="methodology-item bg-white border border-gray-200 rounded-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Bankroll Allocation
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We operate with a dedicated bankroll of <span className="font-bold text-primary">$10,000.00</span>,
                  allocated exclusively for sports betting operations. This capital is segregated from operational
                  funds and represents our maximum risk exposure across all positions.
                </p>
                <div className="bg-gray-50 border-l-4 border-primary p-4">
                  <p className="text-sm text-gray-600 font-mono">
                    <span className="font-bold">Initial Bankroll:</span> $10,000.00<br />
                    <span className="font-bold">Current Bankroll:</span> $10,271.06<br />
                    <span className="font-bold">Capital Preservation Rate:</span> 102.71%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Unit System */}
          <div className="methodology-item bg-white border border-gray-200 rounded-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Unit-Based Sizing System
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We employ a fixed-unit methodology where <span className="font-bold">1 unit = 1% of initial bankroll</span>.
                  This standardized approach allows for consistent risk quantification across all positions,
                  regardless of varying odds structures or bet types.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                    <div className="text-xs uppercase text-gray-500 mb-1 tracking-wide">Base Unit</div>
                    <div className="text-2xl font-bold text-primary mono-number">$100.00</div>
                    <div className="text-xs text-gray-600 mt-1">1.0% of $10,000 bankroll</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                    <div className="text-xs uppercase text-gray-500 mb-1 tracking-wide">Unit Range</div>
                    <div className="text-2xl font-bold text-primary mono-number">1.0u - 3.0u</div>
                    <div className="text-xs text-gray-600 mt-1">$100 - $300 per position</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  By fixing the unit size to our initial bankroll rather than current balance, we eliminate
                  the compounding volatility that occurs with variable unit sizing during drawdowns.
                </p>
              </div>
            </div>
          </div>

          {/* Confidence-Based Allocation */}
          <div className="methodology-item bg-white border border-gray-200 rounded-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Edge-Proportional Stake Sizing
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unit allocation is determined by quantified edge magnitude. Higher-confidence positions
                  (larger perceived edge) receive proportionally larger stakes, while lower-confidence
                  opportunities warrant reduced exposure. This approach optimizes the Kelly Criterion while
                  maintaining conservative risk parameters.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                    <div className="font-bold text-primary w-20 mono-number">1.0u</div>
                    <div className="flex-1 text-sm text-gray-700">
                      Standard edge (10-15%) • Baseline confidence threshold
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                    <div className="font-bold text-primary w-20 mono-number">1.5u</div>
                    <div className="flex-1 text-sm text-gray-700">
                      Elevated edge (15-20%) • Strong statistical advantage
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                    <div className="font-bold text-primary w-20 mono-number">2.0u+</div>
                    <div className="flex-1 text-sm text-gray-700">
                      Maximum edge (20%+) • Exceptional mispricing identified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Long-Term Objective */}
          <div className="methodology-item bg-white border border-gray-200 rounded-sm p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Long-Term Profitability Objective
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our framework prioritizes <span className="font-bold">sustainable, long-run expected value (EV)
                  maximization</span> over short-term variance outcomes. By maintaining strict adherence to
                  positive-EV thresholds and disciplined bankroll management, we aim to exploit market
                  inefficiencies while preserving capital through inevitable variance.
                </p>
                <div className="bg-primary bg-opacity-5 border border-primary p-4 rounded-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-primary">Critical Principle:</span> Individual bet outcomes
                    are independent random variables. Our edge manifests over large sample sizes (n &gt; 100),
                    where the Law of Large Numbers ensures convergence toward expected value. Short-term
                    results—whether positive or negative—do not invalidate or validate our process. We evaluate
                    performance on process quality, not outcome variance.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-1">Target ROI</div>
                    <div className="text-xl font-bold text-primary mono-number">5-8%</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-1">Min. Sample Size</div>
                    <div className="text-xl font-bold text-primary mono-number">250+</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-1">Max. Drawdown</div>
                    <div className="text-xl font-bold text-primary mono-number">&lt;20%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Foundation */}
          <div className="methodology-item bg-primary bg-opacity-5 border-2 border-primary rounded-sm p-8">
            <h3 className="text-xl font-bold text-primary mb-4 text-center">
              Expected Value Formula
            </h3>
            <div className="bg-white p-6 rounded-sm font-mono text-center">
              <div className="text-lg mb-2">
                <span className="text-primary font-bold">EV</span> =
                (P<sub>win</sub> × Amount Won) - (P<sub>loss</sub> × Amount Lost)
              </div>
              <div className="text-sm text-gray-600 mt-4">
                Where P<sub>win</sub> = True probability of success (model-derived)<br />
                P<sub>loss</sub> = 1 - P<sub>win</sub>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-center mt-4 italic">
              We only place bets where EV &gt; 0 with statistical significance.
            </p>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="govt-rule w-32 mx-auto mt-16" />
      </div>
    </section>
  );
}

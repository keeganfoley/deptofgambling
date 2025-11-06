'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BankrollMethodology() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.methodology-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="govt-rule w-32 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-semibold text-primary mb-4">
            The Mathematics of Disciplined Sports Betting
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed mt-4">
            Professional sports betting operates on the same principles as portfolio management: capital preservation,
            position sizing, expected value, and long-term compounding. This framework explains the quantitative
            methodology that separates professionals who generate consistent returns from amateurs who inevitably
            destroy their capital.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Bankroll as Investment Capital */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Bankroll as Investment Capital
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Your bankroll is the total capital you dedicate exclusively to betting—completely segregated from
                rent, bills, savings, and any personal finances. This separation is not merely organizational;
                it&apos;s fundamental to mathematical survival. Professional bettors treat their bankroll as{' '}
                <span className="font-bold text-primary">investment capital</span> in a financial market, subject
                to the same principles of risk management that govern any serious trading operation.
              </p>
              <p>
                The segregation serves three critical functions. First, it creates a{' '}
                <span className="font-bold">psychological barrier</span> that prevents the most destructive behavior:
                reloading accounts during losing streaks. Second, it enables <span className="font-bold">precise performance tracking</span>.
                Third, it facilitates <span className="font-bold">compounding</span>, the engine that transforms
                small edges into substantial long-term wealth.
              </p>
              <div className="bg-primary bg-opacity-5 border-l-4 border-primary p-5 my-6">
                <p className="text-sm font-semibold text-primary mb-2">Critical Principle:</p>
                <p className="text-sm">
                  Even with a 55% win rate (well above breakeven), you will have less bankroll than your all-time
                  peak more than <span className="font-bold">95% of the time</span>. This is not failure—this is
                  mathematical inevitability. Your peak represents a moment of positive variance, not your &quot;true&quot; level.
                </p>
              </div>
              <p>
                Consider the mathematics of compounding with a $10,000 starting bankroll, betting 1% units with a
                54% win rate at standard -110 odds. Over 100 bets, expected bankroll grows to approximately $10,450.
                After 1,000 bets with disciplined reinvestment: roughly $14,500. The key insight: every withdrawal
                interrupts this compounding engine.
              </p>
            </div>
          </div>

          {/* Fixed Unit Sizing */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Fixed Unit Sizing Controls Risk
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                A unit is your standardized bet size, expressed as a fixed percentage of total bankroll. If your
                bankroll is $10,000 and you use 1% units, every bet risks $100 regardless of how &quot;confident&quot; you feel.
                This systematic approach is mathematically superior to variable sizing in every measurable way.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-gray-50 border-2 border-gray-200 p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide font-semibold">Conservative</div>
                  <div className="text-3xl font-bold text-primary mono-number mb-1">1.0%</div>
                  <div className="text-xs text-gray-600">Lowest volatility</div>
                </div>
                <div className="bg-primary bg-opacity-10 border-2 border-primary p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-primary mb-2 tracking-wide font-semibold">Standard</div>
                  <div className="text-3xl font-bold text-primary mono-number mb-1">2.0%</div>
                  <div className="text-xs text-gray-600">Professional baseline</div>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide font-semibold">Aggressive</div>
                  <div className="text-3xl font-bold text-primary mono-number mb-1">3.0%</div>
                  <div className="text-xs text-gray-600">Maximum recommended</div>
                </div>
              </div>

              <p>
                Why fixed units rather than variable &quot;confidence-based&quot; sizing?{' '}
                <span className="font-bold">Overconfidence bias systematically destroys expected value.</span> When
                people rate themselves as &quot;90% confident,&quot; they&apos;re actually correct only about 70% of the time.
                This systematic miscalibration means your largest bets—the ones you&apos;re &quot;most confident&quot; about—are
                statistically your worst bets.
              </p>

              <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm my-6">
                <p className="text-sm font-semibold mb-3">Mathematical Comparison:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bettor A: Flat 1% units, 53% win rate</span>
                    <span className="font-bold text-success">+6% ROI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bettor B: Variable 1-5% units, 53% win rate</span>
                    <span className="font-bold text-loss">-2% ROI</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">
                  Good handicapping with poor bet sizing produces the same result as bad handicapping: bankroll destruction.
                </p>
              </div>
            </div>
          </div>

          {/* Expected Value */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Expected Value Determines Every Decision
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Expected Value (EV) is the single most important concept in betting mathematics. It answers one
                question: if you could place this exact bet infinite times, what would be your average profit or
                loss per bet?
              </p>

              <div className="bg-primary bg-opacity-5 border-2 border-primary p-6 rounded-sm my-6">
                <p className="text-sm font-semibold text-primary mb-3 text-center">Expected Value Formula</p>
                <div className="bg-white p-5 rounded-sm font-mono text-center text-lg">
                  <div className="mb-2">
                    <span className="text-primary font-bold">EV</span> = (P<sub>win</sub> × Amount Won) - (P<sub>loss</sub> × Amount Lost)
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-4 text-center">
                  Where P<sub>win</sub> = Your assessed probability | P<sub>loss</sub> = 1 - P<sub>win</sub>
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                <p className="text-sm font-semibold mb-3">Example Calculation:</p>
                <div className="space-y-2 text-sm">
                  <div>Market Odds: +150 (implied 40% probability)</div>
                  <div>Your Assessment: 45% probability</div>
                  <div>Bet Amount: $100</div>
                  <div className="pt-2 border-t border-gray-300 mt-3">
                    <span className="font-mono">EV = (0.45 × $150) - (0.55 × $100)</span>
                  </div>
                  <div className="font-mono">EV = $67.50 - $55.00 = <span className="font-bold text-success">+$12.50</span></div>
                  <div className="text-xs text-gray-600 italic mt-2">
                    This bet has positive expected value of 12.5% ROI. Over 1,000 such bets, expect to profit $12,500.
                  </div>
                </div>
              </div>

              <p>
                Small edges compound dramatically over volume. A 3% edge over 500 bets translates to a 55.38% win
                rate versus the 52.38% breakeven rate. This demonstrates why professionals focus on volume with
                consistent small edges rather than seeking rare large scores.
              </p>
            </div>
          </div>

          {/* Law of Large Numbers */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Sample Size Separates Signal from Noise
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Law of Large Numbers states that as the number of trials increases, the average of results
                converges to the expected value. In betting terms: over 10 bets, results are mostly random; over
                100 bets, your edge begins emerging; over 300-1,000+ bets, mathematical advantage becomes
                statistically evident.
              </p>

              <div className="grid md:grid-cols-4 gap-3 my-6">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm text-center">
                  <div className="text-2xl font-bold text-gray-400 mono-number mb-1">10</div>
                  <div className="text-xs text-gray-600">Purely random</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm text-center">
                  <div className="text-2xl font-bold text-gray-500 mono-number mb-1">100</div>
                  <div className="text-xs text-gray-600">Edge emerging</div>
                </div>
                <div className="bg-primary bg-opacity-10 border border-primary p-4 rounded-sm text-center">
                  <div className="text-2xl font-bold text-primary mono-number mb-1">300</div>
                  <div className="text-xs text-gray-700 font-semibold">Minimum sample</div>
                </div>
                <div className="bg-primary bg-opacity-10 border border-primary p-4 rounded-sm text-center">
                  <div className="text-2xl font-bold text-primary mono-number mb-1">1000+</div>
                  <div className="text-xs text-gray-700 font-semibold">Statistical confidence</div>
                </div>
              </div>

              <p>
                With a true 55% win rate over 100 bets, actual results could reasonably range from 45-65 wins.
                A 45-55 record (losing money) is well within normal variance for a winning strategy. After 1,000
                bets, the same strategy would produce 520-580 wins, and your edge becomes statistically visible.
              </p>

              <div className="bg-primary bg-opacity-5 border-l-4 border-primary p-5 my-6">
                <p className="text-sm font-semibold text-primary mb-2">Critical Insight:</p>
                <p className="text-sm">
                  Never evaluate a betting strategy on fewer than 100 bets, preferably 300+. Winning or losing
                  streaks of 5-10 bets mean nothing. Monthly results are nearly meaningless. Only over hundreds
                  of bets does mathematical edge overcome random variance.
                </p>
              </div>
            </div>
          </div>

          {/* Variance Management */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">5</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Variance Creates Inevitable Drawdowns
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                A drawdown is the decline from a peak bankroll to a subsequent trough. Drawdowns are mathematically
                inevitable even with strong positive EV. Simulation data demonstrates that with a 55% win rate,
                there&apos;s a <span className="font-bold">43% probability of experiencing a 10-unit drawdown</span> over
                1,000 bets—despite finishing profitable.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">1% Units</div>
                  <div className="text-2xl font-bold text-primary mono-number mb-1">10-15%</div>
                  <div className="text-xs text-gray-600">Expected annual drawdown</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">2% Units</div>
                  <div className="text-2xl font-bold text-primary mono-number mb-1">20-30%</div>
                  <div className="text-xs text-gray-600">Expected annual drawdown</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">5% Units</div>
                  <div className="text-2xl font-bold text-loss mono-number mb-1">50%+</div>
                  <div className="text-xs text-gray-600">Unsustainable risk</div>
                </div>
              </div>

              <p>
                Loss aversion means losses feel approximately twice as painful as equivalent gains feel good.
                A 20% drawdown creates emotional pressure equivalent to needing a 40% gain. This pressure triggers
                predictable destructive behaviors: increasing bet sizes to &quot;recover&quot; losses, betting outside normal
                criteria, or abandoning proven strategies.
              </p>

              <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                <p className="text-sm font-semibold mb-3">Mechanical Rules to Survive Variance:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Never increase unit size during drawdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Evaluate performance only at predetermined intervals (every 500 bets, not daily)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Use stop-loss limits as circuit breakers: if down 30% of bankroll, take a one-week break</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Focus on process metrics you control, not short-term results you don&apos;t</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kelly Criterion */}
          <div className="methodology-item bg-white border-2 border-gray-200 rounded-sm p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xl font-bold">6</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Kelly Criterion Optimizes Position Size
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Kelly Criterion, developed by John L. Kelly Jr. at Bell Labs in 1956, mathematically determines
                optimal bet size. The intuitive insight:{' '}
                <span className="font-bold">edge determines bet size, not confidence or intuition.</span>
              </p>

              <div className="bg-primary bg-opacity-5 border-2 border-primary p-6 rounded-sm my-6">
                <p className="text-sm font-semibold text-primary mb-3 text-center">Kelly Formula</p>
                <div className="bg-white p-5 rounded-sm font-mono text-center text-lg">
                  <div className="mb-2">
                    <span className="text-primary font-bold">f*</span> = (bp - q) / b
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-4 text-center">
                  f* = fraction to bet | b = net odds | p = win probability | q = loss probability
                </p>
              </div>

              <p>
                However, full Kelly produces extreme volatility that is psychologically unbearable. Professional
                bettors use <span className="font-bold">Fractional Kelly</span>—betting a fraction of the full Kelly
                recommendation.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-gray-500 mb-2 tracking-wide">Quarter Kelly</div>
                  <div className="text-2xl font-bold text-primary mono-number mb-1">1/4</div>
                  <div className="text-xs text-gray-600 mb-3">Ultra-conservative</div>
                  <div className="text-xs">50% growth | 12% drawdown</div>
                </div>
                <div className="bg-primary bg-opacity-10 border-2 border-primary p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-primary mb-2 tracking-wide font-semibold">Half Kelly</div>
                  <div className="text-2xl font-bold text-primary mono-number mb-1">1/2</div>
                  <div className="text-xs text-gray-700 mb-3 font-semibold">Professional Standard</div>
                  <div className="text-xs">75% growth | 25% drawdown</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-5 rounded-sm text-center">
                  <div className="text-xs uppercase text-red-600 mb-2 tracking-wide">Full Kelly</div>
                  <div className="text-2xl font-bold text-red-600 mono-number mb-1">1/1</div>
                  <div className="text-xs text-red-600 mb-3">Not Recommended</div>
                  <div className="text-xs">100% growth | 50%+ drawdown</div>
                </div>
              </div>

              <p className="text-sm italic">
                Half Kelly delivers approximately 75% of full Kelly&apos;s growth rate while dramatically reducing
                volatility and drawdown magnitude. This sacrifice of 25% theoretical growth for substantial risk
                reduction is the universally accepted professional standard.
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="methodology-item bg-primary bg-opacity-10 border-2 border-primary rounded-sm p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
              Treating Betting as Financial Mathematics
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Disciplined sports betting operates on the same quantitative principles that govern any financial
                market: dedicated capital, systematic position sizing, probability assessment, expected value
                calculation, variance management, and long-term compounding.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-white border border-gray-300 p-5 rounded-sm">
                  <p className="text-sm font-semibold text-primary mb-3">Success Requires:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span><span className="font-semibold">Mathematical edge</span> (true probability &gt; market probability)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span><span className="font-semibold">Sufficient sample size</span> (300-1,000+ bets minimum)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span><span className="font-semibold">Proper bankroll management</span> (1-2% units via fractional Kelly)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span><span className="font-semibold">Psychological resilience</span> (surviving drawdowns without abandoning strategy)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-300 p-5 rounded-sm">
                  <p className="text-sm font-semibold text-loss mb-3">Failure Results From:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-loss font-bold">✗</span>
                      <span>Betting without edge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-loss font-bold">✗</span>
                      <span>Judging results on tiny samples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-loss font-bold">✗</span>
                      <span>Using position sizes that ensure eventual bankruptcy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-loss font-bold">✗</span>
                      <span>Abandoning winning strategies during normal drawdowns</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-center font-semibold text-primary">
                Professional profitability comes from maintaining small consistent edges across hundreds of
                properly-sized bets while surviving variance long enough for the law of large numbers to manifest
                expected value as actual profit.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="govt-rule w-32 mx-auto mt-16" />
      </div>
    </section>
  );
}

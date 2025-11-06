'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Play {
  id: number;
  player: string;
  line: string;
  odds: string;
  stats: string;
  matchup: string[];
  math: string;
  ev: string;
  projected: string;
  units: string;
  emoji: string;
}

const plays: Play[] = [
  {
    id: 1,
    player: "Tyrese Maxey",
    line: "OVER 3.5 3PT",
    odds: "(+100)",
    stats: "4.2 3PM | 7 of 9 over (78%)",
    matchup: [
      "Embiid OUT = primary option",
      "Knicks 23rd in opp 3PT% | Anunoby OUT"
    ],
    math: "68% true vs 50% implied",
    ev: "+36.0% ROI | Projected: 4-5 threes",
    projected: "4-5 threes",
    units: "1.0 UNIT",
    emoji: "🔥"
  },
  {
    id: 2,
    player: "Trey Murphy III",
    line: "OVER 2.5 3PT",
    odds: "(-165)",
    stats: "3.9 3PM | 8 of 9 over (89%)",
    matchup: [
      "Ingram + Zion OUT = expanded role",
      "Magic 26th in corner 3PT defense"
    ],
    math: "84% true vs 62% implied",
    ev: "+42.1% ROI | Projected: 4-5 threes",
    projected: "4-5 threes",
    units: "1.65 UNITS",
    emoji: "💎"
  },
  {
    id: 3,
    player: "Devin Booker",
    line: "OVER 28.5 pts",
    odds: "(-120)",
    stats: "29.8 PPG | 6 of 8 over (75%)",
    matchup: [
      "KD OUT = 32% usage rate",
      "Portland 29th in DRtg | Worst perimeter D"
    ],
    math: "69% true vs 55% implied",
    ev: "+28.8% ROI | Projected: 31-34 pts",
    projected: "31-34 pts",
    units: "1.2 UNITS",
    emoji: "💰"
  }
];

export default function DailyPlays() {
  const sectionRef = useRef<HTMLElement>(null);
  const playsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !playsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.play-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="govt-rule w-32 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary mb-2">
            Official Plays
          </h2>
          <p className="text-steel text-sm uppercase tracking-widest">
            November 4, 2025
          </p>
        </div>

        {/* Plays Grid */}
        <div ref={playsRef} className="grid gap-6 md:grid-cols-3">
          {plays.map((play) => (
            <div
              key={play.id}
              className="play-card bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Tweet Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Department of Gambling"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">
                      Department of Gambling
                    </span>
                    <span className="text-gray-500 text-sm">
                      @DeptOfGambling
                    </span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">Nov 4</span>
                  </div>
                </div>
              </div>

              {/* Bet Content */}
              <div className="space-y-3">
                {/* Main Bet Line */}
                <div className="text-lg">
                  <span className="mr-2">🏀</span>
                  <span className="font-bold text-gray-900">
                    {play.player} {play.line}
                  </span>
                  <span className="text-gray-600 ml-1">{play.odds}</span>
                </div>

                {/* Stats */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {play.stats}
                </p>

                {/* Matchup Info */}
                <div className="text-sm text-gray-700 space-y-1">
                  {play.matchup.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Math & EV */}
                <div className="pt-3 border-t border-gray-200 space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    MATH: {play.math}
                  </p>
                  <p className="text-sm text-gray-700">
                    EV: {play.ev}
                  </p>
                </div>

                {/* Units */}
                <div className="pt-3">
                  <p className="text-sm font-bold text-accent">
                    {play.emoji} BET {play.units}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Rule */}
        <div className="govt-rule w-32 mx-auto mt-10" />
      </div>
    </section>
  );
}

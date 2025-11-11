'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import betsData from '@/data/bets.json';

interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss';
  finalStat: string;
  edge: number;
  expectedValue: number;
  profit: number;
  betType: string;
  slug: string;
}

interface DailyData {
  date: string;
  bets: Bet[];
  dailyPL: number;
  endingBalance: number;
  record: { wins: number; losses: number };
}

type FilterType = 'all' | '30' | '7';

const STARTING_BALANCE = 10000;

export default function DailyPerformanceHistory() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const sectionRef = useRef<HTMLElement>(null);

  // Group bets by day and calculate daily stats
  const getDailyData = (): DailyData[] => {
    const grouped = new Map<string, Bet[]>();

    // USE ALL REAL BETS (Nov 4, Nov 5, Nov 6, Nov 7, Nov 8, Nov 9, Nov 10)
    const realBets = betsData;

    // Group bets by date (extract just the date part)
    realBets.forEach((bet) => {
      const dateStr = new Date(bet.date).toISOString().split('T')[0];
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr)!.push(bet as Bet);
    });

    // Convert to array and sort by date (newest first)
    const sortedDates = Array.from(grouped.keys()).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    );

    // Calculate running balance and daily stats
    let runningBalance = STARTING_BALANCE;
    const dailyDataReversed: DailyData[] = [];

    // Process in chronological order (oldest first) for balance calculation
    const chronologicalDates = [...sortedDates].reverse();

    chronologicalDates.forEach((date) => {
      const bets = grouped.get(date)!;
      const dailyPL = bets.reduce((sum, bet) => sum + bet.profit, 0);
      runningBalance += dailyPL;

      const wins = bets.filter(b => b.result === 'win').length;
      const losses = bets.filter(b => b.result === 'loss').length;

      dailyDataReversed.push({
        date,
        bets,
        dailyPL,
        endingBalance: runningBalance,
        record: { wins, losses }
      });
    });

    // Reverse back to newest first for display
    return dailyDataReversed.reverse();
  };

  const dailyData = getDailyData();

  // Filter data based on selected timeframe
  const getFilteredData = (): DailyData[] => {
    if (filter === 'all') return dailyData;

    const daysToShow = filter === '30' ? 30 : 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);

    return dailyData.filter(day => new Date(day.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  // Toggle day expansion
  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  // Animation on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    } else {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0a1f44] to-[#061429]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight font-mono">
            DAILY PERFORMANCE HISTORY
          </h2>
          <div className="h-[2px] bg-gradient-to-r from-[#c5a572] via-[#c5a572]/50 to-transparent mb-6 sm:mb-8"></div>

          {/* Filter Tabs */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 text-xs sm:text-base font-semibold transition-all duration-200 border-2 ${
                filter === 'all'
                  ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              ALL TIME
            </button>
            <button
              onClick={() => setFilter('30')}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 text-xs sm:text-base font-semibold transition-all duration-200 border-2 ${
                filter === '30'
                  ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              30 DAYS
            </button>
            <button
              onClick={() => setFilter('7')}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 text-xs sm:text-base font-semibold transition-all duration-200 border-2 ${
                filter === '7'
                  ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              7 DAYS
            </button>
          </div>
        </div>

        {/* Daily Cards */}
        <div className="space-y-4">
          {/* Daily Performance Cards */}
          {filteredData.map((day) => (
            <div key={day.date} className="border-2 border-gray-700 hover:border-gray-600 transition-all duration-200">
              {/* Collapsed View */}
              <button
                onClick={() => toggleDay(day.date)}
                className="w-full bg-gradient-to-r from-[#1a2f54]/60 to-[#0f1f3a]/60 p-4 sm:p-5 text-left hover:from-[#1a2f54]/80 hover:to-[#0f1f3a]/80 transition-all duration-200 backdrop-blur-sm"
              >
                {/* Mobile Layout: Stacked */}
                <div className="flex flex-col gap-2.5 sm:hidden font-mono">
                  {/* Row 1: Date Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-gray-400 text-sm w-4">{expandedDay === day.date ? '▾' : '▸'}</span>
                      <span className="text-white font-bold text-sm tracking-tight">{formatDate(day.date)}</span>
                    </div>
                    <span className="text-gray-500 text-xs tracking-tight">
                      {expandedDay === day.date ? 'COLLAPSE' : 'EXPAND'}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-gray-600/30 my-0.5"></div>

                  {/* Row 2: Balance & Record */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Balance</span>
                      <span className="text-white font-bold text-sm tracking-tight">
                        ${day.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Record</span>
                      <span className="text-gray-400 font-bold text-sm tracking-tight">
                        {day.record.wins}-{day.record.losses}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Daily P/L */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex flex-col flex-1">
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Daily P/L</span>
                      <span className={`font-bold text-base tracking-tight ${day.dailyPL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {day.dailyPL >= 0 ? '+' : ''}${day.dailyPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className={`text-2xl ${day.dailyPL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {day.dailyPL >= 0 ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Desktop Layout: Single Row */}
                <div className="hidden sm:flex items-center gap-4 text-base font-mono">
                  <span className="text-gray-400">{expandedDay === day.date ? '▾' : '▸'}</span>
                  <span className="text-white font-bold min-w-[140px]">{formatDate(day.date)}</span>
                  <span className="text-white font-bold">
                    ${day.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`font-bold ${day.dailyPL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {day.dailyPL >= 0 ? '+' : ''}${day.dailyPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {day.dailyPL >= 0 ? '▲' : '▼'}
                  </span>
                  <span className="text-gray-400">
                    {day.record.wins}-{day.record.losses}
                  </span>
                  <span className="ml-auto text-gray-500 text-sm">
                    {expandedDay === day.date ? '[Collapse ▲]' : '[Expand ▼]'}
                  </span>
                </div>
              </button>

              {/* Expanded View */}
              {expandedDay === day.date && (
                <div className="bg-[#0a1624] p-4 sm:p-6 space-y-3 sm:space-y-4 border-t-2 border-gray-700">
                  {day.bets.map((bet) => (
                    <a
                      key={bet.id}
                      href={`/bets/${bet.slug}`}
                      className={`block border-2 ${
                        bet.result === 'win'
                          ? 'border-[#22c55e] bg-[#22c55e]/5 hover:bg-[#22c55e]/10'
                          : 'border-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/10'
                      } p-4 sm:p-6 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1">
                          <span className={`text-xl sm:text-2xl font-bold ${bet.result === 'win' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {bet.result === 'win' ? '✓' : '✗'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-base sm:text-xl break-words">
                              {bet.description} ({bet.odds > 0 ? '+' : ''}{bet.odds})
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-gray-400 font-mono font-semibold text-sm sm:text-base">{bet.stake}u</span>
                        </div>
                      </div>

                      <div className="ml-7 sm:ml-11 space-y-2">
                        <p className="text-gray-300 text-xs sm:text-base font-mono break-words">
                          Final: {bet.finalStat} · +{bet.edge}% edge · +{bet.expectedValue}% EV
                        </p>
                        <p className={`font-bold text-xl sm:text-3xl font-mono ${
                          bet.result === 'win' ? 'text-[#22c55e]' : 'text-[#ef4444]'
                        }`}>
                          {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)} {bet.result === 'win' ? '↑' : '↓'}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

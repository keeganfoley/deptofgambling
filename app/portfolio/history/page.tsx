'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import betsData from '@/data/bets.json';

interface Bet {
  id: number;
  date: string;
  sport: string;
  description: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'push' | 'pending' | 'no_action';
  finalStat: string;
  edge: number;
  expectedValue: number;
  profit: number;
  betType: string;
  slug: string;
  thesis?: string;
  fund?: string;
}

interface DailyData {
  date: string;
  bets: Bet[];
  dailyPL: number;
  endingBalance: number;
  record: { wins: number; losses: number; pushes: number };
}

type FilterType = 'all' | '30' | '7';

const STARTING_BALANCE = 40000;

// Check if a day is a no-action day
const isNoActionDay = (bets: Bet[]): boolean => {
  return bets.length === 1 && bets[0].result === 'no_action';
};

export default function DailyHistoryPage() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Group bets by day and calculate daily stats
  const getDailyData = (): DailyData[] => {
    const grouped = new Map<string, Bet[]>();

    // USE ALL REAL BETS (exclude pending bets from display)
    const realBets = (betsData as Bet[]).filter(bet => bet.result !== 'pending');

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
      const pushes = bets.filter(b => b.result === 'push').length;

      dailyDataReversed.push({
        date,
        bets,
        dailyPL,
        endingBalance: runningBalance,
        record: { wins, losses, pushes }
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

  // Calculate summary stats
  const summaryStats = {
    totalDays: filteredData.length,
    greenDays: filteredData.filter(d => d.dailyPL > 0).length,
    redDays: filteredData.filter(d => d.dailyPL < 0).length,
    totalPL: filteredData.reduce((sum, d) => sum + d.dailyPL, 0),
    totalWins: filteredData.reduce((sum, d) => sum + d.record.wins, 0),
    totalLosses: filteredData.reduce((sum, d) => sum + d.record.losses, 0),
    totalPushes: filteredData.reduce((sum, d) => sum + d.record.pushes, 0),
  };

  // Format record with pushes
  const formatDailyRecord = (wins: number, losses: number, pushes: number) => {
    if (pushes > 0) {
      return `${wins}-${losses}-${pushes}`;
    }
    return `${wins}-${losses}`;
  };

  // Format date for display (UTC to avoid timezone issues)
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    }).toUpperCase();
  };

  // Toggle day expansion
  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  // Animation on mount
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f44] to-[#061429] py-8 sm:py-16 px-4">
      <div ref={containerRef} className="max-w-4xl mx-auto opacity-0">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight font-mono">
            DAILY PERFORMANCE HISTORY
          </h1>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c5a572] to-transparent"></div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setFilter('7')}
            className={`px-6 py-2.5 text-sm font-semibold transition-all duration-200 border-2 ${
              filter === '7'
                ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
            }`}
          >
            PAST 7 DAYS
          </button>
          <button
            onClick={() => setFilter('30')}
            className={`px-6 py-2.5 text-sm font-semibold transition-all duration-200 border-2 ${
              filter === '30'
                ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
            }`}
          >
            PAST 30 DAYS
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 text-sm font-semibold transition-all duration-200 border-2 ${
              filter === 'all'
                ? 'bg-[#c5a572] text-[#0a1f44] border-[#c5a572]'
                : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
            }`}
          >
            ALL TIME
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a2f54]/60 border-2 border-gray-700 p-4 text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Total P/L</div>
            <div className={`text-xl font-bold font-mono ${summaryStats.totalPL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {summaryStats.totalPL >= 0 ? '+' : ''}${summaryStats.totalPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-[#1a2f54]/60 border-2 border-gray-700 p-4 text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Record (W-L-P)</div>
            <div className="text-xl font-bold font-mono text-white">
              {formatDailyRecord(summaryStats.totalWins, summaryStats.totalLosses, summaryStats.totalPushes)}
            </div>
          </div>
          <div className="bg-[#1a2f54]/60 border-2 border-gray-700 p-4 text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Green Days</div>
            <div className="text-xl font-bold font-mono text-[#22c55e]">
              {summaryStats.greenDays}
            </div>
          </div>
          <div className="bg-[#1a2f54]/60 border-2 border-gray-700 p-4 text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Red Days</div>
            <div className="text-xl font-bold font-mono text-[#ef4444]">
              {summaryStats.redDays}
            </div>
          </div>
        </div>

        {/* Daily Cards */}
        <div className="space-y-3">
          {filteredData.map((day) => (
            <div key={day.date} className="border-2 border-gray-700 hover:border-gray-600 transition-all duration-200">
              {/* Collapsed View */}
              <button
                onClick={() => toggleDay(day.date)}
                className="w-full bg-gradient-to-r from-[#1a2f54]/60 to-[#0f1f3a]/60 p-4 sm:p-5 text-left hover:from-[#1a2f54]/80 hover:to-[#0f1f3a]/80 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{expandedDay === day.date ? '▾' : '▸'}</span>
                    <span className="text-white font-bold text-sm sm:text-base">{formatDate(day.date)}</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-gray-400 text-sm hidden sm:inline">
                      {isNoActionDay(day.bets) ? '—' : formatDailyRecord(day.record.wins, day.record.losses, day.record.pushes)}
                    </span>
                    <span className="text-white font-bold text-sm hidden sm:inline">
                      ${day.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {isNoActionDay(day.bets) ? (
                      <span className="font-bold text-sm sm:text-base text-gray-500">
                        NO ACTION ⊘
                      </span>
                    ) : (
                      <span className={`font-bold text-sm sm:text-base ${day.dailyPL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {day.dailyPL >= 0 ? '+' : ''}${day.dailyPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="ml-1">{day.dailyPL >= 0 ? '▲' : '▼'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded View */}
              {expandedDay === day.date && (
                <div className="bg-[#0a1624] p-4 sm:p-6 space-y-3 sm:space-y-4 border-t-2 border-gray-700">
                  {/* Mobile: Show balance and record */}
                  <div className="sm:hidden grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-700">
                    <div>
                      <div className="text-gray-500 text-xs uppercase">Balance</div>
                      <div className="text-white font-bold font-mono">
                        ${day.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs uppercase">Record</div>
                      <div className="text-white font-bold font-mono">
                        {formatDailyRecord(day.record.wins, day.record.losses, day.record.pushes)}
                      </div>
                    </div>
                  </div>

                  {day.bets.map((bet) => {
                    // Handle no_action days specially
                    if (bet.result === 'no_action') {
                      return (
                        <div
                          key={bet.id}
                          className="block border-2 border-gray-600 bg-gray-800/30 p-4 sm:p-6 rounded-lg"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl font-bold text-gray-500">⊘</span>
                            <div className="flex-1">
                              <p className="text-gray-300 font-bold text-base sm:text-xl mb-2">
                                {bet.description}
                              </p>
                              {bet.thesis && (
                                <p className="text-gray-400 text-xs sm:text-sm italic border-l-2 border-gray-600 pl-3">
                                  {bet.thesis}
                                </p>
                              )}
                              <p className="text-gray-500 font-mono text-sm mt-3">
                                NO ACTION · $0.00
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const getBetStyles = () => {
                      if (bet.result === 'win') return 'border-[#22c55e] bg-[#22c55e]/5 hover:bg-[#22c55e]/10';
                      if (bet.result === 'push') return 'border-gray-500 bg-gray-500/5 hover:bg-gray-500/10';
                      return 'border-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/10';
                    };
                    const getBetColor = () => {
                      if (bet.result === 'win') return 'text-[#22c55e]';
                      if (bet.result === 'push') return 'text-gray-400';
                      return 'text-[#ef4444]';
                    };
                    const getBetIcon = () => {
                      if (bet.result === 'win') return '✓';
                      if (bet.result === 'push') return '—';
                      return '✗';
                    };

                    return (
                    <Link
                      key={bet.id}
                      href={`/bets/${bet.slug}`}
                      className={`block border-2 ${getBetStyles()} p-4 sm:p-6 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1">
                          <span className={`text-xl sm:text-2xl font-bold ${getBetColor()}`}>
                            {getBetIcon()}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-base sm:text-xl break-words">
                              {bet.description} ({bet.odds > 0 ? '+' : ''}{bet.odds})
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">{bet.sport}</p>
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
                        {bet.thesis && (
                          <p className="text-gray-400 text-xs sm:text-sm italic break-words mt-2 border-l-2 border-[#c5a572]/50 pl-3">
                            {bet.thesis}
                          </p>
                        )}
                        <p className={`font-bold text-xl sm:text-3xl font-mono ${getBetColor()}`}>
                          {bet.result === 'push' ? 'PUSH $0.00' : `${bet.profit >= 0 ? '+' : ''}$${bet.profit.toFixed(2)} ${bet.result === 'win' ? '↑' : '↓'}`}
                        </p>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

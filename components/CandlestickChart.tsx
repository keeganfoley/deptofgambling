'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { IChartApi, CandlestickData, Time, HistogramData } from 'lightweight-charts';
import chartDataFile from '@/data/chartData.json';
import betsData from '@/data/bets.json';
import portfolioData from '@/data/portfolio.json';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TimeframeType = '1week' | '2weeks' | '1month' | 'alltime';

interface DailyData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Bet {
  id: number;
  date: string;
  profit: number;
  result: string;
  description: string;
  sport: string;
  stake: number;
  odds: number;
}

interface TooltipData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  betsCount: number;
  totalStake: number;
}

export default function CandlestickChart() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('1month');
  const [stats, setStats] = useState({ totalPL: 0, winRate: 0, totalBets: 0, startValue: 0, endValue: 0, roi: 0 });
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Chart loads immediately without scroll-triggered animation
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || typeof window === 'undefined') return;

    const initChart = async () => {
      const { createChart, CandlestickSeries, HistogramSeries } = await import('lightweight-charts');

      // Clear any existing chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const container = chartContainerRef.current;
      if (!container) return;

      // Wait for container to have dimensions
      const containerWidth = container.clientWidth || window.innerWidth - 32;
      if (containerWidth <= 0) return;

      // Create the chart with premium dark financial theme
      const isMobileChart = window.innerWidth < 768;
      const chartHeight = isMobileChart ? 300 : 450;

      const chart = createChart(container, {
      layout: {
        background: { color: '#0d1117' },
        textColor: '#8b949e',
        fontFamily: "'SF Mono', 'Fira Code', monospace",
      },
      grid: {
        vertLines: { color: '#21262d' },
        horzLines: { visible: false },
      },
      width: containerWidth,
      height: chartHeight,
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: '#58a6ff',
          style: 0,
          labelBackgroundColor: '#1f6feb',
        },
        horzLine: {
          color: '#58a6ff',
          labelBackgroundColor: '#1f6feb',
        },
      },
      rightPriceScale: {
        borderColor: '#30363d',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => {
          // Parse date string directly to avoid timezone issues
          const [year, month, day] = time.toString().split('-').map(Number);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${months[month - 1]} ${day}`;
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series with premium colors
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#3fb950',
      downColor: '#f85149',
      borderVisible: false,
      wickUpColor: '#3fb950',
      wickDownColor: '#f85149',
      lastValueVisible: false,
      priceLineVisible: false,
    });

    // Generate candlestick data from daily values
    const allDailyData = Array.isArray(chartDataFile) ? chartDataFile as DailyData[] : [];
    // Filter out pending bets from display
    const allBets = Array.isArray(betsData) ? (betsData as Bet[]).filter(bet => bet.result !== 'pending') : [];

    // Filter data based on timeframe
    const now = new Date();
    let daysToShow = 30;
    if (timeframe === '1week') daysToShow = 7;
    else if (timeframe === '2weeks') daysToShow = 14;
    else if (timeframe === '1month') daysToShow = 30;
    else daysToShow = 365; // alltime

    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const dailyData = timeframe === 'alltime'
      ? allDailyData
      : allDailyData.filter(d => d.date >= cutoffStr);

    const bets = timeframe === 'alltime'
      ? allBets
      : allBets.filter(b => b.date.split('T')[0] >= cutoffStr);

    // Calculate stats - use combined portfolio starting balance ($40,000)
    const combinedStarting = (portfolioData as any).combined?.startingBalance || 40000;
    if (dailyData.length > 0) {
      const chartStartVal = dailyData[0].open;
      const endVal = dailyData[dailyData.length - 1].close;
      const pl = endVal - chartStartVal;
      const wins = bets.filter(b => b.result === 'win').length;
      const rate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
      // Calculate ROI based on actual chart movement
      const roiPercent = chartStartVal > 0 ? (pl / chartStartVal) * 100 : 0;

      setStats({
        totalPL: pl,
        winRate: rate,
        totalBets: bets.length,
        startValue: chartStartVal,
        endValue: endVal,
        roi: roiPercent,
      });
    }

    // Group bets by date
    const betsByDate = new Map<string, Bet[]>();
    bets.forEach(bet => {
      const dateKey = bet.date.split('T')[0];
      if (!betsByDate.has(dateKey)) {
        betsByDate.set(dateKey, []);
      }
      betsByDate.get(dateKey)!.push(bet);
    });

    const candleData: CandlestickData[] = [];
    const volumeData: HistogramData[] = [];
    const tooltipMap = new Map<string, TooltipData>();

    dailyData.forEach((day, index) => {
      // Use OHLC data directly from chartData.json
      const { open, high, low, close, volume } = day;

      // Get bets for this day for tooltip info
      const dayBets = betsByDate.get(day.date) || [];

      const change = close - open;
      const changePercent = open > 0 ? (change / open) * 100 : 0;
      const totalStake = dayBets.length > 0 ? dayBets.reduce((sum, bet) => sum + bet.stake, 0) : volume;

      candleData.push({
        time: day.date as Time,
        open,
        high,
        low,
        close,
      });

      // Volume = total units staked that day (scaled for visibility)
      volumeData.push({
        time: day.date as Time,
        value: totalStake * 50,
        color: change >= 0 ? 'rgba(63, 185, 80, 0.5)' : 'rgba(248, 81, 73, 0.5)',
      });

      // Store tooltip data
      tooltipMap.set(day.date, {
        date: day.date,
        open,
        close,
        high,
        low,
        change,
        changePercent,
        betsCount: dayBets.length,
        totalStake,
      });
    });

    candlestickSeries.setData(candleData);

    // Add volume histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      lastValueVisible: false,
      priceLineVisible: false,
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    volumeSeries.setData(volumeData);

    // Subscribe to crosshair move for custom tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltipData(null);
        return;
      }

      const dateStr = param.time.toString();
      const data = tooltipMap.get(dateStr);

      if (data && container) {
        setTooltipData(data);
        setTooltipPosition({
          x: param.point.x,
          y: param.point.y,
        });
      }
    });

    // Fit content to view
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && container) {
        const newIsMobile = window.innerWidth < 768;
        const newHeight = newIsMobile ? 300 : 450;
        chartRef.current.applyOptions({
          width: container.clientWidth,
          height: newHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    };

    initChart();

    return () => {
      window.removeEventListener('resize', () => {});
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [timeframe]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary mb-4">
            PORTFOLIO GROWTH
          </h2>
        </div>

        {/* Chart Container */}
        <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-4 sm:p-6 md:p-8 shadow-[0_16px_70px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#58a6ff]/5 to-transparent pointer-events-none" />

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
            <div className="text-center">
              <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Starting</div>
              <div className="font-mono text-lg font-bold text-white">
                ${stats.startValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Current</div>
              <div className="font-mono text-lg font-bold text-[#58a6ff]">
                ${stats.endValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">ROI</div>
              <div className={`font-mono text-lg font-bold ${stats.roi >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Win Rate</div>
              <div className="font-mono text-lg font-bold text-white">
                {stats.winRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div
            ref={chartContainerRef}
            className="w-full relative min-h-[300px] md:min-h-[450px]"
          />

          {/* Custom Tooltip */}
          {tooltipData && (
            <div
              className="absolute pointer-events-none z-50 bg-[#161b22] border border-[#30363d] rounded-lg p-4 shadow-2xl backdrop-blur-sm"
              style={{
                left: Math.min(tooltipPosition.x + 20, (chartContainerRef.current?.clientWidth || 0) - 220),
                top: Math.max(tooltipPosition.y - 100, 10),
                minWidth: '200px',
              }}
            >
              <div className="text-[#8b949e] text-xs mb-2 font-mono">
                {formatDate(tooltipData.date)}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-[#8b949e]">Open</span>
                <span className="text-white font-mono text-right">${tooltipData.open.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

                <span className="text-[#8b949e]">High</span>
                <span className="text-white font-mono text-right">${tooltipData.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

                <span className="text-[#8b949e]">Low</span>
                <span className="text-white font-mono text-right">${tooltipData.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

                <span className="text-[#8b949e]">Close</span>
                <span className="text-white font-mono text-right">${tooltipData.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="border-t border-[#30363d] mt-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e] text-xs">P&L</span>
                  <span className={`font-mono font-bold ${tooltipData.change >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                    {tooltipData.change >= 0 ? '+' : ''}{tooltipData.change.toFixed(2)} ({tooltipData.changePercent >= 0 ? '+' : ''}{tooltipData.changePercent.toFixed(2)}%)
                  </span>
                </div>
                {tooltipData.betsCount > 0 && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#8b949e] text-xs">Bets</span>
                    <span className="text-white font-mono text-sm">
                      {tooltipData.betsCount} ({tooltipData.totalStake.toFixed(1)}u)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 text-xs text-[#8b949e]">
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3fb950] rounded-sm" />
                <span>Winning Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f85149] rounded-sm" />
                <span>Losing Day</span>
              </div>
            </div>
            <div className="text-center text-[10px] text-[#6e7681] max-w-md mx-auto">
              <span className="font-semibold text-[#8b949e]">How to read:</span> Each candle = 1 day. Body shows open → close. Wicks show intraday highs/lows from individual bet swings. Bottom bars = units wagered.
            </div>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-[#21262d]">
            <button
              onClick={() => setTimeframe('1week')}
              className={`px-3 sm:px-5 py-2 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded ${
                timeframe === '1week'
                  ? 'bg-[#1f6feb] text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
              }`}
            >
              1W
            </button>
            <button
              onClick={() => setTimeframe('2weeks')}
              className={`px-3 sm:px-5 py-2 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded ${
                timeframe === '2weeks'
                  ? 'bg-[#1f6feb] text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
              }`}
            >
              2W
            </button>
            <button
              onClick={() => setTimeframe('1month')}
              className={`px-3 sm:px-5 py-2 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded ${
                timeframe === '1month'
                  ? 'bg-[#1f6feb] text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
              }`}
            >
              1M
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-3 sm:px-5 py-2 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded ${
                timeframe === 'alltime'
                  ? 'bg-[#1f6feb] text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
              }`}
            >
              ALL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

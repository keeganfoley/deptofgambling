'use client';

import { useEffect, useRef, useState } from 'react';
import type { IChartApi, CandlestickData, Time, HistogramData } from 'lightweight-charts';
import betsData from '@/data/bets.json';
import portfolioData from '@/data/portfolio.json';

type TimeframeType = '1week' | '2weeks' | '1month' | 'alltime';

interface Bet {
  id: number;
  date: string;
  profit: number;
  result: string;
  description: string;
  sport: string;
  stake: number;
  odds: number;
  fund?: string;
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

interface FundChartProps {
  fundKey: string;
  fundColor: string;
}

export default function FundChart({ fundKey, fundColor }: FundChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('alltime');
  const [stats, setStats] = useState({ totalPL: 0, winRate: 0, totalBets: 0, startValue: 0, endValue: 0, roi: 0 });
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Get fund starting balance
  const fundData = (portfolioData.funds as any)[fundKey];
  const startingBalance = fundData?.startingBalance || 10000;

  // Filter bets for this fund (exclude pending bets)
  const fundBets = (betsData as Bet[])
    .filter(bet => bet.fund === fundKey && bet.result !== 'pending' && bet.result !== 'no_action')
    .sort((a, b) => a.date.localeCompare(b.date));

  const hasBets = fundBets.length > 0;

  useEffect(() => {
    if (!chartContainerRef.current || typeof window === 'undefined') return;

    const initChart = async () => {
      const { createChart, CandlestickSeries, HistogramSeries, LineSeries } = await import('lightweight-charts');

      // Clear any existing chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const container = chartContainerRef.current;
      if (!container) return;

      // Create the chart
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
        width: container.clientWidth,
        height: 350,
        crosshair: {
          mode: 0,
          vertLine: {
            width: 1,
            color: fundColor,
            style: 0,
            labelBackgroundColor: fundColor,
          },
          horzLine: {
            color: fundColor,
            labelBackgroundColor: fundColor,
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
            const [year, month, day] = time.toString().split('-').map(Number);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[month - 1]} ${day}`;
          },
        },
      });

      chartRef.current = chart;

      if (!hasBets) {
        // Show flat line at starting balance for funds with no bets
        const lineSeries = chart.addSeries(LineSeries, {
          color: '#6e7681',
          lineWidth: 2,
        });

        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        lineSeries.setData([
          { time: weekAgo as Time, value: startingBalance },
          { time: today as Time, value: startingBalance },
        ]);

        setStats({
          totalPL: 0,
          winRate: 0,
          totalBets: 0,
          startValue: startingBalance,
          endValue: startingBalance,
          roi: 0,
        });

        chart.timeScale().fitContent();
        return;
      }

      // Build daily data from bets
      const betsByDate = new Map<string, Bet[]>();
      fundBets.forEach(bet => {
        const dateKey = bet.date.split('T')[0];
        if (!betsByDate.has(dateKey)) {
          betsByDate.set(dateKey, []);
        }
        betsByDate.get(dateKey)!.push(bet);
      });

      // Generate daily values
      const dates = Array.from(betsByDate.keys()).sort();
      let runningBalance = startingBalance;
      const dailyData: { date: string; value: number }[] = [];

      dates.forEach(date => {
        const dayBets = betsByDate.get(date) || [];
        const dayPL = dayBets.reduce((sum, bet) => sum + bet.profit, 0);
        runningBalance += dayPL;
        dailyData.push({ date, value: runningBalance });
      });

      // Filter by timeframe
      const now = new Date();
      let daysToShow = 365;
      if (timeframe === '1week') daysToShow = 7;
      else if (timeframe === '2weeks') daysToShow = 14;
      else if (timeframe === '1month') daysToShow = 30;

      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
      const cutoffStr = cutoffDate.toISOString().split('T')[0];

      const filteredDailyData = timeframe === 'alltime'
        ? dailyData
        : dailyData.filter(d => d.date >= cutoffStr);

      const filteredBets = timeframe === 'alltime'
        ? fundBets
        : fundBets.filter(b => b.date.split('T')[0] >= cutoffStr);

      // Calculate stats
      if (filteredDailyData.length > 0) {
        const startVal = timeframe === 'alltime' ? startingBalance : (filteredDailyData[0]?.value || startingBalance);
        const endVal = filteredDailyData[filteredDailyData.length - 1].value;
        const pl = endVal - startVal;
        const wins = filteredBets.filter(b => b.result === 'win').length;
        const rate = filteredBets.length > 0 ? (wins / filteredBets.length) * 100 : 0;
        const roiPercent = startVal > 0 ? (pl / startVal) * 100 : 0;

        setStats({
          totalPL: pl,
          winRate: rate,
          totalBets: filteredBets.length,
          startValue: startVal,
          endValue: endVal,
          roi: roiPercent,
        });
      }

      // Add candlestick series
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#3fb950',
        downColor: '#f85149',
        borderVisible: false,
        wickUpColor: '#3fb950',
        wickDownColor: '#f85149',
        lastValueVisible: false,
        priceLineVisible: false,
      });

      const candleData: CandlestickData[] = [];
      const volumeData: HistogramData[] = [];
      const tooltipMap = new Map<string, TooltipData>();

      // Add starting point
      if (filteredDailyData.length > 0) {
        const firstDate = filteredDailyData[0].date;
        const prevDate = new Date(firstDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split('T')[0];

        // Find the balance before the first filtered date
        let prevBalance = startingBalance;
        for (const d of dailyData) {
          if (d.date < firstDate) {
            prevBalance = d.value;
          } else {
            break;
          }
        }

        filteredDailyData.forEach((day, index) => {
          const prevValue = index === 0 ? prevBalance : filteredDailyData[index - 1].value;
          const currentValue = day.value;
          const dayBets = betsByDate.get(day.date) || [];

          let high = Math.max(prevValue, currentValue);
          let low = Math.min(prevValue, currentValue);

          if (dayBets.length > 0) {
            let rv = prevValue;
            let maxV = prevValue;
            let minV = prevValue;
            dayBets.forEach(bet => {
              rv += bet.profit;
              maxV = Math.max(maxV, rv);
              minV = Math.min(minV, rv);
            });
            high = Math.max(high, maxV);
            low = Math.min(low, minV);
          } else {
            const range = Math.abs(currentValue - prevValue);
            const wickSize = range * 0.15 || 15;
            high = Math.max(prevValue, currentValue) + wickSize;
            low = Math.min(prevValue, currentValue) - wickSize;
          }

          const change = currentValue - prevValue;
          const changePercent = prevValue > 0 ? (change / prevValue) * 100 : 0;
          const totalStake = dayBets.reduce((sum, bet) => sum + bet.stake, 0);

          candleData.push({
            time: day.date as Time,
            open: prevValue,
            high,
            low,
            close: currentValue,
          });

          volumeData.push({
            time: day.date as Time,
            value: totalStake * 50,
            color: change >= 0 ? 'rgba(63, 185, 80, 0.5)' : 'rgba(248, 81, 73, 0.5)',
          });

          tooltipMap.set(day.date, {
            date: day.date,
            open: prevValue,
            close: currentValue,
            high,
            low,
            change,
            changePercent,
            betsCount: dayBets.length,
            totalStake,
          });
        });
      }

      candlestickSeries.setData(candleData);

      // Add volume
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        lastValueVisible: false,
        priceLineVisible: false,
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });

      volumeSeries.setData(volumeData);

      // Tooltip
      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) {
          setTooltipData(null);
          return;
        }
        const dateStr = param.time.toString();
        const data = tooltipMap.get(dateStr);
        if (data && container) {
          setTooltipData(data);
          setTooltipPosition({ x: param.point.x, y: param.point.y });
        }
      });

      chart.timeScale().fitContent();

      // Resize handler
      const handleResize = () => {
        if (chartRef.current && container) {
          chartRef.current.applyOptions({ width: container.clientWidth });
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
  }, [timeframe, fundKey, hasBets, startingBalance]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-4 sm:p-6 shadow-lg relative overflow-hidden">
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
          <div className="font-mono text-lg font-bold" style={{ color: fundColor }}>
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
            {hasBets ? `${stats.winRate.toFixed(1)}%` : '-'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        className="w-full relative"
        style={{ minHeight: '350px' }}
      />

      {/* No activity message */}
      {!hasBets && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[#6e7681] text-lg font-mono bg-[#0d1117]/80 px-6 py-3 rounded">
            No activity yet
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltipData && (
        <div
          className="absolute pointer-events-none z-50 bg-[#161b22] border border-[#30363d] rounded-lg p-4 shadow-2xl"
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
            <span className="text-white font-mono text-right">${tooltipData.open.toFixed(2)}</span>
            <span className="text-[#8b949e]">High</span>
            <span className="text-white font-mono text-right">${tooltipData.high.toFixed(2)}</span>
            <span className="text-[#8b949e]">Low</span>
            <span className="text-white font-mono text-right">${tooltipData.low.toFixed(2)}</span>
            <span className="text-[#8b949e]">Close</span>
            <span className="text-white font-mono text-right">${tooltipData.close.toFixed(2)}</span>
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

      {/* Timeframe Toggle */}
      <div className="flex justify-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-[#21262d]">
        {(['1week', '2weeks', '1month', 'alltime'] as TimeframeType[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 sm:px-5 py-2 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded ${
              timeframe === tf
                ? 'text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
            }`}
            style={timeframe === tf ? { backgroundColor: fundColor } : {}}
          >
            {tf === '1week' ? '1W' : tf === '2weeks' ? '2W' : tf === '1month' ? '1M' : 'ALL'}
          </button>
        ))}
      </div>
    </div>
  );
}

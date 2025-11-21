'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createChart, IChartApi, CandlestickData, Time, HistogramData, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import chartDataFile from '@/data/chartData.json';
import betsData from '@/data/bets.json';

interface DailyData {
  date: string;
  value: number;
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

export default function ChartExport() {
  const searchParams = useSearchParams();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [stats, setStats] = useState({ startValue: 0, endValue: 0, roi: 0, winRate: 0, dayNum: 0 });

  // Get date params (e.g., ?date=2025-11-10&start=2025-11-03)
  const endDateParam = searchParams.get('date') || '2025-11-21';
  const startDateParam = searchParams.get('start') || '2025-11-03'; // Default to beginning
  const labelParam = searchParams.get('label') || ''; // e.g., "Week 1" or "Day 5"

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      layout: {
        background: { color: '#0d1117' },
        textColor: '#8b949e',
        fontFamily: "'SF Mono', 'Fira Code', monospace",
      },
      grid: {
        vertLines: { color: '#21262d' },
        horzLines: { color: '#21262d' },
      },
      width: 1080,
      height: 1080,
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
          top: 0.15,
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

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#3fb950',
      downColor: '#f85149',
      borderVisible: false,
      wickUpColor: '#3fb950',
      wickDownColor: '#f85149',
    });

    // Filter data to the specified date range
    const allDailyData = Array.isArray(chartDataFile) ? chartDataFile as DailyData[] : [];
    const allBets = Array.isArray(betsData) ? betsData as Bet[] : [];

    const dailyData = allDailyData.filter(d => d.date >= startDateParam && d.date <= endDateParam);
    const bets = allBets.filter(b => {
      const betDate = b.date.split('T')[0];
      return betDate >= startDateParam && betDate <= endDateParam;
    });

    // Calculate stats
    if (dailyData.length > 0) {
      const startVal = dailyData[0].value;
      const endVal = dailyData[dailyData.length - 1].value;
      const pl = endVal - startVal;
      const wins = bets.filter(b => b.result === 'win').length;
      const rate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
      const roiPercent = startVal > 0 ? (pl / startVal) * 100 : 0;

      // Calculate day number (Nov 3 is day 0, Nov 4 is day 1, etc.)
      const startDate = new Date('2025-11-03');
      const endDate = new Date(endDateParam);
      const dayNumber = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      setStats({
        startValue: startVal,
        endValue: endVal,
        roi: roiPercent,
        winRate: rate,
        dayNum: dayNumber,
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

    dailyData.forEach((day, index) => {
      const prevValue = index > 0 ? dailyData[index - 1].value : day.value;
      const currentValue = day.value;
      const dayBets = betsByDate.get(day.date) || [];

      let high = Math.max(prevValue, currentValue);
      let low = Math.min(prevValue, currentValue);

      if (dayBets.length > 0) {
        let runningValue = prevValue;
        let maxValue = prevValue;
        let minValue = prevValue;

        dayBets.forEach(bet => {
          runningValue += bet.profit;
          maxValue = Math.max(maxValue, runningValue);
          minValue = Math.min(minValue, runningValue);
        });

        high = Math.max(high, maxValue);
        low = Math.min(low, minValue);
      } else {
        const range = Math.abs(currentValue - prevValue);
        const wickSize = range * 0.15 || 15;
        high = Math.max(prevValue, currentValue) + wickSize;
        low = Math.min(prevValue, currentValue) - wickSize;
      }

      const change = currentValue - prevValue;
      const totalStake = dayBets.reduce((sum, bet) => sum + bet.stake, 0);

      candleData.push({
        time: day.date as Time,
        open: prevValue,
        high: high,
        low: low,
        close: currentValue,
      });

      volumeData.push({
        time: day.date as Time,
        value: totalStake * 50,
        color: change >= 0 ? 'rgba(63, 185, 80, 0.5)' : 'rgba(248, 81, 73, 0.5)',
      });
    });

    candlestickSeries.setData(candleData);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [endDateParam]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  return (
    <div className="w-[1080px] h-[1080px] bg-[#0d1117] p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">DEPARTMENT OF GAMBLING</h1>
        <p className="text-[#8b949e] text-lg">
          {labelParam || `Day ${stats.dayNum}`} | {formatDate(endDateParam)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Starting</div>
          <div className="font-mono text-xl font-bold text-white">
            ${stats.startValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Current</div>
          <div className="font-mono text-xl font-bold text-[#58a6ff]">
            ${stats.endValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">ROI</div>
          <div className={`font-mono text-xl font-bold ${stats.roi >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
            {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Win Rate</div>
          <div className="font-mono text-xl font-bold text-white">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="flex-1" />

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-[#6e7681] text-sm">departmentofgambling.com</p>
      </div>
    </div>
  );
}

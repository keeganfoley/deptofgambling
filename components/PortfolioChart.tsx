'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import chartDataFile from '@/data/chartData.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

gsap.registerPlugin(ScrollTrigger);

type TimeframeType = '30days' | '60days' | 'alltime';

export default function PortfolioChart() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('30days');

  useEffect(() => {
    gsap.fromTo(
      chartContainerRef.current,
      { y: 50, opacity: 0 },
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
  }, []);

  // Get data based on timeframe (for now, only 30days is available)
  const data = chartDataFile.thirtyDays;

  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Portfolio Balance',
        data: data.map((item) => item.balance),
        fill: true,
        borderColor: '#4A90E2', // Steel Blue
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(74, 144, 226, 0.2)');
          gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FF0080',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 750,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#0A1F44',
        titleColor: '#FFFFFF',
        bodyColor: '#7CB9E8',
        borderColor: '#4A90E2',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed?.y;
            if (value == null) return '';
            return `$${value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: "'Courier New', monospace",
            size: 11,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(10, 31, 68, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: "'Courier New', monospace",
            size: 12,
          },
          callback: function (value) {
            return `$${(value as number).toLocaleString()}`;
          },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
    },
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
        <div
          ref={chartContainerRef}
          className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-6 md:p-8 shadow-lg opacity-0"
        >
          <Line data={chartData} options={options} />

          {/* Timeframe Toggle */}
          <div className="flex justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setTimeframe('30days')}
              className={`px-4 sm:px-6 py-2 font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                timeframe === '30days'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('60days')}
              className={`px-4 sm:px-6 py-2 font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                timeframe === '60days'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              disabled
            >
              60 Days
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-4 sm:px-6 py-2 font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                timeframe === 'alltime'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
              disabled
            >
              All Time
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

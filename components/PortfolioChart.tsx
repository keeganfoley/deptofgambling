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
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      chartContainerRef.current,
      { y: isMobile ? 20 : 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.5 : 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  // Get data based on timeframe (for now, only 30days is available)
  const data = Array.isArray(chartDataFile) ? chartDataFile : [];

  const chartData = {
    labels: data.map((item) => {
      // Parse date as local time to avoid timezone issues
      const [year, month, day] = item.date.split('-').map(Number);
      return `${month}/${day}`;
    }),
    datasets: [
      {
        label: 'Portfolio Balance',
        data: data.map((item) => item.close),
        fill: true,
        borderColor: '#FF0080', // Magenta
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(255, 0, 128, 0.3)');
          gradient.addColorStop(0.5, 'rgba(255, 0, 128, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 0, 128, 0)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FF0080',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FF0080',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 3,
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
        backgroundColor: 'rgba(10, 31, 68, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FF0080',
        borderWidth: 2,
        padding: 16,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 16,
          family: "'Courier New', monospace",
          weight: 'bold',
        },
        callbacks: {
          label: function (context) {
            const value = context.parsed?.y;
            if (value == null) return '';
            return `Balance: $${value.toLocaleString('en-US', {
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
          display: true,
          color: 'rgba(255, 0, 128, 0.05)',
          lineWidth: 1,
        },
        ticks: {
          color: '#0A1F44',
          font: {
            family: "'Courier New', monospace",
            size: 12,
            weight: 'bold',
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          padding: 8,
        },
        border: {
          display: true,
          color: 'rgba(10, 31, 68, 0.1)',
          width: 2,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 0, 128, 0.08)',
          lineWidth: 1,
        },
        ticks: {
          color: '#0A1F44',
          font: {
            family: "'Courier New', monospace",
            size: 13,
            weight: 'bold',
          },
          callback: function (value) {
            return `$${(value as number).toLocaleString()}`;
          },
          padding: 12,
        },
        border: {
          display: true,
          color: 'rgba(10, 31, 68, 0.1)',
          width: 2,
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
          className="bg-white rounded-sm border-2 border-gray-200 p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.1)] magenta-glow opacity-0"
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

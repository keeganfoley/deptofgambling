'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatPercent, formatRecord } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Map fund keys to logo paths
const fundLogoMap: Record<string, string> = {
  VectorFund: '/logos/vector-logo.png',
  SharpFund: '/logos/sharp-logo.png',
  ContraFund: '/logos/contra-logo.png',
  CatalystFund: '/logos/catalyst-logo.png',
};

interface FundData {
  name: string;
  tagline: string;
  balance: number;
  startingBalance: number;
  netPL: number;
  roi: number;
  record: { wins: number; losses: number; pushes: number };
  winRate: number;
  unitsWon: number;
  color: string;
  status: 'active' | 'deploying';
}

interface FundCardProps {
  fundKey: string;
  fund: FundData;
  index: number;
}

// Map fund keys to URL slugs
const fundSlugMap: Record<string, string> = {
  VectorFund: 'vector',
  SharpFund: 'sharp',
  ContraFund: 'contra',
  CatalystFund: 'catalyst',
};

// Strategy descriptions for each fund
const fundDescriptions: Record<string, string> = {
  VectorFund: 'Identifies mispriced lines using statistical projections. Bets when model edge exceeds market odds.',
  SharpFund: 'Tracks professional betting signals and line movements. Bets align with sharp action indicators.',
  ContraFund: 'Exploits public betting bias on popular teams and primetime games. Bets against extreme public percentages.',
  CatalystFund: 'Captures edges from rest advantages, travel, revenge spots, and weather. Bets on proven situational factors.',
};

export default function FundCard({ fundKey, fund, index }: FundCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      cardRef.current,
      { y: isMobile ? 20 : 40, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: isMobile ? 0.5 : 0.7,
        delay: index * (isMobile ? 0.08 : 0.12),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  const slug = fundSlugMap[fundKey] || 'vector';
  const isDeploying = fund.status === 'deploying';
  const hasActivity = fund.record.wins > 0 || fund.record.losses > 0;

  return (
    <div
      ref={cardRef}
      className="stat-card overflow-hidden opacity-0 group"
      style={{ borderTop: `3px solid ${fund.color}` }}
    >
      {/* Content */}
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src={fundLogoMap[fundKey]}
            alt={`${fund.name} logo`}
            width={200}
            height={200}
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Fund Name, Tagline, and Description */}
        <div className="mb-3 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1" style={{ letterSpacing: '0.02em' }}>
            {fund.name.toUpperCase()}
          </h3>
          <p className="text-sm text-text-muted font-medium">{fund.tagline}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {fundDescriptions[fundKey]}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Balance */}
            <div>
              <div className="data-label text-xs uppercase mb-1">Balance</div>
              <div className="text-lg data-value text-primary mono-number">
                {formatCurrency(fund.balance, false)}
              </div>
            </div>

            {/* Record */}
            <div>
              <div className="data-label text-xs uppercase mb-1">Record (W-L-P)</div>
              <div className="text-lg data-value text-primary mono-number">
                {isDeploying && !hasActivity ? (
                  <span className="text-text-muted italic">Deploying</span>
                ) : (
                  formatRecord(fund.record.wins, fund.record.losses, fund.record.pushes)
                )}
              </div>
            </div>

            {/* Net P/L */}
            <div>
              <div className="data-label text-xs uppercase mb-1">Net P/L</div>
              <div
                className={`text-lg data-value mono-number ${
                  isDeploying && !hasActivity
                    ? 'text-text-muted'
                    : fund.netPL >= 0
                    ? 'text-success'
                    : 'text-loss'
                }`}
              >
                {isDeploying && !hasActivity ? '-' : formatCurrency(fund.netPL)}
              </div>
            </div>

            {/* ROI */}
            <div>
              <div className="data-label text-xs uppercase mb-1">ROI</div>
              <div
                className={`text-lg data-value mono-number ${
                  isDeploying && !hasActivity
                    ? 'text-text-muted'
                    : fund.roi >= 0
                    ? 'text-success'
                    : 'text-loss'
                }`}
              >
                {isDeploying && !hasActivity ? '-' : formatPercent(fund.roi)}
              </div>
            </div>
          </div>
        </div>

        {/* View Fund CTA */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href={`/funds/${slug}`}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 bg-primary hover:bg-primary-light text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 rounded-lg group-hover:shadow-lg"
          >
            <span>View Fund</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

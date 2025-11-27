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

    if (isMobile) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [index]);

  const slug = fundSlugMap[fundKey] || 'vector';
  const isDeploying = fund.status === 'deploying';
  const hasActivity = fund.record.wins > 0 || fund.record.losses > 0;

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-sm overflow-hidden card-float opacity-0"
      style={{ borderLeft: `4px solid ${fund.color}` }}
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
              <div className="data-label text-xs uppercase mb-1">Record</div>
              <div className="text-lg data-value text-primary mono-number">
                {isDeploying && !hasActivity ? (
                  <span className="text-text-muted italic">Deploying</span>
                ) : (
                  formatRecord(fund.record.wins, fund.record.losses)
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
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Link
            href={`/funds/${slug}`}
            className="inline-block w-full text-center px-4 py-2.5 bg-secondary hover:bg-accent text-white font-bold text-sm uppercase tracking-wide transition-all duration-300 rounded-sm"
          >
            View Fund →
          </Link>
        </div>
      </div>
    </div>
  );
}

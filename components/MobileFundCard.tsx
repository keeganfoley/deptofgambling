'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatPercent, formatRecord } from '@/lib/utils';

// Map fund keys to logo paths
const fundLogoMap: Record<string, string> = {
  VectorFund: '/logos/vector-logo.png',
  SharpFund: '/logos/sharp-logo.png',
  ContraFund: '/logos/contra-logo.png',
  CatalystFund: '/logos/catalyst-logo.png',
};

// Map fund keys to URL slugs
const fundSlugMap: Record<string, string> = {
  VectorFund: 'vector',
  SharpFund: 'sharp',
  ContraFund: 'contra',
  CatalystFund: 'catalyst',
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

interface MobileFundCardProps {
  fundKey: string;
  fund: FundData;
}

export default function MobileFundCard({ fundKey, fund }: MobileFundCardProps) {
  const slug = fundSlugMap[fundKey] || 'vector';
  const hasActivity = fund.record.wins > 0 || fund.record.losses > 0;

  return (
    <div
      className="stat-card overflow-hidden"
      style={{ borderTop: `3px solid ${fund.color}` }}
    >
      <div className="p-4">
        {/* Logo - smaller on mobile */}
        <div className="flex justify-center mb-3">
          <Image
            src={fundLogoMap[fundKey]}
            alt={`${fund.name} logo`}
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Fund Name and Tagline */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-primary">{fund.name.toUpperCase()}</h3>
          <p className="text-xs text-gray-500">{fund.tagline}</p>
        </div>

        {/* Stats Grid - 2x2 compact */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase">Balance</div>
            <div className="text-sm font-bold text-primary mono-number">
              {formatCurrency(fund.balance, false)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase">W-L-P</div>
            <div className="text-sm font-bold text-primary mono-number">
              {hasActivity ? formatRecord(fund.record.wins, fund.record.losses, fund.record.pushes) : '-'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase">P/L</div>
            <div className={`text-sm font-bold mono-number ${fund.netPL >= 0 ? 'text-success' : 'text-loss'}`}>
              {hasActivity ? formatCurrency(fund.netPL) : '-'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase">ROI</div>
            <div className={`text-sm font-bold mono-number ${fund.roi >= 0 ? 'text-success' : 'text-loss'}`}>
              {hasActivity ? formatPercent(fund.roi) : '-'}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/funds/${slug}`}
          className="flex items-center justify-center gap-2 mt-3 py-3 bg-primary hover:bg-primary-light text-white font-semibold text-sm rounded-lg transition-all duration-300"
        >
          <span>View Fund</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

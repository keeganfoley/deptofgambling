'use client';

import { formatDateTime } from '@/lib/utils';
import TwitterX from './icons/TwitterX';

export default function Footer() {
  const lastUpdated = new Date().toISOString();

  return (
    <footer className="bg-primary py-16 px-4 grid-background">
      <div className="max-w-6xl mx-auto">
        {/* Top Rule */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent mb-8" />

        {/* Main Content */}
        <div className="text-center mb-8">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            DEPARTMENT OF GAMBLING
          </h3>
          <p className="text-secondary-light text-lg font-semibold mb-4">
            Office of Odds & Wagers
          </p>
          <p className="text-gray-400 italic text-base">
            &ldquo;Systematic. Transparent. Data-Driven.&rdquo;
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <a
            href="#methodology"
            className="text-secondary-light hover:text-accent transition-colors duration-300 font-semibold tracking-wide"
          >
            Methodology
          </a>
          <span className="text-secondary-light opacity-40">|</span>
          <a
            href="#reports"
            className="text-secondary-light hover:text-accent transition-colors duration-300 font-semibold tracking-wide"
          >
            Performance Reports
          </a>
          <span className="text-secondary-light opacity-40">|</span>
          <a
            href="https://x.com/DeptOfGambling"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-light hover:text-accent transition-colors duration-300 font-semibold tracking-wide inline-flex items-center gap-2"
          >
            <TwitterX className="w-4 h-4" />
            <span>@DeptOfGambling</span>
          </a>
        </div>

        {/* Last Updated */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">
            Last Updated: {formatDateTime(lastUpdated)}
          </p>
        </div>

        {/* Bottom Rule */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary-light to-transparent" />
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface SiteHeaderProps {
  transparent?: boolean;
}

export default function SiteHeader({ transparent = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  // Determine the back destination based on current path
  const getBackDestination = () => {
    // If on a bet detail page, go to bets list
    if (pathname.startsWith('/bets/') && pathname !== '/bets') {
      return '/bets';
    }
    // If on a fund detail page, go to home (funds section)
    if (pathname.startsWith('/funds/')) {
      return '/#funds';
    }
    // If on portfolio history, go to home
    if (pathname.startsWith('/portfolio/history')) {
      return '/';
    }
    // If on portfolio breakdown, go to home
    if (pathname.startsWith('/portfolio/breakdown')) {
      return '/';
    }
    // If on bets list, go to home
    if (pathname === '/bets') {
      return '/';
    }
    // Default to home
    return '/';
  };

  const handleBack = () => {
    // Use browser history if available and makes sense
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(getBackDestination());
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent
        ? 'bg-transparent'
        : 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back button (only show when not on home) */}
        <div className="w-24">
          {!isHome && (
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 group ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>

        {/* Center: Logo/Home link */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Department of Gambling"
              width={36}
              height={36}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className={`text-sm sm:text-base font-bold tracking-tight hidden sm:inline transition-colors ${
            transparent ? 'text-white' : 'text-primary'
          }`}>
            DEPT. OF GAMBLING
          </span>
        </Link>

        {/* Right: Quick links */}
        <div className="w-24 flex justify-end">
          {!isHome && (
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 group ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <span>Home</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

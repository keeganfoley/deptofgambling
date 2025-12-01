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
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back button (only show when not on home) */}
        <div className="w-24">
          {!isHome && (
            <button
              onClick={handleBack}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <span>←</span>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>

        {/* Center: Logo/Home link */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Department of Gambling"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className={`text-sm sm:text-base font-bold hidden sm:inline ${
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
              className={`text-sm font-semibold transition-colors ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

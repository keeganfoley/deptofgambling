'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Funds', href: '#funds', isDropdown: true },
  { label: 'Chart', href: '#chart' },
  { label: 'Bets', href: '#bets' },
  { label: 'History', href: '#history' },
  { label: 'Sports', href: '#sports' },
  { label: 'Method', href: '#method' },
  { label: 'Subscribe', href: '#subscribe' },
];

const fundLinks = [
  { label: 'Vector Fund', href: '/funds/vector' },
  { label: 'Sharp Fund', href: '/funds/sharp' },
  { label: 'Contra Fund', href: '/funds/contra' },
  { label: 'Catalyst Fund', href: '/funds/catalyst' },
];

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [fundsDropdownOpen, setFundsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    // Show nav after scrolling past 400px
    const shouldShow = window.scrollY > 400;
    if (shouldShow !== isVisible) {
      setIsVisible(shouldShow);
    }

    // Determine active section
    const sections = navItems.map(item => item.href.slice(1));
    let current = '';

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150) {
          current = section;
        }
      }
    }

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }, [isVisible, activeSection]);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFundsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.slice(1));
    if (element) {
      const offset = 80; // Account for sticky nav height
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pointer-events-auto ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-[#0d1117]/95 backdrop-blur-md border-b border-[#30363d] safe-area-inset">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-start sm:justify-center gap-1 py-2 sm:py-3 overflow-x-auto overflow-y-visible scrollbar-hide">
            {navItems.map((item) => (
              item.isDropdown ? (
                <div key={item.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setFundsDropdownOpen(!fundsDropdownOpen)}
                    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation flex items-center gap-1 ${
                      activeSection === item.href.slice(1) || fundsDropdownOpen
                        ? 'bg-[#1f6feb] text-white'
                        : 'text-[#8b949e] hover:text-white active:bg-[#21262d]'
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${fundsDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {fundsDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg py-1 min-w-[160px] sm:min-w-[180px] z-[100]">
                      {fundLinks.map((fund) => (
                        <Link
                          key={fund.href}
                          href={fund.href}
                          className="block px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                          onClick={() => setFundsDropdownOpen(false)}
                        >
                          {fund.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation ${
                    activeSection === item.href.slice(1)
                      ? 'bg-[#1f6feb] text-white'
                      : 'text-[#8b949e] hover:text-white active:bg-[#21262d]'
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Add global styles for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
        }
      `}</style>
    </nav>
  );
}

'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';

interface AccordionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  badgeColor?: 'green' | 'red' | 'blue' | 'orange';
}

export default function MobileAccordion({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = 'blue'
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;

    if (isOpen) {
      const height = innerRef.current.scrollHeight;
      gsap.to(contentRef.current, {
        height: height,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.25,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <div className="text-left">
            <div className="font-bold text-primary text-sm">{title}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: defaultOpen ? 'auto' : 0 }}>
        <div ref={innerRef} className="px-4 pb-4 pt-2 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

// Horizontal card swiper for funds
interface SwipeCardProps {
  children: ReactNode[];
}

export function MobileSwiper({ children }: SwipeCardProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3" style={{ width: 'max-content' }}>
        {children.map((child, i) => (
          <div key={i} className="w-[280px] flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact stat row for accordions
interface StatRowProps {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'default';
}

export function StatRow({ label, value, color = 'default' }: StatRowProps) {
  const colorClass = color === 'green' ? 'text-success' : color === 'red' ? 'text-loss' : 'text-primary';
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 uppercase">{label}</span>
      <span className={`font-bold mono-number text-sm ${colorClass}`}>{value}</span>
    </div>
  );
}

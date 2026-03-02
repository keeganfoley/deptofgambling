import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import PortfolioStatus from '@/components/PortfolioStatus';
import FundGrid from '@/components/FundGrid';
import StickyNav from '@/components/StickyNav';

// Lazy load below-fold components so they don't block initial render
const CandlestickChart = dynamic(() => import('@/components/CandlestickChart'), { ssr: false });
const RecentBets = dynamic(() => import('@/components/RecentBets'), { ssr: false });
const DailyPerformanceHistory = dynamic(() => import('@/components/DailyPerformanceHistory'), { ssr: false });
const SportBreakdown = dynamic(() => import('@/components/SportBreakdown'), { ssr: false });
const BetTypeBreakdown = dynamic(() => import('@/components/BetTypeBreakdown'), { ssr: false });
const MethodologyTeaser = dynamic(() => import('@/components/MethodologyTeaser'), { ssr: false });
const QuantitativeMetrics = dynamic(() => import('@/components/QuantitativeMetrics'), { ssr: false });
const SystemIntro = dynamic(() => import('@/components/SystemIntro'), { ssr: false });
const TwitterCTA = dynamic(() => import('@/components/TwitterCTA'), { ssr: false });
const EmailSignup = dynamic(() => import('@/components/EmailSignup'), { ssr: false });
const Disclaimer = dynamic(() => import('@/components/Disclaimer'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <StickyNav />
      <Hero />
      <div id="overview"><PortfolioStatus /></div>
      <div id="funds"><FundGrid /></div>
      <div id="chart"><CandlestickChart /></div>
      <div id="bets"><RecentBets /></div>
      <div id="history"><DailyPerformanceHistory /></div>
      <div id="sports"><SportBreakdown /></div>
      <BetTypeBreakdown />
      <div id="method"><MethodologyTeaser /></div>
      <QuantitativeMetrics />
      <SystemIntro />
      <TwitterCTA />
      <div id="subscribe"><EmailSignup /></div>
      <Disclaimer />
      <Footer />
    </main>
  );
}

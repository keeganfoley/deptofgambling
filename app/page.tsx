import Hero from '@/components/Hero';
import SystemIntro from '@/components/SystemIntro';
import PortfolioStatus from '@/components/PortfolioStatus';
import DailyPerformanceHistory from '@/components/DailyPerformanceHistory';
import SportBreakdown from '@/components/SportBreakdown';
import BetTypeBreakdown from '@/components/BetTypeBreakdown';
import RecentBets from '@/components/RecentBets';
import MethodologyTeaser from '@/components/MethodologyTeaser';
import QuantitativeMetrics from '@/components/QuantitativeMetrics';
import CandlestickChart from '@/components/CandlestickChart';
import TwitterCTA from '@/components/TwitterCTA';
import Disclaimer from '@/components/Disclaimer';
import EmailSignup from '@/components/EmailSignup';
import Footer from '@/components/Footer';
import StickyNav from '@/components/StickyNav';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <StickyNav />
      <Hero />
      <div id="overview"><PortfolioStatus /></div>
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

import Hero from '@/components/Hero';
import SystemIntro from '@/components/SystemIntro';
import PortfolioStatus from '@/components/PortfolioStatus';
import SportBreakdown from '@/components/SportBreakdown';
import BetTypeBreakdown from '@/components/BetTypeBreakdown';
import RecentBets from '@/components/RecentBets';
import MethodologyTeaser from '@/components/MethodologyTeaser';
import QuantitativeMetrics from '@/components/QuantitativeMetrics';
import PortfolioChart from '@/components/PortfolioChart';
import TwitterCTA from '@/components/TwitterCTA';
import Disclaimer from '@/components/Disclaimer';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <SystemIntro />
      <TwitterCTA />
      <PortfolioStatus />
      <SportBreakdown />
      <BetTypeBreakdown />
      <RecentBets />
      <MethodologyTeaser />
      <QuantitativeMetrics />
      <PortfolioChart />
      <Disclaimer />
      <Footer />
    </main>
  );
}

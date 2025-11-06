import BankrollMethodology from '@/components/BankrollMethodology';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Methodology | Department of Gambling',
  description: 'The mathematics of disciplined sports betting: bankroll management, expected value, variance, and the Kelly Criterion.',
};

export default function MethodologyPage() {
  return (
    <main className="overflow-x-hidden">
      {/* Back Navigation */}
      <div className="bg-primary py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-white hover:text-accent transition-colors duration-300 flex items-center gap-2 text-sm uppercase tracking-wide font-semibold"
          >
            <span>←</span>
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Methodology Content */}
      <BankrollMethodology />

      {/* Footer */}
      <Footer />
    </main>
  );
}

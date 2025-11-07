'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function EmailSignup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    } else {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://automation.syneticai.com/webhook-test/0f814e17-c16e-4320-b093-4c414ebb138d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFirstName('');
        setLastName('');
        setEmail('');
      } else {
        console.error('Webhook response error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof TypeError ? 'Network/CORS error' : 'Other error'
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="email-signup" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#0a1f44] via-[#061429] to-[#0a1f44] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#c5a572]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#2a4a7c]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div ref={containerRef} className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#c5a572] via-[#d4b886] to-[#c5a572] rounded-2xl sm:rounded-3xl opacity-40 blur-sm" />

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a572]/10 via-transparent to-[#2a4a7c]/10 opacity-50" />

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4b886] to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4b886] to-[#f4e4c1]">
                  Deeper Breakdowns + Better Edges
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-200 text-center mb-8">
                Coming soon. Put your email in so you don&apos;t miss them.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4b886] focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4b886] focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4b886] focus:border-transparent transition-all backdrop-blur-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 bg-gradient-to-r from-[#c5a572] to-[#d4b886] text-[#0a1f44] font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(212,184,134,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Early Access'}
                </button>
              </form>

              {submitStatus === 'success' && (
                <p className="mt-4 text-center text-[#d4b886] font-semibold">
                  Thanks! We&apos;ll keep you posted.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="mt-4 text-center text-red-400 font-semibold">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>

            {/* Bottom shine */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-16 h-16 border-t-2 border-l-2 border-[#d4b886]/50 rounded-tl-2xl sm:rounded-tl-3xl" />
          <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-2 border-r-2 border-[#d4b886]/50 rounded-br-2xl sm:rounded-br-3xl" />
        </div>
      </div>
    </section>
  );
}

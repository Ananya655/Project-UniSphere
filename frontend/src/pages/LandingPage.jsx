import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import WhatIsUniSphere from '../components/landing/WhatIsUniSphere';
import HowItWorks from '../components/landing/HowItWorks';
import StackSection from '../components/landing/StackSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, initializing, openAuthModal } = useAuth();

  useEffect(() => {
    const auth = searchParams.get('auth');
    if (auth === 'login' || auth === 'register') {
      openAuthModal(auth);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, openAuthModal, setSearchParams]);

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [initializing, isAuthenticated, navigate]);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.landing-page .reveal:not(.in-view)');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, [initializing, isAuthenticated]);

  if (initializing) {
    return (
      <div className="auth-loading" style={{ background: 'var(--paper)' }}>
        <div className="auth-loading-spinner" style={{ borderTopColor: 'var(--navy)' }} />
        <p style={{ color: 'var(--ink-soft)' }}>Loading UniSphere…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <ProblemSection />
      <WhatIsUniSphere />
      <HowItWorks />
      <StackSection />
      <CtaSection />
      <Footer />
      <AuthModal />
    </div>
  );
}

export default LandingPage;

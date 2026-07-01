import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import WhatIsUniSphere from '../components/landing/WhatIsUniSphere';
import HowItWorks from '../components/landing/HowItWorks';
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

  if (initializing) {
    return (
      <div className="auth-loading" style={{ background: 'var(--paper)' }}>
        <div className="auth-loading-spinner" style={{ borderTopColor: 'var(--indigo)' }} />
        <p style={{ color: 'var(--slate)' }}>Loading UniSphere…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <WhatIsUniSphere />
      <HowItWorks />
      <Footer />
      <AuthModal />
    </>
  );
}

export default LandingPage;

import { useAuth } from '../../context/AuthContext';

function Hero() {
  const { openAuthModal } = useAuth();

  return (
    <header className="hero">
      <div className="hero-blob" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Built by students, for students</span>
            <h1>
              Every senior&apos;s
              <br />
              notes, in <em>one place.</em>
            </h1>
            <p className="hero-sub">
              UniSphere is where engineering students share notes, question papers, and answers — so
              nobody has to start from a blank page before an exam again.
            </p>
            <div className="hero-cta">
              <button
                type="button"
                className="btn btn-coral"
                onClick={() => openAuthModal('register')}
              >
                Join your campus ↗
              </button>
              <a href="#how" className="btn btn-ghost">
                See how it works
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">12k+</div>
                <div className="hero-stat-label">Resources shared</div>
              </div>
              <div>
                <div className="hero-stat-num">340</div>
                <div className="hero-stat-label">Colleges</div>
              </div>
              <div>
                <div className="hero-stat-num">98%</div>
                <div className="hero-stat-label">Doubts answered</div>
              </div>
            </div>
          </div>

          <div className="hero-stack" aria-hidden="true">
            <div className="note-card note-card-1">
              <span className="note-tag t-indigo">Notes · Sem 5</span>
              <div className="note-title">DBMS Unit 3 — Normalization</div>
              <div className="note-meta">Uploaded by Aarav K. · CSE</div>
            </div>
            <div className="note-card note-card-2">
              <span className="note-tag t-coral">PYQ · 2024</span>
              <div className="note-title">Operating Systems End-Sem</div>
              <div className="note-meta">Uploaded by Priya S. · IT</div>
            </div>
            <div className="note-card note-card-3">
              <span className="note-tag t-dark">Query · Resolved</span>
              <div className="note-title">Why is 3NF needed here?</div>
              <div className="note-thread">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="#9A9AC0"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>6 answers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

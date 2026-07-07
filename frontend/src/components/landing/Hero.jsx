import { useAuth } from '../../context/AuthContext';

const feedRows = [
  {
    dot: 'up',
    text: (
      <>
        <b>DBMS Unit 3 — Normalization.pdf</b> uploaded to CS301
      </>
    ),
    tag: 'resource · branch: CSE',
  },
  {
    dot: 'qr',
    text: (
      <>
        Query resolved — <b>&quot;Why is 3NF needed here?&quot;</b>
      </>
    ),
    tag: '2 answers · DBMS notes',
  },
  {
    dot: 'ds',
    text: (
      <>
        Discussion gaining traction in <b>#placement</b>
      </>
    ),
    tag: '14 comments · ▲ 22',
  },
  {
    dot: 'up',
    text: (
      <>
        <b>EC204 — Previous Year Papers 2024.pdf</b> uploaded
      </>
    ),
    tag: 'resource · branch: ECE',
  },
  {
    dot: 'qr',
    text: (
      <>
        New query — <b>&quot;Doubt in transistor biasing&quot;</b>
      </>
    ),
    tag: 'awaiting answers',
  },
  {
    dot: 'ds',
    text: (
      <>
        New thread in <b>#exam-prep</b> — semester 5 strategy
      </>
    ),
    tag: '6 comments · ▲ 9',
  },
];

function Hero() {
  const { openAuthModal } = useAuth();

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow reveal in-view">Learn Ask Share Grow</span>
          <h1 className="reveal in-view reveal-delay-1">
            Every note your branch has ever shared, <span className="accent">in one search bar.</span>
          </h1>
          <p className="lead reveal in-view reveal-delay-2">
            Notes, previous year papers and reference material — filtered by branch and semester, with a
            doubt thread on every file and a discussion board for everything that isn&apos;t.
          </p>
          <div className="hero-actions reveal in-view reveal-delay-3">
            <button type="button" className="btn btn-lime" onClick={() => openAuthModal('register')}>
              Get started — it&apos;s free
            </button>
            <a href="#how" className="btn btn-ghost-dark">
              See how it works
            </a>
          </div>
          {/* <div className="hero-meta reveal in-view reveal-delay-3">
            <div>
              <strong>3</strong>
              resource types
            </div>
            <div>
              <strong>10MB</strong>
              PDF uploads
            </div>
            <div>
              <strong>1</strong>
              thread per resource
            </div>
          </div> */}
        </div>

        <div className="reveal in-view reveal-delay-2">
          <div className="device">
            <div className="device-bar">
              <div className="device-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="device-url mono">unisphere.app/activity</div>
            </div>
            <div className="feed">
              <div className="feed-track">
                {[...feedRows, ...feedRows].map((row, index) => (
                  <div key={index} className="feed-row">
                    <span className={`feed-dot ${row.dot}`} />
                    <div>
                      <div className="feed-text">{row.text}</div>
                      <div className="feed-tag mono">{row.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-tags">
            <span className="htag">branch: CSE</span>
            <span className="htag">semester: 5</span>
            <span className="htag">type: PYQ</span>
            <span className="htag">status: resolved</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

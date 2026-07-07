const features = [
  {
    iconBg: 'var(--sky-soft)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 4h11l5 5v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
          stroke="#91766E"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M15 4v5h5" stroke="#91766E" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="#91766E" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Resource library',
    description:
      'Notes, previous year question papers and reference material — filtered by branch, semester, subject and type, sorted newest first.',
  },
  {
    iconBg: '#eae5e1',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 12c0 4.4-4 8-9 8-1.2 0-2.4-.2-3.4-.6L3 20l1.1-4.2A7.9 7.9 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z"
          stroke="#B7A7A9"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M8 11.5h8M8 8.5h5" stroke="#B7A7A9" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Resource queries',
    description:
      'Every upload has its own doubt thread. Ask right where the confusion is, get answered by whoever\'s already worked through it, then mark it resolved.',
  },
  {
    iconBg: 'var(--coral-soft)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2" stroke="#000000" strokeWidth="1.6" />
      </svg>
    ),
    title: 'Discussion forum',
    description:
      'Threads that live beyond a single file — exam prep, internships, placements and everything else worth asking your whole batch.',
  },
];

function WhatIsUniSphere() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow on-light">What&apos;s inside</span>
          <h2>One place for resources, doubts and discussion.</h2>
          <p>
            Built as three connected modules — so a resource, the question it raises, and the wider
            conversation never get separated.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`feature-card reveal${index === 1 ? ' reveal-delay-1' : index === 2 ? ' reveal-delay-2' : ''}`}
            >
              <div className="feature-icon" style={{ background: feature.iconBg }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatIsUniSphere;

const features = [
  {
    id: 'upload',
    iconBg: 'bg-1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z"
          stroke="#1E3FCC"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M13 3v5h5" stroke="#1E3FCC" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="#1E3FCC" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Notes & question papers',
    description:
      "Search by branch, semester, and subject to find notes, PYQs, and reference material uploaded by students who've already taken the course.",
  },
  {
    iconBg: 'bg-2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          stroke="#E54F2E"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Resource-linked doubts',
    description:
      "Stuck on a specific note or paper? Ask right next to it. Anyone who's solved that exact problem before can answer.",
  },
  {
    id: 'discussions',
    iconBg: 'bg-3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M17 20h5v-2a4 4 0 0 0-3-3.87"
          stroke="#2A6B3F"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20H4v-2a4 4 0 0 1 3-3.87"
          stroke="#2A6B3F"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="#2A6B3F" strokeWidth="1.6" />
        <path
          d="M19 7a4 4 0 0 1-3.5 3.97"
          stroke="#2A6B3F"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Community discussions',
    description:
      'Beyond coursework — ask about internships, placements, and exam strategy in an open forum upvoted by your peers.',
  },
];

function WhatIsUniSphere() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">What is UniSphere</span>
          <h2>
            A campus library that
            <br />
            never closes.
          </h2>
          <p>
            Most college knowledge lives in scattered WhatsApp groups and forgotten drives. UniSphere
            puts it all in one searchable, organized place — built around how engineering students
            actually study.
          </p>
        </div>

        <div className="what-grid">
          {features.map((feature) => (
            <div key={feature.title} className="what-card" id={feature.id}>
              <div className={`what-icon ${feature.iconBg}`}>{feature.icon}</div>
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

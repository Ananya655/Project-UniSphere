const steps = [
  {
    num: '01',
    title: 'Create your profile',
    description: 'Sign up with your college, branch, and year so results are relevant from day one.',
  },
  {
    num: '02',
    title: 'Search or upload',
    description: 'Find notes and PYQs by subject and semester, or share your own to help the next batch.',
  },
  {
    num: '03',
    title: 'Ask your doubts',
    description: "Post a question right beside the resource it's about. Seniors and peers chime in.",
  },
  {
    num: '04',
    title: 'Join the discussion',
    description: 'Talk placements, internships, and exam prep in the open community forum.',
  },
];

function HowItWorks() {
  return (
    <section className="section section-paper" id="how">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">How it works</span>
          <h2>
            From blank page to
            <br />
            exam-ready, in four steps.
          </h2>
        </div>

        <div className="how-row">
          {steps.map((step) => (
            <div key={step.num} className="how-step">
              <div className="how-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

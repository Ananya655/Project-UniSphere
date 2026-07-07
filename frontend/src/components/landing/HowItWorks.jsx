// import { useEffect, useRef } from 'react';

// const steps = [
//   {
//     num: '01 / 05',
//     title: 'Create your profile',
//     description:
//       'Sign up with your college, branch and current year, so the resources you see are already relevant to your course.',
//   },
//   {
//     num: '02 / 05',
//     title: 'Search or upload a resource',
//     description:
//       'Find notes, PYQs or reference material by branch, semester and subject — or upload your own PDF for the batch.',
//   },
//   {
//     num: '03 / 05',
//     title: 'Ask a query on it',
//     description:
//       'Stuck on something inside the PDF? Post the question right where the resource lives, not in a separate chat.',
//   },
//   {
//     num: '04 / 05',
//     title: 'Get answers, mark it resolved',
//     description:
//       "Anyone who's solved it can answer. Once you're satisfied, close the loop — so the next person sees it's settled.",
//   },
//   {
//     num: '05 / 05',
//     title: 'Join the wider discussion',
//     description:
//       "Branch-wide threads for exam prep, internships and placements — for everything that isn't tied to one file.",
//   },
// ];

// const panels = [
//   {
//     url: 'unisphere.app/profile',
//     content: (
//       <div className="panel-body">
//         <span className="row-tag mono" style={{ background: 'rgba(90,141,255,0.15)', color: 'var(--sky)' }}>
//           PROFILE
//         </span>
//         <div className="divider" />
//         <div className="field filled">Name — Aditi Rao</div>
//         <div className="field filled">College — RV College of Engineering</div>
//         <div className="field filled">Branch — Computer Science</div>
//         <div className="field">Current year — 3</div>
//       </div>
//     ),
//   },
//   {
//     url: 'unisphere.app/resources?subject=dbms',
//     content: (
//       <div className="panel-body">
//         <span className="row-tag mono" style={{ background: 'rgba(207,255,77,0.15)', color: 'var(--lime)' }}>
//           DBMS · SEM 5
//         </span>
//         <div className="divider" />
//         <div className="field filled mono">search: &quot;normalization&quot;</div>
//         <div className="field">Unit 3 Notes — Normalization.pdf</div>
//         <div className="field">2023 PYQ — DBMS End Sem.pdf</div>
//         <div className="field">Reference — Elmasri Ch.14.pdf</div>
//       </div>
//     ),
//   },
//   {
//     url: 'unisphere.app/resources/482/queries',
//     content: (
//       <div className="panel-body">
//         <span className="row-tag mono" style={{ background: 'rgba(90,141,255,0.15)', color: 'var(--sky)' }}>
//           NEW QUERY
//         </span>
//         <div className="divider" />
//         <div className="field filled">On: Normalization — Unit 3 Notes</div>
//         <div className="thread-line">
//           <div className="avatar" />
//           <div className="bubble">Why is 3NF required if we already applied 2NF here?</div>
//         </div>
//       </div>
//     ),
//   },
//   {
//     url: 'unisphere.app/queries/128',
//     content: (
//       <div className="panel-body">
//         <span className="row-tag mono" style={{ background: 'rgba(90,141,255,0.15)', color: 'var(--sky)' }}>
//           2 ANSWERS
//         </span>
//         <div className="divider" />
//         <div className="thread-line">
//           <div className="avatar" />
//           <div className="bubble">2NF only removes partial dependency — 3NF removes transitive ones too.</div>
//         </div>
//         <div className="thread-line">
//           <div className="avatar" />
//           <div className="bubble">Check slide 12, the example makes it click.</div>
//         </div>
//         <span className="resolve-pill">Marked resolved</span>
//       </div>
//     ),
//   },
//   {
//     url: 'unisphere.app/discussions?category=placement',
//     content: (
//       <div className="panel-body">
//         <span className="row-tag mono" style={{ background: 'rgba(255,92,77,0.15)', color: 'var(--coral)' }}>
//           PLACEMENT
//         </span>
//         <div className="divider" />
//         <div className="field filled">On-campus prep — where to start?</div>
//         <div className="thread-line">
//           <div className="avatar" />
//           <div className="bubble">Start with DBMS + OS basics, that&apos;s 70% of the interviews.</div>
//         </div>
//         <div className="feed-tag mono" style={{ marginTop: '14px' }}>
//           14 comments · ▲ 22
//         </div>
//       </div>
//     ),
//   },
// ];

// function HowItWorks() {
//   const stepsRef = useRef([]);
//   const panelsRef = useRef([]);
//   const railFillRef = useRef(null);

//   useEffect(() => {
//     const stepEls = stepsRef.current.filter(Boolean);
//     const panelEls = panelsRef.current.filter(Boolean);
//     const n = stepEls.length;

//     if (n === 0) return undefined;

//     const setActive = (index) => {
//       stepEls.forEach((step, i) => {
//         step.classList.toggle('active', i === index);
//       });
//       panelEls.forEach((panel, i) => {
//         panel.classList.toggle('active', i === index);
//       });
//     };

//     setActive(0);

//     let ticking = false;

//     const updateProgress = () => {
//       ticking = false;
//       const viewportCenter = window.innerHeight * 0.5;
//       let progress = 0;

//       const centers = stepEls.map((step) => {
//         const rect = step.getBoundingClientRect();
//         return rect.top + rect.height / 2;
//       });

//       if (centers[0] > viewportCenter) {
//         progress = 0;
//       } else if (centers[n - 1] <= viewportCenter) {
//         progress = n - 1;
//       } else {
//         for (let i = 0; i < n - 1; i += 1) {
//           if (centers[i] <= viewportCenter && centers[i + 1] > viewportCenter) {
//             const span = centers[i + 1] - centers[i];
//             const frac = span > 0 ? (viewportCenter - centers[i]) / span : 0;
//             progress = i + frac;
//             break;
//           }
//         }
//       }

//       const active = Math.round(progress);
//       setActive(Math.min(n - 1, Math.max(0, active)));

//       if (railFillRef.current) {
//         const pct = (progress / (n - 1)) * 100;
//         railFillRef.current.style.height = `${Math.min(100, Math.max(0, pct))}%`;
//       }
//     };

//     const onScroll = () => {
//       if (!ticking) {
//         window.requestAnimationFrame(updateProgress);
//         ticking = true;
//       }
//     };

//     window.addEventListener('scroll', onScroll, { passive: true });
//     window.addEventListener('resize', onScroll);
//     updateProgress();

//     return () => {
//       window.removeEventListener('scroll', onScroll);
//       window.removeEventListener('resize', onScroll);
//     };
//   }, []);

//   return (
//     <section className="how section" id="how">
//       <div className="wrap">
//         <div className="section-head on-dark reveal">
//           <span className="eyebrow">Walkthrough</span>
//           <h2>How it actually works.</h2>
//           <p>From setting up your profile to closing a doubt — five steps, scroll through them.</p>
//         </div>

//         <div className="how-layout">
//           <div className="rail">
//             <div className="rail-line">
//               <div className="rail-fill" ref={railFillRef} />
//             </div>
//             <div className="steps-col">
//               {steps.map((step, index) => (
//                 <div
//                   key={step.num}
//                   className="step"
//                   data-step={index}
//                   ref={(el) => {
//                     stepsRef.current[index] = el;
//                   }}
//                 >
//                   <span className="step-num mono">{step.num}</span>
//                   <h3>{step.title}</h3>
//                   <p>{step.description}</p>
//                   <div className="step-inline" />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="visual-col">
//             <div className="visual-sticky">
//               <div className="visual-frame">
//                 {panels.map((panel, index) => (
//                   <div
//                     key={panel.url}
//                     className={`step-panel${index === 0 ? ' active' : ''}`}
//                     data-panel={index}
//                     ref={(el) => {
//                       panelsRef.current[index] = el;
//                     }}
//                   >
//                     <div className="device" style={{ height: '100%' }}>
//                       <div className="device-bar">
//                         <div className="device-dots">
//                           <span />
//                           <span />
//                           <span />
//                         </div>
//                         <div className="device-url mono">{panel.url}</div>
//                       </div>
//                       {panel.content}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HowItWorks;


import { useState } from "react";
import "./HowItWorks.css";

const steps = [
  {
    num: "01",
    title: "Create your profile",
    description:
      "Sign up with your college, branch and current year so every resource is relevant from day one.",
  },
  {
    num: "02",
    title: "Search or upload",
    description:
      "Browse notes, previous year papers and reference books — or upload your own for the batch.",
  },
  {
    num: "03",
    title: "Ask a query",
    description:
      "Ask a doubt directly on the resource it belongs to, so everyone searching later benefits too.",
  },
  {
    num: "04",
    title: "Get answers",
    description:
      "Receive answers from seniors and classmates, then mark the one that solved it as resolved.",
  },
  {
    num: "05",
    title: "Join discussions",
    description:
      "Talk internships, placements and exam prep — everything that isn't tied to one file.",
  },
];

const screens = [
  {
    url: "unisphere.app/profile",
    content: (
      <>
        <div className="screenField">Name — Aditi Rao</div>
        <div className="screenField">College — RV College of Engineering</div>
        <div className="screenField">Branch — Computer Science</div>
        <div className="screenField">Current year — 3</div>
      </>
    ),
  },
  {
    url: "unisphere.app/resources?subject=dbms",
    content: (
      <>
        <div className="screenField">Unit 3 Notes — Normalization.pdf</div>
        <div className="screenField">2023 PYQ — DBMS End Sem.pdf</div>
        <div className="screenField">Reference — Elmasri Ch.14.pdf</div>
        <div className="screenField accent">+ Upload a resource</div>
      </>
    ),
  },
  {
    url: "unisphere.app/resources/482/queries",
    content: (
      <>
        <div className="chatBubble">Why is 3NF required after applying 2NF?</div>
      </>
    ),
  },
  {
    url: "unisphere.app/queries/128",
    content: (
      <>
        <div className="chatBubble">Because a transitive dependency still exists.</div>
        <div className="chatBubble">Check Unit 3, page 18 — the example makes it click.</div>
        <span className="resolvedTag">✓ Marked resolved</span>
      </>
    ),
  },
  {
    url: "unisphere.app/discussions?category=placement",
    content: (
      <>
        <div className="chatBubble">What should I prep for the Amazon OA?</div>
        <div className="chatBubble">Start with DSA + DBMS + OS, that covers most of it.</div>
        <div className="discussionFooter">▲ 42 upvotes · 18 replies</div>
      </>
    ),
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="howSection" id="how">
      <div className="howHeading">
        <span className="eyebrow">Walkthrough</span>
        <h2>How UniSphere works</h2>
        <p>Five steps from signing up to collaborating with your college community.</p>
      </div>

      <div className="howTabs" role="tablist" aria-label="How it works steps">
        {steps.map((step, index) => (
          <button
            key={step.num}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`howTab ${active === index ? "howTabActive" : ""}`}
            onClick={() => setActive(index)}
          >
            <span className="howTabNum">{step.num}</span>
            <span className="howTabTitle">{step.title}</span>
          </button>
        ))}
      </div>

      <div className="howPanel">
        <div className="howInfo" key={`info-${active}`}>
          <span className="howInfoNum">{steps[active].num} / 05</span>
          <h3>{steps[active].title}</h3>
          <p>{steps[active].description}</p>
        </div>

        <div className="howPreview">
          <div className="browser" key={`preview-${active}`}>
            <div className="browserTop">
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="browserURL">{screens[active].url}</div>
            </div>
            <div className="browserBody">{screens[active].content}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
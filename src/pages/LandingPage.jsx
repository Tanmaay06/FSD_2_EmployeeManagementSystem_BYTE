import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import {
  IconUsers, IconShield, IconSearch, IconServer,
  IconZap, IconBarChart, IconCheck, IconDatabase,
  IconSmartphone, IconGlobe, IconGithub, IconLinkedin, IconMail,
  IconCheckCircle, IconArrowRight,
} from '../components/Icons';

/* ── Animated counter ── */
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(easeOut(p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Intersection / reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ── Data ── */
const FEATURES = [
  {
    icon:  <IconUsers size={24} strokeWidth={1.75} />,
    color: '--blue',
    title: 'Employee Records',
    desc:  'Full CRUD operations — create, view, update, and delete employee data with real-time Firestore sync.',
  },
  {
    icon:  <IconShield size={24} strokeWidth={1.75} />,
    color: '--purple',
    title: 'Secure Admin Auth',
    desc:  'Firebase Auth with Firestore role checks ensures only admins can access or modify records.',
  },
  {
    icon:  <IconSearch size={24} strokeWidth={1.75} />,
    color: '--green',
    title: 'Search & Filter',
    desc:  'Instant search by name, email, or position. Filter by department and status across your workforce.',
  },
  {
    icon:  <IconServer size={24} strokeWidth={1.75} />,
    color: '--orange',
    title: 'Real-time Firestore',
    desc:  'All data persists in Cloud Firestore with server-side security rules enforcing access at the DB level.',
  },
];

const STATS = [
  { label: 'Employees Managed', value: 500, suffix: '+',   icon: <IconUsers  size={28} strokeWidth={1.5} /> },
  { label: 'Data Security',     value: 100, suffix: '%',   icon: <IconShield size={28} strokeWidth={1.5} /> },
  { label: 'Uptime',            value: 99,  suffix: '.9%', icon: <IconZap    size={28} strokeWidth={1.5} /> },
];

const STEPS = [
  { n: '01', title: 'Admin Logs In',     desc: 'Firebase Email/Password authentication with Firestore role verification — only admins get access.' },
  { n: '02', title: 'Manage Employees',  desc: 'Create, view, edit, and delete employee records. Changes sync to Firestore in real time.' },
  { n: '03', title: 'Security Enforced', desc: 'Firestore Security Rules block all unauthorised access at the database level — zero client trust.' },
];

const TRUST_ITEMS = [
  { icon: <IconShield    size={13} strokeWidth={2} />, label: 'Role-based auth'    },
  { icon: <IconZap       size={13} strokeWidth={2} />, label: 'Real-time sync'      },
  { icon: <IconSmartphone size={13} strokeWidth={2} />, label: 'Fully responsive'  },
];

const MOCK_EMPLOYEES = [
  ['PS', 'Priya Sharma',  'Engineering', 'Active'],
  ['AM', 'Arjun Mehta',  'Product',     'Active'],
  ['DN', 'Divya Nair',   'Design',      'Active'],
  ['AJ', 'Amit Joshi',   'Sales',       'Inactive'],
];

function StatCounter({ value, suffix, label, icon, start }) {
  const count = useCounter(value, 1600, start);
  return (
    <div className="lp-stat">
      <div className="lp-stat__icon">{icon}</div>
      <div className="lp-stat__value">{count}{suffix}</div>
      <div className="lp-stat__label">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const featureRefs = [useReveal(), useReveal(), useReveal(), useReveal()];
  const howRefs    = [useReveal(), useReveal(), useReveal()];

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp">
      {/* ── Hero ── */}
      <header className="lp-hero">
        <div className="lp-hero__orbs" aria-hidden="true">
          <div className="orb orb--1" /><div className="orb orb--2" />
          <div className="orb orb--3" /><div className="orb orb--4" />
        </div>

        {/* Navbar */}
        <nav className="lp-nav" aria-label="Main navigation">
          <Link to="/" className="lp-nav__brand" aria-label="EMSPro home">
            <div className="lp-nav__logo">
              <IconUsers size={18} color="#fff" strokeWidth={2} />
            </div>
            <span className="lp-nav__brand-text">EMS<strong>Pro</strong></span>
          </Link>
          <div className="lp-nav__right">
            <button className="lp-nav__link" onClick={scrollTo('features')}>Features</button>
            <button className="lp-nav__link" onClick={scrollTo('how-heading')}>How it works</button>
            <Link to="/login" className="btn btn--white btn--sm" id="nav-sign-in">Sign In</Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="lp-hero__content">
          <div className="lp-hero__text">
            <div className="lp-badge">
              <div className="lp-badge__dot" aria-hidden="true" />
              AVIP 2026 · Task 2
            </div>
            <h1 className="lp-hero__headline">
              Manage Your Workforce,<br />
              <span className="lp-highlight">Effortlessly</span>
            </h1>
            <p className="lp-hero__sub">
              A secure, real-time Employee Management System built with React and Firebase.
              Admin-only CRUD, role-based access control, and a clean modern interface.
            </p>
            <div className="lp-hero__ctas">
              <Link to="/login" className="btn btn--primary btn--xl" id="hero-get-started">
                Get Started <IconArrowRight size={16} />
              </Link>
              <button onClick={scrollTo('features')} className="btn btn--xl lp-btn-outline-light">
                Learn More
              </button>
            </div>
            <div className="lp-hero__trust" aria-label="Feature highlights">
              {TRUST_ITEMS.map((item, i) => (
                <span className="lp-trust-item" key={item.label}>
                  {item.icon} {item.label}
                  {i < TRUST_ITEMS.length - 1 && <span className="lp-trust-sep" aria-hidden="true" />}
                </span>
              ))}
            </div>
          </div>

          {/* Mock dashboard window */}
          <div className="lp-hero__mockup-wrap">
            <div className="lp-hero__mockup" aria-label="Dashboard preview">
              <div className="mock-window" role="img" aria-label="EMS Dashboard screenshot">
                <div className="mock-window__bar" aria-hidden="true">
                  <span className="mock-dot mock-dot--red" />
                  <span className="mock-dot mock-dot--yellow" />
                  <span className="mock-dot mock-dot--green" />
                  <div className="mock-window__title">EMS Dashboard</div>
                  <div className="mock-window__actions">
                    <div className="mock-window__action-dot" />
                    <div className="mock-window__action-dot" />
                  </div>
                </div>
                <div className="mock-window__body" aria-hidden="true">
                  <div className="mock-kpi-row">
                    {[['48','Total'],['42','Active'],['6','Inactive'],['8','Depts']].map(([v,l]) => (
                      <div className="mock-kpi" key={l}>
                        <div className="mock-kpi__val">{v}</div>
                        <div className="mock-kpi__lbl">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mock-bar-area">
                    <div className="mock-bar-title">Department Breakdown</div>
                    <div className="mock-bar-group">
                      {[['Engineering','--a','18'],['Product','--b','12'],['Design','--c','8']].map(([d,cls,n]) => (
                        <div className="mock-bar-item" key={d}>
                          <div className="mock-bar-label">{d}</div>
                          <div className="mock-bar-track"><div className={`mock-bar-fill mock-bar-fill${cls}`} /></div>
                          <div className="mock-bar-count">{n}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mock-table-header"><span>Name</span><span>Dept</span><span>Status</span></div>
                  {MOCK_EMPLOYEES.map(([initials, name, dept, status]) => (
                    <div key={name} className="mock-table-row">
                      <span className="mock-name">
                        <span className="mock-avatar">{initials}</span>{name}
                      </span>
                      <span className="mock-dept">{dept}</span>
                      <span className={`mock-status mock-status--${status.toLowerCase()}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="mock-float-badge" aria-hidden="true">
              <div className="mock-float-badge__icon">
                <IconCheckCircle size={18} color="var(--success)" strokeWidth={2} />
              </div>
              <div className="mock-float-badge__text">
                <strong>Employee Added</strong>
                <span>Just now — real-time sync</span>
              </div>
            </div>
            <div className="mock-float-badge-2" aria-hidden="true">
              <IconShield size={14} color="#fff" /> Secured by Firebase
            </div>
          </div>
        </div>
      </header>

      {/* ── Features ── */}
      <section id="features" className="lp-features" aria-labelledby="features-heading">
        <div className="lp-section-label">Features</div>
        <h2 id="features-heading" className="lp-section-title">Everything you need to manage your team</h2>
        <p className="lp-section-sub">
          Built with a Firebase backend secured by production-grade Firestore rules — enterprise-ready from day one.
        </p>
        <div className="lp-features__grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={featureRefs[i]}
              className="lp-feature-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`lp-feature-card__icon lp-feature-card__icon${f.color}`}>{f.icon}</div>
              <h3 className="lp-feature-card__title">{f.title}</h3>
              <p className="lp-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats" ref={statsRef} aria-label="Platform statistics">
        <div className="lp-stats__inner">
          {STATS.map(s => (
            <StatCounter key={s.label} {...s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-how" aria-labelledby="how-heading">
        <div className="lp-section-label">How it works</div>
        <h2 id="how-heading" className="lp-section-title">Simple. Secure. Scalable.</h2>
        <p className="lp-section-sub" style={{ margin: '0 auto .875rem', textAlign: 'center' }}>
          Three steps from login to fully managing your workforce.
        </p>
        <div className="lp-how__steps">
          {STEPS.map((s, i) => (
            <div key={s.n} ref={howRefs[i]} className="lp-step reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="lp-step__connector" aria-hidden="true" />
              <div className="lp-step__num-wrap"><div className="lp-step__num">{s.n}</div></div>
              <h3 className="lp-step__title">{s.title}</h3>
              <p className="lp-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta" aria-labelledby="cta-heading">
        <div className="lp-cta__inner">
          <h2 id="cta-heading">Ready to get started?</h2>
          <p>Sign in with your admin account to access the dashboard and start managing your team.</p>
          <div className="lp-cta__btns">
            <Link to="/login" className="btn btn--white btn--xl" id="cta-login-btn">
              Sign In to Dashboard <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand-col">
            <div className="lp-footer__brand">
              <div className="lp-footer__brand-logo">
                <IconUsers size={16} color="#fff" strokeWidth={2} />
              </div>
              EMS<strong>Pro</strong>
            </div>
            <p className="lp-footer__tagline">Modern employee management, powered by Firebase.</p>
          </div>
          <div className="lp-footer__links-col">
            <h4>Navigation</h4>
            <div className="lp-footer__links">
              <Link to="/login">Admin Login</Link>
              <a href="#features" onClick={scrollTo('features')}>Features</a>
              <a href="#how-heading" onClick={scrollTo('how-heading')}>How it works</a>
            </div>
          </div>
          <div className="lp-footer__links-col">
            <h4>Resources</h4>
            <div className="lp-footer__links">
              <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Docs</a>
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Docs</a>
              <a href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">React Router</a>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <p className="lp-footer__copy">© 2026 EMSPro — AVIP Task 2 · Built with React &amp; Firebase</p>
          <div className="lp-footer__socials" aria-label="Social links">
            <a href="https://github.com"   target="_blank" rel="noopener noreferrer" className="lp-social-link" aria-label="GitHub"><IconGithub size={14} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="lp-social-link" aria-label="LinkedIn"><IconLinkedin size={14} /></a>
            <a href="mailto:admin@emspro.com" className="lp-social-link" aria-label="Email"><IconMail size={14} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FEATURES = [
  { icon: '📋', title: 'Employee Records', desc: 'Full CRUD operations for all employee data — create, view, update, and delete with ease.' },
  { icon: '🔐', title: 'Secure Admin Auth', desc: 'Firebase Authentication with Firestore role checks ensures only admins can modify data.' },
  { icon: '🔍', title: 'Search & Filter', desc: 'Instantly search by name, email, or position; filter by department and status.' },
  { icon: '☁️', title: 'Real-time Firestore', desc: 'All data persists in Cloud Firestore with server-enforced security rules.' },
];

const STATS = [
  { label: 'Employees Managed', value: 500, suffix: '+', icon: '👥' },
  { label: 'Secure by Default', value: 100, suffix: '%', icon: '🔐' },
  { label: 'Uptime Guaranteed', value: 99, suffix: '.9%', icon: '⚡' },
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
  const f1 = useReveal(), f2 = useReveal(), f3 = useReveal(), f4 = useReveal();
  const featureRefs = [f1, f2, f3, f4];

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

  return (
    <div className="lp">
      {/* ── Hero ── */}
      <header className="lp-hero">
        <div className="lp-hero__blobs" aria-hidden="true">
          <div className="blob blob--1" />
          <div className="blob blob--2" />
          <div className="blob blob--3" />
        </div>
        <nav className="lp-nav">
          <div className="lp-nav__brand">
            <span>👥</span>
            <span>EMS<strong>Pro</strong></span>
          </div>
          <Link to="/login" className="btn btn--white btn--sm">Sign In</Link>
        </nav>
        <div className="lp-hero__content">
          <div className="lp-hero__text">
            <div className="lp-badge">AVIP 2026 · Task 2</div>
            <h1 className="lp-hero__headline">
              Manage Your Workforce,<br /><span className="lp-highlight">Effortlessly</span>
            </h1>
            <p className="lp-hero__sub">
              A secure, real-time Employee Management System built with React and Firebase.
              Admin-only CRUD, role-based access control, and a clean modern interface.
            </p>
            <div className="lp-hero__ctas">
              <Link to="/login" className="btn btn--primary btn--xl" id="hero-get-started">
                Get Started →
              </Link>
              <a href="#features" className="btn btn--outline btn--xl lp-btn-outline-light">
                Learn More
              </a>
            </div>
          </div>

          {/* Mock dashboard card */}
          <div className="lp-hero__mockup" aria-label="Dashboard preview">
            <div className="mock-window">
              <div className="mock-window__bar">
                <span /><span /><span />
                <div className="mock-window__title">EMS Dashboard</div>
              </div>
              <div className="mock-window__body">
                <div className="mock-stat-row">
                  {['👥 48 Total','✅ 42 Active','⏸️ 6 Inactive','🏢 8 Depts'].map(s => (
                    <div key={s} className="mock-stat">{s}</div>
                  ))}
                </div>
                <div className="mock-table-header">
                  <span>Name</span><span>Dept</span><span>Status</span>
                </div>
                {[['Priya Sharma','Engineering','Active'],['Arjun Mehta','Product','Active'],['Divya Nair','Design','Active'],['Amit Joshi','Sales','Inactive']].map(([n,d,s]) => (
                  <div key={n} className="mock-table-row">
                    <span className="mock-name">
                      <span className="mock-avatar">{n.split(' ').map(w=>w[0]).join('')}</span>{n}
                    </span>
                    <span className="mock-dept">{d}</span>
                    <span className={`mock-status mock-status--${s.toLowerCase()}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features ── */}
      <section id="features" className="lp-features">
        <div className="lp-section-label">Features</div>
        <h2 className="lp-section-title">Everything you need to manage your team</h2>
        <p className="lp-section-sub">Built with a Firebase backend secured by production-grade Firestore rules.</p>
        <div className="lp-features__grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} ref={featureRefs[i]} className="lp-feature-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="lp-feature-card__icon">{f.icon}</div>
              <h3 className="lp-feature-card__title">{f.title}</h3>
              <p className="lp-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats" ref={statsRef}>
        <div className="lp-stats__inner">
          {STATS.map(s => (
            <StatCounter key={s.label} {...s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-how">
        <div className="lp-section-label">How it works</div>
        <h2 className="lp-section-title">Simple. Secure. Scalable.</h2>
        <div className="lp-how__steps">
          {[
            { n:'01', title:'Admin Logs In', desc:'Firebase Email/Password authentication with Firestore role verification.' },
            { n:'02', title:'Manage Employees', desc:'Create, view, edit, and delete employee records with real-time Firestore sync.' },
            { n:'03', title:'Rules Enforce Security', desc:'Firestore Security Rules block all unauthorised access at the database level.' },
          ].map(s => (
            <div key={s.n} className="lp-step">
              <div className="lp-step__num">{s.n}</div>
              <h3 className="lp-step__title">{s.title}</h3>
              <p className="lp-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="lp-cta">
        <h2>Ready to get started?</h2>
        <p>Sign in with your admin account to access the dashboard.</p>
        <Link to="/login" className="btn btn--white btn--xl" id="cta-login-btn">Sign In to Dashboard</Link>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer__brand">
          <span>👥</span> EMS<strong>Pro</strong>
        </div>
        <p className="lp-footer__copy">AVIP 2026 — Task 2 · Employee Management System · Built with React &amp; Firebase</p>
        <div className="lp-footer__links">
          <Link to="/login">Admin Login</Link>
          <a href="#features">Features</a>
          <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase</a>
        </div>
      </footer>
    </div>
  );
}

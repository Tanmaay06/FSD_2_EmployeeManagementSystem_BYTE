import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEmployees } from '../services/employeeService';
import Sidebar from '../components/Sidebar';
import {
  IconUsers, IconUserCheck, IconUserMinus,
  IconBuilding, IconList, IconPlus, IconDatabase, IconChevronRight,
} from '../components/Icons';

function SkeletonStats() {
  return (
    <div className="stats-grid">
      {[1,2,3,4].map(i => (
        <div key={i} className="stat-card">
          <div className="skeleton" style={{ width: 50, height: 50, borderRadius: 'var(--r-md)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-line skeleton-line--sm" style={{ width: '55%', marginBottom: 10 }} />
            <div className="skeleton skeleton-line" style={{ width: '38%', height: 28 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnimatedValue({ value }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplayed(0); return; }
    let start = null;
    const duration = 700;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.floor(ease * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return displayed;
}

const QUICK_ACTIONS = [
  { to: '/dashboard/employees',     icon: <IconList size={18} />,     label: 'View All Employees', id: 'view-employees-link' },
  { to: '/dashboard/employees/new', icon: <IconPlus size={18} />,     label: 'Add New Employee',   id: 'add-employee-link'   },
  { to: '/dashboard/seed',          icon: <IconDatabase size={18} />, label: 'Seed Sample Data',   id: 'seed-data-link'      },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(err => { console.error('Dashboard fetch error:', err); setError('Failed to load employee data.'); })
      .finally(() => setIsLoading(false));
  }, []);

  const total    = employees.length;
  const active   = employees.filter(e => e.status === 'Active').length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const deptBreakdown = employees.reduce((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {});
  const topDepts = Object.entries(deptBreakdown).sort(([,a],[,b]) => b - a).slice(0, 5);
  const numDepts = Object.keys(deptBreakdown).length;

  const STATS = [
    { label: 'Total Employees', value: total,    icon: <IconUsers size={22} />,      cls: 'total'    },
    { label: 'Active',          value: active,   icon: <IconUserCheck size={22} />,  cls: 'active'   },
    { label: 'Inactive',        value: inactive, icon: <IconUserMinus size={22} />,  cls: 'inactive' },
    { label: 'Departments',     value: numDepts, icon: <IconBuilding size={22} />,   cls: 'depts'    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* Sticky top bar */}
        <div className="topbar">
          <div className="topbar__left">
            <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="topbar__right">
            <Link to="/dashboard/employees/new" className="btn btn--primary btn--sm" id="topbar-add-btn">
              <IconPlus size={14} strokeWidth={2.5} /> Add Employee
            </Link>
          </div>
        </div>

        <main className="page-content" aria-label="Dashboard">
          {/* Page header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                {greeting()}, <strong>{user?.name || user?.email?.split('@')[0]}</strong>
              </p>
            </div>
            <Link to="/dashboard/employees/new" className="btn btn--primary" id="dashboard-add-btn">
              <IconPlus size={15} strokeWidth={2.5} /> Add Employee
            </Link>
          </div>

          {error && <div className="alert alert--error" role="alert">{error}</div>}

          {/* Stats */}
          {isLoading ? <SkeletonStats /> : (
            <div className="stats-grid">
              {STATS.map(s => (
                <div key={s.label} className={`stat-card stat-card--${s.cls}`} id={`stat-${s.cls}`}>
                  <div className="stat-card__icon-wrap">{s.icon}</div>
                  <div>
                    <p className="stat-card__label">{s.label}</p>
                    <p className="stat-card__value"><AnimatedValue value={s.value} /></p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dashboard grid */}
          <div className="dashboard-grid">
            {/* Quick actions */}
            <section className="card" aria-labelledby="quick-actions-heading">
              <h2 id="quick-actions-heading" className="card__title">Quick Actions</h2>
              <div className="quick-actions">
                {QUICK_ACTIONS.map(a => (
                  <Link key={a.to} to={a.to} className="quick-action-link" id={a.id}>
                    <span className="quick-action-link__icon">{a.icon}</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{a.label}</span>
                    <IconChevronRight size={14} color="var(--text-light)" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Department breakdown */}
            <section className="card" aria-labelledby="dept-breakdown-heading">
              <h2 id="dept-breakdown-heading" className="card__title">Department Breakdown</h2>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="skeleton skeleton-line" style={{ width: 110, height: 10 }} />
                      <div className="skeleton skeleton-line" style={{ flex: 1, height: 7 }} />
                      <div className="skeleton skeleton-line" style={{ width: 24, height: 10 }} />
                    </div>
                  ))}
                </div>
              ) : topDepts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <IconBuilding size={32} color="var(--text-light)" style={{ margin: '0 auto .75rem' }} />
                  <p style={{ fontSize: '.9375rem', color: 'var(--text-muted)' }}>
                    No data yet. <Link to="/dashboard/seed">Seed sample data</Link>
                  </p>
                </div>
              ) : (
                <ul className="dept-list" aria-label="Department counts">
                  {topDepts.map(([dept, count]) => (
                    <li key={dept} className="dept-list__item">
                      <span className="dept-list__name">{dept}</span>
                      <div className="dept-list__bar-wrap">
                        <div className="dept-list__bar" style={{ width: `${(count / total) * 100}%` }} aria-label={`${count} employees`} />
                      </div>
                      <span className="dept-list__count">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

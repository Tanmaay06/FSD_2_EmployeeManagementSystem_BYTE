import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEmployees } from '../services/employeeService';
import Sidebar from '../components/Sidebar';

function SkeletonStats() {
  return (
    <div className="stats-grid">
      {[1,2,3,4].map(i => (
        <div key={i} className="stat-card">
          <div className="skeleton skeleton-avatar" style={{width:48,height:48,borderRadius:'var(--radius-md)'}} />
          <div style={{flex:1}}>
            <div className="skeleton skeleton-line skeleton-line--sm" style={{width:'60%',marginBottom:8}} />
            <div className="skeleton skeleton-line" style={{width:'40%',height:28}} />
          </div>
        </div>
      ))}
    </div>
  );
}

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

  const total = employees.length;
  const active = employees.filter(e => e.status === 'Active').length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const deptBreakdown = employees.reduce((acc, e) => { acc[e.department] = (acc[e.department]||0)+1; return acc; }, {});
  const topDepts = Object.entries(deptBreakdown).sort(([,a],[,b])=>b-a).slice(0,5);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content" aria-label="Dashboard">
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back, <strong>{user?.name || user?.email}</strong></p>
            </div>
            <Link to="/dashboard/employees/new" className="btn btn--primary" id="dashboard-add-btn">+ Add Employee</Link>
          </div>

          {error && <div className="alert alert--error" role="alert">{error}</div>}

          {isLoading ? <SkeletonStats /> : (
            <div className="stats-grid">
              {[
                { label:'Total Employees', value:total,    icon:'👥', cls:'total' },
                { label:'Active',          value:active,   icon:'✅', cls:'active' },
                { label:'Inactive',        value:inactive, icon:'⏸️', cls:'inactive' },
                { label:'Departments',     value:Object.keys(deptBreakdown).length, icon:'🏢', cls:'depts' },
              ].map(s => (
                <div key={s.label} className={`stat-card stat-card--${s.cls}`} id={`stat-${s.cls}`}>
                  <div className="stat-card__icon-wrap" aria-hidden="true">{s.icon}</div>
                  <div>
                    <p className="stat-card__label">{s.label}</p>
                    <p className="stat-card__value">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dashboard-grid">
            <section className="card" aria-labelledby="quick-actions-heading">
              <h2 id="quick-actions-heading" className="card__title">Quick Actions</h2>
              <div className="quick-actions">
                {[
                  { to:'/dashboard/employees', icon:'📋', label:'View All Employees', id:'view-employees-link' },
                  { to:'/dashboard/employees/new', icon:'➕', label:'Add New Employee', id:'add-employee-link' },
                  { to:'/dashboard/seed', icon:'🌱', label:'Seed Sample Data', id:'seed-data-link' },
                ].map(a => (
                  <Link key={a.to} to={a.to} className="quick-action-link" id={a.id}>
                    <span className="quick-action-link__icon" aria-hidden="true">{a.icon}</span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="card" aria-labelledby="dept-breakdown-heading">
              <h2 id="dept-breakdown-heading" className="card__title">Department Breakdown</h2>
              {isLoading ? (
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {[1,2,3].map(i => <div key={i} className="skeleton skeleton-line" style={{height:12}} />)}
                </div>
              ) : topDepts.length === 0 ? (
                <p className="text-muted">No data yet. <Link to="/dashboard/seed">Seed sample data →</Link></p>
              ) : (
                <ul className="dept-list" aria-label="Department counts">
                  {topDepts.map(([dept, count]) => (
                    <li key={dept} className="dept-list__item">
                      <span className="dept-list__name">{dept}</span>
                      <div className="dept-list__bar-wrap">
                        <div className="dept-list__bar" style={{width:`${(count/total)*100}%`}} aria-label={`${count} employees`} />
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

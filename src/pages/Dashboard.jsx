import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEmployees } from '../services/employeeService';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load employee data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const inactiveCount = employees.filter((e) => e.status === 'Inactive').length;

  // Department breakdown
  const deptBreakdown = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const topDepts = Object.entries(deptBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content" aria-label="Dashboard">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, <strong>{user?.name || user?.email}</strong>
            </p>
          </div>
          <Link to="/dashboard/employees/new" className="btn btn--primary" id="dashboard-add-btn">
            + Add Employee
          </Link>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">{error}</div>
        )}

        {isLoading ? (
          <Loading message="Loading dashboard…" />
        ) : (
          <>
            {/* Stats cards */}
            <div className="stats-grid">
              <div className="stat-card stat-card--total" id="stat-total">
                <div className="stat-card__icon" aria-hidden="true">👥</div>
                <div className="stat-card__body">
                  <p className="stat-card__label">Total Employees</p>
                  <p className="stat-card__value">{totalCount}</p>
                </div>
              </div>
              <div className="stat-card stat-card--active" id="stat-active">
                <div className="stat-card__icon" aria-hidden="true">✅</div>
                <div className="stat-card__body">
                  <p className="stat-card__label">Active</p>
                  <p className="stat-card__value">{activeCount}</p>
                </div>
              </div>
              <div className="stat-card stat-card--inactive" id="stat-inactive">
                <div className="stat-card__icon" aria-hidden="true">⏸️</div>
                <div className="stat-card__body">
                  <p className="stat-card__label">Inactive</p>
                  <p className="stat-card__value">{inactiveCount}</p>
                </div>
              </div>
              <div className="stat-card stat-card--depts" id="stat-depts">
                <div className="stat-card__icon" aria-hidden="true">🏢</div>
                <div className="stat-card__body">
                  <p className="stat-card__label">Departments</p>
                  <p className="stat-card__value">{Object.keys(deptBreakdown).length}</p>
                </div>
              </div>
            </div>

            {/* Quick links & department breakdown */}
            <div className="dashboard-grid">
              <section className="card" aria-labelledby="quick-actions-heading">
                <h2 id="quick-actions-heading" className="card__title">Quick Actions</h2>
                <div className="quick-actions">
                  <Link to="/dashboard/employees" className="quick-action-link" id="view-employees-link">
                    <span aria-hidden="true">📋</span> View All Employees
                  </Link>
                  <Link to="/dashboard/employees/new" className="quick-action-link" id="add-employee-link">
                    <span aria-hidden="true">➕</span> Add Employee
                  </Link>
                  <Link to="/dashboard/seed" className="quick-action-link" id="seed-data-link">
                    <span aria-hidden="true">🌱</span> Seed Sample Data
                  </Link>
                </div>
              </section>

              <section className="card" aria-labelledby="dept-breakdown-heading">
                <h2 id="dept-breakdown-heading" className="card__title">Department Breakdown</h2>
                {topDepts.length === 0 ? (
                  <p className="text-muted">No data yet.</p>
                ) : (
                  <ul className="dept-list" aria-label="Department employee counts">
                    {topDepts.map(([dept, count]) => (
                      <li key={dept} className="dept-list__item">
                        <span className="dept-list__name">{dept}</span>
                        <div className="dept-list__bar-wrap">
                          <div
                            className="dept-list__bar"
                            style={{ width: `${(count / totalCount) * 100}%` }}
                            aria-label={`${count} of ${totalCount} employees`}
                          />
                        </div>
                        <span className="dept-list__count">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

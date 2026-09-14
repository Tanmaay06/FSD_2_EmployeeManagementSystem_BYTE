import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { seedEmployees, getEmployees } from '../services/employeeService';
import { useToast } from '../hooks/useToast';
import { IconDatabase, IconRefresh, IconCheck, IconAlertTriangle, IconFolderOpen } from '../components/Icons';

function SkeletonRow() {
  return (
    <tr className="employee-table__row">
      {[40, 120, 80, 130, 60, 90, 60].map((w, i) => (
        <td key={i} style={{ padding: '.875rem 1.125rem' }}>
          <div className="skeleton skeleton-line" style={{ width: w, height: 12 }} />
        </td>
      ))}
    </tr>
  );
}

const fmt = (n) =>
  n !== undefined && n !== null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
    : '—';

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function SeedData() {
  const [seedStatus, setSeedStatus] = useState(null);
  const [seedMessage, setSeedMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const addToast = useToast();

  async function fetchEmployees() {
    setIsFetching(true);
    setFetchError('');
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Seed page fetch error:', err);
      setFetchError('Could not load employee data. Check your connection or Firestore rules.');
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => { fetchEmployees(); }, []);

  async function handleSeed() {
    setSeedStatus('loading');
    setSeedMessage('');
    try {
      const result = await seedEmployees();
      setSeedStatus(result.skipped ? 'skipped' : 'success');
      setSeedMessage(result.message);
      addToast(result.message, result.skipped ? 'info' : 'success');
      if (!result.skipped) await fetchEmployees();
    } catch (err) {
      console.error('Seed error:', err);
      const msg = 'Seeding failed. Make sure you are logged in as admin and Firestore rules permit writes.';
      setSeedStatus('error');
      setSeedMessage(msg);
      addToast(msg, 'error');
    }
  }

  const total    = employees.length;
  const active   = employees.filter(e => e.status === 'Active').length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const depts    = new Set(employees.map(e => e.department)).size;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content" aria-label="Seed data page">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Seed Sample Data</h1>
              <p className="page-subtitle">Populate the database with realistic fictional employees</p>
            </div>
            <Link to="/dashboard" className="btn btn--outline" id="seed-back-btn">← Dashboard</Link>
          </div>

          {/* Seed action card */}
          <div className="card seed-card">
            <div className="seed-card__info">
              <h2 className="card__title">About Seeding</h2>
              <p>
                Adds <strong>8 sample employees</strong> to Firestore. Seeding is{' '}
                <strong>idempotent</strong> — if employee records already exist, the seed is
                skipped to prevent duplicates.
              </p>
              <p className="seed-card__warning">
                Only run this on a fresh database or after clearing all existing employees.
              </p>
            </div>

            {seedStatus === 'success' && (
              <div className="alert alert--success" role="alert">{seedMessage}</div>
            )}
            {seedStatus === 'skipped' && (
              <div className="alert alert--warning" role="alert">{seedMessage}</div>
            )}
            {seedStatus === 'error' && (
              <div className="alert alert--error" role="alert">{seedMessage}</div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn--primary btn--lg"
                onClick={handleSeed}
                disabled={seedStatus === 'loading' || seedStatus === 'success'}
                id="seed-run-btn"
              >
                {seedStatus === 'loading' ? (
                  <span className="btn__loading-content">
                    <span className="btn__spinner" aria-hidden="true" />
                    Seeding…
                  </span>
                ) : seedStatus === 'success' ? (
                  <><IconCheck size={15} strokeWidth={2.5} /> Seeded</>
                ) : (
                  <><IconDatabase size={15} /> Run Seed</>
                )}
              </button>

              {(seedStatus === 'success' || total > 0) && (
                <Link to="/dashboard/employees" className="btn btn--secondary btn--lg" id="seed-view-btn">
                  View Employees
                </Link>
              )}

              <button
                className="btn btn--ghost btn--lg"
                onClick={fetchEmployees}
                disabled={isFetching}
                aria-label="Refresh data"
              >
                <IconRefresh size={15} />
                {isFetching ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Live data section */}
          <section className="card" aria-labelledby="live-data-heading">
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '1rem', flexWrap: 'wrap', gap: '.75rem',
            }}>
              <h2 id="live-data-heading" className="card__title" style={{ marginBottom: 0 }}>
                Live Employee Records
              </h2>

              {!isFetching && !fetchError && (
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: `${total} Total`,                 bg: 'var(--primary-light)', color: 'var(--primary-700)' },
                    { label: `${active} Active`,               bg: 'var(--success-light)', color: '#065f46' },
                    { label: `${inactive} Inactive`,           bg: 'var(--surface-3)',     color: 'var(--text-muted)' },
                    { label: `${depts} Dept${depts !== 1 ? 's' : ''}`, bg: 'var(--accent-light)', color: 'var(--accent-dark)' },
                  ].map(b => (
                    <span key={b.label} className="badge" style={{ background: b.bg, color: b.color }}>
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {fetchError && (
              <div className="alert alert--error" role="alert">
                <IconAlertTriangle size={15} style={{ flexShrink: 0 }} /> {fetchError}
              </div>
            )}

            {!fetchError && (
              <>
                {isFetching ? (
                  <div className="table-wrap">
                    <table className="employee-table" aria-label="Loading employee data">
                      <thead>
                        <tr>
                          <th>#</th><th>Name</th><th>Department</th>
                          <th>Position</th><th>Salary</th><th>Joined</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5,6,7,8].map(i => <SkeletonRow key={i} />)}
                      </tbody>
                    </table>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state__art">
                      <IconFolderOpen size={36} color="var(--primary)" strokeWidth={1.5} />
                    </div>
                    <p className="empty-state__title">No employees yet</p>
                    <p className="empty-state__subtitle">
                      Click <strong>Run Seed</strong> above to populate with 8 sample records, or{' '}
                      <Link to="/dashboard/employees/new">add one manually</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table className="employee-table" aria-label={`${total} live employee records`}>
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Department</th>
                          <th scope="col">Position</th>
                          <th scope="col">Salary</th>
                          <th scope="col">Joined</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, i) => (
                          <tr key={emp.id} className="employee-table__row">
                            <td data-label="#" style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>{i + 1}</td>
                            <td data-label="Name" className="employee-table__name">
                              <span className="employee-avatar">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                              {emp.firstName} {emp.lastName}
                            </td>
                            <td data-label="Department"><span className="badge badge--dept">{emp.department}</span></td>
                            <td data-label="Position">{emp.position}</td>
                            <td data-label="Salary">{fmt(emp.salary)}</td>
                            <td data-label="Joined" style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
                              {fmtDate(emp.joiningDate)}
                            </td>
                            <td data-label="Status">
                              <span className={`badge badge--${emp.status === 'Active' ? 'active' : 'inactive'}`}>
                                {emp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="seed-card__note" style={{ marginTop: '1rem' }}>
                  Data fetched live from Firestore · Full schema in{' '}
                  <code>src/services/employeeService.js</code>
                </p>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { seedEmployees } from '../services/employeeService';
import { useToast } from '../hooks/useToast';

export default function SeedData() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const addToast = useToast();

  async function handleSeed() {
    setStatus('loading'); setMessage('');
    try {
      const result = await seedEmployees();
      setStatus(result.skipped ? 'skipped' : 'success');
      setMessage(result.message);
      addToast(result.message, result.skipped ? 'info' : 'success');
    } catch (err) {
      console.error('Seed error:', err);
      const msg = 'Seeding failed. Make sure you are logged in as admin and Firestore rules permit writes.';
      setStatus('error'); setMessage(msg);
      addToast(msg, 'error');
    }
  }

  const samples = [
    { name:'Priya Sharma', dept:'Engineering', position:'Senior Software Engineer', status:'Active' },
    { name:'Arjun Mehta', dept:'Product', position:'Product Manager', status:'Active' },
    { name:'Divya Nair', dept:'Design', position:'UI/UX Designer', status:'Active' },
    { name:'Rohit Verma', dept:'Marketing', position:'Marketing Lead', status:'Active' },
    { name:'Sneha Patel', dept:'Human Resources', position:'HR Manager', status:'Active' },
    { name:'Kiran Reddy', dept:'Finance', position:'Financial Analyst', status:'Active' },
    { name:'Amit Joshi', dept:'Sales', position:'Sales Executive', status:'Inactive' },
    { name:'Meera Krishnan', dept:'Engineering', position:'DevOps Engineer', status:'Active' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content" aria-label="Seed data page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Seed Sample Data</h1>
              <p className="page-subtitle">Populate the database with realistic fictional employees</p>
            </div>
            <Link to="/dashboard" className="btn btn--outline" id="seed-back-btn">← Dashboard</Link>
          </div>

          <div className="card seed-card">
            <div className="seed-card__info">
              <h2 className="card__title">About Seeding</h2>
              <p>Adds <strong>8 sample employees</strong> to Firestore. Seeding is <strong>idempotent</strong> — if employee records already exist, the seed is skipped to prevent duplicates.</p>
              <p className="seed-card__warning">⚠️ Only run this on a fresh database or after clearing all existing employees.</p>
            </div>

            {status === 'success' && <div className="alert alert--success">✅ {message}</div>}
            {status === 'skipped' && <div className="alert alert--warning">⚠️ {message}</div>}
            {status === 'error'   && <div className="alert alert--error">❌ {message}</div>}

            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              <button className="btn btn--primary btn--lg" onClick={handleSeed}
                disabled={status==='loading'||status==='success'} id="seed-run-btn">
                {status==='loading'
                  ? <span className="btn__loading-content"><span className="btn__spinner" />Seeding…</span>
                  : status==='success' ? '✅ Seeded' : '🌱 Run Seed'}
              </button>
              {status==='success' && (
                <Link to="/dashboard/employees" className="btn btn--secondary btn--lg" id="seed-view-btn">
                  View Employees →
                </Link>
              )}
            </div>
          </div>

          <section className="card" aria-labelledby="sample-data-heading">
            <h2 id="sample-data-heading" className="card__title">Preview — Sample Records</h2>
            <div className="table-wrap">
              <table className="employee-table" aria-label="Sample employee preview">
                <thead><tr><th>#</th><th>Name</th><th>Department</th><th>Position</th><th>Status</th></tr></thead>
                <tbody>
                  {samples.map((emp, i) => (
                    <tr key={emp.name} className="employee-table__row">
                      <td>{i+1}</td>
                      <td>{emp.name}</td>
                      <td><span className="badge badge--dept">{emp.dept}</span></td>
                      <td>{emp.position}</td>
                      <td><span className={`badge badge--${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="seed-card__note">Full seed data (salary, phone, joining date, email) is defined in <code>src/services/employeeService.js</code>.</p>
          </section>
        </main>
      </div>
    </div>
  );
}

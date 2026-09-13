import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { seedEmployees } from '../services/employeeService';

export default function SeedData() {
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error' | 'skipped'
  const [message, setMessage] = useState('');

  async function handleSeed() {
    setStatus('loading');
    setMessage('');
    try {
      const result = await seedEmployees();
      if (result.skipped) {
        setStatus('skipped');
      } else {
        setStatus('success');
      }
      setMessage(result.message);
    } catch (err) {
      console.error('Seed error:', err);
      setStatus('error');
      setMessage('Seeding failed. Make sure you are logged in as admin and Firestore rules permit writes.');
    }
  }

  const sampleEmployees = [
    { name: 'Priya Sharma', dept: 'Engineering', position: 'Senior Software Engineer', status: 'Active' },
    { name: 'Arjun Mehta', dept: 'Product', position: 'Product Manager', status: 'Active' },
    { name: 'Divya Nair', dept: 'Design', position: 'UI/UX Designer', status: 'Active' },
    { name: 'Rohit Verma', dept: 'Marketing', position: 'Marketing Lead', status: 'Active' },
    { name: 'Sneha Patel', dept: 'Human Resources', position: 'HR Manager', status: 'Active' },
    { name: 'Kiran Reddy', dept: 'Finance', position: 'Financial Analyst', status: 'Active' },
    { name: 'Amit Joshi', dept: 'Sales', position: 'Sales Executive', status: 'Inactive' },
    { name: 'Meera Krishnan', dept: 'Engineering', position: 'DevOps Engineer', status: 'Active' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content" aria-label="Seed data page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Seed Sample Data</h1>
            <p className="page-subtitle">Populate the database with realistic fictional employee records</p>
          </div>
          <Link to="/dashboard" className="btn btn--outline" id="seed-back-btn">← Dashboard</Link>
        </div>

        <div className="card seed-card">
          <div className="seed-card__info">
            <h2 className="card__title">About Seeding</h2>
            <p>
              This utility adds <strong>8 sample employees</strong> to Firestore for demonstration purposes.
              Seeding is <strong>idempotent</strong> — if employee records already exist, the seed will be skipped
              to prevent duplicates.
            </p>
            <p className="seed-card__warning">
              ⚠️ Only run this on a fresh database or after clearing all existing employees.
            </p>
          </div>

          {status === 'success' && (
            <div className="alert alert--success" role="status" aria-live="polite">
              ✅ {message}
            </div>
          )}
          {status === 'skipped' && (
            <div className="alert alert--warning" role="status" aria-live="polite">
              ⚠️ {message}
            </div>
          )}
          {status === 'error' && (
            <div className="alert alert--error" role="alert" aria-live="assertive">
              ❌ {message}
            </div>
          )}

          <button
            className="btn btn--primary btn--lg"
            onClick={handleSeed}
            disabled={status === 'loading' || status === 'success'}
            id="seed-run-btn"
          >
            {status === 'loading' ? (
              <span className="btn__loading-content">
                <span className="btn__spinner" aria-hidden="true" />
                Seeding…
              </span>
            ) : status === 'success' ? '✅ Seeded' : '🌱 Run Seed'}
          </button>

          {status === 'success' && (
            <Link to="/dashboard/employees" className="btn btn--secondary" id="seed-view-employees-btn">
              View Employees →
            </Link>
          )}
        </div>

        {/* Preview of sample data */}
        <section className="card" aria-labelledby="sample-data-heading">
          <h2 id="sample-data-heading" className="card__title">Sample Employee Records (Preview)</h2>
          <div className="table-wrap">
            <table className="employee-table" aria-label="Sample employee data preview">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Position</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleEmployees.map((emp, i) => (
                  <tr key={emp.name}>
                    <td>{i + 1}</td>
                    <td>{emp.name}</td>
                    <td><span className="badge badge--dept">{emp.dept}</span></td>
                    <td>{emp.position}</td>
                    <td>
                      <span className={`badge ${emp.status === 'Active' ? 'badge--active' : 'badge--inactive'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="seed-card__note">
            Full seed data including phone, salary, joining date, and email are defined in{' '}
            <code>src/services/employeeService.js</code>.
          </p>
        </section>
      </main>
    </div>
  );
}

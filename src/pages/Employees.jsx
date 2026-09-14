import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { useToast } from '../hooks/useToast';
import { IconRefresh } from '../components/Icons';

function SkeletonTable() {
  return (
    <div>
      {/* Controls skeleton */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="skeleton skeleton-line" style={{ flex: 1, minWidth: 200, height: 40, borderRadius: 'var(--r-md)' }} />
        <div className="skeleton skeleton-line" style={{ width: 145, height: 40, borderRadius: 'var(--r-md)' }} />
        <div className="skeleton skeleton-line" style={{ width: 145, height: 40, borderRadius: 'var(--r-md)' }} />
        <div className="skeleton skeleton-line" style={{ width: 130, height: 40, borderRadius: 'var(--r-md)' }} />
      </div>
      {/* Table skeleton */}
      <div className="table-wrap">
        <div style={{
          padding: '.75rem 1.125rem',
          borderBottom: '1.5px solid var(--border)',
          display: 'flex', gap: '1rem', background: 'var(--surface-2)',
        }}>
          {[60, 120, 90, 100, 80, 60, 80, 72].map((w, i) => (
            <div key={i} className="skeleton skeleton-line" style={{ width: w, height: 10 }} />
          ))}
        </div>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="skeleton-row" style={{ paddingLeft: '1.125rem', paddingRight: '1.125rem' }}>
            <div className="skeleton skeleton-avatar" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="skeleton skeleton-line" style={{ width: '40%' }} />
              <div className="skeleton skeleton-line skeleton-line--sm" style={{ width: '30%' }} />
            </div>
            <div className="skeleton skeleton-line" style={{ width: 70 }} />
            <div className="skeleton skeleton-line" style={{ width: 80 }} />
            <div className="skeleton skeleton-line" style={{ width: 55 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const addToast = useToast();

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setIsLoading(true); setError('');
    try { setEmployees(await getEmployees()); }
    catch (err) { console.error('Employees fetch error:', err); setError('Failed to load employees. Please try again.'); }
    finally { setIsLoading(false); }
  }

  async function handleDelete(id) {
    setIsDeleting(true);
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      addToast('Employee deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      addToast(
        err.code === 'permission-denied'
          ? 'Permission denied. Only admins can delete employees.'
          : 'Failed to delete employee. Please try again.',
        'error'
      );
    } finally { setIsDeleting(false); }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* Sticky top bar */}
        <div className="topbar">
          <div className="topbar__left">
            <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
              {!isLoading && employees.length > 0 ? `${employees.length} total records` : 'Employee Directory'}
            </span>
          </div>
          <div className="topbar__right">
            <button
              className="btn btn--ghost btn--sm"
              onClick={fetchAll}
              disabled={isLoading}
              aria-label="Refresh employee list"
            >
              <IconRefresh size={14} /> Refresh
            </button>
          </div>
        </div>

        <main className="page-content" aria-label="Employees page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Employees</h1>
              <p className="page-subtitle">Manage your organisation&apos;s employee records</p>
            </div>
          </div>

          {error && <div className="alert alert--error" role="alert" aria-live="assertive">{error}</div>}

          {isLoading ? <SkeletonTable /> : (
            <EmployeeTable employees={employees} onDelete={handleDelete} isDeleting={isDeleting} />
          )}
        </main>
      </div>
    </div>
  );
}

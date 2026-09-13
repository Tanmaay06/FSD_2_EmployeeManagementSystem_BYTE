import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { useToast } from '../hooks/useToast';

function SkeletonTable() {
  return (
    <div className="table-wrap">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton-row">
          <div className="skeleton skeleton-avatar" />
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
            <div className="skeleton skeleton-line" style={{width:'50%'}} />
            <div className="skeleton skeleton-line skeleton-line--sm" style={{width:'35%'}} />
          </div>
          <div className="skeleton skeleton-line" style={{width:70}} />
          <div className="skeleton skeleton-line" style={{width:55}} />
        </div>
      ))}
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
      addToast(err.code === 'permission-denied'
        ? 'Permission denied. Only admins can delete employees.'
        : 'Failed to delete employee. Please try again.', 'error');
    } finally { setIsDeleting(false); }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
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

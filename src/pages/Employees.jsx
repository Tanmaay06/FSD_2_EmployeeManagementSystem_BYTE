import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EmployeeTable from '../components/EmployeeTable';
import Loading from '../components/Loading';
import { getEmployees, deleteEmployee } from '../services/employeeService';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setIsLoading(true);
    setError('');
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Employees fetch error:', err);
      setError('Failed to load employees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    setIsDeleting(true);
    setError('');
    setSuccessMsg('');
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setSuccessMsg('Employee deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete employee. You may not have permission, or a network error occurred.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content" aria-label="Employees page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-subtitle">Manage your organisation&apos;s employee records</p>
          </div>
        </div>

        {error && (
          <div className="alert alert--error" role="alert" aria-live="assertive">{error}</div>
        )}
        {successMsg && (
          <div className="alert alert--success" role="status" aria-live="polite">{successMsg}</div>
        )}

        {isLoading ? (
          <Loading message="Loading employees…" />
        ) : (
          <EmployeeTable
            employees={employees}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </main>
    </div>
  );
}

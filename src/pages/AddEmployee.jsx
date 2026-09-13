import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee } from '../services/employeeService';
import { useToast } from '../hooks/useToast';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const addToast = useToast();

  async function handleSubmit(formData) {
    setIsLoading(true); setError('');
    try {
      await createEmployee(formData);
      addToast('Employee created successfully!', 'success');
      navigate('/dashboard/employees');
    } catch (err) {
      console.error('Create employee error:', err);
      const msg = err.code === 'permission-denied'
        ? 'Permission denied. Only admins can create employees.'
        : 'Failed to create employee. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally { setIsLoading(false); }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content" aria-label="Add employee page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Employee</h1>
              <p className="page-subtitle">Create a new employee record</p>
            </div>
            <button className="btn btn--outline" onClick={() => navigate(-1)} id="add-employee-back-btn">← Back</button>
          </div>
          {error && <div className="alert alert--error" role="alert">{error}</div>}
          <div className="card">
            <EmployeeForm onSubmit={handleSubmit} submitLabel="Create Employee" isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
}

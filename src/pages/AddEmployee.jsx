import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee } from '../services/employeeService';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError('');
    try {
      await createEmployee(formData);
      navigate('/dashboard/employees', {
        state: { successMsg: 'Employee created successfully.' },
        replace: false,
      });
    } catch (err) {
      console.error('Create employee error:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied. Only admins can create employees.');
      } else {
        setError('Failed to create employee. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content" aria-label="Add employee page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Add Employee</h1>
            <p className="page-subtitle">Create a new employee record</p>
          </div>
          <button
            className="btn btn--outline"
            onClick={() => navigate(-1)}
            id="add-employee-back-btn"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="alert alert--error" role="alert" aria-live="assertive">{error}</div>
        )}

        <div className="card">
          <EmployeeForm
            onSubmit={handleSubmit}
            submitLabel="Create Employee"
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

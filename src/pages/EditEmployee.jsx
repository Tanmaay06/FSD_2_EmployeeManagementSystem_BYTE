import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import Loading from '../components/Loading';
import { getEmployee, updateEmployee } from '../services/employeeService';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const emp = await getEmployee(id);
        if (!emp) {
          setFetchError('Employee not found.');
          return;
        }
        setInitialData({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department: emp.department || '',
          position: emp.position || '',
          salary: emp.salary !== undefined ? String(emp.salary) : '',
          joiningDate: emp.joiningDate || '',
          status: emp.status || '',
        });
      } catch (err) {
        console.error('Edit load error:', err);
        setFetchError('Failed to load employee data. Please try again.');
      } finally {
        setIsLoadingData(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMsg('');
    try {
      await updateEmployee(id, formData);
      setSuccessMsg('Employee updated successfully.');
      // Brief success feedback then navigate
      setTimeout(() => navigate('/dashboard/employees'), 1200);
    } catch (err) {
      console.error('Update employee error:', err);
      if (err.code === 'permission-denied') {
        setSubmitError('Permission denied. Only admins can update employees.');
      } else {
        setSubmitError('Failed to update employee. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content" aria-label="Edit employee page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Employee</h1>
            <p className="page-subtitle">Update employee record</p>
          </div>
          <button
            className="btn btn--outline"
            onClick={() => navigate(-1)}
            id="edit-employee-back-btn"
          >
            ← Back
          </button>
        </div>

        {fetchError && (
          <div className="alert alert--error" role="alert">{fetchError}</div>
        )}
        {submitError && (
          <div className="alert alert--error" role="alert" aria-live="assertive">{submitError}</div>
        )}
        {successMsg && (
          <div className="alert alert--success" role="status" aria-live="polite">{successMsg}</div>
        )}

        {isLoadingData ? (
          <Loading message="Loading employee data…" />
        ) : initialData ? (
          <div className="card">
            <EmployeeForm
              initialData={initialData}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              isLoading={isSubmitting}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}

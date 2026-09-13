import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmployeeForm from '../components/EmployeeForm';
import Loading from '../components/Loading';
import { getEmployee, updateEmployee } from '../services/employeeService';
import { useToast } from '../hooks/useToast';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const addToast = useToast();

  useEffect(() => {
    async function load() {
      try {
        const emp = await getEmployee(id);
        if (!emp) { setFetchError('Employee not found.'); return; }
        setInitialData({
          firstName: emp.firstName || '', lastName: emp.lastName || '',
          email: emp.email || '', phone: emp.phone || '',
          department: emp.department || '', position: emp.position || '',
          salary: emp.salary !== undefined ? String(emp.salary) : '',
          joiningDate: emp.joiningDate || '', status: emp.status || '',
        });
      } catch (err) {
        console.error('Edit load error:', err);
        setFetchError('Failed to load employee data. Please try again.');
      } finally { setIsLoadingData(false); }
    }
    load();
  }, [id]);

  async function handleSubmit(formData) {
    setIsSubmitting(true); setSubmitError('');
    try {
      await updateEmployee(id, formData);
      addToast('Employee updated successfully!', 'success');
      navigate('/dashboard/employees');
    } catch (err) {
      console.error('Update error:', err);
      const msg = err.code === 'permission-denied'
        ? 'Permission denied. Only admins can update employees.'
        : 'Failed to update employee. Please try again.';
      setSubmitError(msg);
      addToast(msg, 'error');
    } finally { setIsSubmitting(false); }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content" aria-label="Edit employee page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Employee</h1>
              <p className="page-subtitle">Update employee record</p>
            </div>
            <button className="btn btn--outline" onClick={() => navigate(-1)} id="edit-employee-back-btn">← Back</button>
          </div>
          {fetchError && <div className="alert alert--error" role="alert">{fetchError}</div>}
          {submitError && <div className="alert alert--error" role="alert">{submitError}</div>}
          {isLoadingData ? (
            <Loading message="Loading employee data…" />
          ) : initialData ? (
            <div className="card">
              <EmployeeForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" isLoading={isSubmitting} />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

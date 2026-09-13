import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

/**
 * Responsive employee table with search/filter and inline actions.
 *
 * Props:
 *  - employees: array of employee objects
 *  - onDelete: async (id) => void
 *  - isDeleting: boolean
 */
export default function EmployeeTable({ employees = [], onDelete, isDeleting = false }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmId, setConfirmId] = useState(null);   // Employee ID pending delete confirmation
  const [confirmEmployee, setConfirmEmployee] = useState(null);

  // Derive unique departments from current employee list
  const departments = [...new Set(employees.map((e) => e.department))].sort();

  // Apply filters
  const filtered = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const searchMatch =
      !search ||
      fullName.includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.position?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase());
    const deptMatch = !deptFilter || emp.department === deptFilter;
    const statusMatch = !statusFilter || emp.status === statusFilter;
    return searchMatch && deptMatch && statusMatch;
  });

  function requestDelete(emp) {
    setConfirmEmployee(emp);
    setConfirmId(emp.id);
  }

  async function handleConfirmDelete() {
    if (!confirmId) return;
    await onDelete(confirmId);
    setConfirmId(null);
    setConfirmEmployee(null);
  }

  function handleCancelDelete() {
    setConfirmId(null);
    setConfirmEmployee(null);
  }

  function formatSalary(salary) {
    if (salary === undefined || salary === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salary);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <>
      {/* Filters */}
      <div className="table-controls">
        <div className="table-controls__search">
          <span className="table-controls__search-icon" aria-hidden="true">🔍</span>
          <input
            id="employee-search"
            type="search"
            className="form-input table-controls__input"
            placeholder="Search by name, email, position…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees"
          />
        </div>
        <div className="table-controls__filters">
          <select
            id="department-filter"
            className="form-select table-controls__select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            id="status-filter"
            className="form-select table-controls__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Link to="/dashboard/employees/new" className="btn btn--primary" id="add-employee-btn">
          + Add Employee
        </Link>
      </div>

      {/* Results count */}
      <p className="table-count" aria-live="polite">
        {filtered.length === employees.length
          ? `${employees.length} employee${employees.length !== 1 ? 's' : ''}`
          : `${filtered.length} of ${employees.length} employees`}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">🗂️</span>
          <p className="empty-state__title">No employees found</p>
          <p className="empty-state__subtitle">
            {employees.length === 0
              ? 'Get started by adding your first employee.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {employees.length === 0 && (
            <Link to="/dashboard/employees/new" className="btn btn--primary" id="empty-add-employee-btn">Add Employee</Link>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="employee-table" aria-label="Employee list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Department</th>
                <th scope="col">Position</th>
                <th scope="col">Phone</th>
                <th scope="col">Salary</th>
                <th scope="col">Status</th>
                <th scope="col">Joined</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="employee-table__row">
                  <td data-label="Name" className="employee-table__name">
                    <span className="employee-avatar" aria-hidden="true">
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </span>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td data-label="Email" className="employee-table__email">
                    <a href={`mailto:${emp.email}`}>{emp.email}</a>
                  </td>
                  <td data-label="Department">
                    <span className="badge badge--dept">{emp.department}</span>
                  </td>
                  <td data-label="Position">{emp.position}</td>
                  <td data-label="Phone">{emp.phone}</td>
                  <td data-label="Salary">{formatSalary(emp.salary)}</td>
                  <td data-label="Status">
                    <span className={`badge ${emp.status === 'Active' ? 'badge--active' : 'badge--inactive'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td data-label="Joined">{formatDate(emp.joiningDate)}</td>
                  <td data-label="Actions" className="employee-table__actions">
                    <Link
                      to={`/dashboard/employees/${emp.id}/edit`}
                      className="btn btn--secondary btn--sm"
                      id={`edit-employee-${emp.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => requestDelete(emp)}
                      disabled={isDeleting}
                      id={`delete-employee-${emp.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Employee?"
        message={
          confirmEmployee
            ? `Are you sure you want to permanently delete ${confirmEmployee.firstName} ${confirmEmployee.lastName}? This action cannot be undone.`
            : 'This action cannot be undone.'
        }
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

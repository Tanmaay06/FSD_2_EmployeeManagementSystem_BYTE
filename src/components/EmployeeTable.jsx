import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const SORT_FIELDS = {
  name: (a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`),
  email: (a, b) => (a.email || '').localeCompare(b.email || ''),
  department: (a, b) => (a.department || '').localeCompare(b.department || ''),
  position: (a, b) => (a.position || '').localeCompare(b.position || ''),
  salary: (a, b) => (a.salary || 0) - (b.salary || 0),
  status: (a, b) => (a.status || '').localeCompare(b.status || ''),
  joiningDate: (a, b) => (a.joiningDate || '').localeCompare(b.joiningDate || ''),
};

export default function EmployeeTable({ employees = [], onDelete, isDeleting = false }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState(1); // 1 = asc, -1 = desc
  const [confirmId, setConfirmId] = useState(null);
  const [confirmEmployee, setConfirmEmployee] = useState(null);

  const departments = [...new Set(employees.map(e => e.department))].sort();

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => -d);
    else { setSortKey(key); setSortDir(1); }
  }

  const filtered = employees
    .filter(emp => {
      const q = search.toLowerCase();
      const match = !q || `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q)
        || emp.email?.toLowerCase().includes(q)
        || emp.position?.toLowerCase().includes(q)
        || emp.department?.toLowerCase().includes(q);
      return match && (!deptFilter || emp.department === deptFilter) && (!statusFilter || emp.status === statusFilter);
    })
    .sort((a, b) => (SORT_FIELDS[sortKey]?.(a, b) || 0) * sortDir);

  function SortIcon({ k }) {
    if (sortKey !== k) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDir === 1 ? '↑' : '↓'}</span>;
  }

  const fmt = n => n !== undefined && n !== null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
    : '—';

  const fmtDate = d => {
    if (!d) return '—';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="table-controls">
        <div className="table-controls__search">
          <span className="table-controls__search-icon" aria-hidden="true">🔍</span>
          <input id="employee-search" type="search" className="form-input table-controls__input"
            placeholder="Search name, email, position…" value={search}
            onChange={e => setSearch(e.target.value)} aria-label="Search employees" />
        </div>
        <div className="table-controls__filters">
          <select id="department-filter" className="form-select table-controls__select"
            value={deptFilter} onChange={e => setDeptFilter(e.target.value)} aria-label="Filter by department">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select id="status-filter" className="form-select table-controls__select"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Link to="/dashboard/employees/new" className="btn btn--primary" id="add-employee-btn">+ Add Employee</Link>
      </div>

      <p className="table-count" aria-live="polite">
        {filtered.length === employees.length ? `${employees.length} employee${employees.length!==1?'s':''}` : `${filtered.length} of ${employees.length} employees`}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__art" aria-hidden="true">🗂️</div>
          <p className="empty-state__title">No employees found</p>
          <p className="empty-state__subtitle">
            {employees.length === 0 ? 'Get started by adding your first employee.' : 'Try adjusting your search or filters.'}
          </p>
          {employees.length === 0 && <Link to="/dashboard/employees/new" className="btn btn--primary" id="empty-add-btn">Add Employee</Link>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="employee-table" aria-label="Employee list">
            <thead>
              <tr>
                {[
                  { key:'name',       label:'Name' },
                  { key:'email',      label:'Email' },
                  { key:'department', label:'Department' },
                  { key:'position',   label:'Position' },
                  { key:'salary',     label:'Salary' },
                  { key:'status',     label:'Status' },
                  { key:'joiningDate',label:'Joined' },
                  { key:null,         label:'Actions' },
                ].map(col => (
                  <th key={col.label} scope="col"
                    className={col.key && sortKey===col.key ? 'sorted' : ''}
                    onClick={col.key ? () => handleSort(col.key) : undefined}
                    aria-sort={col.key && sortKey===col.key ? (sortDir===1?'ascending':'descending') : undefined}
                  >
                    {col.label}{col.key && <SortIcon k={col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="employee-table__row">
                  <td data-label="Name" className="employee-table__name">
                    <span className="employee-avatar" aria-hidden="true">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td data-label="Email" className="employee-table__email"><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
                  <td data-label="Department"><span className="badge badge--dept">{emp.department}</span></td>
                  <td data-label="Position">{emp.position}</td>
                  <td data-label="Salary">{fmt(emp.salary)}</td>
                  <td data-label="Status"><span className={`badge badge--${emp.status==='Active'?'active':'inactive'}`}>{emp.status}</span></td>
                  <td data-label="Joined">{fmtDate(emp.joiningDate)}</td>
                  <td data-label="Actions" className="employee-table__actions">
                    <Link to={`/dashboard/employees/${emp.id}/edit`} className="btn btn--secondary btn--sm" id={`edit-${emp.id}`}>Edit</Link>
                    <button className="btn btn--danger btn--sm" onClick={() => { setConfirmEmployee(emp); setConfirmId(emp.id); }}
                      disabled={isDeleting} id={`delete-${emp.id}`}>Delete</button>
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
        message={confirmEmployee ? `Permanently delete ${confirmEmployee.firstName} ${confirmEmployee.lastName}? This cannot be undone.` : ''}
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel" danger
        onConfirm={async () => { await onDelete(confirmId); setConfirmId(null); setConfirmEmployee(null); }}
        onCancel={() => { setConfirmId(null); setConfirmEmployee(null); }}
      />
    </>
  );
}

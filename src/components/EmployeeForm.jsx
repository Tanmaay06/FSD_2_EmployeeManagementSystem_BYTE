import { useState, useEffect } from 'react';
import { validateEmployee, isValid, DEPARTMENTS, STATUSES } from '../utils/validation';

/**
 * Shared employee form used for both creating and editing an employee.
 *
 * Props:
 *  - initialData: object – pre-populated field values (empty defaults for create)
 *  - onSubmit: async (data) => void
 *  - submitLabel: string
 *  - isLoading: boolean
 */
const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  salary: '',
  joiningDate: '',
  status: '',
};

export default function EmployeeForm({ initialData = EMPTY_FORM, onSubmit, submitLabel = 'Save', isLoading = false }) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Re-populate if initialData changes (e.g. edit form loading data async)
  useEffect(() => {
    setFormData({ ...EMPTY_FORM, ...initialData });
    setErrors({});
    setTouched({});
  }, [JSON.stringify(initialData)]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Re-validate field on change if it's already been touched
    if (touched[name]) {
      const errs = validateEmployee({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateEmployee(formData);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Touch all fields to show all errors
    const allTouched = Object.keys(EMPTY_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    const errs = validateEmployee(formData);
    setErrors(errs);
    if (!isValid(errs)) return;

    await onSubmit(formData);
  }

  function fieldClass(name) {
    if (errors[name] && touched[name]) return 'form-group--error';
    return '';
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <div className="employee-form__grid">
        {/* First Name */}
        <div className={`form-group ${fieldClass('firstName')}`}>
          <label htmlFor="firstName" className="form-label">
            First Name <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="form-input"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Priya"
            maxLength={50}
            aria-describedby={errors.firstName && touched.firstName ? 'firstName-error' : undefined}
            aria-invalid={!!(errors.firstName && touched.firstName)}
            disabled={isLoading}
          />
          {errors.firstName && touched.firstName && (
            <span id="firstName-error" className="form-error" role="alert">{errors.firstName}</span>
          )}
        </div>

        {/* Last Name */}
        <div className={`form-group ${fieldClass('lastName')}`}>
          <label htmlFor="lastName" className="form-label">
            Last Name <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="form-input"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Sharma"
            maxLength={50}
            aria-describedby={errors.lastName && touched.lastName ? 'lastName-error' : undefined}
            aria-invalid={!!(errors.lastName && touched.lastName)}
            disabled={isLoading}
          />
          {errors.lastName && touched.lastName && (
            <span id="lastName-error" className="form-error" role="alert">{errors.lastName}</span>
          )}
        </div>

        {/* Email */}
        <div className={`form-group ${fieldClass('email')}`}>
          <label htmlFor="email" className="form-label">
            Email Address <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. priya@company.com"
            maxLength={100}
            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            aria-invalid={!!(errors.email && touched.email)}
            disabled={isLoading}
          />
          {errors.email && touched.email && (
            <span id="email-error" className="form-error" role="alert">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className={`form-group ${fieldClass('phone')}`}>
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. +91 98765 43210"
            maxLength={20}
            aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
            aria-invalid={!!(errors.phone && touched.phone)}
            disabled={isLoading}
          />
          {errors.phone && touched.phone && (
            <span id="phone-error" className="form-error" role="alert">{errors.phone}</span>
          )}
        </div>

        {/* Department */}
        <div className={`form-group ${fieldClass('department')}`}>
          <label htmlFor="department" className="form-label">
            Department <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="department"
            name="department"
            className="form-select"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.department && touched.department ? 'department-error' : undefined}
            aria-invalid={!!(errors.department && touched.department)}
            disabled={isLoading}
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && touched.department && (
            <span id="department-error" className="form-error" role="alert">{errors.department}</span>
          )}
        </div>

        {/* Position */}
        <div className={`form-group ${fieldClass('position')}`}>
          <label htmlFor="position" className="form-label">
            Position / Title <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="position"
            name="position"
            type="text"
            className="form-input"
            value={formData.position}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Senior Engineer"
            maxLength={100}
            aria-describedby={errors.position && touched.position ? 'position-error' : undefined}
            aria-invalid={!!(errors.position && touched.position)}
            disabled={isLoading}
          />
          {errors.position && touched.position && (
            <span id="position-error" className="form-error" role="alert">{errors.position}</span>
          )}
        </div>

        {/* Salary */}
        <div className={`form-group ${fieldClass('salary')}`}>
          <label htmlFor="salary" className="form-label">
            Annual Salary (₹) <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            className="form-input"
            value={formData.salary}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 1200000"
            min={0}
            step={1000}
            aria-describedby={errors.salary && touched.salary ? 'salary-error' : undefined}
            aria-invalid={!!(errors.salary && touched.salary)}
            disabled={isLoading}
          />
          {errors.salary && touched.salary && (
            <span id="salary-error" className="form-error" role="alert">{errors.salary}</span>
          )}
        </div>

        {/* Joining Date */}
        <div className={`form-group ${fieldClass('joiningDate')}`}>
          <label htmlFor="joiningDate" className="form-label">
            Joining Date <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="joiningDate"
            name="joiningDate"
            type="date"
            className="form-input"
            value={formData.joiningDate}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.joiningDate && touched.joiningDate ? 'joiningDate-error' : undefined}
            aria-invalid={!!(errors.joiningDate && touched.joiningDate)}
            disabled={isLoading}
          />
          {errors.joiningDate && touched.joiningDate && (
            <span id="joiningDate-error" className="form-error" role="alert">{errors.joiningDate}</span>
          )}
        </div>

        {/* Status */}
        <div className={`form-group ${fieldClass('status')}`}>
          <label htmlFor="status" className="form-label">
            Status <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.status && touched.status ? 'status-error' : undefined}
            aria-invalid={!!(errors.status && touched.status)}
            disabled={isLoading}
          >
            <option value="">Select status…</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && touched.status && (
            <span id="status-error" className="form-error" role="alert">{errors.status}</span>
          )}
        </div>
      </div>

      <div className="employee-form__footer">
        <p className="form-required-note">
          <span aria-hidden="true">*</span> Required fields
        </p>
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={isLoading}
          id="employee-form-submit"
        >
          {isLoading ? (
            <span className="btn__loading-content">
              <span className="btn__spinner" aria-hidden="true" />
              Saving…
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}

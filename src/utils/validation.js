// Validation utilities for employee data
// These run client-side for UX; Firestore Security Rules enforce data integrity server-side.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Legal',
  'Product',
  'Design',
  'Customer Support',
];
const STATUSES = ['Active', 'Inactive'];

export { DEPARTMENTS, STATUSES };

/**
 * Validate all employee fields.
 * Returns an object where each key is a field name and the value is an error string (or undefined if valid).
 */
export function validateEmployee(data) {
  const errors = {};

  // First Name
  if (!data.firstName || !data.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = 'First name must be 50 characters or fewer.';
  }

  // Last Name
  if (!data.lastName || !data.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be 50 characters or fewer.';
  }

  // Email
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  } else if (data.email.trim().length > 100) {
    errors.email = 'Email must be 100 characters or fewer.';
  }

  // Phone
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number (7–20 digits).';
  }

  // Department
  if (!data.department) {
    errors.department = 'Department is required.';
  } else if (!DEPARTMENTS.includes(data.department)) {
    errors.department = 'Please select a valid department.';
  }

  // Position
  if (!data.position || !data.position.trim()) {
    errors.position = 'Position is required.';
  } else if (data.position.trim().length > 100) {
    errors.position = 'Position must be 100 characters or fewer.';
  }

  // Salary
  if (data.salary === '' || data.salary === null || data.salary === undefined) {
    errors.salary = 'Salary is required.';
  } else {
    const salaryNum = Number(data.salary);
    if (isNaN(salaryNum)) {
      errors.salary = 'Salary must be a number.';
    } else if (salaryNum < 0) {
      errors.salary = 'Salary cannot be negative.';
    } else if (salaryNum > 10_000_000) {
      errors.salary = 'Salary value seems unreasonably large.';
    }
  }

  // Joining Date
  if (!data.joiningDate) {
    errors.joiningDate = 'Joining date is required.';
  } else {
    const d = new Date(data.joiningDate);
    if (isNaN(d.getTime())) {
      errors.joiningDate = 'Please enter a valid date.';
    } else if (d.getFullYear() < 1980 || d.getFullYear() > 2100) {
      errors.joiningDate = 'Please enter a realistic joining date.';
    }
  }

  // Status
  if (!data.status) {
    errors.status = 'Status is required.';
  } else if (!STATUSES.includes(data.status)) {
    errors.status = 'Status must be Active or Inactive.';
  }

  return errors;
}

/**
 * Returns true if the errors object has no keys.
 */
export function isValid(errors) {
  return Object.keys(errors).length === 0;
}

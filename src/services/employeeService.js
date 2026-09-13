import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const EMPLOYEES_COLLECTION = 'employees';

/**
 * Fetch all employees, sorted client-side by lastName then firstName.
 * Avoids needing a Firestore composite index.
 * @returns {Promise<Array>} Sorted array of employee objects with Firestore doc id included.
 */
export async function getEmployees() {
  const snapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
  const employees = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  // Sort client-side: lastName ASC, then firstName ASC
  employees.sort((a, b) => {
    const last = (a.lastName || '').localeCompare(b.lastName || '');
    if (last !== 0) return last;
    return (a.firstName || '').localeCompare(b.firstName || '');
  });
  return employees;
}

/**
 * Fetch a single employee by ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<Object|null>}
 */
export async function getEmployee(id) {
  const ref = doc(db, EMPLOYEES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Create a new employee document.
 * @param {Object} data - Employee fields (validated before calling this)
 * @returns {Promise<string>} The new document ID
 */
export async function createEmployee(data) {
  const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    department: data.department,
    position: data.position.trim(),
    salary: Number(data.salary),
    joiningDate: data.joiningDate,
    status: data.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing employee document.
 * @param {string} id - Firestore document ID
 * @param {Object} data - Updated fields
 */
export async function updateEmployee(id, data) {
  const ref = doc(db, EMPLOYEES_COLLECTION, id);
  await updateDoc(ref, {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    department: data.department,
    position: data.position.trim(),
    salary: Number(data.salary),
    joiningDate: data.joiningDate,
    status: data.status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an employee document.
 * @param {string} id - Firestore document ID
 */
export async function deleteEmployee(id) {
  await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
}

/**
 * Seed the Firestore database with sample employee data.
 * Only adds employees if the collection is empty (idempotent).
 * Call this from the admin seed page.
 */
export async function seedEmployees() {
  const snapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
  if (!snapshot.empty) {
    return { seeded: 0, skipped: true, message: 'Employees already exist. Skipped seeding.' };
  }

  const sampleEmployees = [
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@company.com',
      phone: '+91 98765 43210',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      salary: 1200000,
      joiningDate: '2021-03-15',
      status: 'Active',
    },
    {
      firstName: 'Arjun',
      lastName: 'Mehta',
      email: 'arjun.mehta@company.com',
      phone: '+91 87654 32109',
      department: 'Product',
      position: 'Product Manager',
      salary: 1500000,
      joiningDate: '2020-07-01',
      status: 'Active',
    },
    {
      firstName: 'Divya',
      lastName: 'Nair',
      email: 'divya.nair@company.com',
      phone: '+91 76543 21098',
      department: 'Design',
      position: 'UI/UX Designer',
      salary: 900000,
      joiningDate: '2022-01-10',
      status: 'Active',
    },
    {
      firstName: 'Rohit',
      lastName: 'Verma',
      email: 'rohit.verma@company.com',
      phone: '+91 65432 10987',
      department: 'Marketing',
      position: 'Marketing Lead',
      salary: 850000,
      joiningDate: '2019-11-20',
      status: 'Active',
    },
    {
      firstName: 'Sneha',
      lastName: 'Patel',
      email: 'sneha.patel@company.com',
      phone: '+91 54321 09876',
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 950000,
      joiningDate: '2020-04-05',
      status: 'Active',
    },
    {
      firstName: 'Kiran',
      lastName: 'Reddy',
      email: 'kiran.reddy@company.com',
      phone: '+91 43210 98765',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 800000,
      joiningDate: '2021-08-22',
      status: 'Active',
    },
    {
      firstName: 'Amit',
      lastName: 'Joshi',
      email: 'amit.joshi@company.com',
      phone: '+91 32109 87654',
      department: 'Sales',
      position: 'Sales Executive',
      salary: 700000,
      joiningDate: '2018-06-30',
      status: 'Inactive',
    },
    {
      firstName: 'Meera',
      lastName: 'Krishnan',
      email: 'meera.krishnan@company.com',
      phone: '+91 21098 76543',
      department: 'Engineering',
      position: 'DevOps Engineer',
      salary: 1100000,
      joiningDate: '2023-02-14',
      status: 'Active',
    },
  ];

  const promises = sampleEmployees.map((emp) =>
    addDoc(collection(db, EMPLOYEES_COLLECTION), {
      ...emp,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await Promise.all(promises);
  return { seeded: sampleEmployees.length, skipped: false, message: `Seeded ${sampleEmployees.length} employees successfully.` };
}

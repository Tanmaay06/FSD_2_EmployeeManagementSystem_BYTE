import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase user object
  const [role, setRole] = useState(null);        // 'admin' | 'user' | null
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({ ...firebaseUser, name: userData.name, email: userData.email || firebaseUser.email });
            setRole(userData.role || 'user');
          } else {
            // No user profile in Firestore — treat as non-admin
            setUser(firebaseUser);
            setRole('user');
          }
        } catch {
          // Could not read user doc (e.g. rules denied)
          setUser(firebaseUser);
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    await signOut(auth);
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, role, authLoading, logout, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

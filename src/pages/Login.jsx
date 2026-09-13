import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

function humanizeAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact an administrator.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'Login failed. Please check your credentials and try again.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      // Check Firestore role
      let userDocSnap;
      try {
        userDocSnap = await getDoc(doc(db, 'users', uid));
      } catch (firestoreErr) {
        // Firestore rules may be blocking the read
        await auth.signOut();
        if (firestoreErr.code === 'permission-denied') {
          setError(
            'Database permission denied. Please deploy the Firestore Security Rules first, then try again. ' +
            'See firestore.rules in the project root and the README for deployment steps.'
          );
        } else {
          setError('Could not verify your account permissions. Please check your connection and try again.');
        }
        return;
      }

      if (!userDocSnap.exists()) {
        await auth.signOut();
        setError(
          'No admin profile found for your account. ' +
          'Please create a users/{uid} document in Firestore with role: "admin". See README for details.'
        );
        return;
      }

      if (userDocSnap.data().role !== 'admin') {
        await auth.signOut();
        setError('Access denied. Your account does not have administrator privileges.');
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(humanizeAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page" aria-label="Login page">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__icon" aria-hidden="true">👥</span>
          <h1 className="login-card__title">Employee Management</h1>
          <p className="login-card__subtitle">Sign in with your administrator account</p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert" id="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="login-card__form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? (
              <span className="btn__loading-content">
                <span className="btn__spinner" aria-hidden="true" />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="login-card__footer">
          Employee Management System &mdash; AVIP 2026 Task 2
        </p>
      </div>
    </main>
  );
}

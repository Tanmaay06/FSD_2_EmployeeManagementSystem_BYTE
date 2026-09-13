import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import './Login.css';

function humanizeAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait before trying again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'Login failed. Please check your credentials.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function triggerShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required.'); triggerShake(); return; }
    if (!password)     { setError('Password is required.'); triggerShake(); return; }

    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      let snap;
      try {
        snap = await getDoc(doc(db, 'users', uid));
      } catch (ferr) {
        await auth.signOut();
        if (ferr.code === 'permission-denied') {
          setError('Database permission denied. Please deploy Firestore Security Rules first. See firestore.rules in the project root.');
        } else {
          setError('Could not verify account permissions. Check your connection.');
        }
        triggerShake();
        return;
      }

      if (!snap.exists()) {
        await auth.signOut();
        setError('No admin profile found. Create a users/{uid} document with role: "admin" in Firestore.');
        triggerShake(); return;
      }
      if (snap.data().role !== 'admin') {
        await auth.signOut();
        setError('Access denied. Your account does not have administrator privileges.');
        triggerShake(); return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(humanizeAuthError(err.code));
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page" aria-label="Login page">
      {/* Left branding panel */}
      <div className="login-panel login-panel--brand" aria-hidden="true">
        <div className="login-panel__blobs">
          <div className="lp-blob lp-blob--1" />
          <div className="lp-blob lp-blob--2" />
        </div>
        <div className="login-panel__content">
          <div className="login-brand">
            <span className="login-brand__logo">👥</span>
            <span className="login-brand__name">EMS<strong>Pro</strong></span>
          </div>
          <h2 className="login-panel__headline">
            The modern way to manage your workforce
          </h2>
          <ul className="login-panel__features">
            {['Role-based admin authentication','Real-time Firestore database','Secure CRUD operations','Responsive dashboard interface'].map(f => (
              <li key={f}><span aria-hidden="true">✓</span> {f}</li>
            ))}
          </ul>
          <div className="login-panel__badge">AVIP 2026 · Task 2</div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel login-panel--form">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in with your administrator account</p>
          </div>

          {error && (
            <div className={`alert alert--error${shaking ? ' shake' : ''}`} role="alert" id="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <span className="input-icon" aria-hidden="true">✉</span>
                <input
                  id="login-email" type="email" className="form-input input-with-icon"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email" disabled={isLoading} required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon" aria-hidden="true">🔒</span>
                <input
                  id="login-password" type="password" className="form-input input-with-icon"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password" disabled={isLoading} required
                />
              </div>
            </div>

            <button
              type="submit" className="btn btn--primary btn--full btn--lg login-submit-btn"
              disabled={isLoading} id="login-submit-btn"
            >
              {isLoading ? (
                <span className="btn__loading-content">
                  <span className="btn__spinner" aria-hidden="true" />
                  Verifying…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="login-form-footer">
            Employee Management System &mdash; AVIP 2026 Task 2
          </p>
        </div>
      </div>
    </main>
  );
}

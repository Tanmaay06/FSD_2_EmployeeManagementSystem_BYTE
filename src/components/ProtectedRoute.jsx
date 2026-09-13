import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

/**
 * Wraps a route that requires an authenticated admin user.
 * Shows a loading spinner while auth state is being restored.
 * Redirects unauthenticated users to /login.
 * Shows an access-denied message to authenticated non-admins.
 */
export default function ProtectedRoute({ children }) {
  const { user, role, authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return <Loading fullPage message="Verifying authentication…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied__card">
          <span className="access-denied__icon" aria-hidden="true">⛔</span>
          <h1>Access Denied</h1>
          <p>
            Your account (<strong>{user.email}</strong>) does not have admin privileges.
          </p>
          <p>
            Please contact your system administrator if you believe this is an error.
          </p>
          <button
            className="btn btn--primary"
            onClick={() => {
              import('firebase/auth').then(({ signOut }) =>
                import('../firebase/firebase').then(({ auth }) => signOut(auth))
              );
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return children;
}

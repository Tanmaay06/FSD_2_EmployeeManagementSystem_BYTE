import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      console.error('Logout failed');
    }
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/dashboard" className="navbar__brand" id="navbar-brand">
          <span className="navbar__brand-icon" aria-hidden="true">👥</span>
          <span className="navbar__brand-text">EMS</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main Navigation">
          <Link
            to="/dashboard"
            className={`navbar__link ${isActive('/dashboard') && !isActive('/dashboard/employees') ? 'navbar__link--active' : ''}`}
            id="nav-link-dashboard"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/employees"
            className={`navbar__link ${isActive('/dashboard/employees') ? 'navbar__link--active' : ''}`}
            id="nav-link-employees"
          >
            Employees
          </Link>
          <Link
            to="/dashboard/seed"
            className={`navbar__link ${isActive('/dashboard/seed') ? 'navbar__link--active' : ''}`}
            id="nav-link-seed"
          >
            Seed Data
          </Link>
        </nav>

        <div className="navbar__user">
          <span className="navbar__user-email" aria-label={`Logged in as ${user?.email}`}>
            {user?.name || user?.email}
          </span>
          <button
            className="btn btn--outline btn--sm"
            onClick={handleLogout}
            id="logout-btn"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

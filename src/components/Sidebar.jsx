import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞', exact: true },
  { to: '/dashboard/employees', label: 'Employees', icon: '👥' },
  { to: '/dashboard/seed', label: 'Seed Data', icon: '🌱' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(item) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  async function handleLogout() {
    try { await logout(); navigate('/login', { replace: true }); }
    catch { console.error('Logout failed'); }
  }

  const initials = (user?.name || user?.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon" aria-hidden="true">👥</span>
        <span className="sidebar__brand-text">EMS<span>Pro</span></span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar__link${isActive(item) ? ' sidebar__link--active' : ''}`}
            aria-current={isActive(item) ? 'page' : undefined}
            id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-email" title={user?.email}>
              {user?.name || user?.email}
            </div>
          </div>
        </div>
        <button
          className="sidebar__link"
          onClick={handleLogout}
          style={{ marginTop: '.5rem', color: '#f87171' }}
          id="logout-btn"
        >
          <span className="sidebar__icon" aria-hidden="true">🚪</span>
          <span className="sidebar__label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

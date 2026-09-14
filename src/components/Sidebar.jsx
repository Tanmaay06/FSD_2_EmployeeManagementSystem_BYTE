import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IconGrid, IconUsers, IconDatabase, IconLogOut } from './Icons';

const NAV_ITEMS = [
  { to: '/dashboard',           label: 'Dashboard', icon: <IconGrid size={16} />, exact: true },
  { to: '/dashboard/employees', label: 'Employees', icon: <IconUsers size={16} /> },
  { to: '/dashboard/seed',      label: 'Seed Data', icon: <IconDatabase size={16} /> },
];

/* ── Compact brand mark — pure CSS, no emoji ── */
function BrandMark() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 'var(--r-md)', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 14px var(--primary-glow)',
    }}>
      <IconUsers size={16} color="#fff" strokeWidth={2.5} />
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  function isActive(item) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  async function handleLogout() {
    try { await logout(); navigate('/login', { replace: true }); }
    catch { console.error('Logout failed'); }
  }

  const displayName = user?.name || user?.email || '?';
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      {/* Brand */}
      <div className="sidebar__brand">
        <BrandMark />
        <span className="sidebar__brand-text">EMS<span>Pro</span></span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <div className="sidebar__section-label">Main Menu</div>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar__link${isActive(item) ? ' sidebar__link--active' : ''}`}
            aria-current={isActive(item) ? 'page' : undefined}
            id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar__footer">
        <div className="sidebar__user" aria-label={`Signed in as ${displayName}`}>
          <div className="sidebar__avatar">{initials}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-email" title={user?.email}>{displayName}</div>
            <div className="sidebar__user-role">Administrator</div>
          </div>
        </div>
        <button
          className="sidebar__link"
          onClick={handleLogout}
          style={{ marginTop: '.375rem', color: '#f87171' }}
          id="logout-btn"
          aria-label="Sign out"
        >
          <span className="sidebar__icon"><IconLogOut size={16} /></span>
          <span className="sidebar__label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

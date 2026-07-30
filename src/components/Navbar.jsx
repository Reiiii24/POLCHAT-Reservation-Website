import { Link, useLocation, NavLink } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/reservation', label: 'Reservation' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="PolChat Home">
          <svg className="navbar-logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
            <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="20" r="4" fill="currentColor" />
          </svg>
          <span className="navbar-title">PolChat</span>
        </Link>

        <div className="navbar-links" role="menubar">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              role="menuitem"
              aria-current={location.pathname === path ? 'page' : undefined}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button className="navbar-cta" aria-label="Book now">
          Book Now
        </button>
      </div>
    </nav>
  );
}
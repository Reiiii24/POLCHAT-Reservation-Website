import { Link, useLocation, NavLink } from "react-router-dom";
import Logo from "./Logo";
import "./Navbar.css";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/direction", label: "Directions" },
  { path: "/reservation", label: "Reservation" },
  { path: "/support", label: "Support" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="PolChat Home">
          <Logo className="navbar-logo" size={42} />

          <div className="navbar-brand-text">
            <span className="navbar-title">PolChat</span>
            <span className="navbar-sub">GARDEN RESORT</span>
          </div>
        </Link>

        <div className="navbar-links" role="menubar">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              role="menuitem"
              aria-current={location.pathname === path ? "page" : undefined}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/reservation"
          className="navbar-cta"
          aria-label="Book now"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Logo from "./Logo";
import "./Navbar.css";


// Keep the main routes in one place so both nav layouts stay in sync.
const navLinks = [
  {
    path: "/",
    label: "Home",
  },

  {
    path: "/services",
    label: "Services",
  },

  {
    path: "/direction",
    label: "Directions",
  },

  {
    path: "/support",
    label: "Support",
  },

  {
    path: "/gallery",
    label: "Gallery",
  },
];


export default function Navbar() {
  const location = useLocation();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  /*
    Automatically close the mobile
    menu whenever the user changes page.
  */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  return (
    <>
      <nav
        className="navbar"
        role="navigation"
        aria-label="Main navigation"
      >

        <div className="navbar-inner">

          {/* BRAND */}

          <Link
            to="/"
            className="navbar-brand"
            aria-label="PolChat Home"
          >
            <Logo
              className="navbar-logo"
              size={42}
            />

            <div className="navbar-brand-text">

              <span className="navbar-title">
                PolChat
              </span>

              <span className="navbar-sub">
                GARDEN RESORT
              </span>

            </div>

          </Link>


          {/* DESKTOP LINKS */}

          <div className="navbar-desktop">

            <div
              className="navbar-links"
              role="menubar"
            >

              {navLinks.map(
                ({
                  path,
                  label,
                }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/"}
                    className={({
                      isActive,
                    }) =>
                      `navbar-link ${
                        isActive
                          ? "active"
                          : ""
                      }`
                    }
                    role="menuitem"
                  >
                    {label}
                  </NavLink>
                )
              )}

            </div>


            <Link
              to="/reservation"
              className="navbar-cta"
            >
              Book Now
            </Link>

          </div>


          {/* MOBILE RIGHT SIDE */}

          <div className="navbar-mobile-actions">

            <Link
              to="/reservation"
              className="navbar-mobile-book"
            >
              Book
            </Link>


            <button
              type="button"
              className={`navbar-menu-toggle ${
                menuOpen
                  ? "navbar-menu-toggle-open"
                  : ""
              }`}
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={
                menuOpen
              }
              onClick={() =>
                setMenuOpen(
                  (previous) =>
                    !previous
                )
              }
            >

              <span></span>
              <span></span>
              <span></span>

            </button>

          </div>

        </div>


        {/* MOBILE DROPDOWN */}

        <div
          className={`navbar-mobile-panel ${
            menuOpen
              ? "navbar-mobile-panel-open"
              : ""
          }`}
        >

          <div className="navbar-mobile-links">

            {navLinks.map(
              ({
                path,
                label,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  className={({
                    isActive,
                  }) =>
                    `navbar-mobile-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              )
            )}


            <Link
              to="/reservation"
              className="navbar-mobile-cta"
            >
              Book Now
            </Link>

          </div>

        </div>

      </nav>


      {/* CLICK OUTSIDE MENU */}

      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="navbar-mobile-backdrop"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}
    </>
  );
}

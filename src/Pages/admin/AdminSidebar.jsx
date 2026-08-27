import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { supabase } from "../../lib/supabaseClient";

import "./AdminSidebar.css";


const topLink = {
  path: "/admin/notifications",
  label: "Notifications",
  icon: "◉",
};


const adminLinks = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: "▦",
    end: true,
  },

  {
    path: "/admin/booking",
    label: "Bookings",
    icon: "▣",
  },

  {
    path: "/admin/calendar",
    label: "Calendar",
    icon: "□",
  },

  {
    path: "/admin/chat",
    label: "Chat",
    icon: "◌",
  },

  {
    path: "/admin/customers",
    label: "Customer History",
    icon: "♙",
  },


];


export default function AdminSidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);


  /* ========================
     LOGOUT
     ======================== */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      setIsLoggingOut(false);

      return;
    }

    /*
      Close the mobile sidebar if
      it happens to be open.
    */
    onClose();

    /*
      Redirect to login after the
      Supabase session has been removed.
    */
    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  };


  /* ========================
     NAVIGATION LINK
     ======================== */

  const renderNavLink = (link) => (
    <NavLink
      key={link.path}
      to={link.path}
      end={link.end}
      onClick={onClose}
      title={link.label}
      className={({
        isActive,
      }) =>
        `admin-nav-link ${
          isActive
            ? "active"
            : ""
        }`
      }
    >
      <span className="admin-nav-icon">
        {link.icon}
      </span>

      <span className="admin-nav-text">
        {link.label}
      </span>
    </NavLink>
  );


  return (
    <aside
      className={`admin-sidebar ${
        isOpen
          ? "admin-sidebar-open"
          : ""
      }`}
    >

      {/* ========================
          HEADER
          ======================== */}

      <div className="admin-sidebar-header">

        <div className="admin-logo">

          <span className="admin-logo-mark">
            P
          </span>

          <div className="admin-logo-text">

            <h2>
              PolChat
            </h2>

            <p>
              ADMIN PANEL
            </p>

          </div>

        </div>


        <button
          type="button"
          className="admin-sidebar-close"
          aria-label="Close admin navigation"
          onClick={onClose}
        >
          ×
        </button>

      </div>


      {/* ========================
          NOTIFICATIONS
          ======================== */}

      <div className="admin-sidebar-top-link">
        {renderNavLink(topLink)}
      </div>


      {/* ========================
          NAVIGATION
          ======================== */}

      <div className="admin-sidebar-label">
        MANAGEMENT
      </div>

      <nav className="admin-nav">
        {adminLinks.map(
          renderNavLink
        )}
      </nav>


      {/* ========================
          ADMIN PROFILE
          ======================== */}

      <div className="admin-sidebar-footer">

        <div className="admin-profile">

          <div className="admin-profile-avatar">
            A
          </div>

          <div className="admin-profile-info">

            <strong>
              Administrator
            </strong>

            <span>
              PolChat Garden Resort
            </span>

          </div>

        </div>


        {/* ========================
            LOGOUT BUTTON
            ======================== */}

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >

          <span className="admin-logout-icon">
            ↪
          </span>

          <span className="admin-logout-text">
            {isLoggingOut
              ? "Logging Out..."
              : "Log Out"}
          </span>

        </button>

      </div>

    </aside>
  );
}
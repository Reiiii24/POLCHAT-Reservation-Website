import {
  NavLink,
} from "react-router-dom";

import "./AdminSidebar.css";


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

  {
    path: "/admin/notifications",
    label: "Notifications",
    icon: "◉",
  },

  {
    path: "/admin/payments",
    label: "Payment Requests",
    icon: "₱",
  },
];


export default function AdminSidebar({
  isOpen = false,
  onClose = () => {},
}) {

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
          NAVIGATION
          ======================== */}

      <div className="admin-sidebar-label">
        MANAGEMENT
      </div>


      <nav className="admin-nav">

        {adminLinks.map(
          (link) => (
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
          )
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


        <button
          type="button"
          className="admin-logout"
        >
          <span className="admin-logout-icon">
            ↪
          </span>

          <span className="admin-logout-text">
            Log Out
          </span>
        </button>

      </div>

    </aside>
  );
}
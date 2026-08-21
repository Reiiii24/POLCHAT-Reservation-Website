import { NavLink } from "react-router-dom";
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

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-mark">P</span>

          <div>
            <h2>PolChat</h2>
            <p>ADMIN PANEL</p>
          </div>
        </div>
      </div>

      <div className="admin-sidebar-label">
        MANAGEMENT
      </div>

      <nav className="admin-nav">
        {adminLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="admin-nav-icon">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-profile">
          <div className="admin-profile-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <span>PolChat Garden Resort</span>
          </div>
        </div>

        {/*
          This is only visual for now.
          Later this will call Supabase Auth signOut().
        */}
        <button
          type="button"
          className="admin-logout"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
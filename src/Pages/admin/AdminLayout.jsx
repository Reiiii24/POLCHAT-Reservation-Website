import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import AdminSidebar from "./AdminSidebar";

import "./AdminLayout.css";


export default function AdminLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const location =
    useLocation();


  /*
    Close the sidebar whenever
    an admin navigates to another page.
  */

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);


  return (
    <div className="admin-layout">

      {/* ========================
          MOBILE HEADER
          ======================== */}

      {/* Mobile header keeps the menu button close on smaller screens. */}
      <header className="admin-mobile-header">

        <button
          type="button"
          className="admin-mobile-menu-button"
          aria-label="Open admin navigation"
          aria-expanded={
            sidebarOpen
          }
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>


        <div className="admin-mobile-brand">

          <strong>
            PolChat
          </strong>

          <span>
            Admin Panel
          </span>

        </div>

      </header>


      {/* ========================
          SIDEBAR
          ======================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      {/* MOBILE BACKDROP */}

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close admin navigation"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* ========================
          CURRENT ADMIN PAGE
          ======================== */}

      <main className="admin-main-content">
        <Outlet />
      </main>

    </div>
  );
}
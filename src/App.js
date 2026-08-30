import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

/* =========================
   CUSTOMER COMPONENTS
   ========================= */

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ResortIntro from "./components/ResortIntro";
import ServiceList from "./components/ServiceList";
import ContactInfo from "./components/ContactInfo";

import ReservationPage from "./Pages/Reservation/ReservationPage";
import SupportPage from "./Pages/Support/SupportPage";
import Direction from "./Pages/Direction/Direction";
import Gallery from "./Pages/Gallery/Gallery";


/* =========================
   ADMIN COMPONENTS
   ========================= */

import AdminLayout from "./Pages/admin/AdminLayout";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminProtectedRoute from "./Pages/admin/AdminProtectedRoute";

import Dashboard from "./Pages/admin/Dashboard";
import Booking from "./Pages/admin/Booking";
import Calendar from "./Pages/admin/Calendar";
import Chat from "./Pages/admin/Chat";
import CustomerHistory from "./Pages/admin/CustomerHistory";
import Notifications from "./Pages/admin/Notifications";


import "./App.css";


/* =========================
   CUSTOMER LAYOUT
   ========================= */

function CustomerLayout() {
  return (
    <div className="App">

      <Navbar />

      <main className="app-main">
        <Outlet />
      </main>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            CUSTOMER WEBSITE
            ===================================== */}

        <Route element={<CustomerLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/services"
            element={
              <>
                <ResortIntro />
                <ServiceList />
                <ContactInfo />
              </>
            }
          />

          <Route
            path="/direction"
            element={<Direction />}
          />

          <Route
            path="/reservation"
            element={<ReservationPage />}
          />

          <Route
            path="/support"
            element={<SupportPage />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/contact"
            element={<ContactInfo />}
          />

        </Route>


        {/* =====================================
            ADMIN WEBSITE
            ===================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

          {/* Default Admin Page */}
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="booking"
            element={<Booking />}
          />

          <Route
            path="calendar"
            element={<Calendar />}
          />

          <Route
            path="chat"
            element={<Chat />}
          />

          <Route
            path="customers"
            element={<CustomerHistory />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="gallery"
            element={<Gallery />}
          />


        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;

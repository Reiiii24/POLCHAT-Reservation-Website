import logo from './logo.svg';
import './App.css';

// function App() {
//   return
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.js
import { useState } from "react";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Home", "About Us", "Rooms & Rates", "Amenities", "Gallery", "Reviews", "Contact"];

  return (
    <div className="resort">
      <div className="resort-bg" />
      <div className="resort-lights">
        {[12, 22, 33, 45, 58, 70, 82, 92].map((left, i) => (
          <span key={i} className="light-glow" style={{ left: `${left}%`, top: `${8 + (i % 3) * 3}%` }} />
        ))}
      </div>
      <div className="resort-foliage" />

      {/* NAVIGATION */}
      <header className="navbar">
        <div className="logo">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C10 2 6 8 6 14c0 5 4 9 9 9s9-4 9-9c0-6-4-12-9-12z" stroke="#d9c17a" strokeWidth="1.4" />
            <path d="M15 9v14" stroke="#d9c17a" strokeWidth="1.2" />
          </svg>
          <div className="logo-text">
            <p className="logo-name">PolChat</p>
            <p className="logo-sub">GARDEN RESORT</p>
          </div>
        </div>

        <nav className="nav-links desktop-only">
          {navLinks.map((link, i) => (
            <a key={link} href="#" className={i === 0 ? "active" : ""}>{link}</a>
          ))}
        </nav>

        <button className="book-btn desktop-only">Book Now</button>

        <button className="menu-toggle mobile-only" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-drawer">
          {navLinks.map((link) => <a key={link} href="#">{link}</a>)}
          <button className="book-btn">Book Now</button>
        </div>
      )}

      {/* HERO */}
      <main className="hero">
        <p className="eyebrow">Nature. Comfort. Memories.</p>
        <h1>Welcome to<br />PolChat <span>Garden Resort</span></h1>
        <p className="subtext">Relax, Recharge, and Experience Nature at its Finest.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Explore Resort</button>
          <button className="btn-secondary">▶ Watch Video</button>
        </div>
      </main>

      {/* BOOKING BAR */}
      <div className="booking-bar">
        <div className="booking-field">
          <span className="label">Check-in</span>
          <span className="value">May 25, 2025</span>
        </div>
        <div className="booking-field">
          <span className="label">Check-out</span>
          <span className="value">May 26, 2025</span>
        </div>
        <div className="booking-field">
          <span className="label">Guests</span>
          <span className="value">2 Guests ▾</span>
        </div>
        <button className="check-btn">Check Availability →</button>
      </div>
    </div>
  );
}

export default App;


// This file shows the resort contact details and related info for guests.

import Logo from './Logo';
import './ContactInfo.css';

export default function ContactInfo() {
  return (
    <section className="about-footnote">
      <div className="about-footer-box">
        <div className="about-footer-top">
          <div className="about-footer-column about-footer-brand-column">
            {/* Brand block keeps the resort identity visible in the footer. */}
            <div className="about-footer-brand">
              <Logo size={40} className="footer-logo" />
              <div>
                <p className="about-footer-brand-name">PolChat</p>
                <p className="about-footer-brand-sub">Garden Resort</p>
              </div>
            </div>
            <p className="about-footer-brand-text">
              Perfect for those who seek comfort,
              Refocusing on the good vibes &amp; 
              Regenerating energy from within.
            </p>
            <div className="about-footer-socials" aria-label="Social links">
              <a href="/" className="about-footer-social">f</a>
              <a href="/" className="about-footer-social">ig</a>
              <a href="/" className="about-footer-social">p</a>
            </div>
          </div>

          {/* Keep only the main links in the shared footer. */}
          <div className="about-footer-column">
            <h3 className="about-footer-heading">Quick Links</h3>
            <ul className="about-footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">About Us</a></li>
            </ul>
          </div>

          <div className="about-footer-column">
            <h3 className="about-footer-heading">Contact Us</h3>
            <ul className="about-footer-contact-list">
              <li>+63 915 841 0828</li>
              <li>marrydianae8@gmail.com</li>
              <li>
                Blk 5 Lot 1 James Street Baltao Subdivision, 
                Taktak Road Brgy Sta Cruz, Antipolo City, Antipolo, Philippines, 1870
              </li>
            </ul>
          </div>

          <div className="about-footer-column">
            <h3 className="about-footer-heading">Operating Hours</h3>
            <div className="about-footer-hours">
              <p>Monday - Sunday</p>
              <p>8:00 AM - 10:00 PM</p>
            </div>
            <blockquote className="about-footer-quote">
              "Relax. Recharge.
              <br />
              Reconnect with Nature."
            </blockquote>
          </div>
        </div>

        <div className="about-footer-bottom">
          <span className="about-footer-bottom-icon" aria-hidden="true">❦</span>
          <p>© 2020 PolChat Garden Resort. All Rights Reserved.</p>
          <span className="about-footer-bottom-icon" aria-hidden="true">❦</span>
        </div>
      </div>
    </section>
  );
}
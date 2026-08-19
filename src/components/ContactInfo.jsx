import Logo from './Logo';
import './ContactInfo.css';

export default function ContactInfo() {
  return (
    <section className="about-footnote">
      <div className="about-footer-box">
        <div className="about-footer-top">
          <div className="about-footer-column about-footer-brand-column">
            <div className="about-footer-brand">
              <Logo size={40} className="footer-logo" />
              <div>
                <p className="about-footer-brand-name">PolChat</p>
                <p className="about-footer-brand-sub">Garden Resort</p>
              </div>
            </div>
            <p className="about-footer-brand-text">
              A serene escape where comfort meets nature. Create beautiful
              memories with your loved ones.
            </p>
            <div className="about-footer-socials" aria-label="Social links">
              <a href="/" className="about-footer-social">f</a>
              <a href="/" className="about-footer-social">ig</a>
              <a href="/" className="about-footer-social">p</a>
            </div>
          </div>

          <div className="about-footer-column">
            <h3 className="about-footer-heading">Quick Links</h3>
            <ul className="about-footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Rooms &amp; Rates</a></li>
              <li><a href="/services">Amenities</a></li>
              <li><a href="/services">Gallery</a></li>
              <li><a href="/services">Reviews</a></li>
<<<<<<< HEAD
              <li><a href="/contact">Contact Us</a></li>
=======
>>>>>>> f6a57fba29ce54ca257a57aa7da264555426a1b5
            </ul>
          </div>

          <div className="about-footer-column">
            <h3 className="about-footer-heading">Contact Us</h3>
            <ul className="about-footer-contact-list">
              <li>+63 915 641 8828</li>
              <li>reamydaine8@gmail.com</li>
              <li>
                Blk 5 Lot 1 Jamesa Street Balitao Subdivision, Taktak Road
                Brgy Sta Cruz, Antipolo City, Rizal, Philippines
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
          <p>© 2025 PolChat Garden Resort. All Rights Reserved.</p>
          <span className="about-footer-bottom-icon" aria-hidden="true">❦</span>
        </div>
      </div>
    </section>
  );
}
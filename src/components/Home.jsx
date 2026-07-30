import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-image-note">
          <span>Insert hero background image here</span>
          <small>Best fit: sunset resort, pool, garden lights</small>
        </div>

        <div className="home-shell">
          <div className="home-hero-copy">
            <p className="home-kicker">Nature. Comfort. Memories.</p>
            <h1>
              Welcome to
              <br />
              PolChat Garden Resort
            </h1>
            <div className="home-divider" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="home-subcopy">
              Relax, recharge, and experience nature at its finest. Discover a
              warm garden retreat made for family stays, celebrations, and
              peaceful weekends.
            </p>

            <div className="home-actions">
              <button type="button" className="home-btn home-btn-primary">
                Explore Resort
              </button>
              <button type="button" className="home-btn home-btn-secondary">
                Watch Video
              </button>
            </div>
          </div>

          <aside className="assistant-card" aria-label="Quick information">
            <div className="assistant-head">
              <div>
                <h2>Hi there!</h2>
                <p>
                  I&apos;m PolChat, your friendly assistant. Here are a few
                  things guests usually look for first.
                </p>
              </div>
              <button type="button" className="assistant-dots">
                ...
              </button>
            </div>

            <div className="assistant-links">
              <button type="button" className="assistant-link">
                <span>Check room availability</span>
                <strong>&rsaquo;</strong>
              </button>
              <button type="button" className="assistant-link">
                <span>Rates &amp; Packages</span>
                <strong>&rsaquo;</strong>
              </button>
              <button type="button" className="assistant-link">
                <span>Amenities</span>
                <strong>&rsaquo;</strong>
              </button>
              <button type="button" className="assistant-link">
                <span>How to get here</span>
                <strong>&rsaquo;</strong>
              </button>
            </div>

            <div className="assistant-input">
              <span>Type your message...</span>
              <button type="button" className="assistant-send">
                &uarr;
              </button>
            </div>
          </aside>
        </div>

        <div className="booking-strip-wrap">
          <div className="booking-strip">
            <div className="booking-item">
              <small>Check-in</small>
              <strong>May 25, 2025</strong>
            </div>
            <div className="booking-item">
              <small>Check-out</small>
              <strong>May 26, 2025</strong>
            </div>
            <div className="booking-item">
              <small>Guests</small>
              <strong>2 Guests</strong>
            </div>
            <button type="button" className="booking-button">
              Check Availability
            </button>
          </div>
        </div>
      </section>

      <section className="home-why">
        <div className="section-heading">
          <p>Why Choose PolChat?</p>
          <h2>Your Perfect Getaway Awaits</h2>
        </div>

        <div className="why-grid">
          <article className="why-card">
            <div className="why-icon">🍃</div>
            <div>
              <h3>Surrounded by Nature</h3>
              <p>Lush greenery and fresh air to soothe your soul.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon">☂</div>
            <div>
              <h3>Clean &amp; Relaxing</h3>
              <p>Well-maintained facilities designed for comfort.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon">👨‍👩‍👧</div>
            <div>
              <h3>Perfect for Everyone</h3>
              <p>Great for family stays, barkada trips, and events.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon">♡</div>
            <div>
              <h3>Memories That Last</h3>
              <p>Create meaningful moments with the people you love.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="home-story">
        <div className="section-heading section-heading-left">
          <p>About the Resort</p>
          <h2>A welcoming garden stay with room for rest and celebration</h2>
        </div>

        <div className="story-grid">
          <div className="story-copy">
            <p>
              PolChat Garden Resort is designed to feel warm, intimate, and
              refreshing from the moment guests arrive. The space blends nature,
              comfort, and simple elegance for overnight stays, day visits, and
              special occasions.
            </p>
            <p>
              You can use this section for your resort background, mission,
              guest capacity, opening hours, and your best value points.
            </p>
            <ul className="story-list">
              <li>Ideal for family weekends and private celebrations</li>
              <li>Convenient booking, cozy rooms, and relaxing surroundings</li>
              <li>Space for featured promos, policies, or house reminders</li>
            </ul>
          </div>

          <div className="image-slot image-slot-large">
            <span>Insert main resort image here</span>
            <small>Recommended: exterior, pool, or garden overview</small>
          </div>
        </div>
      </section>

      <section className="home-gallery">
        <div className="section-heading">
          <p>Photo Highlights</p>
          <h2>Places where you can add your best images</h2>
        </div>

        <div className="gallery-grid">
          <div className="image-slot">
            <span>Insert room image</span>
            <small>Guest room or suite</small>
          </div>
          <div className="image-slot">
            <span>Insert pool image</span>
            <small>Day or night pool view</small>
          </div>
          <div className="image-slot">
            <span>Insert dining image</span>
            <small>Food, table setup, or breakfast</small>
          </div>
          <div className="image-slot">
            <span>Insert event image</span>
            <small>Wedding, birthday, or gathering</small>
          </div>
        </div>
      </section>

      <section className="home-info">
        <div className="info-panel">
          <div>
            <p className="info-label">Initial Information</p>
            <h2>What guests should know before booking</h2>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Location</h3>
              <p>Add your full address, landmark, and map directions here.</p>
            </div>
            <div className="info-card">
              <h3>Check-in Policy</h3>
              <p>Add check-in/check-out times and guest requirements here.</p>
            </div>
            <div className="info-card">
              <h3>Contact Details</h3>
              <p>Add your mobile number, email, and Facebook page here.</p>
            </div>
            <div className="info-card">
              <h3>Featured Offer</h3>
              <p>Add current promos, rates, inclusions, or seasonal deals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-services-brief">
        <div className="services-brief-panel">
          <div className="section-heading section-heading-left">
            <p>Services Brief Info</p>
            <h2>Quick details about the services you offer</h2>
          </div>

          <div className="services-brief-grid">
            <article className="services-brief-card">
              <h3>Day Tour Access</h3>
              <p>
                Add a short overview of day tour schedules, inclusions, and
                guest access here.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Room Stays</h3>
              <p>
                Add a brief note about room types, overnight packages, and
                standard amenities here.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Events &amp; Gatherings</h3>
              <p>
                Add your event offerings for birthdays, reunions, corporate
                bookings, or intimate celebrations.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-footnote">
        <div className="footer-box">
          <div className="footer-top">
            <div className="footer-column footer-brand-column">
              <div className="footer-brand">
                <div className="footer-brand-mark" aria-hidden="true">
                  <span />
                </div>
                <div>
                  <p className="footer-brand-name">PolChat</p>
                  <p className="footer-brand-sub">Garden Resort</p>
                </div>
              </div>
              <p className="footer-brand-text">
                A serene escape where comfort meets nature. Create beautiful
                memories with your loved ones.
              </p>
              <div className="footer-socials" aria-label="Social links">
                <a href="/" className="footer-social">f</a>
                <a href="/" className="footer-social">ig</a>
                <a href="/" className="footer-social">p</a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/services">About Us</a></li>
                <li><a href="/services">Rooms &amp; Rates</a></li>
                <li><a href="/services">Amenities</a></li>
                <li><a href="/services">Gallery</a></li>
                <li><a href="/services">Reviews</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-contact-list">
                <li>+63 915 641 8828</li>
                <li>reamydaine8@gmail.com</li>
                <li>
                  Blk 5 Lot 1 Jamesa Street Balitao Subdivision, Taktak Road
                  Brgy Sta Cruz, Antipolo City, Rizal, Philippines
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Operating Hours</h3>
              <div className="footer-hours">
                <p>Monday - Sunday</p>
                <p>8:00 AM - 10:00 PM</p>
              </div>
              <blockquote className="footer-quote">
                "Relax. Recharge.
                <br />
                Reconnect with Nature."
              </blockquote>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-bottom-icon" aria-hidden="true">❦</span>
            <p>© 2025 PolChat Garden Resort. All Rights Reserved.</p>
            <span className="footer-bottom-icon" aria-hidden="true">❦</span>
          </div>
        </div>
      </section>
    </div>
  );
}

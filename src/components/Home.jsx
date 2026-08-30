import Logo from './Logo';
import './Home.css';
import PolchatEntrance from '../Assets/polchatEntrance.png';
import highlightOne from '../Assets/highlightOne.png';
import highlightTwo from '../Assets/highlightTwo.png';
import highlightThree from '../Assets/higlightThree.png';
import highlightFour from '../Assets/highlightFour.png';

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-overlay" />

        <div className="home-shell">
          <div className="home-hero-copy">
            <p className="home-kicker">Nature. Peace. Unwind.</p>
            <h1>
              Welcome to
              <br />
              PolChat Garden Resort!
            </h1>
            <div className="home-divider" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="home-subcopy">
              
            </p>Perfect for those who seek comfort, <p>Refocusing on the good vibes & Regenerating energy from within. </p>
          

            <div className="home-actions">
              <button type="button" className="home-btn home-btn-primary">
                Explore Resort
              </button>
            </div>
          </div>

        </div>

        {/*this is the booking mini navigation and need functionality */} 
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
          <h2>Your Perfect Getaway Awaits...</h2>
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
          <article className="why-card">
            <div className="why-icon">🏊‍♂️</div>
            <div>
              <h3>Refreshing Pool Access</h3>
              <p>Cool down and enjoy refreshing dips under the open sky.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon">📍</div>
            <div>
              <h3>Accessible Location</h3>
              <p>Conveniently located in Antipolo.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="home-story">
        <div className="section-heading section-heading-left">
         {/* <p>About the Resort</p>*/} 
          <h2> A Place To Relax, Recharge, & Reconnect!</h2>
        </div>

        <div className="story-grid">
          <div className="story-copy">
            <p>
              <b>PolChat Garden Resort</b> is designed to feel warm and
              refreshing from the moment guests arrive. Whether you're planning a family outing, barkada bonding, birthday celebration, or simply a well-deserved break, 
              PolChat Garden offers a relaxing atmosphere where unforgettable memories are made.
            </p>
        
            <ul className="story-list">
              <li>Ideal for family weekends and private celebrations</li>
              <li>Convenient booking, cozy rooms, and relaxing surroundings</li>
              <li>Space for featured promos, policies, or house reminders</li>
            </ul>
          </div>

          <div className="image-slot image-slot-large"> {/*for photos*/}
            <img src={PolchatEntrance} alt="PolChat Garden Resort surrounded by nature" />
          </div>
        </div>
      </section>

      <section className="home-gallery">
        <div className="section-heading">  {/*for photos*/}
         {/*<p>Photo Highlights</p>*/}
          <h2>Photo Highlights from PolChat Garden Resort</h2>
        </div>

        <div className="gallery-grid"> {/*for photos in the home page*/}
          <div className="image-slot">
            <img src={highlightOne} alt="Guest room or suite at PolChat Garden Resort" />
          </div>
          <div className="image-slot">
            <img src={highlightThree} alt="Dining area at PolChat Garden Resort" />
          </div>
           <div className="image-slot">
            <img src={highlightTwo} alt="Pool and garden view at PolChat Garden Resort" />
          </div>
          <div className="image-slot">
            <img src={highlightFour} alt="Event space at PolChat Garden Resort" />
          </div>
        </div>
      </section>

      <section className="home-services-brief">
        <div className="services-brief-panel">
          <div className="section-heading section-heading-left">
          
            <h2> Services of PolChat Garden Resort</h2>
          </div>

          <div className="services-brief-grid">
            <article className="services-brief-card">
              <h3>Day Tour Access</h3>
              <p>
                Enjoy a relaxing day surrounded by nature with access to open
                cottages, garden spaces, and resort amenities.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Room Stays</h3>
              <p>
                Stay overnight in comfortable rooms designed for restful
                weekends, family trips, and quiet staycations.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Events &amp; Gatherings</h3>
              <p>
                Host birthdays, reunions, and special celebrations in a warm
                garden setting made for shared moments.
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
                <Logo size={40} className="footer-logo" />
                <div>
                  <p className="footer-brand-name">PolChat</p>
                  <p className="footer-brand-sub">Garden Resort</p>
                </div>
              </div>
              <p className="footer-brand-text">
                Perfect for those who seek comfort,
                Refocusing on the good vibes & 
                Regenerating energy from within.
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
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-contact-list">
                <li>+63 915 841 0828</li>
                <li>marrydianae8@gmail.com</li>
                <li>
                  Blk 5 Lot 1 James Street Baltao Subdivision, 
                  Taktak Road Brgy Sta Cruz, Antipolo City, Antipolo, Philippines, 1870
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
            <p>© 2020 PolChat Garden Resort. All Rights Reserved.</p>
            <span className="footer-bottom-icon" aria-hidden="true">❦</span>
          </div>
        </div>
      </section>
    </div>
  );
}

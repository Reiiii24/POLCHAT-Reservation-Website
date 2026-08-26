import './ResortIntro.css';

function ResortIntro() {
  return (
    <section className="resort-intro">
      <div className="intro-shell">
        <div className="intro-story">
          <p className="intro-kicker">About the Resort</p>
          <div className="intro-copy">
            <h1>So What is PolChat Garden Resort?</h1>
            <p>
              Launched in 2026, the PolChat Web-Based Resort Management System
              was developed to bridge the gap between traditional hospitality
              and modern digital convenience. Before this platform, booking a
              getaway at PolChat Garden Resort required manual scheduling,
              endless phone calls, and back-and-forth messaging.
            </p>
            <p>
              We built this automated system to give guests an instant,
              hassle-free way to check room availability, find accurate travel
              directions, and get immediate answers to common questions — all
              in one secure place.
            </p>
          </div>
        </div>
        <div className="intro-image-slot">
          <span>Insert resort image here</span>
          <small>Garden, pool, or exterior view</small>
        </div>
      </div>

      <div className="section-heading">
        <p>Why Choose PolChat?</p>
        <h2>Why This Resort</h2>
      </div>

      <div className="why-grid">
        <article className="why-card">
          <div className="why-icon">🌿</div>
          <div>
            <h3>Nature &amp; Serenity</h3>
            <p>
              Escape the noise. Our lush green gardens and refreshing pools
              offer the perfect peaceful environment to unwind with family
              and friends.
            </p>
          </div>
        </article>
        <article className="why-card">
          <div className="why-icon">💰</div>
          <div>
            <h3>Affordable Comfort</h3>
            <p>
              Enjoy premium amenities, cozy cottages, and private event
              spaces tailored to fit your family staycation or corporate
              budget.
            </p>
          </div>
        </article>
        <article className="why-card">
          <div className="why-icon">⭐</div>
          <div>
            <h3>Trusted Service</h3>
            <p>
              A secure and reliable booking experience backed by verified
              reservations and responsive guest support.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ResortIntro;
import './ResortIntro.css';

function ResortIntro() {
  return (
    <section className="resort-intro">
      <div className="intro-shell">
        <div className="intro-story">
          <p className="intro-kicker">About the Resort</p>
          <div className="intro-copy">
            <h1>How Polchat Came To Be?</h1>
            <p>
          Our story began with our parents' love for nature. 
          They spent years cultivating landscaping services and planting a wide variety of flora around our property. 
          What started with lush greenery soon expanded into a cozy retreat featuring a classic Bahay Kubo, a fun Tree House, and an inflatable pool for quick cooling off. </p>

          <p>
          Seeing the joy these simple elements brought to family and friends, my brother had a bigger vision:
          why not turn our green sanctuary into a full-fledged resort? Encouraged by his idea, we officially launched our business in 2020, and by 2021–2022, we upgraded our simple setups with a permanent swimming pool.
            </p>
            <p>
              Today, PotChat is fully family-owned and operated: </p>

              <p>
              Our Parents manage the day-to-day operations on-site, ensuring every corner of the property stays welcoming, clean, and beautiful.
              Whether you're looking for a peaceful getaway surrounded by nature or a fun swimming day with your loved ones, our family is here to welcome yours!
            </p>
          </div>
        </div>
        <div className="intro-image-slot">
          <span>Insert resort image here</span>
          <small>Garden, pool, or exterior view</small>
        </div>
      </div>

      <div className="section-heading">
        <p>So Why Choose PolChat?</p>
        <h2> Reasons Why You Should Choose PolChat Garden Resort</h2>
      </div>

      <div className="why-grid why-grid-alternating">
        <div className="intro-photo-slot">
          <span>Insert image 1</span>
          <small>Garden or entrance photo</small>
        </div>
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
        <div className="intro-photo-slot">
          <span>Insert image 2</span>
          <small>Pool or cottage photo</small>
        </div>
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
        <div className="intro-photo-slot">
          <span>Insert image 3</span>
          <small>Event or family area photo</small>
        </div>
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
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
          <div className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M12 3c3.9 2 6.2 6 6.2 10.1 0 4.2-2.8 7.7-6.2 7.7s-6.2-3.5-6.2-7.7C5.8 9 8.1 5 12 3Zm0 3.1c-2.4 1.7-3.9 4.6-3.9 7 0 2.8 1.7 5.1 3.9 5.1s3.9-2.3 3.9-5.1c0-2.4-1.5-5.3-3.9-7Z" />
              <path d="M12 9.2c1.3 1 2.2 2.5 2.2 4 0 1.9-1.1 3.4-2.2 3.4S9.8 15.1 9.8 13.2c0-1.5.9-3 2.2-4Z" />
            </svg>
          </div>
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
          <div className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M12 4c4.4 0 8 3 8 6.8 0 2.5-1.7 4.7-4.1 5.8l.1 2.4-2.1-.1-.1-1.8c-.6.1-1.2.2-1.8.2-4.4 0-8-3-8-6.8S7.6 4 12 4Zm0 2C8.7 6 6 7.9 6 10.8s2.7 4.8 6 4.8 6-1.9 6-4.8S15.3 6 12 6Zm-1 1.5h2v1h1.2c1.1 0 1.8.7 1.8 1.6s-.7 1.6-1.8 1.6H11c-.4 0-.6.2-.6.5s.2.5.6.5h3.8v1H13v1h-2v-1h-1.2c-1.1 0-1.8-.7-1.8-1.6s.7-1.6 1.8-1.6H13c.4 0 .6-.2.6-.5s-.2-.5-.6-.5h-3.8v-1H11v-1Z" />
            </svg>
          </div>
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
          <div className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M12 3 9.4 8.2 4 9l3.9 3.8-.9 5.4L12 15.7l5 2.5-.9-5.4L20 9l-5.4-.8L12 3Z" />
            </svg>
          </div>
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
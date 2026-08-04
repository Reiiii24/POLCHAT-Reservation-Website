import "./Direction.css";

export default function Direction() {
  return (
    <section className="direction-page">

      {/* Background Overlay */}
      <div className="direction-overlay"></div>

      <div className="direction-container">

        {/* Hero */}
        <div className="direction-hero">

          <h4>DIRECTIONS</h4>

          <h1>
            Where is <span>PolChat?</span>
          </h1>

          <p>
            We're easy to find! Follow the map or use your favorite maps app
            to reach PolChat Garden Resort.
          </p>

        </div>

        {/* Google Map */}
        <div className="map-card">

          <div className="travel-card">

            <div className="travel-icon">
              🚗
            </div>

            <h3>From Antipolo City</h3>

            <h1>24 min</h1>

            <p>12.6 km via Marikina–Infanta Highway</p>

          </div>

          <iframe
            title="PolChat Garden Resort"
            src="https://www.google.com/maps?q=Blk%205%20Lot%201%20James%20Street%20Baltao%20Subdivision%20Taktak%20Road%20Brgy%20Sta%20Cruz%20Antipolo%20City%20Philippines&output=embed"
            loading="lazy"
            allowFullScreen
          ></iframe>

        </div>

        {/* Contact Cards */}

        <div className="contact-grid">

          <div className="info-card">

            <div className="icon">
              📍
            </div>

            <div>

              <h3>ADDRESS</h3>

              <p>
                Blk 5 Lot 1 James Street
                <br />
                Baltao Subdivision
                <br />
                Taktak Road
                <br />
                Brgy. Sta. Cruz
                <br />
                Antipolo City
                <br />
                Philippines 1870
              </p>

            </div>

          </div>

          <div className="info-card">

            <div className="icon">
              📞
            </div>

            <div>

              <h3>MOBILE</h3>

              <p>+63 915 841 0828</p>

            </div>

          </div>

          <div className="info-card">

            <div className="icon">
              ✉️
            </div>

            <div>

              <h3>EMAIL</h3>

              <p>manydansanz@gmail.com</p>

            </div>

          </div>

          <div className="info-card">

            <div className="icon">
              🌐
            </div>

            <div>

              <h3>FACEBOOK</h3>

              <p>
                PolChat Garden and
                <br />
                Landscaping Services
              </p>

            </div>

          </div>

        </div>

        {/* Footer Quote */}

        <div className="direction-footer">

          <p>
            ❦ A peaceful escape is closer than you think. ❦
          </p>

        </div>

      </div>

    </section>
  );
}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.957776407717!2d121.16405689999998!3d14.601481199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b9001840a21d%3A0x34dc9d7152f44ab!2sPolChat%20Garden!5e0!3m2!1sen!2sph!4v1785926965312!5m2!1sen!2sph"
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
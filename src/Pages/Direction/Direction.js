import "./Direction.css";

export default function Direction() {
  const getDirections = () => {
  const destination =
    "Blk 5 Lot 1 James Street, Baltao Subdivision, Taktak Road, Brgy Sta Cruz, Antipolo City, Antipolo, Philippines, 1870";

  // Check if the browser supports GPS
  if (!navigator.geolocation) {
    // GPS isn't supported, so just open Google Maps normally
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;

    window.open(mapsUrl, "_blank");
    return;
  }

  // Ask the visitor for their current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Open Google Maps from the user's current location
      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${latitude},${longitude}` +
        `&destination=${encodeURIComponent(destination)}` +
        `&travelmode=driving`;

      window.open(mapsUrl, "_blank");
    },

    () => {
      // User denied GPS or GPS couldn't be obtained
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}`;

      window.open(mapsUrl, "_blank");
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
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

  <iframe
    title="PolChat Garden Resort"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.957776407717!2d121.16405689999998!3d14.601481199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b9001840a21d%3A0x34dc9d7152f44ab!2sPolChat%20Garden!5e0!3m2!1sen!2sph!4v1786198049809!5m2!1sen!2sph"
    loading="lazy"
    allowFullScreen
  ></iframe>

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
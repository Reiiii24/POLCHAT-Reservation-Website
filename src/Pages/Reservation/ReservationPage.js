import "./ReservationPage.css";
import Background from "../../Assets/Background.png";

function ReservationPage() {
  return (
    <div
      className="reservation-page"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="slider-frame">
        {/* Left/Right arrows (visual only for now) */}
        <button className="arrow left">&#10094;</button>
        <button className="arrow right">&#10095;</button>

        {/* Dots */}
        <div className="dots">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* White reservation card */}
        <div className="reservation-card">
          <div className="reservation-top">
            <h3 className="left-title">Reservation</h3>
          </div>

          <div className="reservation-grid">
            {/* Form */}
            <div className="form-section">
              <label>
                <span>Name</span>
                <input type="text" placeholder="Value" />
              </label>

              <label>
                <span>Address</span>
                <input type="text" placeholder="Value" />
              </label>

              <label>
                <span>Contact Number</span>
                <input type="text" placeholder="Value" />
              </label>

              <label>
                <span>Number of Guests</span>
                <input type="number" placeholder="Value" />
              </label>

              <label>
                <span>Duration</span>
                <input type="number" placeholder="Value" />
              </label>

              <button className="submit-btn" type="button">
                Submit
              </button>
            </div>

            {/* Calendar Placeholder */}
            <div className="calendar-section">
              <div className="calendar-header">
                <h3>Reservation Date</h3>
              </div>

              <div className="calendar-box">Calendar goes here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;
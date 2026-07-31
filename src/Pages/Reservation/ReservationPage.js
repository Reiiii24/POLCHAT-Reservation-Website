import { useState } from "react";
import "./ReservationPage.css";
import Background from "../../Assets/Background.png";

function ReservationPage() {
  const [step, setStep] = useState(1);
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

    {step === 1 ? (
        <>

            <label>
                <span>Name</span>
                <input type="text" placeholder="Enter your full name" />
            </label>

            <label>
                <span>Address</span>
                <input type="text" placeholder="Enter your address" />
            </label>

            <label>
                <span>Contact Number</span>
                <input type="text" placeholder="09XXXXXXXXXX" />
            </label>

            <label>
                <span>Number of Guests</span>
                <input type="number" />
            </label>

            <label>
                <span>Duration (Hours)</span>
                <input type="number" />
            </label>

            <button
                className="submit-btn"
                type="button"
                onClick={() => setStep(2)}
            >
                Next
            </button>

        </>
    ) : (
        <>

            <label>
                <span>E-Mail</span>
                <input type="email" placeholder="example@email.com" />
            </label>

            <label>
                <span>Confirm E-Mail</span>
                <input type="email" placeholder="Re-enter your email" />
            </label>

            <label>
                <span>Preferred Arrival Time</span>
                <input type="time" />
            </label>

            <label>
                <span>Special Requests</span>
                <textarea rows="5"></textarea>
            </label>

            <div className="button-group">

                <button
                    className="back-btn"
                    type="button"
                    onClick={() => setStep(1)}
                >
                    Back
                </button>

                <button
                    className="submit-btn"
                    type="button"
                >
                    Submit
                </button>

            </div>

        </>
    )}

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
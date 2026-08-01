import { useState } from "react";
import "./ReservationPage.css";
import Background from "../../Assets/Background.png";

function ReservationPage() {
  const [step, setStep] = useState(1);

  // Calendar states
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get number of days in current month
  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // Get which day of the week the month starts on
  const firstDayOfMonth = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Go to previous month
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Go to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Select a date
  const selectDate = (day) => {
    const chosenDate = new Date(
      currentYear,
      currentMonth,
      day
    );

    chosenDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Prevent selecting dates in the past
    if (chosenDate < currentDate) {
      return;
    }

    setSelectedDate(chosenDate);
  };

  // Check if date is selected
  const isSelected = (day) => {
    if (!selectedDate) {
      return false;
    }

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  // Check if date already passed
  const isPastDate = (day) => {
    const date = new Date(
      currentYear,
      currentMonth,
      day
    );

    date.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return date < currentDate;
  };

  return (
    <div
      className="reservation-page"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="slider-frame">

        {/* Slider arrows */}
        <button className="arrow left">
          &#10094;
        </button>

        <button className="arrow right">
          &#10095;
        </button>

        {/* Slider dots */}
        <div className="dots">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Reservation form + title */}
        <div className="reservation-wrapper">

          {/* TITLE IS NOW OUTSIDE THE FORM */}
          <h1 className="reservation-title">
            Reservation
          </h1>

          {/* White Card */}
          <div className="reservation-card">

            <div className="reservation-grid">

              {/* LEFT SIDE FORM */}
              <div className="form-section">

                {step === 1 ? (
                  <>
                    <label>
                      <span>Name</span>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                      />
                    </label>

                    <label>
                      <span>Address</span>
                      <input
                        type="text"
                        placeholder="Enter your address"
                      />
                    </label>

                    <label>
                      <span>Contact Number</span>
                      <input
                        type="text"
                        placeholder="09XXXXXXXXX"
                      />
                    </label>

                    <label>
                      <span>Number of Guests</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Number of guests"
                      />
                    </label>

                    <label>
                      <span>Duration</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Duration"
                      />
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
                      <input
                        type="email"
                        placeholder="example@email.com"
                      />
                    </label>

                    <label>
                      <span>Confirm E-Mail</span>
                      <input
                        type="email"
                        placeholder="Re-enter your email"
                      />
                    </label>

                    <label>
                      <span>Preferred Arrival Time</span>
                      <input type="time" />
                    </label>

                    <label>
                      <span>Special Requests</span>

                      <textarea
                        rows="5"
                        placeholder="Additional requests or notes..."
                      ></textarea>
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

              {/* RIGHT SIDE CALENDAR */}
              <div className="calendar-section">

                <div className="calendar-header">
                  <h3>Reservation Date</h3>
                </div>

                <div className="calendar-box">

                  {/* Month controls */}
                  <div className="calendar-navigation">

                    <button
                      type="button"
                      onClick={previousMonth}
                      className="calendar-nav-btn"
                    >
                      &#10094;
                    </button>

                    <h2>
                      {monthNames[currentMonth]}{" "}
                      {currentYear}
                    </h2>

                    <button
                      type="button"
                      onClick={nextMonth}
                      className="calendar-nav-btn"
                    >
                      &#10095;
                    </button>

                  </div>

                  {/* Days of week */}
                  <div className="calendar-weekdays">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Dates */}
                  <div className="calendar-days">

                    {/* Blank cells before first day */}
                    {Array.from({
                      length: firstDayOfMonth,
                    }).map((_, index) => (
                      <div
                        key={`blank-${index}`}
                        className="calendar-empty"
                      ></div>
                    ))}

                    {/* Actual dates */}
                    {Array.from(
                      { length: daysInMonth },
                      (_, index) => {
                        const day = index + 1;
                        const past = isPastDate(day);

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={past}
                            onClick={() =>
                              selectDate(day)
                            }
                            className={`calendar-day
                              ${
                                isSelected(day)
                                  ? "selected"
                                  : ""
                              }
                              ${
                                past
                                  ? "disabled"
                                  : ""
                              }
                            `}
                          >
                            {day}
                          </button>
                        );
                      }
                    )}

                  </div>

                  {/* Selected date */}
                  <div className="selected-date">

                    {selectedDate ? (
                      <>
                        <span>Selected Date</span>

                        <strong>
                          {selectedDate.toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </strong>
                      </>
                    ) : (
                      <span>
                        Please select your reservation date.
                      </span>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReservationPage;
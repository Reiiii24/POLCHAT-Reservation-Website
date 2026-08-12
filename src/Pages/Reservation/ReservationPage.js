import { useState } from "react";
import "./ReservationPage.css";
import Background from "../../Assets/Background.png";
import { supabase } from "../../lib/supabaseClient";

function ReservationPage() {
  const today = new Date();

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Prevents duplicate submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     FORM DATA
     ========================= */

  const [formData, setFormData] = useState({
    name: "",
    bookingType: "",
    address: "",
    contactNumber: "",
    guests: "",
    stayType: "",
    email: "",
    confirmEmail: "",
    arrivalTime: "",
    specialRequests: "",
  });

  /* =========================
     CALENDAR
     ========================= */

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

  const [selectedDate, setSelectedDate] = useState(null);

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

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  /* =========================
     CAPACITY RULES
     ========================= */

  const capacityLimits = {
    "Day Tour": 60,
    Overnight: 35,
    "22 Hours": 25,
  };

  const guestCount = Number(formData.guests) || 0;

  const selectedCapacity =
    capacityLimits[formData.stayType] || 0;

  const exceedsCapacity =
    selectedCapacity > 0 &&
    guestCount > selectedCapacity;

  /* Base rate includes 20 guests */

  const extraGuests = Math.max(
    0,
    guestCount - 20
  );

  const extraGuestFee =
    extraGuests * 200;

  /* =========================
     FORM FUNCTIONS
     ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setFormError("");
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.bookingType ||
      !formData.address ||
      !formData.contactNumber ||
      !formData.guests ||
      !formData.stayType ||
      !selectedDate
    ) {
      setFormError(
        "Please complete all required reservation details and select a reservation date."
      );

      return;
    }

    if (guestCount < 1) {
      setFormError(
        "The number of guests must be at least 1."
      );

      return;
    }

    if (exceedsCapacity) {
      setFormError(
        `${formData.stayType} allows a maximum of ${selectedCapacity} guests.`
      );

      return;
    }

    setFormError("");
    setStep(2);
  };

  /* =========================
     DATABASE DATE FORMAT
     ========================= */

  const formatDateForDatabase = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================
     SUPABASE SUBMISSION
     ========================= */

  const handleSubmit = async () => {
    /*
      Final validation before touching
      the database.
    */

    if (
      !formData.email ||
      !formData.confirmEmail ||
      !formData.arrivalTime
    ) {
      setFormError(
        "Please complete all required fields before submitting."
      );

      return;
    }

    if (!selectedDate) {
      setFormError(
        "Please select a reservation date."
      );

      return;
    }

    if (
      formData.email.trim().toLowerCase() !==
      formData.confirmEmail.trim().toLowerCase()
    ) {
      setFormError(
        "The email addresses do not match."
      );

      return;
    }

    if (exceedsCapacity) {
      setFormError(
        `${formData.stayType} allows a maximum of ${selectedCapacity} guests.`
      );

      return;
    }

    /*
      Prevent the customer from clicking
      Submit multiple times.
    */

    if (isSubmitting) {
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    /*
      Object that will be inserted into
      the Supabase reservations table.
    */

    const reservationData = {
      name: formData.name.trim(),

      customer_type:
        formData.bookingType,

      address:
        formData.address.trim(),

      contact_number:
        formData.contactNumber.trim(),

      email:
        formData.email
          .trim()
          .toLowerCase(),

      number_of_guests:
        guestCount,

      reservation_type:
        formData.stayType,

      reservation_date:
        formatDateForDatabase(
          selectedDate
        ),

      arrival_time:
        formData.arrivalTime,

      special_requests:
        formData.specialRequests.trim()
          ? formData.specialRequests.trim()
          : null,

      extra_guest_fee:
        extraGuestFee,
    };

    try {
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        console.error(
          "Supabase reservation error:",
          error
        );

        setFormError(
          "We could not submit your reservation. Please try again."
        );

        return;
      }

      /*
        Supabase accepted the reservation,
        so NOW we can safely show the
        success popup.
      */

      setShowSuccess(true);

    } catch (error) {
      console.error(
        "Unexpected reservation error:",
        error
      );

      setFormError(
        "An unexpected error occurred. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     CALENDAR FUNCTIONS
     ========================= */

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);

      setCurrentYear(
        currentYear - 1
      );

    } else {
      setCurrentMonth(
        currentMonth - 1
      );
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);

      setCurrentYear(
        currentYear + 1
      );

    } else {
      setCurrentMonth(
        currentMonth + 1
      );
    }
  };

  const selectDate = (day) => {
    const chosenDate = new Date(
      currentYear,
      currentMonth,
      day
    );

    chosenDate.setHours(
      0,
      0,
      0,
      0
    );

    const currentDate =
      new Date();

    currentDate.setHours(
      0,
      0,
      0,
      0
    );

    if (
      chosenDate <
      currentDate
    ) {
      return;
    }

    setSelectedDate(
      chosenDate
    );

    setFormError("");
  };

  const isSelected = (day) => {
    if (!selectedDate) {
      return false;
    }

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() ===
        currentMonth &&
      selectedDate.getFullYear() ===
        currentYear
    );
  };

  const isPastDate = (day) => {
    const date = new Date(
      currentYear,
      currentMonth,
      day
    );

    date.setHours(
      0,
      0,
      0,
      0
    );

    const currentDate =
      new Date();

    currentDate.setHours(
      0,
      0,
      0,
      0
    );

    return (
      date <
      currentDate
    );
  };

  return (
    <div
      className="reservation-page"
      style={{
        backgroundImage:
          `url(${Background})`,
      }}
    >

      <div className="slider-frame">

        {/* Slider arrows */}

        <button
          className="arrow left"
          type="button"
          aria-label="Previous image"
        >
          &#10094;
        </button>

        <button
          className="arrow right"
          type="button"
          aria-label="Next image"
        >
          &#10095;
        </button>

        {/* Slider dots */}

        <div className="dots">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="reservation-wrapper">

          <h1 className="reservation-title">
            Reservation
          </h1>

          <div className="reservation-card">

            <div className="reservation-grid">

              {/* =====================
                  LEFT FORM
                  ===================== */}

              <div className="form-section">

                {step === 1 ? (
                  <>

                    <label>
                      <span>
                        Name <b>*</b>
                      </span>

                      <input
                        type="text"
                        name="name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your full name"
                      />
                    </label>

                    <label>
                      <span>
                        Family or Company{" "}
                        <b>*</b>
                      </span>

                      <select
                        name="bookingType"
                        value={
                          formData.bookingType
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="">
                          Select booking type
                        </option>

                        <option value="Family">
                          Family
                        </option>

                        <option value="Company">
                          Company
                        </option>

                      </select>
                    </label>

                    <label>
                      <span>
                        Address <b>*</b>
                      </span>

                      <input
                        type="text"
                        name="address"
                        value={
                          formData.address
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your address"
                      />
                    </label>

                    <label>
                      <span>
                        Contact Number{" "}
                        <b>*</b>
                      </span>

                      <input
                        type="tel"
                        name="contactNumber"
                        value={
                          formData.contactNumber
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="09XXXXXXXXX"
                      />
                    </label>

                    <label>
                      <span>
                        Number of Guests{" "}
                        <b>*</b>
                      </span>

                      <input
                        type="number"
                        name="guests"
                        value={
                          formData.guests
                        }
                        onChange={
                          handleChange
                        }
                        min="1"
                        placeholder="Number of guests"
                      />
                    </label>

                    <label>
                      <span>
                        Reservation Type{" "}
                        <b>*</b>
                      </span>

                      <select
                        name="stayType"
                        value={
                          formData.stayType
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="">
                          Select reservation type
                        </option>

                        <option value="Day Tour">
                          Day Tour
                        </option>

                        <option value="Overnight">
                          Overnight
                        </option>

                        <option value="22 Hours">
                          22 Hours
                        </option>

                      </select>
                    </label>

                    {/* CAPACITY INFORMATION */}

                    {formData.stayType && (
                      <div className="capacity-info">

                        <strong>
                          {
                            formData.stayType
                          }
                        </strong>

                        <span>
                          Maximum capacity:{" "}
                          {
                            selectedCapacity
                          }{" "}
                          guests
                        </span>

                        {formData.stayType ===
                          "22 Hours" && (
                          <span>
                            Sleeping capacity
                            is limited to 25
                            guests.
                          </span>
                        )}

                      </div>
                    )}

                    {/* RATE INFORMATION */}

                    <div className="rate-info">

                      <p>
                        The base rate covers
                        up to{" "}
                        <strong>
                          20 guests
                        </strong>
                        .
                      </p>

                      <p>
                        Additional guests are
                        charged{" "}
                        <strong>
                          ₱200 per person
                        </strong>
                        .
                      </p>

                      {extraGuests > 0 &&
                        !exceedsCapacity && (
                          <div className="additional-fee">

                            {extraGuests}{" "}
                            additional{" "}
                            {extraGuests === 1
                              ? "guest"
                              : "guests"}
                            :{" "}

                            <strong>
                              ₱
                              {extraGuestFee.toLocaleString()}
                            </strong>

                          </div>
                        )}

                      {exceedsCapacity && (
                        <div className="capacity-warning">

                          This exceeds the
                          maximum capacity of{" "}
                          {
                            selectedCapacity
                          }{" "}
                          guests for{" "}
                          {
                            formData.stayType
                          }.

                        </div>
                      )}

                    </div>

                    {formError && (
                      <p className="form-error">
                        {formError}
                      </p>
                    )}

                    <button
                      className="submit-btn"
                      type="button"
                      onClick={
                        handleNext
                      }
                    >
                      Next
                    </button>

                  </>
                ) : (
                  <>

                    <label>
                      <span>
                        E-Mail <b>*</b>
                      </span>

                      <input
                        type="email"
                        name="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="example@email.com"
                      />
                    </label>

                    <label>
                      <span>
                        Confirm E-Mail{" "}
                        <b>*</b>
                      </span>

                      <input
                        type="email"
                        name="confirmEmail"
                        value={
                          formData.confirmEmail
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Re-enter your email"
                      />
                    </label>

                    <label>
                      <span>
                        Preferred Arrival
                        Time <b>*</b>
                      </span>

                      <input
                        type="time"
                        name="arrivalTime"
                        value={
                          formData.arrivalTime
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Special Requests
                      </span>

                      <textarea
                        rows="5"
                        name="specialRequests"
                        value={
                          formData.specialRequests
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Add any requests or notes here..."
                      />
                    </label>

                    {formError && (
                      <p className="form-error">
                        {formError}
                      </p>
                    )}

                    <div className="button-group">

                      <button
                        className="back-btn"
                        type="button"
                        disabled={
                          isSubmitting
                        }
                        onClick={() => {
                          setStep(1);
                          setFormError("");
                        }}
                      >
                        Back
                      </button>

                      <button
                        className="submit-btn"
                        type="button"
                        disabled={
                          isSubmitting
                        }
                        onClick={
                          handleSubmit
                        }
                      >

                        {isSubmitting
                          ? "Submitting..."
                          : "Submit"}

                      </button>

                    </div>

                  </>
                )}

              </div>

              {/* =====================
                  RIGHT SIDE
                  ===================== */}

              <div className="calendar-section">

                <div className="calendar-header">
                  <h3>
                    Reservation Date
                  </h3>
                </div>

                <div className="calendar-box">

                  <div className="calendar-navigation">

                    <button
                      type="button"
                      onClick={
                        previousMonth
                      }
                      className="calendar-nav-btn"
                    >
                      &#10094;
                    </button>

                    <h2>
                      {
                        monthNames[
                          currentMonth
                        ]
                      }{" "}
                      {currentYear}
                    </h2>

                    <button
                      type="button"
                      onClick={
                        nextMonth
                      }
                      className="calendar-nav-btn"
                    >
                      &#10095;
                    </button>

                  </div>

                  <div className="calendar-weekdays">

                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>

                  </div>

                  <div className="calendar-days">

                    {Array.from({
                      length:
                        firstDayOfMonth,
                    }).map(
                      (_, index) => (
                        <div
                          key={`blank-${index}`}
                          className="calendar-empty"
                        />
                      )
                    )}

                    {Array.from(
                      {
                        length:
                          daysInMonth,
                      },
                      (_, index) => {

                        const day =
                          index + 1;

                        const past =
                          isPastDate(day);

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={
                              past
                            }
                            onClick={() =>
                              selectDate(
                                day
                              )
                            }
                            className={`calendar-day ${
                              isSelected(
                                day
                              )
                                ? "selected"
                                : ""
                            } ${
                              past
                                ? "disabled"
                                : ""
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                    )}

                  </div>

                  <div className="selected-date">

                    {selectedDate ? (
                      <>
                        <span>
                          Selected Date
                        </span>

                        <strong>
                          {selectedDate.toLocaleDateString(
                            "en-US",
                            {
                              month:
                                "long",
                              day:
                                "numeric",
                              year:
                                "numeric",
                            }
                          )}
                        </strong>
                      </>
                    ) : (
                      <span>
                        Please select your
                        reservation date.
                      </span>
                    )}

                  </div>

                </div>

                {/* RESERVATION RULES */}

                <div className="reservation-policies">

                  <h3>
                    Important Reservation
                    Policies
                  </h3>

                  <ul>

                    <li>
                      The base rate covers
                      up to{" "}
                      <strong>
                        20 guests
                      </strong>
                      . Additional guests
                      are charged{" "}
                      <strong>
                        ₱200 per person
                      </strong>
                      , subject to the
                      applicable guest
                      capacity.
                    </li>

                    <li>
                      A{" "}
                      <strong>
                        ₱2,000 security
                        deposit
                      </strong>{" "}
                      is required to cover
                      possible missing or
                      damaged resort
                      property. Any
                      refundable amount
                      will be returned
                      within{" "}
                      <strong>
                        24 hours after
                        checkout
                      </strong>
                      , following
                      inspection.
                    </li>

                    <li>
                      To confirm a
                      reservation, guests
                      must pay{" "}
                      <strong>
                        50% of the required
                        down payment
                      </strong>{" "}
                      together with the{" "}
                      <strong>
                        ₱2,000 security
                        deposit
                      </strong>
                      .
                    </li>

                    <li>
                      Guests are
                      encouraged to bring
                      their own personal
                      essentials and
                      preferred items for
                      their stay.
                    </li>

                    <li>
                      To maintain a
                      comfortable and safe
                      environment for
                      everyone, loud,
                      disruptive, or
                      disorderly
                      gatherings are not
                      allowed.
                    </li>

                  </ul>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            SUCCESS POPUP
            ========================= */}

        {showSuccess && (
          <div className="success-overlay">

            <div
              className="success-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-title"
            >

              <div className="success-icon">
                ✓
              </div>

              <h2 id="success-title">
                Reservation Submitted
              </h2>

              <p>
                Your reservation request
                has been submitted
                successfully.
              </p>

              <p className="success-note">
                Please wait for
                confirmation from PolChat
                Garden Resort before
                considering your
                reservation final.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowSuccess(false)
                }
              >
                Close
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ReservationPage;
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import "./ReservationPage.css";

import placeHolderOne from "../../Assets/placeHolderOne.jpg";
import placeHolderTwo from "../../Assets/placeHolderTwo.png";
import placeHolderThree from "../../Assets/placeHolderThree.png";
import placeHolderFour from "../../Assets/placeHolderFour.png";
import placeHolderFive from "../../Assets/placeHolderFive.png";
import placeHolderSix from "../../Assets/placeHolderSix.jpg";

import { supabase } from "../../lib/supabaseClient";


/* =========================
   RESORT SLIDESHOW IMAGES
   ========================= */

const resortImages = [
  placeHolderOne,
  placeHolderTwo,
  placeHolderThree,
  placeHolderFour,
  placeHolderFive,
  placeHolderSix,
];


/* =========================
   DATE HELPERS
   ========================= */

const formatDateKey = (
  year,
  monthIndex,
  day
) => {
  const month = String(
    monthIndex + 1
  ).padStart(2, "0");

  const formattedDay = String(
    day
  ).padStart(2, "0");

  return `${year}-${month}-${formattedDay}`;
};


const formatDateObjectForDatabase = (
  date
) => {
  return formatDateKey(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};


/* =========================
   COMPONENT
   ========================= */

function ReservationPage() {
  const today = new Date();

  const [step, setStep] =
    useState(1);

  const [
    showSuccess,
    setShowSuccess,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  /* =========================
     SLIDESHOW
     ========================= */

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);


  useEffect(() => {
    const slideshowTimer =
      setInterval(() => {
        setCurrentSlide(
          (previousSlide) =>
            previousSlide ===
            resortImages.length - 1
              ? 0
              : previousSlide + 1
        );
      }, 5000);

    return () => {
      clearInterval(
        slideshowTimer
      );
    };
  }, []);


  const previousSlide = () => {
    setCurrentSlide(
      (previousSlideIndex) =>
        previousSlideIndex === 0
          ? resortImages.length - 1
          : previousSlideIndex - 1
    );
  };


  const nextSlide = () => {
    setCurrentSlide(
      (previousSlideIndex) =>
        previousSlideIndex ===
        resortImages.length - 1
          ? 0
          : previousSlideIndex + 1
    );
  };


  /* =========================
     FORM DATA
     ========================= */

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    bookingType: "",
    groupName: "",
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
     CALENDAR STATE
     ========================= */

  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(
    today.getMonth()
  );

  const [
    currentYear,
    setCurrentYear,
  ] = useState(
    today.getFullYear()
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(null);


  /* =========================
     AVAILABILITY STATE
     ========================= */

  const [
    availabilityByDate,
    setAvailabilityByDate,
  ] = useState({});

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState("");


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


  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();


  const firstDayOfMonth =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();


  /* =========================
     LOAD CONFIRMED
     RESERVATION AVAILABILITY
     ========================= */

  const fetchConfirmedAvailability =
    useCallback(async () => {
      setAvailabilityLoading(
        true
      );

      setAvailabilityError("");

      const startDate =
        formatDateKey(
          currentYear,
          currentMonth,
          1
        );

      const endDate =
        formatDateKey(
          currentYear,
          currentMonth,
          daysInMonth
        );

      const {
        data,
        error,
      } = await supabase.rpc(
        "get_confirmed_reservation_availability",
        {
          p_start_date:
            startDate,

          p_end_date:
            endDate,
        }
      );


      if (error) {
        console.error(
          "Reservation availability error:",
          error
        );

        setAvailabilityError(
          "Availability could not be loaded. Final availability will still be checked when you submit."
        );

        setAvailabilityLoading(
          false
        );

        return;
      }


      const nextAvailability =
        {};


      (data || []).forEach(
        (item) => {
          nextAvailability[
            item.reservation_date
          ] = item;
        }
      );


      setAvailabilityByDate(
        nextAvailability
      );

      setAvailabilityLoading(
        false
      );
    }, [
      currentMonth,
      currentYear,
      daysInMonth,
    ]);


  /* =========================
     LOAD WHEN MONTH CHANGES
     ========================= */

  useEffect(() => {
    fetchConfirmedAvailability();
  }, [
    fetchConfirmedAvailability,
  ]);


  /* =========================
     REALTIME AVAILABILITY
     ========================= */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "reservation-availability"
        )
        .on(
          "broadcast",
          {
            event:
              "availability_changed",
          },
          () => {
            fetchConfirmedAvailability();
          }
        )
        .subscribe();


    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    fetchConfirmedAvailability,
  ]);


  /* =========================
     AVAILABILITY HELPERS
     ========================= */

  const getAvailabilityForDay = (
    day
  ) => {
    const dateKey =
      formatDateKey(
        currentYear,
        currentMonth,
        day
      );

    return (
      availabilityByDate[
        dateKey
      ] || null
    );
  };


  const getAvailabilityForDate =
  useCallback(
    (date) => {
      if (!date) {
        return null;
      }

      const dateKey =
        formatDateObjectForDatabase(
          date
        );

      return (
        availabilityByDate[
          dateKey
        ] || null
      );
    },
    [availabilityByDate]
  );


  /* =========================
     RESPOND TO REALTIME
     CONFLICTS
     ========================= */

  useEffect(() => {
    if (!selectedDate) {
      return;
    }


    const availability =
      getAvailabilityForDate(
        selectedDate
      );


    /*
      A confirmed 22 Hours booking
      makes the entire date unavailable.
    */

    if (
      availability
        ?.availability_status ===
      "unavailable"
    ) {
      setSelectedDate(null);

      setStep(1);

      setFormError(
        "The date you selected has just become fully unavailable because a 22 Hours reservation was confirmed. Please choose another date."
      );

      return;
    }


    /*
      If a Day Tour / Overnight becomes
      confirmed while this customer is
      trying to book 22 Hours, require
      another date.
    */

    if (
      availability
        ?.availability_status ===
        "partial" &&
      formData.stayType ===
        "22 Hours"
    ) {
      setSelectedDate(null);

      setStep(1);

      setFormError(
        "22 Hours requires an entirely free date. The selected date now has a confirmed Day Tour or Overnight reservation. Please choose another date."
      );
    }
  }, [
    selectedDate,
  formData.stayType,
  getAvailabilityForDate,
  ]);


  /* =========================
     CAPACITY RULES
     ========================= */

  const capacityLimits = {
    "Day Tour": 60,
    Overnight: 35,
    "22 Hours": 25,
  };


  const guestCount =
    Number(
      formData.guests
    ) || 0;


  const selectedCapacity =
    capacityLimits[
      formData.stayType
    ] || 0;


  const exceedsCapacity =
    selectedCapacity > 0 &&
    guestCount >
      selectedCapacity;


  /* =========================
     EXTRA GUEST FEE
     ========================= */

  const extraGuests =
    Math.max(
      0,
      guestCount - 20
    );


  const extraGuestFee =
    extraGuests * 200;


  /* =========================
     FORM CHANGE
     ========================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;


    /*
      Reset group name when
      switching Family / Company.
    */

    if (
      name ===
      "bookingType"
    ) {
      setFormData(
        (previousData) => ({
          ...previousData,

          bookingType:
            value,

          groupName:
            "",
        })
      );

      setFormError("");

      return;
    }


    /*
      If the customer already selected
      a yellow date, then changes the
      reservation type to 22 Hours,
      clear that date.
    */

    if (
      name === "stayType" &&
      value ===
        "22 Hours" &&
      selectedDate
    ) {
      const availability =
        getAvailabilityForDate(
          selectedDate
        );


      if (
        availability
          ?.availability_status ===
        "partial"
      ) {
        setFormData(
          (previousData) => ({
            ...previousData,

            stayType:
              value,
          })
        );

        setSelectedDate(
          null
        );

        setFormError(
          "22 Hours requires an entirely free date. Your previously selected date already has a confirmed Day Tour or Overnight reservation. Please select another date."
        );

        return;
      }
    }


    setFormData(
      (previousData) => ({
        ...previousData,

        [name]:
          value,
      })
    );


    setFormError("");
  };


  /* =========================
     NEXT BUTTON
     ========================= */

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.bookingType ||
      !formData.groupName ||
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


    const dateAvailability =
      getAvailabilityForDate(
        selectedDate
      );


    if (
      dateAvailability
        ?.availability_status ===
      "unavailable"
    ) {
      setFormError(
        "This date is fully unavailable because a confirmed 22 Hours reservation occupies the resort."
      );

      return;
    }


    if (
      formData.stayType ===
        "22 Hours" &&
      dateAvailability
        ?.availability_status ===
        "partial"
    ) {
      setFormError(
        "22 Hours requires an entirely free date. Please choose a date without a confirmed Day Tour or Overnight reservation."
      );

      return;
    }


    if (
      guestCount < 1
    ) {
      setFormError(
        "The number of guests must be at least 1."
      );

      return;
    }


    if (
      exceedsCapacity
    ) {
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

  const formatDateForDatabase = (
    date
  ) => {
    return formatDateObjectForDatabase(
      date
    );
  };


  /* =========================
     SUBMIT RESERVATION
     ========================= */

  const handleSubmit =
    async () => {
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


      if (
        !selectedDate
      ) {
        setFormError(
          "Please select a reservation date."
        );

        setStep(1);

        return;
      }


      /*
        Check the currently loaded
        confirmed availability again.
      */

      const dateAvailability =
        getAvailabilityForDate(
          selectedDate
        );


      if (
        dateAvailability
          ?.availability_status ===
        "unavailable"
      ) {
        setFormError(
          "This date is fully unavailable because a confirmed 22 Hours reservation occupies the resort."
        );

        setStep(1);

        return;
      }


      if (
        formData.stayType ===
          "22 Hours" &&
        dateAvailability
          ?.availability_status ===
          "partial"
      ) {
        setFormError(
          "22 Hours requires an entirely free date. Please choose a date without a confirmed Day Tour or Overnight reservation."
        );

        setStep(1);

        return;
      }


      /*
        Email confirmation.
      */

      if (
        formData.email
          .trim()
          .toLowerCase() !==
        formData.confirmEmail
          .trim()
          .toLowerCase()
      ) {
        setFormError(
          "The email addresses do not match."
        );

        return;
      }


      if (
        exceedsCapacity
      ) {
        setFormError(
          `${formData.stayType} allows a maximum of ${selectedCapacity} guests.`
        );

        return;
      }


      if (
        isSubmitting
      ) {
        return;
      }


      setFormError("");

      setIsSubmitting(
        true
      );


      const reservationData = {
        name:
          formData.name.trim(),

        customer_type:
          formData.bookingType,

        group_name:
          formData.groupName.trim(),

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
          formData.specialRequests
            .trim()
            ? formData
                .specialRequests
                .trim()
            : null,

        extra_guest_fee:
          extraGuestFee,
      };


      try {
        const {
          error,
        } =
          await supabase
            .from(
              "reservations"
            )
            .insert([
              reservationData,
            ]);


        if (error) {
          console.error(
            "Supabase reservation error:",
            error
          );


          const databaseMessage =
            error.message ||
            "";


          /*
            These are the messages raised
            by our database-level 22 Hours
            conflict trigger.
          */

          if (
            databaseMessage.includes(
              "active 22 Hours reservation"
            ) ||
            databaseMessage.includes(
              "cannot be reserved for 22 Hours"
            ) ||
            databaseMessage.includes(
              "another active reservation already exists"
            )
          ) {
            setFormError(
              databaseMessage
            );

            setStep(1);
          } else {
            setFormError(
              "We could not submit your reservation. Please try again."
            );
          }


          return;
        }


        setShowSuccess(
          true
        );


        /*
          Refresh availability in case
          anything changed during submit.
        */

        fetchConfirmedAvailability();

      } catch (error) {
        console.error(
          "Unexpected reservation error:",
          error
        );

        setFormError(
          "An unexpected error occurred. Please try again."
        );

      } finally {
        setIsSubmitting(
          false
        );
      }
    };


  /* =========================
     MONTH NAVIGATION
     ========================= */

  const previousMonth = () => {
    if (
      currentMonth === 0
    ) {
      setCurrentMonth(
        11
      );

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
    if (
      currentMonth === 11
    ) {
      setCurrentMonth(
        0
      );

      setCurrentYear(
        currentYear + 1
      );

    } else {
      setCurrentMonth(
        currentMonth + 1
      );
    }
  };


  /* =========================
     SELECT DATE
     ========================= */

  const selectDate = (
    day
  ) => {
    const chosenDate =
      new Date(
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


    /*
      Past dates cannot
      be selected.
    */

    if (
      chosenDate <
      currentDate
    ) {
      return;
    }


    const availability =
      getAvailabilityForDay(
        day
      );


    /*
      RED DATE:
      Confirmed 22 Hours reservation.
    */

    if (
      availability
        ?.availability_status ===
      "unavailable"
    ) {
      setFormError(
        "This date is fully unavailable because a confirmed 22 Hours reservation occupies the resort."
      );

      return;
    }


    /*
      YELLOW DATE:
      Day Tour / Overnight confirmed.

      Still selectable for Day Tour or
      Overnight, but not for 22 Hours.
    */

    if (
      formData.stayType ===
        "22 Hours" &&
      availability
        ?.availability_status ===
        "partial"
    ) {
      setFormError(
        "22 Hours requires an entirely free date. This date already has a confirmed Day Tour or Overnight reservation."
      );

      return;
    }


    setSelectedDate(
      chosenDate
    );

    setFormError("");
  };


  /* =========================
     SELECTED DATE CHECK
     ========================= */

  const isSelected = (
    day
  ) => {
    if (
      !selectedDate
    ) {
      return false;
    }


    return (
      selectedDate.getDate() ===
        day &&
      selectedDate.getMonth() ===
        currentMonth &&
      selectedDate.getFullYear() ===
        currentYear
    );
  };


  /* =========================
     PAST DATE CHECK
     ========================= */

  const isPastDate = (
    day
  ) => {
    const date =
      new Date(
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


  /* =========================
     PAGE
     ========================= */

  return (
    <div className="reservation-page">

      <div className="slider-frame">

        <div className="reservation-wrapper">

          {/* =========================
              PAGE TITLE
              ========================= */}

          <h1 className="reservation-title">
            Reservation
          </h1>


          {/* =========================
              RESORT SLIDESHOW
              ========================= */}

          <div className="reservation-slideshow-shell">

            {/* LEFT ARROW */}

            <button
              type="button"
              className="reservation-slide-outside-control reservation-slide-outside-previous"
              onClick={
                previousSlide
              }
              aria-label="Previous resort image"
            >
              &#10094;
            </button>


            {/* IMAGE */}

            <div className="reservation-slideshow">

              <img
                src={
                  resortImages[
                    currentSlide
                  ]
                }
                alt={`PolChat Garden Resort view ${
                  currentSlide + 1
                }`}
                className="reservation-slide-image"
              />


              <div className="reservation-slide-overlay" />


              {/* DOTS */}

              <div className="reservation-slide-dots">

                {resortImages.map(
                  (
                    _,
                    index
                  ) => (
                    <button
                      key={
                        index
                      }
                      type="button"
                      aria-label={`Show resort image ${
                        index + 1
                      }`}
                      onClick={() =>
                        setCurrentSlide(
                          index
                        )
                      }
                      className={`reservation-slide-dot ${
                        currentSlide ===
                        index
                          ? "reservation-slide-dot-active"
                          : ""
                      }`}
                    />
                  )
                )}

              </div>

            </div>


            {/* RIGHT ARROW */}

            <button
              type="button"
              className="reservation-slide-outside-control reservation-slide-outside-next"
              onClick={
                nextSlide
              }
              aria-label="Next resort image"
            >
              &#10095;
            </button>

          </div>


          {/* =========================
              RESERVATION CARD
              ========================= */}

          <div className="reservation-card">

            <div className="reservation-grid">

              {/* =====================
                  LEFT FORM
                  ===================== */}

              <div className="form-section">

                {step === 1 ? (
                  <>

                    {/* NAME */}

                    <label>

                      <span>
                        Name{" "}
                        <b>*</b>
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


                    {/* FAMILY / COMPANY */}

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


                    {/* GROUP NAME */}

                    {formData.bookingType && (
                      <label>

                        <span>
                          {formData.bookingType ===
                          "Family"
                            ? "Family Name"
                            : "Company Name"}{" "}
                          <b>*</b>
                        </span>


                        <input
                          type="text"
                          name="groupName"
                          value={
                            formData.groupName
                          }
                          onChange={
                            handleChange
                          }
                          placeholder={
                            formData.bookingType ===
                            "Family"
                              ? "Enter your family name"
                              : "Enter the company name"
                          }
                        />

                      </label>
                    )}


                    {/* ADDRESS */}

                    <label>

                      <span>
                        Address{" "}
                        <b>*</b>
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


                    {/* CONTACT NUMBER */}

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


                    {/* NUMBER OF GUESTS */}

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


                    {/* RESERVATION TYPE */}

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
                            Sleeping capacity is limited to 25 guests.
                          </span>
                        )}

                      </div>
                    )}


                    {/* RATE INFORMATION */}

                    <div className="rate-info">

                      <p>
                        The base rate covers up to{" "}
                        <strong>
                          20 guests
                        </strong>
                        .
                      </p>

                      <p>
                        Additional guests are charged{" "}
                        <strong>
                          ₱200 per person
                        </strong>
                        .
                      </p>


                      {extraGuests >
                        0 &&
                        !exceedsCapacity && (
                          <div className="additional-fee">

                            {
                              extraGuests
                            }{" "}
                            additional{" "}

                            {extraGuests ===
                            1
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

                          This exceeds the maximum capacity of{" "}
                          {
                            selectedCapacity
                          }{" "}
                          guests for{" "}
                          {
                            formData.stayType
                          }
                          .

                        </div>
                      )}

                    </div>


                    {/* FORM ERROR */}

                    {formError && (
                      <p className="form-error">
                        {
                          formError
                        }
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

                    {/* EMAIL */}

                    <label>

                      <span>
                        E-Mail{" "}
                        <b>*</b>
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


                    {/* CONFIRM EMAIL */}

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


                    {/* ARRIVAL TIME */}

                    <label>

                      <span>
                        Preferred Arrival Time{" "}
                        <b>*</b>
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


                    {/* SPECIAL REQUESTS */}

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
                        {
                          formError
                        }
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
                          setStep(
                            1
                          );

                          setFormError(
                            ""
                          );
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

              <div className="reservation-calendar-section">

                <div className="reservation-calendar-header">

                  <h3>
                    Reservation Date
                  </h3>

                </div>


                <div className="reservation-calendar-box">

                  {/* MONTH NAVIGATION */}

                  <div className="reservation-calendar-navigation">

                    <button
                      type="button"
                      onClick={
                        previousMonth
                      }
                      className="reservation-calendar-nav-btn"
                      aria-label="Previous month"
                    >
                      &#10094;
                    </button>


                    <h2>
                      {
                        monthNames[
                          currentMonth
                        ]
                      }{" "}
                      {
                        currentYear
                      }
                    </h2>


                    <button
                      type="button"
                      onClick={
                        nextMonth
                      }
                      className="reservation-calendar-nav-btn"
                      aria-label="Next month"
                    >
                      &#10095;
                    </button>

                  </div>


                  {/* WEEKDAYS */}

                  <div className="reservation-calendar-weekdays">

                    <span>
                      Sun
                    </span>

                    <span>
                      Mon
                    </span>

                    <span>
                      Tue
                    </span>

                    <span>
                      Wed
                    </span>

                    <span>
                      Thu
                    </span>

                    <span>
                      Fri
                    </span>

                    <span>
                      Sat
                    </span>

                  </div>


                  {/* CALENDAR DAYS */}

                  <div className="reservation-calendar-days">

                    {Array.from({
                      length:
                        firstDayOfMonth,
                    }).map(
                      (
                        _,
                        index
                      ) => (
                        <div
                          key={`blank-${index}`}
                          className="reservation-calendar-empty"
                        />
                      )
                    )}


                    {Array.from(
                      {
                        length:
                          daysInMonth,
                      },
                      (
                        _,
                        index
                      ) => {
                        const day =
                          index +
                          1;

                        const past =
                          isPastDate(
                            day
                          );

                        const availability =
                          getAvailabilityForDay(
                            day
                          );


                        const partiallyBooked =
                          !past &&
                          availability
                            ?.availability_status ===
                            "partial";


                        const fullyUnavailable =
                          !past &&
                          availability
                            ?.availability_status ===
                            "unavailable";


                        return (
                          <button
                            key={
                              day
                            }
                            type="button"
                            disabled={
                              past ||
                              fullyUnavailable
                            }
                            onClick={() =>
                              selectDate(
                                day
                              )
                            }
                            title={
                              fullyUnavailable
                                ? "Fully unavailable — confirmed 22 Hours reservation"
                                : partiallyBooked
                                ? "Partially booked — confirmed Day Tour or Overnight reservation"
                                : "Available"
                            }
                            aria-label={
                              fullyUnavailable
                                ? `${day}, fully unavailable`
                                : partiallyBooked
                                ? `${day}, partially booked`
                                : `${day}, available`
                            }
                            className={`reservation-calendar-day ${
                              isSelected(
                                day
                              )
                                ? "reservation-calendar-day-selected"
                                : ""
                            } ${
                              past
                                ? "reservation-calendar-day-disabled"
                                : ""
                            } ${
                              partiallyBooked
                                ? "reservation-calendar-day-partial"
                                : ""
                            } ${
                              fullyUnavailable
                                ? "reservation-calendar-day-unavailable"
                                : ""
                            }`}
                          >
                            {
                              day
                            }
                          </button>
                        );
                      }
                    )}

                  </div>


                  {/* =========================
                      AVAILABILITY LEGEND
                      ========================= */}

                  <div className="reservation-calendar-availability">

                    <div className="reservation-calendar-availability-item">

                      <span className="reservation-calendar-availability-dot reservation-calendar-availability-dot-partial" />

                      <span>
                        Day Tour / Overnight confirmed
                      </span>

                    </div>


                    <div className="reservation-calendar-availability-item">

                      <span className="reservation-calendar-availability-dot reservation-calendar-availability-dot-unavailable" />

                      <span>
                        Fully unavailable — 22 Hours confirmed
                      </span>

                    </div>

                  </div>


                  {/* AVAILABILITY LOADING */}

                  {availabilityLoading && (
                    <p className="reservation-calendar-availability-message">

                      Checking confirmed reservations...

                    </p>
                  )}


                  {/* AVAILABILITY ERROR */}

                  {availabilityError && (
                    <p className="reservation-calendar-availability-error">

                      {
                        availabilityError
                      }

                    </p>
                  )}


                  {/* =========================
                      SELECTED DATE
                      ========================= */}

                  <div className="reservation-selected-date">

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


                        {getAvailabilityForDate(
                          selectedDate
                        )
                          ?.availability_status ===
                          "partial" && (
                          <small className="reservation-selected-date-note">

                            This date already has a confirmed Day Tour or Overnight reservation. A 22 Hours booking is not available for this date.

                          </small>
                        )}

                      </>
                    ) : (
                      <span>
                        Please select your reservation date.
                      </span>
                    )}

                  </div>

                </div>


                {/* =========================
                    RESERVATION RULES
                    ========================= */}

                <div className="reservation-policies">

                  <h3>
                    Important Reservation Policies
                  </h3>


                  <ul>

                    <li>

                      The base rate covers up to{" "}

                      <strong>
                        20 guests
                      </strong>

                      . Additional guests are charged{" "}

                      <strong>
                        ₱200 per person
                      </strong>

                      , subject to the applicable guest capacity.

                    </li>


                    <li>

                      A{" "}

                      <strong>
                        22 Hours reservation
                      </strong>{" "}

                      requires exclusive use of the resort for the selected date. A date with a confirmed 22 Hours reservation is fully unavailable, while a date with a confirmed Day Tour or Overnight reservation cannot be selected for 22 Hours.

                    </li>


                    <li>

                      A{" "}

                      <strong>
                        ₱2,000 security deposit
                      </strong>{" "}

                      is required to cover possible missing or damaged resort property. Any refundable amount will be returned within{" "}

                      <strong>
                        24 hours after checkout
                      </strong>

                      , following inspection.

                    </li>


                    <li>

                      To confirm a reservation, guests must pay{" "}

                      <strong>
                        50% of the required down payment
                      </strong>{" "}

                      together with the{" "}

                      <strong>
                        ₱2,000 security deposit
                      </strong>

                      .

                    </li>


                    <li>

                      Guests are encouraged to bring their own personal essentials and preferred items for their stay.

                    </li>


                    <li>

                      To maintain a comfortable and safe environment for everyone, loud, disruptive, or disorderly gatherings are not allowed.

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
                Your reservation request has been submitted successfully.
              </p>


              <p className="success-note">

                Please wait for confirmation from PolChat Garden Resort before considering your reservation final.

              </p>


              <button
                type="button"
                onClick={() =>
                  setShowSuccess(
                    false
                  )
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
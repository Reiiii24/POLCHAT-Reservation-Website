import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabaseClient";

import "./Calendar.css";


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


const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];


/* ==========================================
   DATE HELPERS
   ========================================== */

function formatDateKey(
  year,
  month,
  day
) {
  const monthNumber =
    String(
      month + 1
    ).padStart(
      2,
      "0"
    );

  const dayNumber =
    String(
      day
    ).padStart(
      2,
      "0"
    );

  return `${year}-${monthNumber}-${dayNumber}`;
}


function formatDisplayDate(
  dateString
) {
  if (!dateString) {
    return "—";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


function formatArrivalTime(
  timeString
) {
  if (!timeString) {
    return "Not specified";
  }

  const [
    hours,
    minutes,
  ] =
    timeString.split(":");

  const date =
    new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-PH",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


function formatBookingId(
  booking
) {
  const year =
    booking.reservation_date
      ? booking.reservation_date.slice(
          0,
          4
        )
      : new Date().getFullYear();

  return `BK-${year}-${String(
    booking.id
  ).padStart(
    3,
    "0"
  )}`;
}


/* ==========================================
   STATUS HELPER
   ========================================== */

function getStatusClass(
  status
) {
  return String(
    status || ""
  )
    .trim()
    .toLowerCase();
}


/* ==========================================
   ADMIN CALENDAR
   ========================================== */

export default function Calendar() {
  const today =
    new Date();

  const [
    currentDate,
    setCurrentDate,
  ] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [
    bookings,
    setBookings,
  ] =
    useState([]);

  const [
    selectedBooking,
    setSelectedBooking,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");


  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  /* ========================================
     LOAD RESERVATIONS
     ======================================== */

  const fetchBookings =
    useCallback(
      async () => {
        setLoading(
          true
        );

        setError(
          ""
        );


        const startDate =
          formatDateKey(
            year,
            month,
            1
          );


        const endDate =
          formatDateKey(
            year,
            month,
            daysInMonth
          );


        const {
          data,
          error:
            fetchError,
        } =
          await supabase
            .from(
              "reservations"
            )
            .select(`
              id,
              name,
              customer_type,
              group_name,
              address,
              contact_number,
              email,
              number_of_guests,
              reservation_type,
              reservation_date,
              arrival_time,
              special_requests,
              status,
              extra_guest_fee,
              created_at,
              hold_expires_at
            `)
            .gte(
              "reservation_date",
              startDate
            )
            .lte(
              "reservation_date",
              endDate
            )
            .order(
              "reservation_date",
              {
                ascending:
                  true,
              }
            )
            .order(
              "created_at",
              {
                ascending:
                  true,
              }
            );


        if (
          fetchError
        ) {
          console.error(
            "Calendar reservation error:",
            fetchError
          );

          setError(
            "Unable to load reservations for this month."
          );

          setBookings(
            []
          );

          setLoading(
            false
          );

          return;
        }


        const nextBookings =
          data || [];


        setBookings(
          nextBookings
        );


        /*
          If the detail panel is
          currently open, update it
          with the newest database
          version of that booking.
        */

        setSelectedBooking(
          (
            previousBooking
          ) => {
            if (
              !previousBooking
            ) {
              return null;
            }

            return (
              nextBookings.find(
                (
                  booking
                ) =>
                  booking.id ===
                  previousBooking.id
              ) ||
              null
            );
          }
        );


        setLoading(
          false
        );
      },
      [
        year,
        month,
        daysInMonth,
      ]
    );


  /* ========================================
     LOAD WHEN MONTH CHANGES
     ======================================== */

  useEffect(() => {
    fetchBookings();
  }, [
    fetchBookings,
  ]);


  /* ========================================
     REALTIME
     ======================================== */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "admin-calendar-reservations"
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "reservations",
          },
          () => {
            fetchBookings();
          }
        )
        .subscribe();


    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    fetchBookings,
  ]);


  /* ========================================
     MONTH NAVIGATION
     ======================================== */

  const previousMonth =
    () => {
      setSelectedBooking(
        null
      );

      setCurrentDate(
        new Date(
          year,
          month - 1,
          1
        )
      );
    };


  const nextMonth =
    () => {
      setSelectedBooking(
        null
      );

      setCurrentDate(
        new Date(
          year,
          month + 1,
          1
        )
      );
    };


  const goToToday =
    () => {
      setSelectedBooking(
        null
      );

      setCurrentDate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
      );
    };


  /* ========================================
     BOOKINGS FOR A DATE
     ======================================== */

  const getBookingsForDate =
    (day) => {
      const date =
        formatDateKey(
          year,
          month,
          day
        );

      return bookings.filter(
        (
          booking
        ) =>
          booking.reservation_date ===
          date
      );
    };


  /* ========================================
     TODAY CHECK
     ======================================== */

  const isToday =
    (day) => {
      return (
        today.getFullYear() ===
          year &&
        today.getMonth() ===
          month &&
        today.getDate() ===
          day
      );
    };


  /* ========================================
     CALENDAR DAY ARRAY
     ======================================== */

  const calendarDays =
    [];


  for (
    let index = 0;
    index <
    firstDay;
    index++
  ) {
    calendarDays.push(
      null
    );
  }


  for (
    let day = 1;
    day <=
    daysInMonth;
    day++
  ) {
    calendarDays.push(
      day
    );
  }


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="calendar-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="calendar-header">

        <div>

          <h1>
            Calendar
          </h1>

          <p>
            View reservations and important booking dates.
          </p>

        </div>


        <button
          type="button"
          className="today-btn"
          onClick={
            goToToday
          }
        >
          Today
        </button>

      </div>


      {/* =========================
          ERROR
          ========================= */}

      {error && (
        <div className="calendar-error">
          {
            error
          }
        </div>
      )}


      {/* =========================
          CALENDAR
          ========================= */}

      <div className="calendar-card">

        <div className="calendar-navigation">

          <button
            type="button"
            className="month-arrow"
            onClick={
              previousMonth
            }
            aria-label="Previous month"
          >
            ‹
          </button>


          <h2>
            {
              monthNames[
                month
              ]
            }{" "}
            {
              year
            }
          </h2>


          <button
            type="button"
            className="month-arrow"
            onClick={
              nextMonth
            }
            aria-label="Next month"
          >
            ›
          </button>

        </div>


        {/* WEEKDAY HEADER */}

        <div className="week-header">

          {weekDays.map(
            (day) => (
              <div
                key={
                  day
                }
              >
                {
                  day
                }
              </div>
            )
          )}

        </div>


        {/* CALENDAR GRID */}

        <div className="calendar-grid">

          {calendarDays.map(
            (
              day,
              index
            ) => {

              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  />
                );
              }


              const dayBookings =
                getBookingsForDate(
                  day
                );


              return (
                <div
                  key={
                    day
                  }
                  className={`calendar-day ${
                    isToday(
                      day
                    )
                      ? "today"
                      : ""
                  }`}
                >

                  <div className="day-number">
                    {
                      day
                    }
                  </div>


                  <div className="calendar-events">

                    {dayBookings.map(
                      (
                        booking
                      ) => (
                        <button
                          type="button"
                          key={
                            booking.id
                          }
                          className={`calendar-event ${getStatusClass(
                            booking.status
                          )}`}
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          title={`${booking.name} — ${booking.reservation_type} — ${booking.status}`}
                        >
                          <span className="calendar-event-name">
                            {
                              booking.name
                            }
                          </span>

                          <span className="calendar-event-type">
                            {
                              booking.reservation_type
                            }
                          </span>
                        </button>
                      )
                    )}


                    {!loading &&
                      dayBookings.length ===
                        0 && (
                        <span className="calendar-no-event">
                          &nbsp;
                        </span>
                      )}

                  </div>

                </div>
              );
            }
          )}

        </div>


        {loading && (
          <div className="calendar-loading">
            Loading reservations...
          </div>
        )}

      </div>


      {/* =========================
          LEGEND
          ========================= */}

      <div className="calendar-legend">

        <div>
          <span className="legend-dot confirmed-dot" />
          Confirmed
        </div>

        <div>
          <span className="legend-dot pending-dot" />
          Pending
        </div>

        <div>
          <span className="legend-dot rejected-dot" />
          Rejected
        </div>

        <div>
          <span className="legend-dot cancelled-dot" />
          Cancelled
        </div>

      </div>


      {/* =========================
          BOOKING DETAILS
          ========================= */}

      {selectedBooking && (
        <div className="calendar-details">

          <div className="details-header">

            <div>

              <h2>
                Booking Details
              </h2>

              <p className="details-booking-id">
                {formatBookingId(
                  selectedBooking
                )}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setSelectedBooking(
                  null
                )
              }
              className="close-details"
              aria-label="Close booking details"
            >
              ×
            </button>

          </div>


          <div className="details-content">

            <div>
              <span>
                Guest
              </span>

              <strong>
                {
                  selectedBooking.name
                }
              </strong>
            </div>


            <div>
              <span>
                Family / Company
              </span>

              <strong>
                {
                  selectedBooking.customer_type
                }
              </strong>

              {selectedBooking.group_name && (
                <small>
                  {
                    selectedBooking.group_name
                  }
                </small>
              )}
            </div>


            <div>
              <span>
                Booking Type
              </span>

              <strong>
                {
                  selectedBooking.reservation_type
                }
              </strong>
            </div>


            <div>
              <span>
                Date
              </span>

              <strong>
                {formatDisplayDate(
                  selectedBooking.reservation_date
                )}
              </strong>
            </div>


            <div>
              <span>
                Preferred Arrival
              </span>

              <strong>
                {formatArrivalTime(
                  selectedBooking.arrival_time
                )}
              </strong>
            </div>


            <div>
              <span>
                Number of Guests
              </span>

              <strong>
                {
                  selectedBooking.number_of_guests
                }
              </strong>
            </div>


            <div>
              <span>
                Extra Guest Fee
              </span>

              <strong>
                ₱
                {Number(
                  selectedBooking.extra_guest_fee ||
                    0
                ).toLocaleString(
                  "en-PH"
                )}
              </strong>
            </div>


            <div>
              <span>
                Contact Number
              </span>

              <strong>
                {
                  selectedBooking.contact_number ||
                  "—"
                }
              </strong>
            </div>


            <div>
              <span>
                E-Mail
              </span>

              <strong>
                {
                  selectedBooking.email ||
                  "—"
                }
              </strong>
            </div>


            <div>
              <span>
                Status
              </span>

              <strong
                className={`details-status ${getStatusClass(
                  selectedBooking.status
                )}`}
              >
                {
                  selectedBooking.status
                }
              </strong>
            </div>

          </div>


          {selectedBooking.special_requests && (
            <div className="calendar-special-request">

              <span>
                Special Requests
              </span>

              <p>
                {
                  selectedBooking.special_requests
                }
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
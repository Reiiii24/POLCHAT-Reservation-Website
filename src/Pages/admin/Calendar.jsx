import { useState } from "react";
import "./Calendar.css";

const calendarBookings = [
  {
    id: 1,
    date: "2026-08-25",
    guest: "Juan Dela Cruz",
    type: "Overnight",
    status: "Pending",
    amount: "₱3,500",
  },
  {
    id: 2,
    date: "2026-08-27",
    guest: "Maria Santos",
    type: "Day Tour",
    status: "Confirmed",
    amount: "₱1,200",
  },
  {
    id: 3,
    date: "2026-08-28",
    guest: "Pedro Reyes",
    type: "22-Hour Stay",
    status: "Confirmed",
    amount: "₱4,000",
  },
  {
    id: 4,
    date: "2026-08-29",
    guest: "Ana Lopez",
    type: "Day Tour",
    status: "Cancelled",
    amount: "₱1,200",
  },
  {
    id: 5,
    date: "2026-09-02",
    guest: "Mark Torres",
    type: "Overnight",
    status: "Pending",
    amount: "₱3,500",
  },
];

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

export default function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState(null);

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

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  const formatDate = (day) => {
    const monthNumber =
      String(month + 1).padStart(
        2,
        "0"
      );

    const dayNumber =
      String(day).padStart(
        2,
        "0"
      );

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const getBookingsForDate = (day) => {
    const date =
      formatDate(day);

    return calendarBookings.filter(
      (booking) =>
        booking.date === date
    );
  };

  const isToday = (day) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const calendarDays = [];

  for (
    let index = 0;
    index < firstDay;
    index++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <h1>Calendar</h1>

          <p>
            View reservations and important
            booking dates.
          </p>
        </div>

        <button
          type="button"
          className="today-btn"
          onClick={goToToday}
        >
          Today
        </button>
      </div>

      <div className="calendar-card">
        <div className="calendar-navigation">
          <button
            type="button"
            className="month-arrow"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            ‹
          </button>

          <h2>
            {monthNames[month]} {year}
          </h2>

          <button
            type="button"
            className="month-arrow"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="week-header">
          {weekDays.map((day) => (
            <div key={day}>
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(
            (day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  />
                );
              }

              const bookings =
                getBookingsForDate(day);

              return (
                <div
                  key={day}
                  className={`calendar-day ${
                    isToday(day)
                      ? "today"
                      : ""
                  }`}
                >
                  <div className="day-number">
                    {day}
                  </div>

                  <div className="calendar-events">
                    {bookings.map(
                      (booking) => (
                        <button
                          type="button"
                          key={booking.id}
                          className={`calendar-event ${booking.status.toLowerCase()}`}
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                        >
                          {booking.guest}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

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
          <span className="legend-dot cancelled-dot" />
          Cancelled
        </div>
      </div>

      {selectedBooking && (
        <div className="calendar-details">
          <div className="details-header">
            <h2>Booking Details</h2>

            <button
              type="button"
              onClick={() =>
                setSelectedBooking(null)
              }
              className="close-details"
              aria-label="Close booking details"
            >
              ×
            </button>
          </div>

          <div className="details-content">
            <div>
              <span>Guest</span>
              <strong>
                {selectedBooking.guest}
              </strong>
            </div>

            <div>
              <span>Booking Type</span>
              <strong>
                {selectedBooking.type}
              </strong>
            </div>

            <div>
              <span>Date</span>
              <strong>
                {selectedBooking.date}
              </strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {selectedBooking.amount}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong
                className={`details-status ${selectedBooking.status.toLowerCase()}`}
              >
                {selectedBooking.status}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

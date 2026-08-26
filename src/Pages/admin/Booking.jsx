import { useState } from "react";
import "./Booking.css";

const initialBookings = [
  {
    id: 1,
    bookingId: "BK-2026-001",
    guest: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    type: "Overnight",
    checkIn: "Aug 25, 2026",
    checkOut: "Aug 26, 2026",
    guests: 2,
    amount: "₱3,500",
    status: "Pending",
  },
  {
    id: 2,
    bookingId: "BK-2026-002",
    guest: "Maria Santos",
    email: "maria.santos@email.com",
    type: "Day Tour",
    checkIn: "Aug 27, 2026",
    checkOut: "Aug 27, 2026",
    guests: 4,
    amount: "₱1,200",
    status: "Confirmed",
  },
  {
    id: 3,
    bookingId: "BK-2026-003",
    guest: "Pedro Reyes",
    email: "pedro.reyes@email.com",
    type: "22-Hour Stay",
    checkIn: "Aug 28, 2026",
    checkOut: "Aug 29, 2026",
    guests: 5,
    amount: "₱4,000",
    status: "Confirmed",
  },
  {
    id: 4,
    bookingId: "BK-2026-004",
    guest: "Ana Lopez",
    email: "ana.lopez@email.com",
    type: "Day Tour",
    checkIn: "Aug 29, 2026",
    checkOut: "Aug 29, 2026",
    guests: 3,
    amount: "₱1,200",
    status: "Cancelled",
  },
  {
    id: 5,
    bookingId: "BK-2026-005",
    guest: "Mark Torres",
    email: "mark.torres@email.com",
    type: "Overnight",
    checkIn: "Sep 02, 2026",
    checkOut: "Sep 03, 2026",
    guests: 2,
    amount: "₱3,500",
    status: "Pending",
  },
];

function bookingStatusClass(status) {
  if (status === "Confirmed") {
    return "booking-status confirmed";
  }

  if (status === "Pending") {
    return "booking-status pending";
  }

  return "booking-status cancelled";
}

export default function Booking() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.guest.toLowerCase().includes(searchText) ||
      booking.email.toLowerCase().includes(searchText) ||
      booking.bookingId.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
            }
          : booking
      )
    );
  };

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div>
          <h1>Bookings</h1>
          <p>
            Manage customer reservations and booking status.
          </p>
        </div>
      </header>

      <div className="booking-controls">
        <input
          type="text"
          placeholder="Search guest, email, or booking ID..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="booking-search"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="booking-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="booking-table-card">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Guest</th>
              <th>Type</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr className="booking-empty-row">
                <td
                  colSpan="9"
                  className="booking-no-results"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td data-label="Booking">
                    <strong>
                      {booking.bookingId}
                    </strong>
                  </td>

                  <td data-label="Guest">
                    <strong>
                      {booking.guest}
                    </strong>

                    <small>
                      {booking.email}
                    </small>
                  </td>

                  <td data-label="Type">
                    {booking.type}
                  </td>

                  <td data-label="Check-in">
                    {booking.checkIn}
                  </td>

                  <td data-label="Check-out">
                    {booking.checkOut}
                  </td>

                  <td data-label="Guests">
                    {booking.guests}
                  </td>

                  <td
                    data-label="Amount"
                    className="booking-amount"
                  >
                    {booking.amount}
                  </td>

                  <td data-label="Status">
                    <span
                      className={bookingStatusClass(
                        booking.status
                      )}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td data-label="Action">
                    {booking.status === "Pending" ? (
                      <div className="booking-actions">
                        <button
                          type="button"
                          className="confirm-btn"
                          onClick={() =>
                            updateStatus(
                              booking.id,
                              "Confirmed"
                            )
                          }
                        >
                          Confirm
                        </button>

                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() =>
                            updateStatus(
                              booking.id,
                              "Cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    ) : booking.status === "Confirmed" ? (
                      <button
                        type="button"
                        className="cancel-outline-btn"
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "Cancelled"
                          )
                        }
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="booking-done">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabaseClient";

import "./Booking.css";


/* ==========================================
   STATUS CLASS
   ========================================== */

function bookingStatusClass(status) {
  switch (status) {
    case "Confirmed":
      return "booking-status confirmed";

    case "Pending":
      return "booking-status pending";

    case "Awaiting Payment":
      return "booking-status awaiting-payment";

    case "Rejected":
      return "booking-status rejected";

    case "Cancelled":
      return "booking-status cancelled";

    default:
      return "booking-status";
  }
}


/* ==========================================
   DISPLAY DATE
   ========================================== */

function formatReservationDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}


/* ==========================================
   DISPLAY TIME
   ========================================== */

function formatArrivalTime(timeString) {
  if (!timeString) {
    return "Not specified";
  }

  const [hours, minutes] =
    timeString.split(":");

  const date = new Date();

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


/* ==========================================
   DISPLAY BOOKING ID
   ========================================== */

function formatBookingId(reservation) {
  const year =
    reservation.reservation_date
      ? reservation.reservation_date.slice(
          0,
          4
        )
      : new Date().getFullYear();

  return `BK-${year}-${String(
    reservation.id
  ).padStart(3, "0")}`;
}


/* ==========================================
   BOOKING PAGE
   ========================================== */

export default function Booking() {
  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  /* ========================================
     LOAD BOOKINGS
     ======================================== */

  const fetchBookings =
    useCallback(async () => {
      setError("");

      const {
        data,
        error: fetchError,
      } = await supabase
        .from("reservations")
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
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (fetchError) {
        console.error(
          "Error loading reservations:",
          fetchError
        );

        setError(
          "Unable to load reservations. Please try again."
        );

        setLoading(false);

        return;
      }


      setBookings(
        data || []
      );

      setLoading(false);
    }, []);


  /* ========================================
     INITIAL LOAD
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
          "admin-bookings-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reservations",
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
     UPDATE STATUS
     ======================================== */

  const updateStatus = async (
    id,
    newStatus
  ) => {
    if (updatingId !== null) {
      return;
    }


    setUpdatingId(id);

    setError("");


    const {
      error: updateError,
    } = await supabase
      .from("reservations")
      .update({
        status: newStatus,
      })
      .eq(
        "id",
        id
      );


    if (updateError) {
      console.error(
        "Reservation update error:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to update the reservation."
      );

      setUpdatingId(null);

      return;
    }


    /*
      Update interface immediately.
      Realtime will also synchronize
      the final database state.
    */

    setBookings(
      (previousBookings) =>
        previousBookings.map(
          (booking) =>
            booking.id === id
              ? {
                  ...booking,
                  status: newStatus,
                }
              : booking
        )
    );


    setUpdatingId(null);
  };


  /* ========================================
     SEARCH + FILTER
     ======================================== */

  const filteredBookings =
    bookings.filter(
      (booking) => {
        const searchText =
          search
            .trim()
            .toLowerCase();


        const bookingId =
          formatBookingId(
            booking
          ).toLowerCase();


        const matchesSearch =
          !searchText ||

          booking.name
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          booking.email
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          bookingId.includes(
            searchText
          ) ||

          booking.group_name
            ?.toLowerCase()
            .includes(
              searchText
            );


        const matchesStatus =
          statusFilter === "All" ||
          booking.status ===
            statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="booking-page">

      {/* ===================================
          HEADER
          =================================== */}

      <header className="booking-header">

        <h1>
          Bookings
        </h1>

        <p>
          Manage reservation requests,
          payment preparation, and confirmed bookings.
        </p>

      </header>


      {/* ===================================
          ERROR
          =================================== */}

      {error && (
        <div
          className="booking-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* ===================================
          CONTROLS
          =================================== */}

      <div className="booking-controls">

        <input
          type="text"
          placeholder="Search guest, email, group, or booking ID..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="booking-search"
        />


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="booking-filter"
        >

          <option value="All">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Awaiting Payment">
            Awaiting Payment
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>


      {/* ===================================
          CONTENT
          =================================== */}

      {loading ? (

        <div className="booking-loading">
          Loading reservations...
        </div>

      ) : (

        <div className="booking-table-card">

          <table className="booking-table">

            <thead>

              <tr>
                <th>Booking</th>
                <th>Guest</th>
                <th>Group</th>
                <th>Type</th>
                <th>Date</th>
                <th>Arrival</th>
                <th>Guests</th>
                <th>Extra Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredBookings.length ===
              0 ? (

                <tr className="booking-empty-row">

                  <td
                    colSpan="10"
                    className="booking-no-results"
                  >
                    No bookings found.
                  </td>

                </tr>

              ) : (

                filteredBookings.map(
                  (booking) => {
                    const isUpdating =
                      updatingId ===
                      booking.id;


                    // Only show the request affordance when there is real text to review.
                    const hasSpecialRequest =
                      Boolean(
                        booking.special_requests
                          ?.trim()
                      );


                    return (
                      <tr
                        key={booking.id}
                      >

                        {/* BOOKING ID */}

                        <td data-label="Booking">

                          <strong>
                            {formatBookingId(
                              booking
                            )}
                          </strong>

                        </td>


                        {/* GUEST */}

                        <td data-label="Guest">

                          <strong>
                            {booking.name}
                          </strong>

                          <small>
                            {booking.email}
                          </small>

                        </td>


                        {/* GROUP */}

                        <td data-label="Group">

                          <strong>
                            {booking.customer_type}
                          </strong>

                          {booking.group_name && (
                            <small>
                              {booking.group_name}
                            </small>
                          )}

                        </td>


                        {/* TYPE */}

                        <td data-label="Type">
                          {booking.reservation_type}
                        </td>


                        {/* DATE */}

                        <td data-label="Date">

                          {formatReservationDate(
                            booking.reservation_date
                          )}

                        </td>


                        {/* ARRIVAL */}

                        <td data-label="Arrival">

                          {formatArrivalTime(
                            booking.arrival_time
                          )}

                        </td>


                        {/* GUESTS */}

                        <td data-label="Guests">
                          {booking.number_of_guests}
                        </td>


                        {/* EXTRA FEE */}

                        <td
                          data-label="Extra Fee"
                          className="booking-amount"
                        >
                          ₱
                          {Number(
                            booking.extra_guest_fee ||
                              0
                          ).toLocaleString(
                            "en-PH"
                          )}
                        </td>


                        {/* STATUS */}

                        <td data-label="Status">

                          <span
                            className={
                              bookingStatusClass(
                                booking.status
                              )
                            }
                          >
                            {booking.status}
                          </span>

                        </td>


                        {/* ===================================
                            ACTION + SPECIAL REQUEST
                            =================================== */}

                        <td data-label="Action">

                          <div className="booking-action-area">

                            {/* SPECIAL REQUEST ICON */}

                            {hasSpecialRequest && (

                              <div className="special-request-wrapper">

                                <button
                                  type="button"
                                  className="special-request-icon"
                                  aria-label={`View special request from ${booking.name}`}
                                >
                                  💬
                                </button>


                                <div
                                  className="special-request-tooltip"
                                  role="tooltip"
                                >

                                  <strong>
                                    Special Request
                                  </strong>


                                  <p>
                                    {booking.special_requests}
                                  </p>

                                </div>

                              </div>

                            )}


                            {/* PENDING */}

                            {booking.status ===
                            "Pending" ? (

                              <div className="booking-actions">

                                <button
                                  type="button"
                                  className="accept-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Awaiting Payment"
                                    )
                                  }
                                >

                                  {isUpdating
                                    ? "Updating..."
                                    : "Accept"}

                                </button>


                                <button
                                  type="button"
                                  className="reject-booking-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>

                              </div>


                            /* ===============================
                               AWAITING PAYMENT
                               =============================== */

                            ) : booking.status ===
                              "Awaiting Payment" ? (

                              <div className="booking-awaiting-actions">

                                <span className="booking-payment-note">
                                  Verify payment in Chat
                                </span>


                                <button
                                  type="button"
                                  className="cancel-outline-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Cancelled"
                                    )
                                  }
                                >

                                  {isUpdating
                                    ? "Updating..."
                                    : "Cancel"}

                                </button>

                              </div>


                            /* ===============================
                               CONFIRMED
                               =============================== */

                            ) : booking.status ===
                              "Confirmed" ? (

                              <button
                                type="button"
                                className="cancel-outline-btn"
                                disabled={isUpdating}
                                onClick={() =>
                                  updateStatus(
                                    booking.id,
                                    "Cancelled"
                                  )
                                }
                              >

                                {isUpdating
                                  ? "Updating..."
                                  : "Cancel"}

                              </button>


                            /* ===============================
                               REJECTED / CANCELLED
                               =============================== */

                            ) : (

                              <span className="booking-done">
                                No action
                              </span>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}
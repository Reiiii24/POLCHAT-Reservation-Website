import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../../lib/supabaseClient";

import "./CustomerHistory.css";


/* ==========================================
   DATE HELPERS
   ========================================== */

function formatDisplayDate(dateString) {
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
   STATUS
   ========================================== */

function statusClass(status) {
  switch (status) {
    case "Confirmed":
      return "history-status confirmed";

    case "Pending":
      return "history-status pending";

    case "Rejected":
      return "history-status rejected";

    case "Cancelled":
      return "history-status cancelled";

    default:
      return "history-status";
  }
}


/* ==========================================
   CUSTOMER HISTORY
   ========================================== */

export default function CustomerHistory() {
  const [
    reservations,
    setReservations,
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
    selectedEmail,
    setSelectedEmail,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /* ========================================
     LOAD RESERVATIONS
     ======================================== */

  const fetchReservations =
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
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (fetchError) {
        console.error(
          "Customer history error:",
          fetchError
        );

        setError(
          "Unable to load customer history."
        );

        setLoading(false);

        return;
      }


      setReservations(
        data || []
      );

      setLoading(false);
    }, []);


  /* ========================================
     INITIAL LOAD
     ======================================== */

  useEffect(() => {
    fetchReservations();
  }, [
    fetchReservations,
  ]);


  /* ========================================
     REALTIME
     ======================================== */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "admin-customer-history"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reservations",
          },
          () => {
            fetchReservations();
          }
        )
        .subscribe();


    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    fetchReservations,
  ]);


  /* ========================================
     GROUP RESERVATIONS BY CUSTOMER
     ======================================== */

  const customers =
    useMemo(() => {
      const grouped =
        new Map();


      reservations.forEach(
        (reservation) => {
          /*
            Email is used as the customer
            identifier because different
            customers may have the same name.
          */

          const emailKey =
            reservation.email
              .trim()
              .toLowerCase();


          if (
            !grouped.has(
              emailKey
            )
          ) {
            grouped.set(
              emailKey,
              {
                email:
                  emailKey,

                reservations:
                  [],
              }
            );
          }


          grouped
            .get(emailKey)
            .reservations.push(
              reservation
            );
        }
      );


      return Array.from(
        grouped.values()
      ).map(
        (customer) => {
          /*
            Reservations came from Supabase
            ordered by created_at descending,
            so the first entry is the newest
            submission for this customer.
          */

          const latest =
            customer.reservations[0];


          const confirmedCount =
            customer.reservations.filter(
              (reservation) =>
                reservation.status ===
                "Confirmed"
            ).length;


          const pendingCount =
            customer.reservations.filter(
              (reservation) =>
                reservation.status ===
                "Pending"
            ).length;


          const cancelledCount =
            customer.reservations.filter(
              (reservation) =>
                reservation.status ===
                "Cancelled"
            ).length;


          const rejectedCount =
            customer.reservations.filter(
              (reservation) =>
                reservation.status ===
                "Rejected"
            ).length;


          return {
            email:
              customer.email,

            name:
              latest.name,

            contactNumber:
              latest.contact_number,

            customerType:
              latest.customer_type,

            groupName:
              latest.group_name,

            address:
              latest.address,

            latestReservation:
              latest,

            totalReservations:
              customer.reservations.length,

            confirmedCount,

            pendingCount,

            cancelledCount,

            rejectedCount,

            reservations:
              customer.reservations,
          };
        }
      );
    }, [
      reservations,
    ]);


  /* ========================================
     SEARCH + FILTER
     ======================================== */

  const filteredCustomers =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();


      return customers.filter(
        (customer) => {
          const matchesSearch =
            !searchText ||
            customer.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            customer.email
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            customer.contactNumber
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            customer.groupName
              ?.toLowerCase()
              .includes(
                searchText
              );


          const matchesStatus =
            statusFilter ===
              "All" ||
            customer.reservations.some(
              (reservation) =>
                reservation.status ===
                statusFilter
            );


          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      customers,
      search,
      statusFilter,
    ]);


  /* ========================================
     SELECTED CUSTOMER
     ======================================== */

  const selectedCustomer =
    useMemo(() => {
      if (!selectedEmail) {
        return null;
      }

      return (
        customers.find(
          (customer) =>
            customer.email ===
            selectedEmail
        ) || null
      );
    }, [
      customers,
      selectedEmail,
    ]);


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="history-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="history-header">

        <h1>
          Customer History
        </h1>

        <p>
          Review customer profiles and their
          previous and current reservation records.
        </p>

      </header>


      {/* =========================
          ERROR
          ========================= */}

      {error && (
        <div
          className="history-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* =========================
          CONTROLS
          ========================= */}

      <div className="history-controls">

        <input
          type="text"
          placeholder="Search name, email, contact, family, or company..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="history-search"
        />


        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="history-filter"
        >

          <option value="All">
            All Statuses
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>


      {/* =========================
          CUSTOMER TABLE
          ========================= */}

      <div className="history-table-card">

        {loading ? (

          <div className="history-loading">
            Loading customer history...
          </div>

        ) : (

          <table className="history-table">

            <thead>

              <tr>
                <th>
                  Customer
                </th>

                <th>
                  Contact
                </th>

                <th>
                  Family / Company
                </th>

                <th>
                  Reservations
                </th>

                <th>
                  Latest Booking
                </th>

                <th>
                  Status Summary
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {filteredCustomers.length ===
              0 ? (

                <tr className="history-empty-row">

                  <td
                    colSpan="7"
                    className="no-results"
                  >
                    No matching customers found.
                  </td>

                </tr>

              ) : (

                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={
                        customer.email
                      }
                    >

                      {/* CUSTOMER */}

                      <td
                        data-label="Customer"
                      >

                        <strong className="history-customer-name">
                          {customer.name}
                        </strong>

                        <small className="history-customer-email">
                          {customer.email}
                        </small>

                      </td>


                      {/* CONTACT */}

                      <td
                        data-label="Contact"
                      >
                        {customer.contactNumber ||
                          "—"}
                      </td>


                      {/* FAMILY / COMPANY */}

                      <td
                        data-label="Family / Company"
                      >

                        <strong className="history-group-type">
                          {
                            customer.customerType
                          }
                        </strong>

                        {customer.groupName && (
                          <small className="history-group-name">
                            {
                              customer.groupName
                            }
                          </small>
                        )}

                      </td>


                      {/* TOTAL BOOKINGS */}

                      <td
                        data-label="Reservations"
                      >

                        <strong className="history-total">
                          {
                            customer.totalReservations
                          }
                        </strong>

                      </td>


                      {/* LATEST */}

                      <td
                        data-label="Latest Booking"
                      >

                        <strong>
                          {formatDisplayDate(
                            customer
                              .latestReservation
                              .reservation_date
                          )}
                        </strong>

                        <small className="history-latest-type">
                          {
                            customer
                              .latestReservation
                              .reservation_type
                          }
                        </small>

                      </td>


                      {/* STATUS SUMMARY */}

                      <td
                        data-label="Status Summary"
                      >

                        <div className="history-summary">

                          {customer.confirmedCount >
                            0 && (
                            <span className="history-summary-item confirmed">
                              {
                                customer.confirmedCount
                              }{" "}
                              Confirmed
                            </span>
                          )}


                          {customer.pendingCount >
                            0 && (
                            <span className="history-summary-item pending">
                              {
                                customer.pendingCount
                              }{" "}
                              Pending
                            </span>
                          )}


                          {customer.rejectedCount >
                            0 && (
                            <span className="history-summary-item rejected">
                              {
                                customer.rejectedCount
                              }{" "}
                              Rejected
                            </span>
                          )}


                          {customer.cancelledCount >
                            0 && (
                            <span className="history-summary-item cancelled">
                              {
                                customer.cancelledCount
                              }{" "}
                              Cancelled
                            </span>
                          )}

                        </div>

                      </td>


                      {/* ACTION */}

                      <td
                        data-label="Action"
                      >

                        <button
                          type="button"
                          className="history-view-btn"
                          onClick={() =>
                            setSelectedEmail(
                              customer.email
                            )
                          }
                        >
                          View History
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>
        )}

      </div>


      {/* =========================
          CUSTOMER DETAILS
          ========================= */}

      {selectedCustomer && (

        <section className="customer-history-details">

          <div className="customer-details-header">

            <div>

              <h2>
                {
                  selectedCustomer.name
                }
              </h2>

              <p>
                {
                  selectedCustomer.email
                }
              </p>

            </div>


            <button
              type="button"
              className="history-close-btn"
              aria-label="Close customer history"
              onClick={() =>
                setSelectedEmail(
                  null
                )
              }
            >
              ×
            </button>

          </div>


          {/* CUSTOMER INFORMATION */}

          <div className="customer-profile-grid">

            <div>
              <span>
                Contact Number
              </span>

              <strong>
                {
                  selectedCustomer.contactNumber ||
                  "—"
                }
              </strong>
            </div>


            <div>
              <span>
                Customer Type
              </span>

              <strong>
                {
                  selectedCustomer.customerType ||
                  "—"
                }
              </strong>
            </div>


            <div>
              <span>
                Family / Company
              </span>

              <strong>
                {
                  selectedCustomer.groupName ||
                  "—"
                }
              </strong>
            </div>


            <div>
              <span>
                Total Reservations
              </span>

              <strong>
                {
                  selectedCustomer.totalReservations
                }
              </strong>
            </div>


            <div className="customer-address">
              <span>
                Latest Address
              </span>

              <strong>
                {
                  selectedCustomer.address ||
                  "—"
                }
              </strong>
            </div>

          </div>


          {/* RESERVATION HISTORY */}

          <div className="customer-reservation-heading">

            <h3>
              Reservation History
            </h3>

            <span>
              {
                selectedCustomer.totalReservations
              }{" "}
              record
              {selectedCustomer.totalReservations ===
              1
                ? ""
                : "s"}
            </span>

          </div>


          <div className="customer-reservation-list">

            {selectedCustomer.reservations.map(
              (reservation) => (

                <article
                  className="customer-reservation-card"
                  key={
                    reservation.id
                  }
                >

                  <div className="customer-reservation-top">

                    <div>

                      <strong className="history-booking-id">
                        {formatBookingId(
                          reservation
                        )}
                      </strong>

                      <span className="history-reservation-date">
                        {formatDisplayDate(
                          reservation.reservation_date
                        )}
                      </span>

                    </div>


                    <span
                      className={
                        statusClass(
                          reservation.status
                        )
                      }
                    >
                      {
                        reservation.status
                      }
                    </span>

                  </div>


                  <div className="customer-reservation-info">

                    <div>
                      <span>
                        Reservation Type
                      </span>

                      <strong>
                        {
                          reservation.reservation_type
                        }
                      </strong>
                    </div>


                    <div>
                      <span>
                        Guests
                      </span>

                      <strong>
                        {
                          reservation.number_of_guests
                        }
                      </strong>
                    </div>


                    <div>
                      <span>
                        Arrival
                      </span>

                      <strong>
                        {formatArrivalTime(
                          reservation.arrival_time
                        )}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Extra Guest Fee
                      </span>

                      <strong>
                        ₱
                        {Number(
                          reservation.extra_guest_fee ||
                            0
                        ).toLocaleString(
                          "en-PH"
                        )}
                      </strong>
                    </div>

                  </div>


                  {reservation.special_requests && (
                    <div className="history-special-request">

                      <span>
                        Special Requests
                      </span>

                      <p>
                        {
                          reservation.special_requests
                        }
                      </p>

                    </div>
                  )}

                </article>
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}
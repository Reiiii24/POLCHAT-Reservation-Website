// This file shows the main admin dashboard with booking stats and updates.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { supabase } from "../../lib/supabaseClient";

import "./Dashboard.css";


/* ==========================================
   DATE HELPERS
   ========================================== */

function formatDateKey(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


/* ==========================================
   STATUS
   ========================================== */

function statusClass(status) {
  switch (status) {
    case "Confirmed":
      return "status-badge confirmed";

    case "Pending":
      return "status-badge pending";

    case "Rejected":
      return "status-badge rejected";

    case "Cancelled":
      return "status-badge cancelled";

    default:
      return "status-badge";
  }
}


/* ==========================================
   DASHBOARD
   ========================================== */

export default function Dashboard() {
  const [
    reservations,
    setReservations,
  ] = useState([]);

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
    useCallback(
      async () => {
        setError("");

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
              reservation_type,
              reservation_date,
              status,
              created_at
            `)
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            );


        if (
          fetchError
        ) {
          console.error(
            "Dashboard reservation error:",
            fetchError
          );

          setError(
            "Unable to load dashboard data."
          );

          setLoading(
            false
          );

          return;
        }


        setReservations(
          data || []
        );

        setLoading(
          false
        );
      },
      []
    );


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
    // Keep the summary cards fresh when reservations change outside this view.
    const channel =
      supabase
        .channel(
          "admin-dashboard-reservations"
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
     TODAY
     ======================================== */

  const todayKey =
    formatDateKey(
      new Date()
    );


  /* ========================================
     STATISTICS
     ======================================== */

  const totalBookings =
    reservations.length;


  const todaysReservations =
    reservations.filter(
      (
        reservation
      ) =>
        reservation.reservation_date ===
          todayKey &&
        (
          reservation.status ===
            "Pending" ||
          reservation.status ===
            "Confirmed"
        )
    ).length;


  const pendingReservations =
    reservations.filter(
      (
        reservation
      ) =>
        reservation.status ===
        "Pending"
    ).length;


  const stats = [
    {
      label:
        "Total Bookings",

      value:
        totalBookings,
    },

    {
      label:
        "Today's Reservations",

      value:
        todaysReservations,
    },

    {
      label:
        "Pending Reservations",

      value:
        pendingReservations,
    },
  ];


  /* ========================================
     WEEKLY BOOKINGS
     ======================================== */

  const weeklyBookings =
    useMemo(
      () => {
        const current =
          new Date();

        current.setHours(
          0,
          0,
          0,
          0
        );


        /*
          Convert JavaScript's
          Sunday-first week into
          Monday-first.
        */

        const dayOfWeek =
          current.getDay();

        const distanceToMonday =
          dayOfWeek === 0
            ? 6
            : dayOfWeek - 1;


        const monday =
          new Date(
            current
          );

        monday.setDate(
          current.getDate() -
            distanceToMonday
        );


        const dayLabels = [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ];


        return dayLabels.map(
          (
            label,
            index
          ) => {
            const date =
              new Date(
                monday
              );

            date.setDate(
              monday.getDate() +
                index
            );


            const dateKey =
              formatDateKey(
                date
              );


            /*
              The chart represents
              active reservations
              scheduled for each day.

              Rejected and Cancelled
              reservations are excluded.
            */

            const bookingCount =
              reservations.filter(
                (
                  reservation
                ) =>
                  reservation.reservation_date ===
                    dateKey &&
                  (
                    reservation.status ===
                      "Pending" ||
                    reservation.status ===
                      "Confirmed"
                  )
              ).length;


            return {
              day:
                label,

              bookings:
                bookingCount,
            };
          }
        );
      },
      [
        reservations,
      ]
    );


  /* ========================================
     RECENT BOOKINGS
     ======================================== */

  const recentBookings =
    reservations.slice(
      0,
      5
    );


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="dashboard-heading">

        <h1>
          Dashboard Overview
        </h1>

        <p>
          Monitor reservations, booking activity,
          and upcoming resort schedules.
        </p>

      </header>


      {/* =========================
          ERROR
          ========================= */}

      {error && (
        <div
          className="dashboard-error"
          role="alert"
        >
          {
            error
          }
        </div>
      )}


      {/* =========================
          STAT CARDS
          ========================= */}

      <div className="stat-grid">

        {stats.map(
          (
            stat
          ) => (
            <article
              className="stat-card"
              key={
                stat.label
              }
            >

              <p className="stat-value">

                {loading
                  ? "—"
                  : stat.value}

              </p>


              <p className="stat-label">
                {
                  stat.label
                }
              </p>

            </article>
          )
        )}

      </div>


      {/* =========================
          DASHBOARD CONTENT
          ========================= */}

      <div className="dashboard-grid">

        {/* WEEKLY CHART */}

        <section className="chart-card">

          <div className="dashboard-card-heading">

            <div>

              <h2>
                Reservations This Week
              </h2>

              <p>
                Pending and confirmed reservations
                scheduled from Monday to Sunday.
              </p>

            </div>

          </div>


          <div className="dashboard-chart-wrap">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  weeklyBookings
                }
                margin={{
                  top:
                    8,

                  right:
                    8,

                  left:
                    -18,

                  bottom:
                    0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                />

                <YAxis
                  allowDecimals={
                    false
                  }
                />

                <Tooltip />

                <Bar
                  dataKey="bookings"
                  fill="#d4a85c"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* =========================
            RECENT BOOKINGS
            ========================= */}

        <section className="recent-card">

          <div className="dashboard-card-heading">

            <div>

              <h2>
                Recent Bookings
              </h2>

              <p>
                Latest reservation requests
                submitted by customers.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="dashboard-loading">

              Loading recent bookings...

            </div>

          ) : recentBookings.length ===
            0 ? (

            <div className="dashboard-empty">

              No reservations have been submitted yet.

            </div>

          ) : (

            <div className="recent-table-wrap">

              <table className="recent-table">

                <thead>

                  <tr>

                    <th>
                      Guest
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentBookings.map(
                    (
                      booking
                    ) => (
                      <tr
                        key={
                          booking.id
                        }
                      >

                        <td
                          data-label="Guest"
                        >
                          {
                            booking.name
                          }
                        </td>


                        <td
                          data-label="Type"
                        >
                          {
                            booking.reservation_type
                          }
                        </td>


                        <td
                          data-label="Date"
                        >
                          {formatDisplayDate(
                            booking.reservation_date
                          )}
                        </td>


                        <td
                          data-label="Status"
                        >

                          <span
                            className={
                              statusClass(
                                booking.status
                              )
                            }
                          >
                            {
                              booking.status
                            }
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}
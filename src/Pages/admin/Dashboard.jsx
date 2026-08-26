import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const stats = [
  { label: "Total Bookings", value: 128 },
  { label: "Today's Check-ins", value: 6 },
  { label: "Pending Payments", value: 9 },
  { label: "Available Rooms", value: 14 },
];

const weeklyBookings = [
  { day: "Mon", bookings: 8 },
  { day: "Tue", bookings: 5 },
  { day: "Wed", bookings: 12 },
  { day: "Thu", bookings: 7 },
  { day: "Fri", bookings: 15 },
  { day: "Sat", bookings: 22 },
  { day: "Sun", bookings: 18 },
];

const recentBookings = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    type: "Overnight",
    date: "Aug 20, 2026",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Maria Santos",
    type: "Day Tour",
    date: "Aug 20, 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    type: "22-Hour Stay",
    date: "Aug 19, 2026",
    status: "Confirmed",
  },
  {
    id: 4,
    name: "Ana Lopez",
    type: "Day Tour",
    date: "Aug 19, 2026",
    status: "Cancelled",
  },
  {
    id: 5,
    name: "Mark Torres",
    type: "Overnight",
    date: "Aug 18, 2026",
    status: "Confirmed",
  },
];

function statusClass(status) {
  if (status === "Confirmed") {
    return "status-badge confirmed";
  }

  if (status === "Pending") {
    return "status-badge pending";
  }

  return "status-badge cancelled";
}

export default function Dashboard() {
  const [bookings] = useState(recentBookings);

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <h1>Dashboard Overview</h1>
        <p>
          Monitor bookings, check-ins, payments, and room availability.
        </p>
      </header>

      <div className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="chart-card">
          <h2>Bookings This Week</h2>

          <div className="dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyBookings}
                margin={{
                  top: 8,
                  right: 8,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="#d4a85c"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="recent-card">
          <h2>Recent Bookings</h2>

          <div className="recent-table-wrap">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td data-label="Guest">{booking.name}</td>
                    <td data-label="Type">{booking.type}</td>
                    <td data-label="Date">{booking.date}</td>
                    <td data-label="Status">
                      <span className={statusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

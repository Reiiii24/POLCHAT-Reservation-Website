import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const stats = [
  { label: 'Total Bookings', value: 128 },
  { label: "Today's Check-ins", value: 6 },
  { label: 'Pending Payments', value: 9 },
  { label: 'Available Rooms', value: 14 },
];

const weeklyBookings = [
  { day: 'Mon', bookings: 8 },
  { day: 'Tue', bookings: 5 },
  { day: 'Wed', bookings: 12 },
  { day: 'Thu', bookings: 7 },
  { day: 'Fri', bookings: 15 },
  { day: 'Sat', bookings: 22 },
  { day: 'Sun', bookings: 18 },
];

const recentBookings = [
  { id: 1, name: 'Juan Dela Cruz', type: 'Overnight', date: 'Aug 20, 2026', status: 'Confirmed' },
  { id: 2, name: 'Maria Santos', type: 'Day Tour', date: 'Aug 20, 2026', status: 'Pending' },
  { id: 3, name: 'Pedro Reyes', type: '22-Hour Stay', date: 'Aug 19, 2026', status: 'Confirmed' },
  { id: 4, name: 'Ana Lopez', type: 'Day Tour', date: 'Aug 19, 2026', status: 'Cancelled' },
  { id: 5, name: 'Mark Torres', type: 'Overnight', date: 'Aug 18, 2026', status: 'Confirmed' },
];

function statusClass(status) {
  if (status === 'Confirmed') return 'status-badge confirmed';
  if (status === 'Pending') return 'status-badge pending';
  return 'status-badge cancelled';
}

export default function Dashboard() {
  const [bookings] = useState(recentBookings);

  return (
    <div className="dashboard-page">
      <h1>Dashboard Overview</h1>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h2>Bookings This Week</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#d4a85c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-card">
          <h2>Recent Bookings</h2>
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
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.type}</td>
                  <td>{b.date}</td>
                  <td>
                    <span className={statusClass(b.status)}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
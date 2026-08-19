import { useState } from 'react';
import './Notifications.css';

const initialNotifications = [
  { id: 1, type: 'booking', message: 'New booking from Juan Dela Cruz for Overnight Stay.', time: '10 minutes ago', read: false },
  { id: 2, type: 'payment', message: 'Payment received from Maria Santos — ₱1,200.', time: '1 hour ago', read: false },
  { id: 3, type: 'cancellation', message: 'Ana Lopez cancelled her Day Tour booking.', time: '3 hours ago', read: false },
  { id: 4, type: 'booking', message: 'New booking from Pedro Reyes for 22-Hour Stay.', time: 'Yesterday', read: true },
  { id: 5, type: 'reminder', message: "Reservation hold for Mark Torres expires in 2 hours.", time: 'Yesterday', read: true },
  { id: 6, type: 'payment', message: 'Payment received from Pedro Reyes — ₱4,000.', time: '2 days ago', read: true },
];

const typeIcons = {
  booking: '📅',
  payment: '💳',
  cancellation: '❌',
  reminder: '⏰',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('All');

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-page">
      <div className="notif-header">
        <h1>
          Notifications
          {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </h1>
        <button className="mark-all-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="notif-filters">
        {['All', 'Unread', 'booking', 'payment', 'cancellation', 'reminder'].map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'All' || f === 'Unread' ? f : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="notif-list">
        {filtered.length === 0 ? (
          <p className="no-notif">No notifications here.</p>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`notif-card ${n.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="notif-icon">{typeIcons[n.type]}</div>
              <div className="notif-content">
                <p>{n.message}</p>
                <small>{n.time}</small>
              </div>
              {!n.read && <span className="dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
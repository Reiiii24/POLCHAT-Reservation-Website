import { useState } from "react";
import "./Notifications.css";

const initialNotifications = [
  {
    id: 1,
    type: "booking",
    message: "New booking from Juan Dela Cruz for Overnight Stay.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    message: "Payment received from Maria Santos — ₱1,200.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "cancellation",
    message: "Ana Lopez cancelled her Day Tour booking.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "booking",
    message: "New booking from Pedro Reyes for 22-Hour Stay.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "reminder",
    message: "Reservation hold for Mark Torres expires in 2 hours.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "payment",
    message: "Payment received from Pedro Reyes — ₱4,000.",
    time: "2 days ago",
    read: true,
  },
];

const typeIcons = {
  booking: "📅",
  payment: "💳",
  cancellation: "❌",
  reminder: "⏰",
};

const filterOptions = [
  "All",
  "Unread",
  "booking",
  "payment",
  "cancellation",
  "reminder",
];

export default function Notifications() {
  const [
    notifications,
    setNotifications,
  ] = useState(initialNotifications);

  const [filter, setFilter] = useState("All");

  const markAsRead = (id) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const filtered = notifications.filter((notification) => {
    if (filter === "All") {
      return true;
    }

    if (filter === "Unread") {
      return !notification.read;
    }

    return notification.type === filter;
  });

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <div className="notif-page">
      <header className="notif-header">
        <div>
          <h1>
            Notifications

            {unreadCount > 0 && (
              <span className="unread-count">
                {unreadCount}
              </span>
            )}
          </h1>

          <p>
            Review booking, payment, cancellation, and reservation alerts.
          </p>
        </div>

        <button
          type="button"
          className="mark-all-btn"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </header>

      <div className="notif-filters">
        {filterOptions.map((filterOption) => (
          <button
            type="button"
            key={filterOption}
            className={`filter-chip ${
              filter === filterOption
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter(filterOption)
            }
          >
            {filterOption === "All" ||
            filterOption === "Unread"
              ? filterOption
              : filterOption
                  .charAt(0)
                  .toUpperCase() +
                filterOption.slice(1)}
          </button>
        ))}
      </div>

      <div className="notif-list">
        {filtered.length === 0 ? (
          <p className="no-notif">
            No notifications here.
          </p>
        ) : (
          filtered.map((notification) => (
            <button
              type="button"
              key={notification.id}
              className={`notif-card ${
                notification.read
                  ? "read"
                  : "unread"
              }`}
              onClick={() =>
                markAsRead(
                  notification.id
                )
              }
            >
              <div className="notif-icon">
                {
                  typeIcons[
                    notification.type
                  ]
                }
              </div>

              <div className="notif-content">
                <p>
                  {notification.message}
                </p>

                <small>
                  {notification.time}
                </small>
              </div>

              {!notification.read && (
                <span
                  className="dot"
                  aria-label="Unread notification"
                />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

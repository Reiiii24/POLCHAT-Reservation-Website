// This file shows admin notifications about booking activity and updates.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import "./Notifications.css";


/* ==========================================
   CATEGORY ICONS
   ========================================== */

const typeIcons = {
  Booking: "📅",
  Chat: "💬",
  Payment: "💳",
  Cancellation: "❌",
  Reminder: "⏰",
};


/* ==========================================
   FILTERS
   ========================================== */

const filterOptions = [
  "All",
  "Unread",
  "Booking",
  "Chat",
  "Payment",
  "Cancellation",
  "Reminder",
];


/* ==========================================
   RELATIVE TIME
   ========================================== */

function formatNotificationTime(
  dateString
) {
  if (!dateString) {
    return "";
  }


  const date =
    new Date(
      dateString
    );

  const now =
    new Date();


  const difference =
    now.getTime() -
    date.getTime();


  const seconds =
    Math.floor(
      difference / 1000
    );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const hours =
    Math.floor(
      minutes / 60
    );

  const days =
    Math.floor(
      hours / 24
    );


  if (seconds < 30) {
    return "Just now";
  }


  if (minutes < 1) {
    return "Less than a minute ago";
  }


  if (minutes === 1) {
    return "1 minute ago";
  }


  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }


  if (hours === 1) {
    return "1 hour ago";
  }


  if (hours < 24) {
    return `${hours} hours ago`;
  }


  if (days === 1) {
    return "Yesterday";
  }


  if (days < 7) {
    return `${days} days ago`;
  }


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
   NOTIFICATIONS PAGE
   ========================================== */

export default function Notifications() {
  const navigate =
    useNavigate();


  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    filter,
    setFilter,
  ] = useState("All");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    markingAll,
    setMarkingAll,
  ] = useState(false);


  const [
    openingId,
    setOpeningId,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  /* ========================================
     FETCH NOTIFICATIONS
     ======================================== */

  const fetchNotifications =
    useCallback(
      async (
        showLoader = false
      ) => {

        if (showLoader) {
          setLoading(
            true
          );
        }


        setError(
          ""
        );


        const {
          data,
          error:
            fetchError,
        } =
          await supabase
            .from(
              "notifications"
            )
            .select(`
              id,
              category,
              title,
              message,
              target_path,
              reservation_id,
              conversation_id,
              message_id,
              is_read,
              created_at
            `)
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            );


        if (fetchError) {

          console.error(
            "Notification loading error:",
            fetchError
          );


          setError(
            "Unable to load notifications."
          );


          setLoading(
            false
          );

          return;
        }


        setNotifications(
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

    fetchNotifications(
      true
    );

  }, [
    fetchNotifications,
  ]);


  /* ========================================
     REALTIME NOTIFICATIONS
     ======================================== */

  useEffect(() => {

    const channel =
      supabase
        .channel(
          "admin-notifications-realtime"
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "notifications",
          },
          () => {

            fetchNotifications(
              false
            );

          }
        )
        .subscribe();


    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, [
    fetchNotifications,
  ]);


  /* ========================================
     UNREAD COUNT
     ======================================== */

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.is_read
        ).length,

      [
        notifications,
      ]
    );


  /* ========================================
     FILTERED NOTIFICATIONS
     ======================================== */

  const filteredNotifications =
    useMemo(
      () => {

        if (
          filter === "All"
        ) {
          return notifications;
        }


        if (
          filter === "Unread"
        ) {

          return notifications.filter(
            (notification) =>
              !notification.is_read
          );

        }


        return notifications.filter(
          (notification) =>
            notification.category ===
            filter
        );

      },
      [
        notifications,
        filter,
      ]
    );


  /* ========================================
     MARK ONE AS READ
     ======================================== */

  const markAsRead =
    async (
      notificationId
    ) => {

      const notification =
        notifications.find(
          (item) =>
            item.id ===
            notificationId
        );


      if (
        !notification ||
        notification.is_read
      ) {
        return true;
      }


      /*
        Update the interface immediately.
      */

      setNotifications(
        (
          previousNotifications
        ) =>
          previousNotifications.map(
            (item) =>
              item.id ===
              notificationId
                ? {
                    ...item,
                    is_read:
                      true,
                  }
                : item
          )
      );


      const {
        error:
          readError,
      } =
        await supabase.rpc(
          "mark_notification_read",
          {
            p_notification_id:
              notificationId,
          }
        );


      if (readError) {

        console.error(
          "Mark notification read error:",
          readError
        );


        /*
          Restore unread state if
          database update failed.
        */

        setNotifications(
          (
            previousNotifications
          ) =>
            previousNotifications.map(
              (item) =>
                item.id ===
                notificationId
                  ? {
                      ...item,
                      is_read:
                        false,
                    }
                  : item
            )
        );


        setError(
          "Unable to mark the notification as read."
        );


        return false;
      }


      return true;

    };


  /* ========================================
     OPEN NOTIFICATION
     ======================================== */

  const openNotification =
    async (
      notification
    ) => {

      if (
        openingId !== null
      ) {
        return;
      }


      setOpeningId(
        notification.id
      );


      setError(
        ""
      );


      await markAsRead(
        notification.id
      );


      /*
        Navigate to the page associated
        with the notification.

        We also pass IDs in route state
        so they can be used later for
        deeper navigation if desired.
      */

      if (
        notification.target_path
      ) {

        navigate(
          notification.target_path,
          {
            state: {
              reservationId:
                notification.reservation_id,

              conversationId:
                notification.conversation_id,

              messageId:
                notification.message_id,
            },
          }
        );

      }


      setOpeningId(
        null
      );

    };


  /* ========================================
     MARK ALL AS READ
     ======================================== */

  const markAllAsRead =
    async () => {

      if (
        unreadCount === 0 ||
        markingAll
      ) {
        return;
      }


      setMarkingAll(
        true
      );


      setError(
        ""
      );


      /*
        Optimistic update.
      */

      const previousNotifications =
        notifications;


      setNotifications(
        (
          currentNotifications
        ) =>
          currentNotifications.map(
            (notification) => ({
              ...notification,
              is_read:
                true,
            })
          )
      );


      const {
        error:
          markAllError,
      } =
        await supabase.rpc(
          "mark_all_notifications_read"
        );


      if (markAllError) {

        console.error(
          "Mark all notifications error:",
          markAllError
        );


        setNotifications(
          previousNotifications
        );


        setError(
          "Unable to mark all notifications as read."
        );

      }


      setMarkingAll(
        false
      );

    };


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="notif-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="notif-header">

        <div>

          <h1>

            Notifications


            {unreadCount >
              0 && (

              <span className="unread-count">

                {
                  unreadCount
                }

              </span>

            )}

          </h1>


          <p>
            Review booking, chat, payment,
            cancellation, and reservation alerts.
          </p>

        </div>


        <button
          type="button"
          className="mark-all-btn"
          onClick={
            markAllAsRead
          }
          disabled={
            unreadCount === 0 ||
            markingAll
          }
        >

          {markingAll
            ? "Marking..."
            : "Mark all as read"}

        </button>

      </header>


      {/* =========================
          ERROR
          ========================= */}

      {error && (

        <div
          className="notif-error"
          role="alert"
        >

          {error}

        </div>

      )}


      {/* =========================
          FILTERS
          ========================= */}

      <div className="notif-filters">

        {filterOptions.map(
          (
            filterOption
          ) => (

            <button
              type="button"
              key={
                filterOption
              }
              className={`filter-chip ${
                filter ===
                filterOption
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter(
                  filterOption
                )
              }
            >

              {
                filterOption
              }


              {filterOption ===
                "Unread" &&
                unreadCount >
                  0 && (

                <span className="filter-count">

                  {
                    unreadCount
                  }

                </span>

              )}

            </button>

          )
        )}

      </div>


      {/* =========================
          NOTIFICATION LIST
          ========================= */}

      <div className="notif-list">

        {loading ? (

          <div className="notif-loading">

            Loading notifications...

          </div>

        ) : filteredNotifications.length ===
          0 ? (

          <div className="no-notif">

            <strong>
              No notifications here.
            </strong>


            <p>

              {filter ===
              "Unread"
                ? "You're all caught up."
                : filter ===
                  "All"
                ? "New system activity will appear here."
                : `No ${filter.toLowerCase()} notifications yet.`}

            </p>

          </div>

        ) : (

          filteredNotifications.map(
            (
              notification
            ) => (

              <button
                type="button"
                key={
                  notification.id
                }
                className={`notif-card ${
                  notification.is_read
                    ? "read"
                    : "unread"
                }`}
                disabled={
                  openingId ===
                  notification.id
                }
                onClick={() =>
                  openNotification(
                    notification
                  )
                }
              >

                {/* ICON */}

                <div className="notif-icon">

                  {typeIcons[
                    notification
                      .category
                  ] || "🔔"}

                </div>


                {/* CONTENT */}

                <div className="notif-content">

                  <strong className="notif-title">

                    {
                      notification.title
                    }

                  </strong>


                  <p>

                    {
                      notification.message
                    }

                  </p>


                  <small>

                    {formatNotificationTime(
                      notification.created_at
                    )}

                  </small>

                </div>


                {/* UNREAD DOT */}

                {!notification.is_read && (

                  <span
                    className="dot"
                    aria-label="Unread notification"
                  />

                )}

              </button>

            )
          )

        )}

      </div>

    </div>
  );
}
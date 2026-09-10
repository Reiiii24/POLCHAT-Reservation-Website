// This file shows the admin review analytics and customer feedback.

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


/* ==========================================
   DATE HELPERS
   ========================================== */

function formatDisplayDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


/* ==========================================
   REVIEW ANALYTICS PAGE
   ========================================== */

export default function ReviewAnalytics() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* ========================================
     LOAD REVIEWS
     ======================================== */

  const fetchReviews = useCallback(async () => {
    setError("");

    const { data, error: fetchError } = await supabase
      .from("reviews")
      .select(`
        id,
        guest_name,
        rating,
        comment,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Review analytics error:", fetchError);
      setError("Unable to load review data.");
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }, []);


  /* ========================================
     INITIAL LOAD
     ======================================== */

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);


  /* ========================================
     REALTIME
     ======================================== */

  useEffect(() => {
    const channel = supabase
      .channel("admin-review-analytics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReviews]);


  /* ========================================
     STATISTICS
     ======================================== */

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length;

  const stats = [
    {
      label: "Total Reviews",
      value: totalReviews,
    },
    {
      label: "Average Rating",
      value: totalReviews > 0 ? `${averageRating} / 5.0` : "—",
    },
    {
      label: "5-Star Ratings",
      value: fiveStarReviews,
    },
  ];


  /* ========================================
     RATING DISTRIBUTION CHART
     ======================================== */

  const ratingDistribution = useMemo(() => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      if (distribution[review.rating] !== undefined) {
        distribution[review.rating] += 1;
      }
    });

    return [
      { stars: "5 Stars", count: distribution[5] },
      { stars: "4 Stars", count: distribution[4] },
      { stars: "3 Stars", count: distribution[3] },
      { stars: "2 Stars", count: distribution[2] },
      { stars: "1 Star", count: distribution[1] },
    ];
  }, [reviews]);


  /* ========================================
     PAGE
     ======================================== */

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="dashboard-heading">
        <h1>Review Analytics</h1>
        <p>Monitor customer feedback, overall satisfaction, and resort ratings.</p>
      </header>


      {/* =========================
          ERROR
          ========================= */}

      {error && (
        <div className="dashboard-error" role="alert">
          {error}
        </div>
      )}


      {/* =========================
          STAT CARDS
          ========================= */}

      <div className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="stat-value">
              {loading ? "—" : stat.value}
            </p>
            <p className="stat-label">{stat.label}</p>
          </article>
        ))}
      </div>


      {/* =========================
          DASHBOARD CONTENT
          ========================= */}

      <div className="dashboard-grid">

        {/* CHART */}

        <section className="chart-card">
          <div className="dashboard-card-heading">
            <div>
              <h2>Rating Distribution</h2>
              <p>Breakdown of all customer star ratings.</p>
            </div>
          </div>

          <div className="dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingDistribution}
                layout="vertical"
                margin={{ top: 8, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="stars" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#d4a85c" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* =========================
            RECENT REVIEWS TABLE
            ========================= */}

        <section className="recent-card">
          <div className="dashboard-card-heading">
            <div>
              <h2>Recent Feedback</h2>
              <p>Latest comments submitted by your guests.</p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">Loading recent feedback...</div>
          ) : reviews.length === 0 ? (
            <div className="dashboard-empty">No reviews have been submitted yet.</div>
          ) : (
            <div className="recent-table-wrap">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td data-label="Guest">
                        <strong>{review.guest_name}</strong>
                      </td>
                      <td data-label="Rating">
                        <span style={{ color: "#d4a85c", fontWeight: "bold", fontSize: "1.1rem" }}>
                          {"★".repeat(review.rating)}
                          <span style={{ color: "#e0e0e0" }}>
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </span>
                      </td>
                      <td data-label="Comment" style={{ maxWidth: "250px", whiteSpace: "normal", lineHeight: "1.4" }}>
                        {review.comment ? `"${review.comment}"` : <span style={{ color: "#999", fontStyle: "italic" }}>No comment provided</span>}
                      </td>
                      <td data-label="Date">
                        {formatDisplayDate(review.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./ReviewForm.css";

export default function ReviewForm() {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [reservationData, setReservationData] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ========================================
     VALIDATE THE URL LINK
     ======================================== */
  useEffect(() => {
    const validateLink = async () => {
      // 1. Check if the URL has a reference ID
      if (!refId) {
        setValidationError("Invalid link. Please use the exact link sent to your email.");
        setIsValidating(false);
        return;
      }

      // 2. Fetch the reservation details
      const { data: reservation, error: fetchError } = await supabase
        .from("reservations")
        .select("id, name, status, reservation_date")
        .eq("id", refId)
        .single();

      if (fetchError || !reservation) {
        setValidationError("We could not find a reservation linked to this request.");
        setIsValidating(false);
        return;
      }

      // 3. Ensure the reservation was actually confirmed
      if (reservation.status !== "Confirmed") {
        setValidationError("Only guests with confirmed reservations can leave a review.");
        setIsValidating(false);
        return;
      }

      // 4. Ensure the reservation date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const resDate = new Date(reservation.reservation_date);
      
      if (resDate >= today) {
        setValidationError("You can only leave a review after your stay has concluded.");
        setIsValidating(false);
        return;
      }

      // 5. Check if they already left a review
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("reservation_id", refId)
        .single();

      if (existingReview) {
        setValidationError("You have already submitted a review for this stay. Thank you!");
        setIsValidating(false);
        return;
      }

      // Passed all checks!
      setReservationData(reservation);
      setIsValidating(false);
    };

    validateLink();
  }, [refId]);


  /* ========================================
     SUBMIT THE FORM
     ======================================== */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating === 0) {
      setFormError("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const { error: insertError } = await supabase
      .from("reviews")
      .insert([
        {
          reservation_id: reservationData.id,
          guest_name: reservationData.name, // Auto-pulled from the database!
          rating: rating,
          comment: comment.trim() || null,
        },
      ]);

    if (insertError) {
      console.error("Review submission error:", insertError);
      setFormError("We could not submit your review. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  /* ========================================
     PAGE RENDER
     ======================================== */

  // 1. Loading State
  if (isValidating) {
    return (
      <div className="review-page">
        <div className="review-card">
          <h2>Validating...</h2>
          <p>Please wait while we verify your link.</p>
        </div>
      </div>
    );
  }

  // 2. Invalid Link / Error State
  if (validationError) {
    return (
      <div className="review-page">
        <div className="review-card">
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔒</div>
          <h2 style={{ color: "#d32f2f" }}>Access Denied</h2>
          <p>{validationError}</p>
        </div>
      </div>
    );
  }

  // 3. Success State
  if (success) {
    return (
      <div className="review-page">
        <div className="review-card success-card">
          <div className="success-icon">✓</div>
          <h2>Thank You, {reservationData.name}!</h2>
          <p>Your feedback has been submitted successfully. We appreciate you taking the time to help us improve PolChat Garden Resort!</p>
        </div>
      </div>
    );
  }

  // 4. The Form
  return (
    <div className="review-page">
      <div className="review-card">
        <h2>Rate Your Stay</h2>
        <p>Welcome back, <strong>{reservationData.name}</strong>! How was your experience with us?</p>

        {formError && <div className="review-error">{formError}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="star-rating-container">
            <span>Rating <b>*</b></span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-button ${
                    star <= (hoverRating || rating) ? "active" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isSubmitting}
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="rating-label">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </div>
          </div>

          <label>
            <span>Comments & Feedback</span>
            <textarea
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you loved or what we can improve..."
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            className="review-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
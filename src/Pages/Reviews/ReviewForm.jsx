import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./ReviewForm.css";

export default function ReviewForm() {
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!guestName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const { error: insertError } = await supabase
      .from("reviews")
      .insert([
        {
          guest_name: guestName.trim(),
          rating: rating,
          comment: comment.trim() || null,
        },
      ]);

    if (insertError) {
      console.error("Review submission error:", insertError);
      setError("We could not submit your review. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="review-page">
        <div className="review-card success-card">
          <div className="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully. We appreciate you taking the time to help us improve PolChat Garden Resort!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-card">
        <h2>Rate Your Stay</h2>
        <p>How was your experience at PolChat Garden Resort?</p>

        {error && <div className="review-error">{error}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          <label>
            <span>Name <b>*</b></span>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
          </label>

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
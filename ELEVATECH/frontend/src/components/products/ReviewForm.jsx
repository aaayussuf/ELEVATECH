import { useState } from "react";

import ReviewStars from "./ReviewStars";
import reviewService from "../../services/reviewService";

export default function ReviewForm({
  productId,
  reload,
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanTitle = title.trim();
    const cleanComment = comment.trim();

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (!cleanComment) {
      setError("Please write a review before submitting.");
      return;
    }

    if (cleanComment.length < 5) {
      setError("Your review must contain at least 5 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await reviewService.createReview({
        product_id: productId,
        rating,
        title: cleanTitle || null,
        comment: cleanComment,
      });

      setTitle("");
      setComment("");
      setRating(5);

      setMessage("Thank you! Your review has been submitted.");

      await reload();

    } catch (err) {
      console.error("Review submission error:", err);

      setError(
        err.message ||
        "Unable to create review. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl shadow p-8"
    >
      <h3 className="text-2xl font-bold mb-6">
        Write a Review
      </h3>

      {/* Rating */}

      <div>
        <label className="block font-semibold mb-3">
          Your Rating
        </label>

        <ReviewStars
          rating={rating}
          setRating={setRating}
        />
      </div>

      {/* Title */}

      <div className="mt-6">
        <label
          htmlFor="review-title"
          className="block font-semibold mb-2"
        >
          Review Title
        </label>

        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          placeholder="Enter a review title"
          className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Comment */}

      <div className="mt-6">
        <label
          htmlFor="review-comment"
          className="block font-semibold mb-2"
        >
          Your Review
        </label>

        <textarea
          id="review-comment"
          rows="5"
          maxLength={2000}
          className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us what you think..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="text-sm text-gray-400 mt-2 text-right">
          {comment.length}/2000
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Success */}

      {message && (
        <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
          {message}
        </div>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting
          ? "Submitting..."
          : "Submit Review"}
      </button>
    </form>
  );
}

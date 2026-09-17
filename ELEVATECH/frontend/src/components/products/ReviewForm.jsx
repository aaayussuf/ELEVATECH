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
      className="w-full min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8"
    >
      <h3 className="text-lg font-bold leading-tight text-[#0F1111] sm:text-xl md:text-2xl">
        Write a Review
      </h3>

      {/* RATING */}
      <div className="mt-5 sm:mt-6">
        <label className="mb-3 block text-sm font-semibold text-[#0F1111] sm:text-base">
          Your Rating
        </label>

        <div className="min-h-11 flex items-center">
          <ReviewStars
            rating={rating}
            setRating={setRating}
          />
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-5 sm:mt-6">
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-semibold text-[#0F1111] sm:text-base"
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
          className="min-h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-sm text-[#0F1111] outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:text-base"
        />
      </div>

      {/* COMMENT */}
      <div className="mt-5 sm:mt-6">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-semibold text-[#0F1111] sm:text-base"
        >
          Your Review
        </label>

        <textarea
          id="review-comment"
          rows="5"
          maxLength={2000}
          placeholder="Tell us what you think..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-w-0 resize-y rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-sm leading-6 text-[#0F1111] outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:py-4 sm:text-base"
        />

        <div className="mt-2 text-right text-xs text-gray-400 sm:text-sm">
          {comment.length}/2000
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mt-4 w-full min-w-0 break-words rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-700 sm:mt-5 sm:p-4"
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {message && (
        <div
          role="status"
          className="mt-4 w-full min-w-0 break-words rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm leading-6 text-green-700 sm:mt-5 sm:p-4"
        >
          {message}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 min-h-11 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:w-auto sm:text-base"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

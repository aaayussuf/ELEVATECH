import { useCallback, useEffect, useState } from "react";

import reviewService from "../../services/reviewService";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import RatingSummary from "./RatingSummary";

export default function ReviewSection({ productId, onReviewsChange }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await reviewService.getReviews(productId);
      const nextReviews = Array.isArray(data) ? data : [];

      setReviews(nextReviews);

      if (onReviewsChange) {
        onReviewsChange(nextReviews);
      }
    } catch (err) {
      console.error("Load reviews error:", err);
      setError(err?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId, onReviewsChange]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (loading) {
    return (
      <div
        className="w-full min-w-0 py-6 text-sm text-gray-500 sm:py-8"
        aria-busy="true"
      >
        Loading reviews...
      </div>
    );
  }

  return (
    <section className="w-full min-w-0">
      <div className="space-y-6 sm:space-y-8">
        {error && (
          <div className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:rounded-2xl sm:p-5">
            <p className="break-words leading-6">
              {error}
            </p>

            <button
              type="button"
              onClick={loadReviews}
              className="mt-3 min-h-11 rounded-lg px-1 font-bold underline underline-offset-2 transition hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="w-full min-w-0">
          <RatingSummary reviews={reviews} />
        </div>

        <div className="w-full min-w-0">
          <ReviewForm
            productId={productId}
            reload={loadReviews}
          />
        </div>

        <div className="w-full min-w-0">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </section>
  );
}

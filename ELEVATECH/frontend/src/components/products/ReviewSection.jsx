import { useCallback, useEffect, useState } from "react";

import reviewService from "../../services/reviewService";

import ReviewForm from "./ReviewForm";

import ReviewList from "./ReviewList";

import RatingSummary from "./RatingSummary";

export default function ReviewSection({ productId }) {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reviewService.getReviews(productId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load reviews error:", err);
      setError(err?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

   
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (loading) {
    return <div className="py-8 text-gray-500">Loading reviews...</div>;
  }

  return (

    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
          {error}
          <button
            onClick={loadReviews}
            className="block mt-3 font-bold underline"
          >
            Try Again
          </button>
        </div>
      )}

      <RatingSummary

        reviews={reviews}

      />

      <ReviewForm

        productId={productId}

        reload={loadReviews}

      />

      <ReviewList reviews={reviews} />

    </div>

  );

}


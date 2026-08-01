import { useEffect, useState } from "react";

import reviewService from "../../services/reviewService";

import ReviewForm from "./ReviewForm";

import ReviewList from "./ReviewList";

import RatingSummary from "./RatingSummary";

export default function ReviewSection({ productId }) {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function loadReviews() {

    const data = await reviewService.getReviews(productId);

    setReviews(data);

  }

  return (

    <div className="space-y-8">

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


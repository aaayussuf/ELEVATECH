import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import reviewService from "../../services/reviewService";

export default function ReviewList({ reviews = [] }) {
  const [sort, setSort] = useState("newest");
  const [helpful, setHelpful] = useState({});

  const sortedReviews = useMemo(() => {
    const list = [...(reviews || [])];

    switch (sort) {
      case "highest":
        list.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;

      case "lowest":
        list.sort((a, b) => Number(a.rating) - Number(b.rating));
        break;

      default:
        list.sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );
    }

    return list;
  }, [reviews, sort]);

  async function handleHelpful(reviewId) {
    if (helpful[reviewId]) {
      return;
    }

    try {
      const data =
        await reviewService.markHelpful(reviewId);

      setHelpful((current) => ({
        ...current,
        [reviewId]: data.helpful_count,
      }));
    } catch (err) {
      console.error(
        "Helpful error:",
        err
      );
    }
  }

  if (!reviews || !reviews.length) {
    return (
      <div className="bg-white rounded-2xl shadow p-8">
        <h3 className="text-2xl font-bold">
          Customer Reviews
        </h3>

        <p className="text-gray-500 mt-4">
          No reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl font-bold">
          Customer Reviews
        </h2>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="newest">
            Newest
          </option>

          <option value="highest">
            Highest Rating
          </option>

          <option value="lowest">
            Lowest Rating
          </option>
        </select>

      </div>

      <div className="space-y-8">

        {sortedReviews.map((review) => {

          const helpfulCount =
            helpful[review.id] ??
            review.helpful_count ??
            0;

          const alreadyHelpful =
            Boolean(helpful[review.id]);

          return (
            <div
              key={review.id}
              className="border-b pb-8 last:border-0"
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="font-bold">
                      {review.user?.name ||
                        "Customer"}
                    </h3>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Verified Purchase
                    </span>

                  </div>

                  {review.title && (
                    <h4 className="font-bold text-lg mt-3">
                      {review.title}
                    </h4>
                  )}

                  <div className="flex mt-3">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={
                            star <= Number(review.rating)
                              ? "#FACC15"
                              : "none"
                          }
                          color="#FACC15"
                        />
                      )
                    )}

                  </div>

                </div>

                <span className="text-gray-400">
                  {review.created_at
                    ? new Date(
                        review.created_at
                      ).toLocaleDateString()
                    : ""}
                </span>

              </div>

              <p className="mt-5 text-gray-700 leading-7">
                {review.comment}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleHelpful(review.id)
                }
                disabled={alreadyHelpful}
                className={`mt-5 px-4 py-2 rounded-lg transition ${
                  alreadyHelpful
                    ? "bg-green-100 text-green-700"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                👍 Helpful
                {helpfulCount > 0 &&
                  ` (${helpfulCount})`}
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}



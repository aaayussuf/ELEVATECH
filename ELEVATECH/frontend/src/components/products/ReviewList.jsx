import { useMemo, useState } from "react";
import { CircleCheckBig, Star } from "lucide-react";

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
      const data = await reviewService.markHelpful(reviewId);

      setHelpful((current) => ({
        ...current,
        [reviewId]: data.helpful_count,
      }));
    } catch (err) {
      console.error("Helpful error:", err);
    }
  }

  if (!reviews || !reviews.length) {
    return (
      <section className="w-full min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8">
        <h3 className="text-lg font-bold text-[#0F1111] sm:text-xl md:text-2xl">
          Customer Reviews
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:mt-4">
          No reviews yet.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8">
      {/* HEADER */}
      <div className="flex min-w-0 flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="min-w-0 text-lg font-bold leading-tight text-[#0F1111] sm:text-xl md:text-2xl">
          Customer Reviews
        </h2>

        <label className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
          <span className="shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            Sort:
          </span>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#0F1111] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto sm:min-w-[170px]"
            aria-label="Sort customer reviews"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </label>
      </div>
      {/* REVIEWS */}
      <div className="space-y-6 sm:space-y-8">
        {sortedReviews.map((review) => {
          const helpfulCount =
            helpful[review.id] ??
            review.helpful_count ??
            0;

          const alreadyHelpful =
            Boolean(helpful[review.id]);

          return (
            <article
              key={review.id}
              className="min-w-0 border-b border-gray-200 pb-6 last:border-0 last:pb-0 sm:pb-8"
            >
              {/* REVIEW HEADER */}
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h3 className="min-w-0 max-w-full break-words font-bold text-[#0F1111]">
                      {review.user?.name || "Customer"}
                    </h3>

                    <span
                      title="This customer purchased the product from ELEVATECH"
                      className="inline-flex max-w-full shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold leading-4 text-emerald-800 sm:px-2.5 sm:text-[11px]"
                    >
                      <CircleCheckBig
                        size={12}
                        className="shrink-0"
                      />
                      <span>Verified Purchase</span>
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="mt-3 break-words text-base font-bold leading-6 text-[#0F1111] sm:text-lg">
                      {review.title}
                    </h4>
                  )}

                  {/* STAR RATING */}
                  <div
                    className="mt-3 flex items-center"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={17}
                        className="shrink-0 sm:h-[18px] sm:w-[18px]"
                        fill={
                          star <= Number(review.rating)
                            ? "#FACC15"
                            : "none"
                        }
                        color="#FACC15"
                      />
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <time
                  dateTime={review.created_at || undefined}
                  className="shrink-0 text-xs text-gray-400 sm:text-sm"
                >
                  {review.created_at
                    ? new Date(
                        review.created_at
                      ).toLocaleDateString()
                    : ""}
                </time>
              </div>

              {/* COMMENT */}
              <p className="mt-4 break-words text-sm leading-6 text-gray-700 sm:mt-5 sm:text-base sm:leading-7">
                {review.comment}
              </p>

              {/* HELPFUL */}
              <button
                type="button"
                onClick={() => handleHelpful(review.id)}
                disabled={alreadyHelpful}
                className={`mt-4 min-h-11 rounded-lg px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98] sm:mt-5 sm:px-4 ${
                  alreadyHelpful
                    ? "bg-green-100 text-green-700"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                👍 Helpful
                {helpfulCount > 0 &&
                  ` (${helpfulCount})`}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

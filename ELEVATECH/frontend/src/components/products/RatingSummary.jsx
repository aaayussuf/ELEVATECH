import { CircleCheckBig, Star } from "lucide-react";

export default function RatingSummary({ reviews }) {
  if (!reviews.length) {
    return null;
  }

  const average = Number(
    (
      reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
      reviews.length
    ).toFixed(1)
  );

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    total: reviews.filter(
      (review) => Number(review.rating) === star
    ).length,
  }));

  const maxCount = Math.max(...counts.map((count) => count.total));

  return (
    <div className="pdp-card pdp-card-hover p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* LARGE AVERAGE */}
        <div className="md:w-1/3">
          <p className="text-6xl font-black text-[#0F1111]">{average}</p>

          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={26}
                fill={star <= Math.round(average) ? "#FACC15" : "none"}
                color="#FACC15"
              />
            ))}
          </div>

          <p className="text-sm text-[#565959] mt-1">
            {reviews.length} reviews
          </p>
        </div>

        {/* DISTRIBUTION BARS */}
        <div className="flex-1 space-y-3">
          {counts.map(({ star, total }) => {
            const percent = maxCount && total
              ? (total / maxCount) * 100
              : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs w-9 font-semibold">
                  {star}★
                </span>

                <div className="flex-1 h-4 rounded-full bg-[#E3E6E6]">
                  <div
                    className="h-4 rounded-full bg-[#FACC15]"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-xs w-8 text-right text-[#565959]">
                  {total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
        <CircleCheckBig size={16} className="shrink-0" />
        Every review on this product is from a customer who actually
        purchased it.
      </p>
    </div>
  );
}
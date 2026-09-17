import { Star } from "lucide-react";

export default function ReviewStars({
  rating,
  setRating,
}) {
  return (
    <div
      className="flex items-center gap-1 sm:gap-2"
      role="radiogroup"
      aria-label="Select your rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = star <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition hover:bg-yellow-50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:h-12 sm:w-12"
          >
            <Star
              size={24}
              className="sm:h-7 sm:w-7"
              fill={selected ? "#FACC15" : "none"}
              color="#FACC15"
            />
          </button>
        );
      })}
    </div>
  );
}

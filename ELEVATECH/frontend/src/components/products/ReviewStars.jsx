import { Star } from "lucide-react";

export default function ReviewStars({
    rating,
    setRating,
}) {

    return (

        <div className="flex gap-2">

            {[1,2,3,4,5].map(star => (

                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                >

                    <Star

                        size={28}

                        fill={
                            star <= rating
                                ? "#FACC15"
                                : "none"
                        }

                        color="#FACC15"

                    />

                </button>

            ))}

        </div>

    );

}

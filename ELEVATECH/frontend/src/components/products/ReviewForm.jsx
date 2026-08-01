import { useState } from "react";

import ReviewStars from "./ReviewStars";

import reviewService from "../../services/reviewService";

export default function ReviewForm({

    productId,

    reload,

}) {

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    async function submit(e){

        e.preventDefault();

        await reviewService.createReview({

            product_id: productId,

            user_id: 1,

            rating,

            comment,

        });

        setComment("");

        reload();

    }

    return (

        <form
            onSubmit={submit}
            className="bg-white rounded-2xl shadow p-8"
        >

            <h3 className="text-2xl font-bold mb-6">

                Write a Review

            </h3>

            <ReviewStars
                rating={rating}
                setRating={setRating}
            />

            <textarea

                rows="5"

                className="w-full border rounded-xl p-4 mt-6"

                placeholder="Tell us what you think..."

                value={comment}

                onChange={(e)=>setComment(e.target.value)}

            />

            <button
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl"
            >

                Submit Review

            </button>

        </form>

    );

}

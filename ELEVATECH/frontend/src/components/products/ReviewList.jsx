import { useMemo, useState } from "react";
import { Star } from "lucide-react";

export default function ReviewList({ reviews }) {

    const [sort, setSort] = useState("newest");

    const sortedReviews = useMemo(() => {

        let list = [...reviews];

        switch (sort) {

            case "highest":
                list.sort((a, b) => b.rating - a.rating);
                break;

            case "lowest":
                list.sort((a, b) => a.rating - b.rating);
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

    if (!reviews.length) {

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

                    onChange={(e)=>setSort(e.target.value)}

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

                {sortedReviews.map(review=>(

                    <div

                        key={review.id}

                        className="border-b pb-8 last:border-0"

                    >

                        <div className="flex justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <h3 className="font-bold">

                                        {review.user}

                                    </h3>

                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                        Verified Purchase

                                    </span>

                                </div>

                                <div className="flex mt-3">

                                    {[1,2,3,4,5].map(star=>(

                                        <Star

                                            key={star}

                                            size={18}

                                            fill={
                                                star<=review.rating
                                                    ? "#FACC15"
                                                    : "none"
                                            }

                                            color="#FACC15"

                                        />

                                    ))}

                                </div>

                            </div>

                            <span className="text-gray-400">

                                {new Date(review.created_at).toLocaleDateString()}

                            </span>

                        </div>

                        <p className="mt-5 text-gray-700 leading-7">

                            {review.comment}

                        </p>

                        <button

                            className="mt-5 text-blue-600 hover:text-blue-800"

                        >

                            👍 Helpful

                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}


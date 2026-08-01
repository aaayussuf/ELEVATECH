import { Star } from "lucide-react";

export default function RatingSummary({ reviews }) {

    if (!reviews.length) {
        return null;
    }

    const average =
        (
            reviews.reduce(
                (sum, r) => sum + r.rating,
                0
            ) / reviews.length
        ).toFixed(1);

    return (

        <div className="bg-white rounded-2xl shadow p-8">

            <h2 className="text-3xl font-bold">

                Customer Rating

            </h2>

            <div className="flex items-center gap-8 mt-8">

                <div>

                    <div className="text-6xl font-black text-blue-600">

                        {average}

                    </div>

                    <div className="flex mt-3">

                        {[1,2,3,4,5].map(star=>(

                            <Star
                                key={star}
                                size={26}
                                fill={
                                    star<=Math.round(average)
                                        ? "#FACC15"
                                        : "none"
                                }
                                color="#FACC15"
                            />

                        ))}

                    </div>

                    <p className="mt-3 text-gray-500">

                        {reviews.length} Reviews

                    </p>

                </div>

                <div className="flex-1 space-y-4">

                    {[5,4,3,2,1].map(star=>{

                        const total =
                            reviews.filter(
                                r=>r.rating===star
                            ).length;

                        const percent =
                            reviews.length
                                ? total/reviews.length*100
                                : 0;

                        return(

                            <div
                                key={star}
                                className="flex items-center gap-4"
                            >

                                <span className="w-10">

                                    {star}★

                                </span>

                                <div className="flex-1 h-3 rounded-full bg-gray-200">

                                    <div
                                        className="h-3 rounded-full bg-yellow-400"
                                        style={{
                                            width:`${percent}%`
                                        }}
                                    />

                                </div>

                                <span>

                                    {total}

                                </span>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}


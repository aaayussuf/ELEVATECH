const API = "http://127.0.0.1:5000/api/reviews";

const reviewService = {

    async getReviews(productId) {

        const res = await fetch(`${API}/${productId}`);

        return await res.json();

    },

    async createReview(review) {

        const res = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(review),

        });

        return await res.json();

    },

};

export default reviewService;

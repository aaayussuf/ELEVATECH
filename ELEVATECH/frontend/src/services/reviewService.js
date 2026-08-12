const API =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api/reviews`;

const reviewService = {
  async getReviews(productId) {
    const res = await fetch(`${API}/${productId}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Unable to load reviews"
      );
    }

    return data;
  },

  async createReview(review) {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Unable to create review"
      );
    }

    return data;
  },
};

export default reviewService;


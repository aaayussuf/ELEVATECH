const API =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api/reviews`;

const reviewService = {
  async getReviews(productId) {
    const res = await fetch(
      `${API}/product/${productId}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Unable to load reviews"
      );
    }

    return data;
  },

  async createReview(review) {
    const token =
      localStorage.getItem("elevatech_token") ||
      localStorage.getItem("access_token");

    if (!token) {
      throw new Error(
        "You must be logged in to write a review."
      );
    }

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

  async markHelpful(reviewId) {
    const res = await fetch(
      `${API}/${reviewId}/helpful`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Unable to mark review as helpful"
      );
    }

    return data;
  },
};

export default reviewService;



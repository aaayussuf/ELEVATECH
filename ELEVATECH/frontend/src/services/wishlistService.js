const API =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api/wishlist`;

function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

const wishlistService = {
  async getWishlist(token) {
    const res = await fetch(API, {
      method: "GET",
      headers: {
        ...authHeaders(token),
      },
    });

    const data = await res.json().catch(() => []);

    if (!res.ok) {
      throw new Error(
        data?.message ||
          "Unable to load wishlist."
      );
    }

    return data;
  },

  async add(productId, token) {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data?.message ||
          "Unable to add product to wishlist."
      );
    }

    return data;
  },

  async remove(productId, token) {
    const res = await fetch(
      `${API}/${productId}`,
      {
        method: "DELETE",
        headers: {
          ...authHeaders(token),
        },
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data?.message ||
          "Unable to remove product from wishlist."
      );
    }

    return data;
  },
};

export default wishlistService;


const API_BASE =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api/products`;

const productService = {
  async getProducts(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        params.append(key, value);
      }
    });

    const query = params.toString();

    const response = await fetch(
      `${API_BASE}${query ? `?${query}` : ""}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load products");
    }

    return data;
  },

  async getFeaturedProducts() {
    const response = await fetch(`${API_BASE}/featured`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load featured products"
      );
    }

    return data;
  },

  async getLatestProducts() {
    const response = await fetch(`${API_BASE}/latest`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load latest products"
      );
    }

    return data;
  },

  async getProduct(slug) {
    const response = await fetch(`${API_BASE}/${slug}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load product"
      );
    }

    return data;
  },
};

export default productService;

const API_BASE = "http://127.0.0.1:5000/api/products";

const productService = {
  async getProducts() {
    const response = await fetch(API_BASE);
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
      throw new Error(data.message || "Unable to load featured products");
    }

    return data;
  },

  async getLatestProducts() {
    const response = await fetch(`${API_BASE}/latest`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load latest products");
    }

    return data;
  },

  async getProduct(slug) {
    const response = await fetch(`${API_BASE}/${slug}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load product");
    }

    return data;
  },
};

export default productService;


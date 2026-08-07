import api from "./api";

const BASE = "/api/admin/products";

const adminProductService = {
  async getAll() {
    const { data } = await api.get(BASE, {
      params: { per_page: 1000 },
    });
    return data.products || [];
  },

  async listProducts(params = {}) {
    const { data } = await api.get(BASE, { params });
    return data;
  },

  async getProduct(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async createProduct(product) {
    const { data } = await api.post(BASE, product);
    return data;
  },

  async updateProduct(id, product) {
    const { data } = await api.put(`${BASE}/${id}`, product);
    return data;
  },

async deleteProduct(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },

  async bulkDelete(ids) {
    const { data } = await api.delete(
      "/api/admin/products/bulk-delete",
      {
        data: { ids }
      }
    );

    return data;
  },

  async updateStock(id, quantity) {
    const { data } = await api.patch(`${BASE}/${id}/stock`, {
      quantity,
    });

    return data;
  },

  async toggleFeatured(id) {
    const { data } = await api.patch(
      `${BASE}/${id}/featured`
    );

    return data;
  },

  async toggleStatus(id) {
    const { data } = await api.patch(
      `${BASE}/${id}/status`
    );

    return data;
  },

async getStats() {
    const { data } = await api.get(
      `${BASE}/stats`
    );

    return data;
  },

  async getLowStock() {
    const { data } = await api.get(
      "/api/admin/products/low-stock"
    );

    return data;
  },
};

export default adminProductService;
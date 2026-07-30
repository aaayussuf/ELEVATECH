import api from "./api";

const BASE = "/api/admin/categories";

const adminCategoryService = {
  async listCategories(params = {}) {
    const { data } = await api.get(BASE, { params });
    return data;
  },

  async getCategory(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async createCategory(category) {
    const { data } = await api.post(BASE, category);
    return data;
  },

  async updateCategory(id, category) {
    const { data } = await api.put(`${BASE}/${id}`, category);
    return data;
  },

  async deleteCategory(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },

  async toggleStatus(id) {
    const { data } = await api.patch(`${BASE}/${id}/status`);
    return data;
  },
};

export default adminCategoryService;


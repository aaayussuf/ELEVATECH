import api from "./api";

const BASE = "/api/admin/purchase-orders";

const purchaseOrderService = {
  async getAll() {
    const { data } = await api.get(BASE);
    return data;
  },

  async get(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post(BASE, payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    return data;
  },

  async receive(id) {
    const { data } = await api.post(`${BASE}/${id}/receive`);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  }
};

export default purchaseOrderService;

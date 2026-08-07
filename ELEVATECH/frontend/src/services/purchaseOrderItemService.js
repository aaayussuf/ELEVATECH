import api from "./api";

const BASE = "/api/admin/purchase-order-items";

const purchaseOrderItemService = {
  async getAll(purchaseOrderId) {
    const { data } = await api.get(`${BASE}/${purchaseOrderId}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post(BASE, payload);
    return data;
  },

  async update(itemId, payload) {
    const { data } = await api.put(`${BASE}/${itemId}`, payload);
    return data;
  },

  async remove(itemId) {
    const { data } = await api.delete(`${BASE}/${itemId}`);
    return data;
  },
};

export default purchaseOrderItemService;

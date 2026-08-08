import api from "./api";

const BASE = "/api/admin/purchase-order-items";

const purchaseOrderItemService = {
  async getItems(purchaseOrderId) {
    const { data } = await api.get(`${BASE}/${purchaseOrderId}`);
    return data;
  },

  async createItem(item) {
    const { data } = await api.post(BASE, item);
    return data;
  },

  async updateItem(itemId, item) {
    const { data } = await api.put(`${BASE}/${itemId}`, item);
    return data;
  },

  async deleteItem(itemId) {
    const { data } = await api.delete(`${BASE}/${itemId}`);
    return data;
  },
};

export default purchaseOrderItemService;

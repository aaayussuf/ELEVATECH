import api from "./api";

const BASE = "/api/admin/purchase-orders";
const ITEM_BASE = "/api/admin/purchase-order-items";

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
  },

  // -----------------------------
  // Purchase Order Items
  // -----------------------------

  async getItems(purchaseOrderId) {
    const { data } = await api.get(
      `${ITEM_BASE}/${purchaseOrderId}`
    );

    return data;
  },

  async addItem(payload) {
    const { data } = await api.post(
      ITEM_BASE,
      payload
    );

    return data;
  },

  async updateItem(itemId, payload) {
    const { data } = await api.put(
      `${ITEM_BASE}/${itemId}`,
      payload
    );

    return data;
  },

  async deleteItem(itemId) {
    const { data } = await api.delete(
      `${ITEM_BASE}/${itemId}`
    );

    return data;
  },
};

export default purchaseOrderService;

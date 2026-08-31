import api from "./api";

const BASE = "/admin/orders";

const adminOrderService = {
  async getOrders() {
    const { data } = await api.get(BASE);
    return data;
  },

  async getOrder(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async updateOrder(id, values) {
    const { data } = await api.patch(
      `${BASE}/${id}`,
      values
    );

    return data;
  },

  async updateOrderFull(id, values) {
    const { data } = await api.put(
      `${BASE}/${id}`,
      values
    );

    return data;
  },

  async getKanban() {
    const { data } = await api.get(
      `${BASE}/kanban`
    );

    return data;
  },
};

export default adminOrderService;

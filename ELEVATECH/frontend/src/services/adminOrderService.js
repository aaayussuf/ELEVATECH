import api from "./api";

const BASE = "/api/admin/orders";

const adminOrderService = {

  async getOrders() {
    const { data } = await api.get(BASE);
    return data;
  },

  async getOrder(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(
      `${BASE}/${id}/status`,
      { status }
    );

    return data;
  }

};

export default adminOrderService;


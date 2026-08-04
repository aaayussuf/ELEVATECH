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

  async updateOrder(id, values) {
    const { data } = await api.patch(
      `${BASE}/${id}`,
      values
    );

    return data;
  }

};

export default adminOrderService;

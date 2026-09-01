import api from "./api";

const inventoryService = {
  async getInventory() {
    const { data } = await api.get(
      "/admin/products/inventory"
    );

    return data;
  },

  async updateStock(id, quantity) {
    const { data } = await api.patch(
      `/admin/products/${id}/stock`,
      { quantity }
    );

    return data;
  },

  async getReorderSuggestions() {
    const { data } = await api.get(
      "/admin/inventory/reorder-suggestions"
    );

    return data;
  },
};

export default inventoryService;


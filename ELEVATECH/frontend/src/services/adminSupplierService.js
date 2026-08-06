import api from "./api";

const BASE = "/api/admin/suppliers";

const adminSupplierService = {

  async getSuppliers() {
    const { data } = await api.get(BASE);
    return data;
  },

  async getSupplier(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async createSupplier(values) {
    const { data } = await api.post(BASE, values);
    return data;
  },

  async updateSupplier(id, values) {
    const { data } = await api.put(
      `${BASE}/${id}`,
      values
    );

    return data;
  },

  async deleteSupplier(id) {
    const { data } = await api.delete(
      `${BASE}/${id}`
    );

    return data;
  }

};

export default adminSupplierService;

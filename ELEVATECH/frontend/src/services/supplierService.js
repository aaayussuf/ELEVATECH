import api from "./api";

const supplierService = {

  async getAll() {
    const { data } = await api.get("/api/admin/suppliers");
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/api/admin/suppliers/${id}`);
    return data;
  },

  async create(values) {
    const { data } = await api.post("/api/admin/suppliers", values);
    return data;
  },

  async update(id, values) {
    const { data } = await api.put(
      `/api/admin/suppliers/${id}`,
      values
    );
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(
      `/api/admin/suppliers/${id}`
    );
    return data;
  }

};

export default supplierService;
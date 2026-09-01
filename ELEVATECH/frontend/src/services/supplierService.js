import api from "./api";

const supplierService = {

  async getAll() {
    const { data } = await api.get("/admin/suppliers");
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/admin/suppliers/${id}`);
    return data;
  },

  async create(values) {
    const { data } = await api.post("/admin/suppliers", values);
    return data;
  },

  async update(id, values) {
    const { data } = await api.put(
      `/admin/suppliers/${id}`,
      values
    );
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(
      `/admin/suppliers/${id}`
    );
    return data;
  }

};

export default supplierService;

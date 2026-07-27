import api from "./api";

async function listProducts(params = {}) {
  const response = await api.get("/admin/products", { params });
  return response.data;
}

async function getProduct(id) {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
}

async function createProduct(data) {
  const response = await api.post("/admin/products", data);
  return response.data;
}

async function updateProduct(id, data) {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data;
}

async function deleteProduct(id) {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
}

async function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/admin/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};


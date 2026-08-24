import axios from "axios";

const API_BASE =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api`;

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function getProfile(token) {
  const res = await axios.get(`${API_BASE}/profile`, withAuth(token));
  return res.data;
}

async function updateProfile(token, payload) {
  const res = await axios.put(`${API_BASE}/profile`, payload, {
    ...withAuth(token),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function getOrders(token) {
  const res = await axios.get(`${API_BASE}/orders`, withAuth(token));
  // backend shape may be {orders:[...]} or just [...]
  return res.data?.orders ?? res.data;
}

async function getOrderDetails(token, id) {
  const res = await axios.get(`${API_BASE}/orders/${id}`, withAuth(token));
  return res.data?.order ?? res.data;
}

async function getAddresses(token) {
  const res = await axios.get(`${API_BASE}/addresses`, withAuth(token));
  return res.data?.addresses ?? res.data;
}

async function createAddress(token, payload) {
  const res = await axios.post(`${API_BASE}/addresses`, payload, {
    ...withAuth(token),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data?.address ?? res.data;
}

async function deleteAddress(token, id) {
  const res = await axios.delete(`${API_BASE}/addresses/${id}`, withAuth(token));
  return res.data;
}

async function getWishlist(token) {
  const res = await axios.get(`${API_BASE}/wishlist`, withAuth(token));
  // backend shape may be {items:[...]} or {wishlist:[...]} or just [...]
  return res.data?.items ?? res.data?.wishlist ?? res.data;
}

async function addWishlist(token, payload) {
  // Best-effort: only works if backend supports POST /wishlist
  const res = await axios.post(`${API_BASE}/wishlist`, payload, {
    ...withAuth(token),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

async function removeWishlist(token, id) {
  const res = await axios.delete(`${API_BASE}/wishlist/${id}`, withAuth(token));
  return res.data;
}

export default {
  getProfile,
  updateProfile,
  getOrders,
  getOrderDetails,
  getAddresses,
  createAddress,
  deleteAddress,
  getWishlist,
  addWishlist,
  removeWishlist,
};


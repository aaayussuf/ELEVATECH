import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("elevatech_token") ||
    sessionStorage.getItem("elevatech_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // CRITICAL: When posting FormData (image upload), the browser/axios must
  // set `Content-Type: multipart/form-data; boundary=...` automatically.
  // The instance default is `application/json`, which would otherwise be
  // sent with the FormData body — Flask then sees an empty `request.files`
  // and returns "No image provided. Attach file as 'image'."
  // So strip any JSON Content-Type for FormData payloads.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.friendlyMessage =
        "The server is taking too long to respond. Please try again.";
    } else if (!error.response) {
      error.friendlyMessage =
        "Unable to reach the server. Check that the backend is running, then try again.";
    } else if (error.response.status === 401) {
      error.friendlyMessage = "Your session has expired. Please sign in again.";
    } else if (error.response.status === 403) {
      error.friendlyMessage =
        error.response.data?.message ||
        "You do not have permission to do that.";
    } else {
      error.friendlyMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Something went wrong. Please try again.";
    }
    return Promise.reject(error);
  }
);

export default api;


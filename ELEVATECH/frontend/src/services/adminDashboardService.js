import api from "./api";

const adminDashboardService = {
  async getDashboard() {
    const { data } = await api.get("/api/admin/dashboard");
    return data;
  },

  async getAnalytics() {
    const { data } = await api.get("/api/admin/analytics");
    return data;
  },

  async getNotifications() {
    const { data } = await api.get("/api/admin/notifications");
    return data;
  },
};

export default adminDashboardService;

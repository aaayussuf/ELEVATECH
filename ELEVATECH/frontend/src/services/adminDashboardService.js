import api from "./api";

const adminDashboardService = {
  async getDashboard() {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  async getAnalytics() {
    const { data } = await api.get("/admin/analytics");
    return data;
  },

  async getNotifications() {
    const { data } = await api.get("/admin/notifications");
    return data;
  },
};

export default adminDashboardService;

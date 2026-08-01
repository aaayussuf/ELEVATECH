import api from "./api";

const BASE = "/api/admin/coupons";

const adminCouponService = {
  async listCoupons() {
    const { data } = await api.get(BASE);
    return data;
  },

  async createCoupon(coupon) {
    const { data } = await api.post(BASE, coupon);
    return data;
  },

  async updateCoupon(id, coupon) {
    const { data } = await api.put(`${BASE}/${id}`, coupon);
    return data;
  },

  async deleteCoupon(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },
};

export default adminCouponService;


import api from "./api";

const couponService = {
  async applyCoupon(code, subtotal) {
    const { data } = await api.post("/coupons/apply", {
      code,
      subtotal,
    });

    return data;
  },
};

export default couponService;

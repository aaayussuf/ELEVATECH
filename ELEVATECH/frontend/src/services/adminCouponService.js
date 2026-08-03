import api from "./api";

const adminCouponService = {

    async listCoupons() {

        const { data } = await api.get(
            "/api/admin/coupons"
        );

        return data;

    },

    async getCoupon(id) {

        const { data } = await api.get(
            `/api/admin/coupons/${id}`
        );

        return data;

    },

    async createCoupon(coupon) {

        const { data } = await api.post(
            "/api/admin/coupons",
            coupon
        );

        return data;

    },

    async updateCoupon(id, coupon) {

        const { data } = await api.put(
            `/api/admin/coupons/${id}`,
            coupon
        );

        return data;

    },

    async deleteCoupon(id) {

        const { data } = await api.delete(
            `/api/admin/coupons/${id}`
        );

        return data;

    }

};

export default adminCouponService;
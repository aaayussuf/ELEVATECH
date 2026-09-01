import api from "./api";

const adminCouponService = {

    async listCoupons() {

        const { data } = await api.get(
            "/admin/coupons"
        );

        return data;

    },

    async getCoupon(id) {

        const { data } = await api.get(
            `/admin/coupons/${id}`
        );

        return data;

    },

    async createCoupon(coupon) {

        const { data } = await api.post(
            "/admin/coupons",
            coupon
        );

        return data;

    },

    async updateCoupon(id, coupon) {

        const { data } = await api.put(
            `/admin/coupons/${id}`,
            coupon
        );

        return data;

    },

    async deleteCoupon(id) {

        const { data } = await api.delete(
            `/admin/coupons/${id}`
        );

        return data;

    }

};

export default adminCouponService;

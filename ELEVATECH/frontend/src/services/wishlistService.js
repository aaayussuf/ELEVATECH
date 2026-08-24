import api from "./api";

const wishlistService = {
  async getWishlist() {
    const { data } = await api.get("/wishlist");
    return data?.wishlist ?? [];
  },

  async add(productId) {
    const { data } = await api.post("/wishlist", {
      product_id: productId,
    });
    return data;
  },

  async remove(wishlistId) {
    const { data } = await api.delete(`/wishlist/${wishlistId}`);
    return data;
  },
};

export default wishlistService;


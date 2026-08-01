const API = "http://127.0.0.1:5000/api/wishlist";

const wishlistService = {

    async getWishlist() {

        const res = await fetch(API, {
            credentials: "include",
        });

        return await res.json();

    },

    async add(productId) {

        const res = await fetch(API, {

            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                product_id: productId,
            }),

        });

        return await res.json();

    },

    async remove(productId) {

        const res = await fetch(`${API}/${productId}`, {

            method: "DELETE",

            credentials: "include",

        });

        return await res.json();

    },

};

export default wishlistService;


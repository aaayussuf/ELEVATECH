import api from "./api";

const categoryService = {

    async getCategories() {

        const { data } = await api.get("/api/categories");

        return data;

    }

};

export default categoryService;
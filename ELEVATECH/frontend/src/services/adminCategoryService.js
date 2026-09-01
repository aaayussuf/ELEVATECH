import api from "./api";

const adminCategoryService = {

    async listCategories(params) {

        const { data } = await api.get(
            "/admin/categories",
            {
                params,
            }
        );

        return data;

    }

};

export default adminCategoryService;

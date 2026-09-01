import api from "./api";

const uploadService = {

    async uploadImage(file) {

        const formData = new FormData();

        formData.append("image", file);

        const { data } = await api.post(
            "/admin/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return data.url;

    }

};

export default uploadService;

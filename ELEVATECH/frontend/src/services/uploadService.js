import api from "./api";

const uploadService = {

    async uploadImage(file) {

        const formData = new FormData();

        formData.append("image", file);

        // NOTE: do NOT set Content-Type manually — the browser must add
        // the multipart boundary, otherwise Flask sees no file and the
        // upload fails.
        const { data } = await api.post(
            "/admin/upload",
            formData,
        );

        return data.url;

    }

};

export default uploadService;

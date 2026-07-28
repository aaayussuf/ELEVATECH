import api from "./api";

async function listCustomers() {

    const response =
        await api.get("/admin/customers");

    return response.data;

}

async function getCustomer(id) {

    const response =
        await api.get(`/admin/customers/${id}`);

    return response.data;

}

export default {
    listCustomers,
    getCustomer,
};


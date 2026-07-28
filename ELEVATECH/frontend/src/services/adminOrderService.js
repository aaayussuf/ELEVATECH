import api from "./api";

async function listOrders() {

    const response =
        await api.get("/admin/orders");

    return response.data;

}

async function updateStatus(id, status) {

    const response =
        await api.patch(
            `/admin/orders/${id}/status`,
            {
                status
            }
        );

    return response.data;

}

export default {

    listOrders,

    updateStatus,

};


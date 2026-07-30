import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminOrderService from "../../services/adminOrderService";

import CustomerCard from "../../components/admin/orders/CustomerCard";
import OrderItems from "../../components/admin/orders/OrderItems";
import OrderSummary from "../../components/admin/orders/OrderSummary";
import OrderStatus from "../../components/admin/orders/OrderStatus";

export default function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
    }, []);

    async function loadOrder() {
        try {
            const data = await adminOrderService.getOrder(id);
            setOrder(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return <p className="p-8">Loading order...</p>;

    if (!order)
        return <p className="p-8">Order not found.</p>;

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Order #{order.id}
            </h1>

            <CustomerCard customer={order.customer} />

            <OrderItems items={order.items} />

        </div>
    );
}


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminOrderService from "../../../services/adminOrderService";
import CustomerCard from "../../../components/admin/orders/CustomerCard";
import OrderItems from "../../../components/admin/orders/OrderItems";
import OrderSummary from "../../../components/admin/orders/OrderSummary";
import OrderStatus from "../../../components/admin/orders/OrderStatus";

export default function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {

        loadOrder();

    }, [id]);

    async function loadOrder() {

        const data = await adminOrderService.getOrder(id);

        setOrder(data);

    }

    if (!order)
        return <h2 className="p-6">Loading...</h2>;

return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>

            <CustomerCard customer={order.customer} />

            <hr />

            <OrderItems items={order.items} />

            <hr />

            <OrderSummary order={order} />

            <hr />

            <OrderStatus order={order} onUpdated={setOrder} />
        </div>
    );

}


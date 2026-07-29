import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminOrderService from "../../../services/adminOrderService";

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

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">

                Order #{order.id}

            </h1>

        </div>

    );

}


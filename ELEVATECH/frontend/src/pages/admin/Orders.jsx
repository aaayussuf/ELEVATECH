import { useEffect, useState } from "react";
import adminOrderService from "../../services/adminOrderService";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const data = await adminOrderService.listOrders();
        setOrders(data);
    }

    async function changeStatus(id, status) {
        await adminOrderService.updateStatus(id, status);
        loadOrders();
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Orders
            </h1>

            <table className="w-full">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {orders.map(order => (

                        <tr key={order.id}>

                            <td>{order.id}</td>

                            <td>{order.customer}</td>

                            <td>KSh {order.total}</td>

                            <td>{order.payment}</td>

                            <td>{order.status}</td>

                            <td>

                                <select
                                    defaultValue={order.status}
                                    onChange={(e)=>
                                        changeStatus(
                                            order.id,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option>Pending</option>

                                    <option>Paid</option>

                                    <option>Processing</option>

                                    <option>Shipped</option>

                                    <option>Delivered</option>

                                    <option>Cancelled</option>

                                </select>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}


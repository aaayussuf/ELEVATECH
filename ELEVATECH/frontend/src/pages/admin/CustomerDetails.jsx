import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminCustomerService from "../../services/adminCustomerService";

export default function CustomerDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadCustomer() {
        try {
            const result = await adminCustomerService.getCustomer(id);
            setData(result);
        } catch (error) {
            console.error("Failed to load customer", error);
        } finally {
            setLoading(false);
        }
    }

     
    useEffect(() => {
        loadCustomer();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <p>Customer not found.</p>
                <button
                    onClick={() => navigate("/admin/customers")}
                    className="text-blue-500 underline mt-2"
                >
                    Back to Customers
                </button>
            </div>
        );
    }

    const { customer, orders, spent, total_orders } = data;

    return (
        <div className="p-6">

            <button
                onClick={() => navigate("/admin/customers")}
                className="text-blue-500 underline mb-4 inline-block"
            >
                &larr; Back to Customers
            </button>

            <div className="bg-white rounded shadow p-6 mb-6">

                <h1 className="text-3xl font-bold mb-4">
                    {customer.name}
                </h1>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p>{customer.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p>{customer.phone || "N/A"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Member Since</p>
                        <p>{customer.created_at}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <p>{total_orders}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Total Spent</p>
                        <p className="text-green-600 font-semibold">
                            KSh {spent.toLocaleString()}
                        </p>
                    </div>

                </div>

            </div>

            <h2 className="text-2xl font-bold mb-4">
                Orders ({orders.length})
            </h2>

            <table className="w-full bg-white rounded shadow">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="p-3 text-left">Order ID</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>

                </thead>

                <tbody>

                    {orders.map(order => (

                        <tr
                            key={order.id}
                            className="border-b"
                        >

                            <td className="p-3">#{order.id}</td>

                            <td>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        order.status === "Paid"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </td>

                            <td>KSh {order.total.toLocaleString()}</td>

                        </tr>

                    ))}

                    {orders.length === 0 && (

                        <tr>
                            <td
                                colSpan={3}
                                className="p-6 text-center text-gray-500"
                            >
                                No orders found.
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}


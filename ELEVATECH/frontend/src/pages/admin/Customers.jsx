import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCustomerService from "../../services/adminCustomerService";

export default function Customers() {

    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        const data = await adminCustomerService.listCustomers();
        setCustomers(data);
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Customers
            </h1>

            <table className="w-full bg-white rounded shadow">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="p-3 text-left">Customer</th>
                        <th>Email</th>
                        <th>Orders</th>
                        <th>Spent</th>
                        <th>Last Order</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {customers.map(customer => (

                        <tr
                            key={customer.id}
                            className="border-b"
                        >

                            <td className="p-3">
                                {customer.name}
                            </td>

                            <td>{customer.email}</td>

                            <td>{customer.orders}</td>

                            <td>
                                KSh {customer.spent.toLocaleString()}
                            </td>

                            <td>
                                {customer.last_order
                                    ? new Date(customer.last_order).toLocaleDateString()
                                    : "Never"}
                            </td>

                            <td>{customer.role}</td>

                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/admin/customers/${customer.id}`)
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    View
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}


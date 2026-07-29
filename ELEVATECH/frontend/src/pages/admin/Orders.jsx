import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminOrderService from "../../services/adminOrderService";

export default function Orders() {

    const [orders,setOrders]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        loadOrders();

    },[]);

    async function loadOrders(){

        try{

            const data=await adminOrderService.getOrders();

            setOrders(data);

        }

        catch(err){

            console.error(err);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return <h2 className="p-6">Loading Orders...</h2>;

    }

    return(

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">

                Orders

            </h1>

            <div className="overflow-x-auto">

                <table className="w-full bg-white rounded shadow">

                    <thead>

                        <tr className="border-b">

                            <th className="p-3">Order</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Date</th>
                            <th className="p-3"></th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order=>(

                            <tr
                                key={order.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="p-3">

                                    #{order.id}

                                </td>

                                <td className="p-3">

                                    {order.user_id}

                                </td>

                                <td className="p-3">

                                    {order.status}

                                </td>

                                <td className="p-3">

                                    {order.payment_method}

                                </td>

                                <td className="p-3">

                                    KSh {order.total}

                                </td>

                                <td className="p-3">

                                    {new Date(order.created_at).toLocaleDateString()}

                                </td>

                                <td className="p-3">

                                    <Link

                                        to={`/admin/orders/${order.id}`}

                                        className="text-blue-600"

                                    >

                                        View

                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}


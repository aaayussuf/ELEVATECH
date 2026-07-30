export default function OrderItems({ items = [] }) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-4">
                Order Items
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-2">Product</th>

                        <th className="text-left py-2">Qty</th>

                        <th className="text-left py-2">Price</th>

                        <th className="text-left py-2">Subtotal</th>

                    </tr>

                </thead>

                <tbody>

                    {items.map(item => (

                        <tr key={item.id} className="border-b">

                            <td className="py-3">
                                {item.product_name || `Product #${item.product_id}`}
                            </td>

                            <td>{item.quantity}</td>

                            <td>
                                KSh {Number(item.price).toLocaleString()}
                            </td>

                            <td>
                                KSh {(item.price * item.quantity).toLocaleString()}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}


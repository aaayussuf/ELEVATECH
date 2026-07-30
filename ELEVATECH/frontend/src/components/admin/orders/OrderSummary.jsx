export default function OrderSummary({ order }) {
    if (!order) return null;

    const itemCount = order.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
    ) || 0;

    const createdDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-xl mb-4">
                Order Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold">
                        KSh {Number(order.total).toLocaleString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-lg font-semibold">
                        {order.payment_method || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-lg font-semibold">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="text-lg font-semibold">
                        {createdDate}
                    </p>
                </div>
            </div>
        </div>
    );
}


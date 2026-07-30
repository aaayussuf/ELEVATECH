import { useState } from "react";
import adminOrderService from "../../../services/adminOrderService";
import StatusBadge from "../tables/StatusBadge";

const STATUSES = [
    "Pending",
    "Processing",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
];

export default function OrderStatus({ order, onUpdated }) {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    async function handleStatusChange(newStatus) {
        if (newStatus === order.status) return;

        setUpdating(true);
        setError(null);

        try {
            const updated = await adminOrderService.updateStatus(
                order.id,
                newStatus
            );
            onUpdated(updated);
        } catch (err) {
            console.error(err);
            setError("Failed to update status. Please try again.");
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-xl mb-4">
                Order Status
            </h2>

            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">Current:</span>
                <StatusBadge status={order.status} />
            </div>

            <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                    <button
                        key={status}
                        disabled={updating}
                        onClick={() => handleStatusChange(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                            ${
                                status === order.status
                                    ? "bg-gray-200 border-gray-400 cursor-not-allowed"
                                    : "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
                            }
                            ${updating ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}


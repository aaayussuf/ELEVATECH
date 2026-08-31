import { useEffect, useState } from "react";
import adminOrderService from "../../../services/adminOrderService";

export default function ShippingDetails({ order, onUpdated }) {
    const [courier, setCourier] = useState(order.courier || "");
    const [trackingNumber, setTrackingNumber] = useState(
        order.tracking_number || ""
    );
    const [paymentStatus, setPaymentStatus] = useState(
        order.payment_status || "Pending"
    );
    const [notes, setNotes] = useState(order.notes || "");

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setCourier(order.courier || "");
        setTrackingNumber(order.tracking_number || "");
        setPaymentStatus(order.payment_status || "Pending");
        setNotes(order.notes || "");
    }, [order]);

    async function saveDetails() {
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const updated = await adminOrderService.updateOrderFull(
                order.id,
                {
                    courier: courier.trim() || null,
                    tracking_number: trackingNumber.trim() || null,
                    payment_status: paymentStatus,
                    notes: notes.trim() || null,
                }
            );

            onUpdated(updated);

            setMessage("Shipping details saved successfully.");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save shipping details."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-5">
                Shipping & Delivery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Courier
                    </label>

                    <input
                        type="text"
                        value={courier}
                        onChange={(e) =>
                            setCourier(e.target.value)
                        }
                        placeholder="e.g. Fargo Courier"
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Tracking Number
                    </label>

                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) =>
                            setTrackingNumber(e.target.value)
                        }
                        placeholder="e.g. TRK-123456"
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Payment Status
                    </label>

                    <select
                        value={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(e.target.value)
                        }
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Failed">
                            Failed
                        </option>

                        <option value="Refunded">
                            Refunded
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Shipped At
                    </label>

                    <input
                        type="text"
                        value={
                            order.shipped_at
                                ? new Date(
                                    order.shipped_at
                                ).toLocaleString("en-KE")
                                : "Not shipped"
                        }
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Delivered At
                    </label>

                    <input
                        type="text"
                        value={
                            order.delivered_at
                                ? new Date(
                                    order.delivered_at
                                ).toLocaleString("en-KE")
                                : "Not delivered"
                        }
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />
                </div>

                <div className="md:col-span-2">

                    <label className="block text-sm font-medium mb-2">
                        Order Notes
                    </label>

                    <textarea
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                        rows={4}
                        placeholder="Add delivery instructions or internal notes..."
                        className="w-full border rounded-lg px-3 py-2"
                    />

                </div>

            </div>

            {message && (
                <p className="mt-4 text-green-600 text-sm font-medium">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-4 text-red-600 text-sm font-medium">
                    {error}
                </p>
            )}

            <button
                onClick={saveDetails}
                disabled={saving}
                className="mt-5 px-5 py-2 rounded-lg bg-black text-white font-medium disabled:opacity-50"
            >
                {saving
                    ? "Saving..."
                    : "Save Shipping Details"}
            </button>

        </div>
    );
}


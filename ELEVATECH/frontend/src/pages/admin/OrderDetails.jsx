import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import adminOrderService from "../../services/adminOrderService";

const STATUSES = [
  "Pending",
  "Processing",
  "Paid",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
];

export default function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    status: "",
    payment_status: "",
    tracking_number: "",
    courier: "",
    notes: "",
  });

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {

    try {

      setLoading(true);
      setError("");

      const data =
        await adminOrderService.getOrder(id);

      setOrder(data);

      setForm({
        status: data.status || "Pending",
        payment_status:
          data.payment_status || "Pending",
        tracking_number:
          data.tracking_number || "",
        courier:
          data.courier || "",
        notes:
          data.notes || "",
      });

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to load order."
      );

    } finally {

      setLoading(false);

    }
  }

  function handleChange(event) {

    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSave() {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await adminOrderService.updateOrderFull(
          id,
          form
        );

      setOrder(updated);

      setForm({
        status: updated.status || "Pending",
        payment_status:
          updated.payment_status || "Pending",
        tracking_number:
          updated.tracking_number || "",
        courier:
          updated.courier || "",
        notes:
          updated.notes || "",
      });

      setSuccess(
        "Order updated successfully."
      );

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Failed to update order."
      );

    } finally {

      setSaving(false);

    }
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading order...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="font-bold text-red-700">
            Unable to load order
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <Link
            to="/admin/orders"
            className="inline-block mt-5 bg-gray-900 text-white px-5 py-3 rounded-xl"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const items = order?.items || [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
      Number(item.quantity || 0),
    0
  );

  const itemCount = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Orders
          </Link>

          <h1 className="text-3xl font-black mt-3">
            Order #{order.id}
          </h1>

          <p className="text-gray-500 mt-1">
            {order.created_at
              ? new Date(
                  order.created_at
                ).toLocaleString()
              : "Date unavailable"}
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold">
            {order.status || "Pending"}
          </span>

          <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 font-bold">
            {order.payment_status || "Pending"}
          </span>

        </div>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">
          {success}
        </div>
      )}

      {/* SUMMARY */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-sm text-gray-500">
            Items
          </p>

          <p className="text-2xl font-black mt-1">
            {itemCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-sm text-gray-500">
            Subtotal
          </p>

          <p className="text-2xl font-black mt-1">
            KSh {subtotal.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="text-2xl font-black text-blue-600 mt-1">
            KSh{" "}
            {Number(
              order.total || 0
            ).toLocaleString()}
          </p>
        </div>

      </div>

      {/* CUSTOMER */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-black mb-5">
          Customer
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-bold mt-1">
              {order.customer?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-bold mt-1">
              {order.customer?.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-bold mt-1">
              {order.customer?.phone || "—"}
            </p>
          </div>

        </div>

      </div>

      {/* ITEMS */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-black mb-5">
          Order Items
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left">

                <th className="py-3">
                  Product
                </th>

                <th className="py-3">
                  Quantity
                </th>

                <th className="py-3">
                  Price
                </th>

                <th className="py-3">
                  Subtotal
                </th>

              </tr>

            </thead>

            <tbody>

              {items.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-8 text-gray-500"
                  >
                    No items found.
                  </td>

                </tr>

              ) : (

                items.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="py-4 font-semibold">
                      {item.product_name ||
                        `Product #${item.product_id}`}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      KSh{" "}
                      {Number(
                        item.price || 0
                      ).toLocaleString()}
                    </td>

                    <td className="font-bold">
                      KSh{" "}
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* EDIT ORDER */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-black mb-6">
          Manage Order
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* STATUS */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Order Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >

              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}

            </select>

          </div>

          {/* PAYMENT */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Payment Status
            </label>

            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >

              {PAYMENT_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>

          {/* COURIER */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Courier
            </label>

            <input
              type="text"
              name="courier"
              value={form.courier}
              onChange={handleChange}
              placeholder="e.g. Fargo Courier"
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          {/* TRACKING */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Tracking Number
            </label>

            <input
              type="text"
              name="tracking_number"
              value={form.tracking_number}
              onChange={handleChange}
              placeholder="e.g. TRK-123456"
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

        </div>

        {/* NOTES */}

        <div className="mt-5">

          <label className="block text-sm font-semibold mb-2">
            Internal Notes
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add notes about this order..."
            className="w-full border rounded-xl px-4 py-3 resize-none"
          />

        </div>

        <div className="flex justify-end mt-6">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Order Changes"}
          </button>

        </div>

      </div>

      {/* SHIPPING */}

      {(order.courier ||
        order.tracking_number ||
        order.shipped_at ||
        order.delivered_at) && (

        <div className="bg-gray-50 rounded-2xl p-6">

          <h2 className="text-xl font-black mb-5">
            Shipping Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {order.courier && (
              <div>
                <p className="text-sm text-gray-500">
                  Courier
                </p>

                <p className="font-bold mt-1">
                  {order.courier}
                </p>
              </div>
            )}

            {order.tracking_number && (
              <div>
                <p className="text-sm text-gray-500">
                  Tracking Number
                </p>

                <p className="font-bold mt-1">
                  {order.tracking_number}
                </p>
              </div>
            )}

            {order.shipped_at && (
              <div>
                <p className="text-sm text-gray-500">
                  Shipped
                </p>

                <p className="font-bold mt-1">
                  {new Date(
                    order.shipped_at
                  ).toLocaleString()}
                </p>
              </div>
            )}

            {order.delivered_at && (
              <div>
                <p className="text-sm text-gray-500">
                  Delivered
                </p>

                <p className="font-bold mt-1">
                  {new Date(
                    order.delivered_at
                  ).toLocaleString()}
                </p>
              </div>
            )}

          </div>

        </div>

      )}

    </div>
  );
}

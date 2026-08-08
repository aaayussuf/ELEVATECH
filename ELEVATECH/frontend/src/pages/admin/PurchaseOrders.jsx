import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  async function loadPurchaseOrders() {
    try {
      setLoading(true);

      const data = await purchaseOrderService.getAll();

      setPurchaseOrders(data);
    } catch (err) {
      console.error("Purchase orders error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function receivePurchaseOrder(id) {
    const confirmed = window.confirm(
      `Receive purchase order #${id}?\n\n` +
      "This will add all ordered quantities to inventory."
    );

    if (!confirmed) {
      return;
    }

    try {
      await purchaseOrderService.receive(id);

      await loadPurchaseOrders();

      alert("Purchase order received successfully.");
    } catch (err) {
      console.error("Receive purchase order error:", err);

      alert(
        err?.response?.data?.message ||
        "Failed to receive purchase order."
      );
    }
  }

async function deletePurchaseOrder(id) {
    const confirmed = window.confirm(
      `Delete purchase order #${id}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await purchaseOrderService.remove(id);

      await loadPurchaseOrders();

      alert("Purchase order deleted successfully.");
    } catch (err) {
      console.error("Delete purchase order error:", err);

      alert(
        err?.response?.data?.message ||
        "Failed to delete purchase order."
      );
    }
  }

  function getStatusClass(status) {
    if (status === "Received") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Ordered") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  function getSupplierName(po) {
    return (
      po.supplier?.company_name ||
      po.supplier?.name ||
      "-"
    );
  }

  function getItemCount(po) {
    return (po.items || []).reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }

  function getTotalCost(po) {
    return (po.items || []).reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0) *
        Number(item.cost_price || 0),
      0
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading purchase orders...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Purchase Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage supplier orders and incoming inventory.
          </p>
        </div>

        <Link
          to="/admin/purchase-orders/new"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Purchase Order
        </Link>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

        <div className="bg-white rounded-xl shadow border p-5">
          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <p className="text-3xl font-bold mt-1">
            {purchaseOrders.length}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow border p-5">
          <p className="text-yellow-700 text-sm">
            Draft
          </p>

          <p className="text-3xl font-bold mt-1">
            {
              purchaseOrders.filter(
                (po) => po.status === "Draft"
              ).length
            }
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl shadow border p-5">
          <p className="text-blue-700 text-sm">
            Ordered
          </p>

          <p className="text-3xl font-bold mt-1">
            {
              purchaseOrders.filter(
                (po) => po.status === "Ordered"
              ).length
            }
          </p>
        </div>

        <div className="bg-green-50 rounded-xl shadow border p-5">
          <p className="text-green-700 text-sm">
            Received
          </p>

          <p className="text-3xl font-bold mt-1">
            {
              purchaseOrders.filter(
                (po) => po.status === "Received"
              ).length
            }
          </p>
        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        {purchaseOrders.length === 0 ? (

          <div className="p-12 text-center">

            <h2 className="text-xl font-semibold">
              No purchase orders
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first supplier purchase order.
            </p>

            <Link
              to="/admin/purchase-orders/new"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create Purchase Order
            </Link>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  ID
                </th>

                <th className="text-left p-4">
                  Supplier
                </th>

                <th className="text-left p-4">
                  Items
                </th>

                <th className="text-left p-4">
                  Total Cost
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Created
                </th>

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {purchaseOrders.map((po) => {

                const itemCount =
                  getItemCount(po);

                const totalCost =
                  getTotalCost(po);

                const editable =
                  po.status !== "Received" &&
                  po.status !== "Cancelled";

                return (

                  <tr
                    key={po.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* ID */}

                    <td className="p-4">

                      <Link
                        to={`/admin/purchase-orders/${po.id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        #{po.id}
                      </Link>

                    </td>

                    {/* Supplier */}

                    <td className="p-4 font-medium">
                      {getSupplierName(po)}
                    </td>

                    {/* Items */}

                    <td className="p-4">
                      {itemCount}
                    </td>

                    {/* Total */}

                    <td className="p-4 font-semibold">
                      ${totalCost.toFixed(2)}
                    </td>

                    {/* Status */}

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          po.status
                        )}`}
                      >
                        {po.status}
                      </span>

                    </td>

                    {/* Created */}

                    <td className="p-4 text-gray-600">

                      {po.created_at
                        ? new Date(
                            po.created_at
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex gap-2">

                        <Link
                          to={`/admin/purchase-orders/${po.id}`}
                          className="border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          View
                        </Link>

{editable && (
                          <Link
                            to={`/admin/purchase-orders/${po.id}/edit`}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Edit
                          </Link>
                        )}

{editable && (
                          <button
                            onClick={() =>
                              receivePurchaseOrder(
                                po.id
                              )
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Receive
                          </button>
                        )}

                        {editable && (
                          <button
                            onClick={() =>
                              deletePurchaseOrder(
                                po.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";

export default function PurchaseOrders() {
  const navigate = useNavigate();

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  async function loadPurchaseOrders() {
    try {
      const data = await purchaseOrderService.getAll();
      setPurchaseOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function receivePurchaseOrder(id) {
    try {
      await purchaseOrderService.receive(id);
      loadPurchaseOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to receive purchase order.");
    }
  }

  if (loading) {
    return <div className="p-6">Loading purchase orders...</div>;
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Purchase Orders
        </h1>

<button
          onClick={() => navigate("/admin/purchase-orders/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Purchase Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">ID</th>

              <th className="text-left p-4">Supplier</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Created</th>

              <th className="text-left p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {purchaseOrders.map(po => (

              <tr
                key={po.id}
                className="border-t"
              >

<td className="p-4">

                    <Link

                        to={`/admin/purchase-orders/${po.id}`}

                        className="text-blue-600 hover:underline font-semibold"

                    >
                        #{po.id}
                    </Link>

                </td>

                <td className="p-4">
                  {po.supplier?.company_name || "Unknown Supplier"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      po.status === "Received"
                        ? "bg-green-100 text-green-700"
                        : po.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {po.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(po.created_at).toLocaleDateString()}
                </td>

                <td className="p-4">

                  {po.status !== "Received" && (
                    <button
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Receive purchase order #${po.id}? This will add all PO quantities to inventory.`
                        );

                        if (confirmed) {
                          receivePurchaseOrder(po.id);
                        }
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Receive
                    </button>
                  )}

                  {po.status === "Received" && (
                    <span className="text-green-600 font-medium">
                      Received
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

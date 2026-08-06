import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import purchaseOrderService from "../../services/purchaseOrderService";

export default function PurchaseOrderDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [purchaseOrder, setPurchaseOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrder();
  }, [id]);

  async function loadPurchaseOrder() {

    try {

      const data = await purchaseOrderService.get(id);

      setPurchaseOrder(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  async function receivePurchaseOrder() {

    if (
      !window.confirm(
        "Receive this purchase order?"
      )
    ) {
      return;
    }

    try {

      await purchaseOrderService.receive(id);

      await loadPurchaseOrder();

      alert("Purchase Order received successfully.");

    } catch (err) {

      console.error(err);

      alert("Unable to receive purchase order.");

    }

  }

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="p-6">
        Purchase Order not found.
      </div>
    );
  }

  const total = purchaseOrder.items.reduce(

    (sum, item) =>

      sum + item.quantity * item.cost_price,

    0

  );

  return (

    <div className="p-6 space-y-6">

      <button

        onClick={() => navigate(-1)}

        className="text-blue-600"

      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow border p-6">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">

              Purchase Order #{purchaseOrder.id}

            </h1>

            <p className="text-gray-500 mt-2">

              Supplier:

              <span className="font-semibold ml-2">

                {purchaseOrder.supplier?.name}

              </span>

            </p>

            <p className="text-gray-500">

              Status:

              <span className="font-semibold ml-2">

                {purchaseOrder.status}

              </span>

            </p>

          </div>

          {purchaseOrder.status !== "Received" && (

            <button

              onClick={receivePurchaseOrder}

              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"

            >

              Receive Purchase Order

            </button>

          )}

        </div>

      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">

                Product

              </th>

              <th className="text-left p-4">

                Qty

              </th>

              <th className="text-left p-4">

                Cost

              </th>

              <th className="text-left p-4">

                Total

              </th>

            </tr>

          </thead>

          <tbody>

            {purchaseOrder.items.map(item => (

              <tr

                key={item.id}

                className="border-t"

              >

                <td className="p-4">

                  {item.product_name}

                </td>

                <td className="p-4">

                  {item.quantity}

                </td>

                <td className="p-4">

                  KSh {item.cost_price.toLocaleString()}

                </td>

                <td className="p-4 font-semibold">

                  KSh {(item.quantity * item.cost_price).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-white rounded-xl shadow border p-6">

        <div className="text-right">

          <h2 className="text-2xl font-bold">

            Total

          </h2>

          <div className="text-3xl text-blue-600 font-bold mt-2">

            KSh {total.toLocaleString()}

          </div>

        </div>

      </div>

    </div>

  );
}

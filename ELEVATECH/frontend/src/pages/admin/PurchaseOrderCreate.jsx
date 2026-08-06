import { useState } from "react";
import SupplierSelect from "../../components/admin/purchaseOrders/SupplierSelect";
import PurchaseOrderItemsTable from "../../components/admin/purchaseOrders/PurchaseOrderItemsTable";
import PurchaseOrderSummary from "../../components/admin/purchaseOrders/PurchaseOrderSummary";

export default function PurchaseOrderCreate() {

  const [notes, setNotes] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  return (

    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            New Purchase Order

          </h1>

          <p className="text-gray-500">

            Create a purchase order for one supplier.

          </p>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">

          <div className="bg-white rounded-xl shadow border p-6">

            <h2 className="text-xl font-semibold mb-6">

              Supplier Information

            </h2>

            <SupplierSelect

              value={supplierId}

              onChange={setSupplierId}

            />

          </div>

          <div className="bg-white rounded-xl shadow border p-6 mt-6">

            <h2 className="text-xl font-semibold mb-6">

              Purchase Items

            </h2>

<PurchaseOrderItemsTable

                items={items}

                setItems={setItems}

            />

          </div>

        </div>

        <div>

          <div className="bg-white rounded-xl shadow border p-6">

            <h2 className="text-xl font-semibold mb-6">

              Order Notes

            </h2>

            <textarea

              rows={8}

              value={notes}

              onChange={(e) => setNotes(e.target.value)}

              className="w-full border rounded-lg p-3"

              placeholder="Internal notes..."

            />

          </div>

          <div className="bg-white rounded-xl shadow border p-6 mt-6">

<PurchaseOrderSummary

                items={items}

            />

          </div>

        </div>

      </div>

    </div>

  );

}

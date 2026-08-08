import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import purchaseOrderService from "../../services/purchaseOrderService";
import purchaseOrderItemService from "../../services/purchaseOrderItemService";
import adminProductService from "../../services/adminProductService";

export default function PurchaseOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [products, setProducts] = useState([]);

const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receiving, setReceiving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    status: "Draft",
    notes: "",
  });

const [itemSaving, setItemSaving] = useState(null);
  const [itemDeleting, setItemDeleting] = useState(null);

  const [newItem, setNewItem] = useState({
    product_id: "",
    quantity: 1,
    cost_price: 0,
  });
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    loadPurchaseOrder();
    loadProducts();
  }, [id]);

  async function loadPurchaseOrder() {
    try {
      setLoading(true);

      const data = await purchaseOrderService.get(id);

      setPurchaseOrder(data);

      try {
        const productData = await adminProductService.getAll();
        setProducts(productData);
      } catch (productError) {
        console.error("Products loading error:", productError);
      }

      setEditForm({
        status: data.status || "Draft",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error("Purchase order error:", err);
      alert("Failed to load purchase order.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const data = await adminProductService.getAll();

      setProducts(data || []);
    } catch (err) {
      console.error("Products error:", err);
    }
  }

function canEdit() {
    return (
      purchaseOrder &&
      purchaseOrder.status !== "Received" &&
      purchaseOrder.status !== "Cancelled"
    );
  }

async function handleUpdateItem(itemId, quantity, costPrice) {
  if (!purchaseOrder) return;

  if (
    purchaseOrder.status === "Received" ||
    purchaseOrder.status === "Cancelled"
  ) {
    alert(
      "Cannot modify items on a Received or Cancelled purchase order."
    );
    return;
  }

  try {
    setItemSaving(itemId);

    await purchaseOrderService.updateItem(itemId, {
      quantity: Number(quantity),
      cost_price: Number(costPrice),
    });

    await loadPurchaseOrder();

    alert("Purchase order item updated successfully.");
  } catch (err) {
    console.error("Update item error:", err);

    alert(
      err?.response?.data?.message ||
        "Failed to update purchase order item."
    );
  } finally {
    setItemSaving(null);
  }
}

async function handleDeleteItem(itemId) {
  if (!purchaseOrder) return;

  if (
    purchaseOrder.status === "Received" ||
    purchaseOrder.status === "Cancelled"
  ) {
    alert(
      "Cannot modify items on a Received or Cancelled purchase order."
    );
    return;
  }

  const confirmed = window.confirm(
    "Remove this item from the purchase order?"
  );

  if (!confirmed) return;

  try {
    setItemDeleting(itemId);

    await purchaseOrderService.deleteItem(itemId);

    await loadPurchaseOrder();

    alert("Purchase order item removed.");
  } catch (err) {
    console.error("Delete item error:", err);

    alert(
      err?.response?.data?.message ||
        "Failed to delete purchase order item."
    );
  } finally {
    setItemDeleting(null);
  }
}

  async function handleReceive() {
    if (!purchaseOrder) return;

    if (purchaseOrder.status === "Received") {
      return;
    }

    const confirmed = window.confirm(
      `Receive purchase order #${purchaseOrder.id}?\n\n` +
        `This will add all ordered quantities to inventory.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setReceiving(true);

      await purchaseOrderService.receive(purchaseOrder.id);

      await loadPurchaseOrder();

      alert("Purchase order received successfully.");
    } catch (err) {
      console.error("Receive PO error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to receive purchase order."
      );
    } finally {
      setReceiving(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      await purchaseOrderService.update(
        purchaseOrder.id,
        {
          status: editForm.status,
          notes: editForm.notes,
        }
      );

      await loadPurchaseOrder();

      setEditing(false);

      alert("Purchase order updated successfully.");
    } catch (err) {
      console.error("Update PO error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update purchase order."
      );
    } finally {
      setSaving(false);
    }
  }

async function handleAddItem() {
  if (!purchaseOrder) return;

  if (
    purchaseOrder.status === "Received" ||
    purchaseOrder.status === "Cancelled"
  ) {
    alert(
      "Cannot modify items on a Received or Cancelled purchase order."
    );
    return;
  }

  if (!newItem.product_id) {
    alert("Please select a product.");
    return;
  }

  if (Number(newItem.quantity) <= 0) {
    alert("Quantity must be greater than zero.");
    return;
  }

  if (Number(newItem.cost_price) < 0) {
    alert("Cost price cannot be negative.");
    return;
  }

  try {
    setAddingItem(true);

    await purchaseOrderService.addItem({
      purchase_order_id: purchaseOrder.id,
      product_id: Number(newItem.product_id),
      quantity: Number(newItem.quantity),
      cost_price: Number(newItem.cost_price),
    });

    setNewItem({
      product_id: "",
      quantity: 1,
      cost_price: 0,
    });

    await loadPurchaseOrder();

    alert("Product added to purchase order.");
  } catch (err) {
    console.error("Add item error:", err);

    alert(
      err?.response?.data?.message ||
        "Failed to add product to purchase order."
    );
  } finally {
    setAddingItem(false);
  }
}

if (loading) {
    return (
      <div className="p-6">
        Loading purchase order...
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="p-6">
        <p className="text-gray-600 mb-4">
          Purchase order not found.
        </p>

        <Link
          to="/admin/purchase-orders"
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Orders
        </Link>
      </div>
    );
  }

  const items = purchaseOrder.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.cost_price || 0),
    0
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">

        <div>
          <Link
            to="/admin/purchase-orders"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Purchase Orders
          </Link>

          <h1 className="text-3xl font-bold mt-3">
            Purchase Order #{purchaseOrder.id}
          </h1>

          <p className="text-gray-500 mt-1">
            Created{" "}
            {new Date(
              purchaseOrder.created_at
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              purchaseOrder.status === "Received"
                ? "bg-green-100 text-green-700"
                : purchaseOrder.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {purchaseOrder.status}
          </span>

          {canEdit() && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={handleReceive}
                disabled={receiving}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {receiving
                  ? "Receiving..."
                  : "Receive Purchase Order"}
              </button>
            </>
          )}

        </div>
      </div>

      {/* Supplier */}
      <div className="bg-white rounded-xl shadow border p-6 mb-6">

        <h2 className="text-xl font-bold mb-4">
          Supplier
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Company
            </p>

            <p className="font-semibold">
              {purchaseOrder.supplier?.company_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Contact
            </p>

            <p className="font-semibold">
              {purchaseOrder.supplier?.contact_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-semibold">
              {purchaseOrder.supplier?.phone || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {purchaseOrder.supplier?.email || "-"}
            </p>
          </div>

        </div>
      </div>

      {/* Edit PO */}
      {editing && canEdit() && (
        <div className="bg-white rounded-xl shadow border p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Edit Purchase Order
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>

              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Draft">
                  Draft
                </option>

                <option value="Ordered">
                  Ordered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notes
              </label>

              <textarea
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    notes: e.target.value,
                  })
                }
                rows="4"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Purchase order notes..."
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>
      )}

      {/* Notes */}
      {purchaseOrder.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">

          <h2 className="font-bold mb-2">
            Notes
          </h2>

          <p className="text-gray-700">
            {purchaseOrder.notes}
          </p>

        </div>
      )}

      {/* Add Product */}
      {canEdit() && (
        <div className="bg-white rounded-xl shadow border p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Add Product
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            <div className="md:col-span-2">

              <label className="block text-sm font-medium mb-2">
                Product
              </label>

              <select
                value={newItem.product_id}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    product_id: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">
                  Select product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Cost Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={newItem.cost_price}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    cost_price: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

            </div>

          </div>

<div className="flex justify-end mt-4">

            <button
              onClick={handleAddItem}
              disabled={addingItem}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {addingItem
                ? "Adding..."
                : "+ Add Product"}
            </button>

          </div>

        </div>
      )}

{/* Items */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <div className="p-6 border-b">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-xl font-bold">
                Purchase Order Items
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Products included in this supplier order.
              </p>
            </div>

            {purchaseOrder.status !== "Received" &&
              purchaseOrder.status !== "Cancelled" && (
                <span className="text-sm text-blue-600">
                  Editing enabled
                </span>
              )}

          </div>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Product
              </th>

              <th className="text-left p-4">
                Quantity
              </th>

              <th className="text-left p-4">
                Cost Price
              </th>

              <th className="text-left p-4">
                Total
              </th>

              {purchaseOrder.status !== "Received" &&
                purchaseOrder.status !== "Cancelled" && (
                  <th className="text-left p-4">
                    Actions
                  </th>
                )}

            </tr>

          </thead>

          <tbody>

            {items.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    purchaseOrder.status !== "Received" &&
                    purchaseOrder.status !== "Cancelled"
                      ? 5
                      : 4
                  }
                  className="p-8 text-center text-gray-500"
                >
                  No products have been added to this purchase
                  order.
                </td>

              </tr>

            ) : (

              items.map((item) => {

                const itemTotal =
                  Number(item.quantity || 0) *
                  Number(item.cost_price || 0);

                return (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-4 font-medium">
                      {item.product_name}
                    </td>

                    <td className="p-4">

                      {purchaseOrder.status === "Received" ||
                      purchaseOrder.status === "Cancelled" ? (

                        item.quantity

                      ) : (

                        <input
                          type="number"
                          min="1"
                          defaultValue={item.quantity}
                          id={`quantity-${item.id}`}
                          className="w-24 border rounded-lg px-3 py-2"
                        />

                      )}

                    </td>

                    <td className="p-4">

                      {purchaseOrder.status === "Received" ||
                      purchaseOrder.status === "Cancelled" ? (

                        `$${Number(
                          item.cost_price || 0
                        ).toFixed(2)}`

                      ) : (

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={item.cost_price}
                          id={`cost-${item.id}`}
                          className="w-32 border rounded-lg px-3 py-2"
                        />

                      )}

                    </td>

                    <td className="p-4 font-semibold">
                      ${itemTotal.toFixed(2)}
                    </td>

                    {purchaseOrder.status !== "Received" &&
                      purchaseOrder.status !== "Cancelled" && (

                        <td className="p-4">

                          <div className="flex gap-2">

                            <button
                              disabled={itemSaving === item.id}
                              onClick={() => {

                                const quantity =
                                  document.getElementById(
                                    `quantity-${item.id}`
                                  ).value;

                                const costPrice =
                                  document.getElementById(
                                    `cost-${item.id}`
                                  ).value;

                                handleUpdateItem(
                                  item.id,
                                  quantity,
                                  costPrice
                                );

                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {itemSaving === item.id
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              disabled={itemDeleting === item.id}
                              onClick={() =>
                                handleDeleteItem(item.id)
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              {itemDeleting === item.id
                                ? "Removing..."
                                : "Remove"}
                            </button>

                          </div>

                        </td>

                      )}

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

        {/* Total */}
        <div className="flex justify-end border-t p-6">

          <div className="text-right">

            <p className="text-gray-500">
              Total Purchase Cost
            </p>

            <p className="text-2xl font-bold">
              ${total.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";
import adminProductService from "../../services/adminProductService";

export default function PurchaseOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    status: "Draft",
    notes: "",
  });

  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    product_id: "",
    quantity: 1,
    cost_price: 0,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [po, productList] = await Promise.all([
        purchaseOrderService.get(id),
        adminProductService.getAll(),
      ]);

      setPurchaseOrder(po);
      setProducts(productList || []);

      setForm({
        status: po.status || "Draft",
        notes: po.notes || "",
      });

      setItems(po.items || []);
    } catch (err) {
      console.error("Purchase order edit error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to load purchase order."
      );
    } finally {
      setLoading(false);
    }
  }

  const isReadOnly =
    purchaseOrder?.status === "Received" ||
    purchaseOrder?.status === "Cancelled";

  function updateForm(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateNewItem(field, value) {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function getItemTotal(item) {
    return (
      Number(item.quantity || 0) *
      Number(item.cost_price || 0)
    );
  }

  const total = items.reduce(
    (sum, item) => sum + getItemTotal(item),
    0
  );

  async function handleSaveOrder() {
    if (!purchaseOrder) return;

    if (isReadOnly) {
      alert(
        "Received or Cancelled purchase orders cannot be modified."
      );
      return;
    }

    try {
      setSaving(true);

      await purchaseOrderService.update(
        purchaseOrder.id,
        {
          status: form.status,
          notes: form.notes,
        }
      );

      alert("Purchase order updated successfully.");

      navigate(
        `/admin/purchase-orders/${purchaseOrder.id}`
      );
    } catch (err) {
      console.error("Save purchase order error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update purchase order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateItem(item) {
    if (isReadOnly) {
      alert(
        "Received or Cancelled purchase orders cannot be modified."
      );
      return;
    }

    try {
      const quantity = Number(item.quantity);
      const costPrice = Number(item.cost_price);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        alert("Quantity must be greater than 0.");
        return;
      }

      if (!Number.isFinite(costPrice) || costPrice < 0) {
        alert("Cost price cannot be negative.");
        return;
      }

      await purchaseOrderService.updateItem(
        item.id,
        {
          quantity,
          cost_price: costPrice,
        }
      );

      await loadData();

      alert("Purchase order item updated.");
    } catch (err) {
      console.error("Update item error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update purchase order item."
      );
    }
  }

  async function handleDeleteItem(item) {
    if (isReadOnly) {
      alert(
        "Received or Cancelled purchase orders cannot be modified."
      );
      return;
    }

    const confirmed = window.confirm(
      `Remove ${item.product_name} from this purchase order?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await purchaseOrderService.deleteItem(item.id);

      await loadData();

      alert("Purchase order item removed.");
    } catch (err) {
      console.error("Delete item error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to remove purchase order item."
      );
    }
  }

  async function handleAddItem() {
    if (isReadOnly) {
      alert(
        "Received or Cancelled purchase orders cannot be modified."
      );
      return;
    }

    const productId = Number(newItem.product_id);
    const quantity = Number(newItem.quantity);
    const costPrice = Number(newItem.cost_price);

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (!Number.isFinite(costPrice) || costPrice < 0) {
      alert("Cost price cannot be negative.");
      return;
    }

    try {
      await purchaseOrderService.addItem({
        purchase_order_id: Number(purchaseOrder.id),
        product_id: productId,
        quantity,
        cost_price: costPrice,
      });

      setNewItem({
        product_id: "",
        quantity: 1,
        cost_price: 0,
      });

      await loadData();

      alert("Product added to purchase order.");
    } catch (err) {
      console.error("Add item error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to add product."
      );
    }
  }

  function updateItemLocal(itemId, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading purchase order...
        </p>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Purchase order not found
        </h1>

        <Link
          to="/admin/purchase-orders"
          className="text-blue-600 hover:underline"
        >
          ← Back to Purchase Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">

        <div>
          <Link
            to={`/admin/purchase-orders/${purchaseOrder.id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Purchase Order
          </Link>

          <h1 className="text-3xl font-bold mt-3">
            Edit Purchase Order #{purchaseOrder.id}
          </h1>

          <p className="text-gray-500 mt-1">
            Manage supplier order information and items.
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            purchaseOrder.status === "Received"
              ? "bg-green-100 text-green-700"
              : purchaseOrder.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : purchaseOrder.status === "Ordered"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {purchaseOrder.status}
        </span>

      </div>

      {/* Read-only warning */}
      {isReadOnly && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
          <p className="font-semibold">
            This purchase order is read-only.
          </p>

          <p className="text-sm mt-1">
            Received or Cancelled purchase orders cannot
            be modified.
          </p>
        </div>
      )}

      {/* Purchase Order Information */}
      <div className="bg-white rounded-xl shadow border p-6 mb-6">

        <h2 className="text-xl font-bold mb-5">
          Purchase Order Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Supplier
            </label>

            <div className="border rounded-lg px-4 py-3 bg-gray-50">
              <p className="font-semibold">
                {purchaseOrder.supplier?.company_name ||
                  "-"}
              </p>

              <p className="text-sm text-gray-500">
                {purchaseOrder.supplier?.contact_name ||
                  ""}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>

            <select
              value={form.status}
              disabled={isReadOnly}
              onChange={(e) =>
                updateForm(
                  "status",
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
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

          {/* Notes */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium mb-2">
              Notes
            </label>

            <textarea
              rows="4"
              value={form.notes}
              disabled={isReadOnly}
              onChange={(e) =>
                updateForm(
                  "notes",
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
              placeholder="Purchase order notes..."
            />

          </div>

        </div>

        {!isReadOnly && (
          <div className="flex justify-end mt-5">

            <button
              onClick={handleSaveOrder}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Purchase Order"}
            </button>

          </div>
        )}

      </div>

      {/* Add Product */}
      {!isReadOnly && (
        <div className="bg-white rounded-xl shadow border p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Add Product
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="md:col-span-2">

              <label className="block text-sm font-medium mb-2">
                Product
              </label>

              <select
                value={newItem.product_id}
                onChange={(e) =>
                  updateNewItem(
                    "product_id",
                    e.target.value
                  )
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
                  updateNewItem(
                    "quantity",
                    e.target.value
                  )
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
                  updateNewItem(
                    "cost_price",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-4 py-2"
              />

            </div>

          </div>

          <div className="flex justify-end mt-5">

            <button
              onClick={handleAddItem}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Product
            </button>

          </div>

        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Purchase Order Items
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {items.length} product
            {items.length === 1 ? "" : "s"} in this order.
          </p>

        </div>

        {items.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No products have been added to this purchase order.
          </div>

        ) : (

          <div className="overflow-x-auto">

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

                  {!isReadOnly && (
                    <th className="text-left p-4">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>

              <tbody>

                {items.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-4 font-medium">
                      {item.product_name}
                    </td>

                    <td className="p-4">

                      {isReadOnly ? (
                        item.quantity
                      ) : (
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemLocal(
                              item.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-24 border rounded-lg px-3 py-2"
                        />
                      )}

                    </td>

                    <td className="p-4">

                      {isReadOnly ? (
                        `$${Number(
                          item.cost_price || 0
                        ).toFixed(2)}`
                      ) : (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.cost_price}
                          onChange={(e) =>
                            updateItemLocal(
                              item.id,
                              "cost_price",
                              e.target.value
                            )
                          }
                          className="w-32 border rounded-lg px-3 py-2"
                        />
                      )}

                    </td>

                    <td className="p-4 font-semibold">
                      $
                      {getItemTotal(
                        item
                      ).toFixed(2)}
                    </td>

                    {!isReadOnly && (
                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleUpdateItem(
                                item
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteItem(
                                item
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>

                        </div>

                      </td>
                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* Total */}
        <div className="flex justify-end border-t p-6">

          <div className="text-right">

            <p className="text-gray-500">
              Total Purchase Cost
            </p>

            <p className="text-3xl font-bold">
              ${total.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

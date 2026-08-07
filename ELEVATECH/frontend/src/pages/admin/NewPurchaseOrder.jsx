import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import purchaseOrderService from "../../services/purchaseOrderService";
import purchaseOrderItemService from "../../services/purchaseOrderItemService";
import supplierService from "../../services/supplierService";
import adminProductService from "../../services/adminProductService";

export default function NewPurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const suggestionProductId = searchParams.get("product_id");
  const suggestionQuantity = searchParams.get("quantity");
  const suggestionSupplierId = searchParams.get("supplier_id");

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [supplierId, setSupplierId] = useState(
    suggestionSupplierId || ""
  );

  const [status, setStatus] = useState("Draft");
  const [notes, setNotes] = useState("");

  const [selectedProductId, setSelectedProductId] = useState(
    suggestionProductId || ""
  );

  const [quantity, setQuantity] = useState(
    suggestionQuantity || 1
  );

  const [costPrice, setCostPrice] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [supplierData, productData] =
        await Promise.all([
          supplierService.getAll(),
          adminProductService.getAll(),
        ]);

      setSuppliers(supplierData || []);
      setProducts(productData || []);

      if (
        suggestionProductId &&
        productData?.length
      ) {
        const product = productData.find(
          (p) =>
            Number(p.id) ===
            Number(suggestionProductId)
        );

        if (product) {
          setCostPrice(
            product.cost_price
              ? String(product.cost_price)
              : ""
          );
        }
      }
    } catch (err) {
      console.error(
        "New purchase order loading error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to load purchase order data."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleProductChange(productId) {
    setSelectedProductId(productId);

    const product = products.find(
      (p) => Number(p.id) === Number(productId)
    );

    if (product?.cost_price) {
      setCostPrice(String(product.cost_price));
    } else {
      setCostPrice("");
    }
  }

  function addProduct() {
    if (!selectedProductId) {
      alert("Please select a product.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedCostPrice = Number(costPrice);

    if (parsedQuantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (parsedCostPrice < 0) {
      alert("Cost price cannot be negative.");
      return;
    }

    const product = products.find(
      (p) =>
        Number(p.id) ===
        Number(selectedProductId)
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    const existingItem = items.find(
      (item) =>
        Number(item.product_id) ===
        Number(selectedProductId)
    );

    if (existingItem) {
      setItems(
        items.map((item) =>
          Number(item.product_id) ===
          Number(selectedProductId)
            ? {
                ...item,
                quantity:
                  Number(item.quantity) +
                  parsedQuantity,
                cost_price:
                  parsedCostPrice,
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          product_id: Number(selectedProductId),
          product_name: product.name,
          quantity: parsedQuantity,
          cost_price: parsedCostPrice,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
    setCostPrice("");
  }

  function removeProduct(productId) {
    setItems(
      items.filter(
        (item) =>
          Number(item.product_id) !==
          Number(productId)
      )
    );
  }

  function updateItem(itemProductId, field, value) {
    setItems(
      items.map((item) =>
        Number(item.product_id) ===
        Number(itemProductId)
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function getTotal() {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0) *
          Number(item.cost_price || 0),
      0
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      alert(
        "Please add at least one product."
      );
      return;
    }

    for (const item of items) {
      if (Number(item.quantity) <= 0) {
        alert(
          `Invalid quantity for ${item.product_name}.`
        );
        return;
      }

      if (Number(item.cost_price) < 0) {
        alert(
          `Invalid cost price for ${item.product_name}.`
        );
        return;
      }
    }

    try {
      setSaving(true);

      // Create the purchase order first.
      const purchaseOrder =
        await purchaseOrderService.create({
          supplier_id: Number(supplierId),
          status,
          notes,
        });

      // Add all PO items.
      for (const item of items) {
        await purchaseOrderItemService.create({
          purchase_order_id:
            purchaseOrder.id,
          product_id: Number(
            item.product_id
          ),
          quantity: Number(item.quantity),
          cost_price: Number(
            item.cost_price
          ),
        });
      }

      alert(
        "Purchase order created successfully."
      );

      navigate(
        `/admin/purchase-orders/${purchaseOrder.id}`
      );
    } catch (err) {
      console.error(
        "Create purchase order error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to create purchase order."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading purchase order form...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/purchase-orders")
          }
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Purchase Orders
        </button>

        <h1 className="text-3xl font-bold mt-3">
          New Purchase Order
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new supplier purchase order.
        </p>

      </div>

      {/* Automatic reorder notice */}
      {suggestionProductId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">

          <h2 className="font-bold text-yellow-800">
            Automatic Reorder Suggestion
          </h2>

          <p className="text-yellow-700 mt-1">
            This purchase order was opened from
            an inventory reorder suggestion.
          </p>

          {suggestionQuantity && (
            <p className="text-yellow-700 mt-2">
              Recommended quantity:{" "}
              <strong>
                {suggestionQuantity}
              </strong>
            </p>
          )}

        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Purchase Order Information */}
        <div className="bg-white rounded-xl shadow border p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Purchase Order Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Supplier */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Supplier
              </label>

              <select
                value={supplierId}
                onChange={(e) =>
                  setSupplierId(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
                required
              >

                <option value="">
                  Select supplier
                </option>

                {suppliers
                  .filter(
                    (supplier) =>
                      supplier.active !== false
                  )
                  .map((supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.company_name}
                    </option>
                  ))}

              </select>

            </div>

            {/* Status */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
              >

                <option value="Draft">
                  Draft
                </option>

                <option value="Ordered">
                  Ordered
                </option>

              </select>

            </div>

            {/* Notes */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium mb-2">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows="4"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Optional purchase order notes..."
              />

            </div>

          </div>

        </div>

        {/* Add Products */}
        <div className="bg-white rounded-xl shadow border p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Add Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            {/* Product */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium mb-2">
                Product
              </label>

              <select
                value={selectedProductId}
                onChange={(e) =>
                  handleProductChange(
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

            {/* Quantity */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
              />

            </div>

            {/* Cost */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Cost Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={costPrice}
                onChange={(e) =>
                  setCostPrice(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
                placeholder="0.00"
              />

            </div>

          </div>

          <button
            type="button"
            onClick={addProduct}
            className="mt-4 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
          >
            + Add Product
          </button>

        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow border overflow-hidden mb-6">

          <div className="p-6 border-b">

            <h2 className="text-xl font-bold">
              Purchase Order Items
            </h2>

          </div>

          {items.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No products have been added yet.
            </div>

          ) : (

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

                  <th className="text-left p-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item) => {

                  const itemTotal =
                    Number(
                      item.quantity || 0
                    ) *
                    Number(
                      item.cost_price || 0
                    );

                  return (
                    <tr
                      key={item.product_id}
                      className="border-t"
                    >

                      <td className="p-4 font-medium">
                        {item.product_name}
                      </td>

                      <td className="p-4">

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.product_id,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-24 border rounded px-2 py-1"
                        />

                      </td>

                      <td className="p-4">

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.cost_price}
                          onChange={(e) =>
                            updateItem(
                              item.product_id,
                              "cost_price",
                              e.target.value
                            )
                          }
                          className="w-28 border rounded px-2 py-1"
                        />

                      </td>

                      <td className="p-4 font-semibold">
                        $
                        {itemTotal.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td className="p-4">

                        <button
                          type="button"
                          onClick={() =>
                            removeProduct(
                              item.product_id
                            )
                          }
                          className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          )}

          {/* Total */}
          <div className="flex justify-end border-t p-6">

            <div className="text-right">

              <p className="text-gray-500">
                Total Purchase Cost
              </p>

              <p className="text-2xl font-bold">
                $
                {getTotal().toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/purchase-orders")
            }
            className="px-5 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving || items.length === 0
            }
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create Purchase Order"}
          </button>

        </div>

      </form>

    </div>
  );
}

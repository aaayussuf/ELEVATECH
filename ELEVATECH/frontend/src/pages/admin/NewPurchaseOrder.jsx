import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import purchaseOrderService from "../../services/purchaseOrderService";
import purchaseOrderItemService from "../../services/purchaseOrderItemService";
import supplierService from "../../services/supplierService";
import adminProductService from "../../services/adminProductService";

export default function NewPurchaseOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestion = location.state?.suggestion;

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplierId, setSupplierId] = useState(
    suggestion?.supplier_id || ""
  );

  const [status, setStatus] = useState("Draft");
  const [notes, setNotes] = useState("");

  const [productId, setProductId] = useState(
    suggestion?.product_id || ""
  );

  const [quantity, setQuantity] = useState(
    suggestion?.recommended_quantity || 1
  );

  const [costPrice, setCostPrice] = useState(0);

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      setSuppliers(supplierData);
      setProducts(productData);

      /*
       * If this page came from a reorder suggestion,
       * automatically add the suggested product.
       */
      if (suggestion?.product_id) {
        const suggestedProduct = productData.find(
          (product) =>
            Number(product.id) ===
            Number(suggestion.product_id)
        );

        if (suggestedProduct) {
          setItems([
            {
              product_id: suggestedProduct.id,
              product_name: suggestedProduct.name,
              quantity:
                suggestion.recommended_quantity || 1,
              cost_price:
                Number(suggestedProduct.cost_price) || 0,
            },
          ]);

          setCostPrice(
            Number(suggestedProduct.cost_price) || 0
          );
        }
      }
    } catch (err) {
      console.error("New purchase order error:", err);

      alert(
        err?.response?.data?.message ||
        "Failed to load purchase order data."
      );
    } finally {
      setLoading(false);
    }
  }

  function addProduct() {
    if (!productId) {
      alert("Please select a product.");
      return;
    }

    const qty = Number(quantity);
    const price = Number(costPrice);

    if (qty <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    if (price < 0) {
      alert("Cost price cannot be negative.");
      return;
    }

    const product = products.find(
      (p) => Number(p.id) === Number(productId)
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    const existing = items.find(
      (item) =>
        Number(item.product_id) === Number(productId)
    );

    if (existing) {
      setItems(
        items.map((item) =>
          Number(item.product_id) ===
          Number(productId)
            ? {
                ...item,
                quantity:
                  Number(item.quantity) + qty,
                cost_price: price,
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: qty,
          cost_price: price,
        },
      ]);
    }

    setProductId("");
    setQuantity(1);
    setCostPrice(0);
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

  function updateItemQuantity(productId, value) {
    const qty = Number(value);

    if (qty < 1) {
      return;
    }

    setItems(
      items.map((item) =>
        Number(item.product_id) ===
        Number(productId)
          ? {
              ...item,
              quantity: qty,
            }
          : item
      )
    );
  }

  function updateItemCost(productId, value) {
    const price = Number(value);

    if (price < 0) {
      return;
    }

    setItems(
      items.map((item) =>
        Number(item.product_id) ===
        Number(productId)
          ? {
              ...item,
              cost_price: price,
            }
          : item
      )
    );
  }

  async function handleCreate() {
    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Step 1:
       * Create the purchase order.
       */
      const purchaseOrder =
        await purchaseOrderService.create({
          supplier_id: Number(supplierId),
          status,
          notes,
        });

      /*
       * Step 2:
       * Add each product to the purchase order.
       */
      for (const item of items) {
        await purchaseOrderItemService.create({
          purchase_order_id: purchaseOrder.id,
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          cost_price: Number(item.cost_price),
        });
      }

      alert(
        `Purchase order #${purchaseOrder.id} created successfully.`
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

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.cost_price || 0),
    0
  );

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

        <Link
          to="/admin/purchase-orders"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Purchase Orders
        </Link>

        <h1 className="text-3xl font-bold mt-3">
          New Purchase Order
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new supplier purchase order.
        </p>

      </div>

      {/* Reorder Suggestion */}

      {suggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">

          <h2 className="font-bold text-blue-800">
            Automatic Reorder Suggestion
          </h2>

          <p className="text-blue-700 mt-2">
            {suggestion.product_name} has reached
            its minimum stock level.
          </p>

          <p className="text-blue-700 mt-1">
            Recommended quantity:
            <strong className="ml-1">
              {suggestion.recommended_quantity}
            </strong>
          </p>

        </div>
      )}

      {/* Purchase Order Information */}

      <div className="bg-white rounded-xl shadow border p-6 mb-6">

        <h2 className="text-xl font-bold mb-5">
          Purchase Order Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
            >

              <option value="">
                Select supplier
              </option>

              {suppliers
                .filter((supplier) => supplier.active)
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

          <div>

            <label className="block text-sm font-medium mb-2">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) => {
                const value = e.target.value;

                setProductId(value);

                const product = products.find(
                  (p) =>
                    Number(p.id) ===
                    Number(value)
                );

                if (product) {
                  setCostPrice(
                    Number(product.cost_price) || 0
                  );
                }
              }}
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
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
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
              value={costPrice}
              onChange={(e) =>
                setCostPrice(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2"
            />

          </div>

          <button
            type="button"
            onClick={addProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>

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
            No products added yet.
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
                  Number(item.quantity || 0) *
                  Number(item.cost_price || 0);

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
                          updateItemQuantity(
                            item.product_id,
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
                          updateItemCost(
                            item.product_id,
                            e.target.value
                          )
                        }
                        className="w-28 border rounded px-2 py-1"
                      />

                    </td>

                    <td className="p-4 font-semibold">
                      ${itemTotal.toFixed(2)}
                    </td>

                    <td className="p-4">

                      <button
                        type="button"
                        onClick={() =>
                          removeProduct(
                            item.product_id
                          )
                        }
                        className="text-red-600 hover:underline"
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
              ${total.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

      {/* Actions */}

      <div className="flex justify-end gap-3">

        <Link
          to="/admin/purchase-orders"
          className="px-5 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Creating..."
            : "Create Purchase Order"}
        </button>

      </div>

    </div>
  );
}


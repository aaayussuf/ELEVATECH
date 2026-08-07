import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import supplierService from "../../services/supplierService";
import productService from "../../services/productService";
import purchaseOrderService from "../../services/purchaseOrderService";

export default function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const location = useLocation();

  const reorderSuggestion =
    location.state?.reorderSuggestion;

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [supplierData, productData] = await Promise.all([
        supplierService.getAll(),
        productService.getProducts(),
      ]);

      setSuppliers(supplierData);

      const productList = Array.isArray(productData)
        ? productData
        : productData.products || productData.data || [];

      setProducts(productList);

      if (reorderSuggestion) {
        if (reorderSuggestion.supplier_id) {
          setSupplierId(
            String(reorderSuggestion.supplier_id)
          );
        }

        const product = productList.find(
          (p) =>
            Number(p.id) ===
            Number(reorderSuggestion.product_id)
        );

        if (product) {
          setProductId(String(product.id));

          setQuantity(
            Number(
              reorderSuggestion.recommended_quantity
            )
          );

          setItems([
            {
              product_id: Number(product.id),
              product_name: product.name,
              quantity: Number(
                reorderSuggestion.recommended_quantity
              ),
              cost_price: Number(product.cost_price || 0),
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load suppliers and products.");
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    if (costPrice === "" || Number(costPrice) < 0) {
      alert("Please enter a valid cost price.");
      return;
    }

    const product = products.find(
      (p) => Number(p.id) === Number(productId)
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    const existingItem = items.find(
      (item) => Number(item.product_id) === Number(productId)
    );

    if (existingItem) {
      setItems(
        items.map((item) =>
          Number(item.product_id) === Number(productId)
            ? {
                ...item,
                quantity: Number(item.quantity) + Number(quantity),
                cost_price: Number(costPrice),
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          product_id: Number(product.id),
          product_name: product.name,
          quantity: Number(quantity),
          cost_price: Number(costPrice),
        },
      ]);
    }

    setProductId("");
    setQuantity(1);
    setCostPrice("");
  }

  function removeItem(productIdToRemove) {
    setItems(
      items.filter(
        (item) => Number(item.product_id) !== Number(productIdToRemove)
      )
    );
  }

  async function createPurchaseOrder() {
    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    setSaving(true);

    try {
      // Create the purchase order first.
      const purchaseOrder = await purchaseOrderService.create({
        supplier_id: Number(supplierId),
        status: "Draft",
        notes,
      });

      // Then create each purchase-order item.
      for (const item of items) {
        await fetch(
          "http://127.0.0.1:5000/api/admin/purchase-order-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "elevatech_token"
              )}`,
            },
            body: JSON.stringify({
              purchase_order_id: purchaseOrder.id,
              product_id: item.product_id,
              quantity: item.quantity,
              cost_price: item.cost_price,
            }),
          }
        );
      }

      alert(`Purchase Order #${purchaseOrder.id} created successfully.`);

      navigate("/admin/purchase-orders");
    } catch (error) {
      console.error(error);
      alert("Failed to create purchase order.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading suppliers and products...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            New Purchase Order
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new supplier purchase order.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/purchase-orders")}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>

      {reorderSuggestion && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h2 className="font-semibold text-yellow-800">
            Automatic Reorder Suggestion
          </h2>

          <p className="text-yellow-700 mt-1">
            {reorderSuggestion.product_name} has reached
            its minimum stock level.
          </p>

          <p className="text-yellow-700 mt-1">
            Recommended quantity:
            <strong className="ml-1">
              {reorderSuggestion.recommended_quantity}
            </strong>
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow border p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Purchase Order Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block font-medium mb-2">
              Supplier
            </label>

            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
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
            <label className="block font-medium mb-2">
              Status
            </label>

            <input
              value="Draft"
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

        </div>

        <div className="mt-6">

          <label className="block font-medium mb-2">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional purchase order notes..."
          />

        </div>

      </div>

      <div className="bg-white rounded-xl shadow border p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Add Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="md:col-span-2">

            <label className="block font-medium mb-2">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
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

            <label className="block font-medium mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          <div>

            <label className="block font-medium mb-2">
              Cost Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="0.00"
            />

          </div>

        </div>

        <button
          onClick={addItem}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>

      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden mb-6">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
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

              {items.map((item) => (

                <tr
                  key={item.product_id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {item.product_name}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.cost_price}
                      onChange={(e) => {
                        const value = e.target.value;

                        setItems(
                          items.map((currentItem) =>
                            currentItem.product_id ===
                            item.product_id
                              ? {
                                  ...currentItem,
                                  cost_price: value,
                                }
                              : currentItem
                          )
                        );
                      }}
                      className="w-32 border rounded-lg px-3 py-2"
                    />
                  </td>

                  <td className="p-4 font-semibold">
                    $
                    {(
                      Number(item.quantity) *
                      Number(item.cost_price)
                    ).toFixed(2)}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        removeItem(item.product_id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {items.length > 0 && (

        <div className="bg-white rounded-xl shadow border p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Total Purchase Cost
              </p>

              <p className="text-3xl font-bold">

                $
                {items
                  .reduce(
                    (total, item) =>
                      total +
                      Number(item.quantity) *
                        Number(item.cost_price),
                    0
                  )
                  .toFixed(2)}

              </p>

            </div>

            <button
              onClick={createPurchaseOrder}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Purchase Order"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}


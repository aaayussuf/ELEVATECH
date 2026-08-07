import { useEffect, useState } from "react";
import inventoryService from "../../services/inventoryService";
import adminProductService from "../../services/adminProductService";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);

      const data = await inventoryService.getInventory();

      console.log("Inventory:", data);

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Inventory Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }

      alert("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  async function changeStock(product, newQuantity) {
    if (newQuantity < 0) return;

    try {
      setUpdatingId(product.id);

      await inventoryService.updateStock(
        product.id,
        newQuantity
      );

      await loadInventory();
    } catch (err) {
      console.error("Stock update error:", err);

      if (err.response) {
        console.error(err.response.data);
      }

      alert("Failed to update stock.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteSelected() {
    if (selected.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selected.length} product(s)?`
    );

    if (!confirmed) return;

    try {
      await adminProductService.bulkDelete(selected);

      setSelected([]);

      await loadInventory();
    } catch (err) {
      console.error("Bulk delete error:", err);

      alert("Failed to delete selected products.");
    }
  }

  const total = products.length;

  const inStock = products.filter(
    (p) => p.status === "In Stock"
  ).length;

  const lowStock = products.filter(
    (p) => p.status === "Low Stock"
  ).length;

  const outOfStock = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

  function badge(status) {
    const styles = {
      "In Stock":
        "bg-green-100 text-green-700",

      "Low Stock":
        "bg-yellow-100 text-yellow-700",

      "Out of Stock":
        "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] ||
          "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  }

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const sku = product.sku || "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(searchValue) ||
      sku.toLowerCase().includes(searchValue);

    const matchesFilter =
      filter === "All" ||
      product.status === filter;

    return matchesSearch && matchesFilter;
  });

  function toggleSelectAll(checked) {
    if (checked) {
      setSelected(
        filteredProducts.map((product) => product.id)
      );
    } else {
      setSelected([]);
    }
  }

  function toggleProduct(id, checked) {
    if (checked) {
      setSelected((prev) => {
        if (prev.includes(id)) {
          return prev;
        }

        return [...prev, id];
      });
    } else {
      setSelected((prev) =>
        prev.filter((selectedId) => selectedId !== id)
      );
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Inventory
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          Loading inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Inventory
          </h1>

          <p className="text-gray-500 mt-1">
            Manage product stock and inventory levels.
          </p>
        </div>

        <button
          onClick={loadInventory}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          Refresh
        </button>

      </div>

      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-6 gap-4">

        <input
          type="text"
          placeholder="Search product or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-80"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">
            All
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>
        </select>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Products
          </h3>

          <p className="text-3xl font-bold mt-2">
            {total}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl shadow p-5">
          <h3 className="text-green-700">
            In Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {inStock}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow p-5">
          <h3 className="text-yellow-700">
            Low Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {lowStock}
          </p>
        </div>

        <div className="bg-red-50 rounded-xl shadow p-5">
          <h3 className="text-red-700">
            Out of Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {outOfStock}
          </p>
        </div>

      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">

          <strong>
            {selected.length} selected
          </strong>

          <div className="flex gap-3">

            <button
              onClick={deleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>

            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => {
                alert(
                  "Bulk featured action can be connected next."
                );
              }}
            >
              Mark Featured
            </button>

            <button
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => {
                alert(
                  "Bulk disable action can be connected next."
                );
              }}
            >
              Disable
            </button>

          </div>

        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 w-12">

                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      filteredProducts.every(
                        (product) =>
                          selected.includes(product.id)
                      )
                    }
                    onChange={(e) =>
                      toggleSelectAll(e.target.checked)
                    }
                  />

                </th>

                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  SKU
                </th>

                <th className="text-left p-4">
                  Stock
                </th>

                <th className="text-left p-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map((product) => (

                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* Checkbox */}
                    <td className="p-4">

                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={(e) =>
                          toggleProduct(
                            product.id,
                            e.target.checked
                          )
                        }
                      />

                    </td>

                    {/* Product */}
                    <td className="p-4">

                      <div className="font-semibold">
                        {product.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        Product #{product.id}
                      </div>

                    </td>

                    {/* SKU */}
                    <td className="p-4">

                      {product.sku || "-"}

                    </td>

                    {/* Stock */}
                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <button
                          disabled={
                            product.stock <= 0 ||
                            updatingId === product.id
                          }
                          className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                          onClick={() =>
                            changeStock(
                              product,
                              product.stock - 1
                            )
                          }
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          disabled={
                            updatingId === product.id
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            setProducts((prev) =>
                              prev.map((item) =>
                                item.id === product.id
                                  ? {
                                      ...item,
                                      stock:
                                        value === ""
                                          ? 0
                                          : Number(value),
                                    }
                                  : item
                              )
                            );
                          }}
                          onBlur={(e) => {
                            const quantity = Math.max(
                              0,
                              Number(e.target.value)
                            );

                            changeStock(
                              product,
                              quantity
                            );
                          }}
                          className="w-20 border rounded text-center px-2 py-1"
                        />

                        <button
                          disabled={
                            updatingId === product.id
                          }
                          className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                          onClick={() =>
                            changeStock(
                              product,
                              product.stock + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </td>

{/* Status + Reorder */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        {badge(product.status)}

                        {product.status === "Low Stock" && (
                          <button
                            onClick={() => {
                              window.location.href =
                                "/admin/inventory/reorder-suggestions";
                            }}
                            className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 text-sm"
                          >
                            Reorder
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


import { useEffect, useState } from "react";
import inventoryService from "../../services/inventoryService";
import adminProductService from "../../services/adminProductService";

export default function Inventory() {
const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const data = await inventoryService.getInventory();

      console.log("Inventory:", data);

      setProducts(data);
    } catch (err) {
      console.error("Inventory Error:", err);

      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
      }
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
          styles[status]
        }`}
      >
        {status}
      </span>
    );
  }

const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      product.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Inventory
      </h1>

      {/* Search & Filter Controls */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-80"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option>All</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-green-50 rounded-xl shadow p-5">
          <h3 className="text-green-700">In Stock</h3>
          <p className="text-3xl font-bold">{inStock}</p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow p-5">
          <h3 className="text-yellow-700">Low Stock</h3>
          <p className="text-3xl font-bold">{lowStock}</p>
        </div>

        <div className="bg-red-50 rounded-xl shadow p-5">
          <h3 className="text-red-700">Out of Stock</h3>
          <p className="text-3xl font-bold">{outOfStock}</p>
        </div>

      </div>

      {/* Bulk Actions Toolbar */}
      {selected.length > 0 && (

        <div className="bg-blue-50 border rounded-lg p-4 mb-4 flex justify-between items-center">

          <strong>
            {selected.length} selected
          </strong>

          <div className="flex gap-3">

            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={async () => {

                if (
                  !window.confirm(
                    `Delete ${selected.length} products?`
                  )
                ) {
                  return;
                }

                await adminProductService.bulkDelete(selected);

                setSelected([]);

                loadInventory();

              }}
            >
              Delete
            </button>

            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Mark Featured
            </button>

            <button className="bg-gray-700 text-white px-4 py-2 rounded">
              Disable
            </button>

          </div>

        </div>

      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selected.length === filteredProducts.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(filteredProducts.map(p => p.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </th>

              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">SKU</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>

            </tr>

          </thead>

          <tbody>

{filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-t"
              >

                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={(e) => {

                      if (e.target.checked) {
                        setSelected(prev => [...prev, product.id]);
                      } else {
                        setSelected(prev =>
                          prev.filter(id => id !== product.id)
                        );
                      }

                    }}
                  />
                </td>

                <td className="p-4">{product.name}</td>

                <td className="p-4">
                  {product.sku || "-"}
                </td>

<td className="p-4">

                  <div className="flex items-center gap-2">

                    <button
                      className="bg-red-100 px-2 rounded"
                      onClick={async () => {
                        if (product.stock <= 0) return;

                        await inventoryService.updateStock(
                          product.id,
                          product.stock - 1
                        );

                        loadInventory();
                      }}
                    >
                      −
                    </button>

<input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      className="w-20 border rounded text-center px-2 py-1"
                      onBlur={async (e) => {

                        const quantity = Number(e.target.value);

                        await inventoryService.updateStock(
                          product.id,
                          quantity
                        );

                        loadInventory();

                      }}
                    />

                    <button
                      className="bg-green-100 px-2 rounded"
                      onClick={async () => {
                        await inventoryService.updateStock(
                          product.id,
                          product.stock + 1
                        );

                        loadInventory();
                      }}
                    >
                      +
                    </button>

                  </div>

                </td>

                <td className="p-4">
                  {badge(product.status)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

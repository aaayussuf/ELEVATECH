import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminProductService from "../../services/adminProductService";
import DataTable from "../../components/admin/tables/DataTable";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
const [stats, setStats] = useState({
    total_products: 0,
    featured_products: 0,
    active_products: 0,
    low_stock: 0,
    out_of_stock: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    loadStats();
    loadLowStock();
  }, [page]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await adminProductService.listProducts({
        search,
        page,
        per_page: 10,
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

async function loadStats() {
    try {
      const data = await adminProductService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadLowStock() {
    try {
      const data = await adminProductService.getLowStock();
      setLowStockProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminProductService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  }

  const columns = [
    {
      key: "image",
      title: "Image",
      render: (product) => (
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 rounded object-cover"
        />
      ),
    },
    {
      key: "name",
      title: "Product",
    },
    {
      key: "price",
      title: "Price",
      render: (p) =>
        `KSh ${Number(p.price).toLocaleString()}`,
    },
{
      key: "quantity",
      title: "Inventory",
      render: (product) => {
        let color = "text-green-600";
        let badge = "In Stock";

        if (product.quantity <= 0) {
          color = "text-red-600";
          badge = "Out of Stock";
        } else if (product.quantity <= product.low_stock) {
          color = "text-yellow-600";
          badge = "Low Stock";
        }

        return (
          <div>
            <div className={`font-semibold ${color}`}>
              {badge}
            </div>

            <div className="text-gray-500 text-sm">
              {product.quantity} units
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mt-6 mb-8">
        <div className="bg-white shadow rounded p-5">
          <p className="text-gray-500 text-sm">Products</p>
          <h2 className="text-3xl font-bold">{stats.total_products}</h2>
        </div>

        <div className="bg-green-100 rounded p-5">
          <p className="text-sm">Active</p>
          <h2 className="text-3xl font-bold">{stats.active_products}</h2>
        </div>

        <div className="bg-blue-100 rounded p-5">
          <p className="text-sm">Featured</p>
          <h2 className="text-3xl font-bold">{stats.featured_products}</h2>
        </div>

        <div className="bg-yellow-100 rounded p-5">
          <p className="text-sm">Low Stock</p>
          <h2 className="text-3xl font-bold">{stats.low_stock}</h2>
        </div>

<div className="bg-red-100 rounded p-5">
          <p className="text-sm">Out of Stock</p>
          <h2 className="text-3xl font-bold">{stats.out_of_stock}</h2>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-yellow-800">
            ⚠ Inventory Alert
          </h3>

          <p className="text-yellow-700 mt-2">
            {lowStockProducts.length} product(s) are running low on stock.
          </p>

          <ul className="mt-3 list-disc list-inside text-sm">
            {lowStockProducts.slice(0, 5).map((product) => (
              <li key={product.id}>
                {product.name} — {product.quantity} left
              </li>
            ))}
          </ul>

          {lowStockProducts.length > 5 && (
            <p className="mt-2 text-sm text-yellow-700">
              ...and {lowStockProducts.length - 5} more.
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          className="border rounded px-3 py-2 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found."
actions={(product) => (
          <ProductActions
            product={product}
            onDelete={handleDelete}
            onUpdated={loadProducts}
            navigate={navigate}
          />
        )}
      />

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
)}
    </div>
  );
}

function ProductActions({
  product,
  navigate,
  onDelete,
  onUpdated,
}) {
  const [qty, setQty] = useState(product.quantity);

  async function saveStock() {
    try {
      await adminProductService.updateStock(
        product.id,
        qty
      );

      onUpdated();
    } catch {
      alert("Unable to update stock.");
    }
  }

  return (
    <div className="space-y-2">

      <div className="flex gap-2">

        <input
          type="number"
          value={qty}
          onChange={(e) =>
            setQty(Number(e.target.value))
          }
          className="border rounded w-20 px-2"
        />

        <button
          onClick={saveStock}
          className="bg-green-600 text-white px-3 rounded"
        >
          Save
        </button>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            navigate(`/admin/products/${product.id}/edit`)
          }
          className="text-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

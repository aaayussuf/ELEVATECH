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

  useEffect(() => {
    loadProducts();
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
      title: "Stock",
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
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(`/admin/products/${product.id}/edit`)
              }
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
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

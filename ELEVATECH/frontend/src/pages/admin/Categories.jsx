import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminCategoryService from "../../services/adminCategoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  async function loadCategories() {
    try {
      setLoading(true);

      const data =
        await adminCategoryService.listCategories({
          page,
          search,
        });

      setCategories(data.categories);

      setPages(data.pages);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id) {
    try {
      await adminCategoryService.toggleStatus(id);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Unable to update category.");
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;

    try {
      await adminCategoryService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Unable to delete.");
    }
  }

  if (loading)
    return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <Link
          to="/admin/categories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </Link>

      </div>

      <input
        className="border rounded-lg px-4 py-2 w-full"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Image</th>

              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Products</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {categories.map(category => (

              <tr
                key={category.id}
                className="border-t"
              >

                <td className="p-4">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                </td>

                <td className="p-4 font-semibold">
                  {category.name}
                </td>

                <td className="p-4">
                  {category.products}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.active ? "Active" : "Hidden"}
                  </span>

                </td>

                <td className="p-4 flex gap-2">

                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => toggleStatus(category.id)}
                    className="text-orange-600"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}


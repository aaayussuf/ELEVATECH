import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminProductService from "../../services/adminProductService";
import categoryService from "../../services/categoryService";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: initialData.name || "",
    slug: initialData.slug || "",
    description: initialData.description || "",
    price: initialData.price || "",
    quantity: initialData.quantity || 0,
    brand: initialData.brand || "",
    category_id: initialData.category_id || "",
    image: initialData.image || "",
    image2: initialData.image2 || "",
    image3: initialData.image3 || "",
    image4: initialData.image4 || "",
    featured: initialData.featured || false,
    active: initialData.active ?? true,
  });

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [saving, setSaving] = useState(false);

  // List of common brands for the dropdown
  const BRAND_OPTIONS = [
    "HP",
    "Lenovo",
    "Dell",
    "Apple",
    "Logitech",
    "Samsung",
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await categoryService.getCategories();
    setCategories(data);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageUpload(fieldName) {
    return async function (e) {
      const file = e.target.files[0];

      if (!file) return;

      try {
        setUploading(true);
        setUploadingField(fieldName);

        const result = await adminProductService.uploadImage(file);

        setForm((prev) => ({
          ...prev,
          [fieldName]: result.url,
        }));
      } catch (err) {
        alert("Image upload failed.");
      } finally {
        setUploading(false);
        setUploadingField(null);
      }
    };
  }

  // Format price as KES
  function formatPrice(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return `KES ${num.toLocaleString("en-KE")}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      await onSubmit(form);

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold">
        Product Information
      </h2>

      <input
        className="w-full border rounded p-2"
        placeholder="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Slug"
        name="slug"
        value={form.slug}
        onChange={handleChange}
        required
      />

      <textarea
        className="w-full border rounded p-2"
        rows={5}
        placeholder="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
          {form.price && (
            <p className="text-green-600 text-sm mt-1 font-medium">
              {formatPrice(form.price)}
            </p>
          )}
        </div>

        <input
          type="number"
          className="border rounded p-2"
          placeholder="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Brand
        </label>
        <select
          name="brand"
          value={
            BRAND_OPTIONS.includes(form.brand)
              ? form.brand
              : "Custom"
          }
          onChange={(e) => {
            const val = e.target.value;
            setForm((prev) => ({
              ...prev,
              brand: val === "Custom" ? "" : val,
            }));
          }}
          className="w-full border rounded p-2"
        >
          <option value="">Select Brand</option>
          {BRAND_OPTIONS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
          <option value="Custom">Custom</option>
        </select>

        {!BRAND_OPTIONS.includes(form.brand) && form.brand !== "" && (
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Type custom brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map(category => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-3">
          Product Images
        </label>

        {[
          { label: "Main Image", field: "image" },
          { label: "Second Image", field: "image2" },
          { label: "Third Image", field: "image3" },
          { label: "Fourth Image", field: "image4" },
        ].map(({ label, field }) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {label}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload(field)}
            />

            {uploading && uploadingField === field && (
              <p className="text-blue-600 mt-2">
                Uploading...
              </p>
            )}

            {form[field] && (
              <img
                src={form[field]}
                alt={label}
                className="mt-2 w-48 rounded border"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />

          <span className="ml-2">Featured</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          <span className="ml-2">Active</span>
        </label>
      </div>

      <button
        disabled={saving}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
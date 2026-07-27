import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminProductService from "../../services/adminProductService";

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
    featured: initialData.featured || false,
    active: initialData.active ?? true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const result = await adminProductService.uploadImage(file);

      setForm((prev) => ({
        ...prev,
        image: result.url,
      }));
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
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
        <input
          type="number"
          className="border rounded p-2"
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className="border rounded p-2"
          placeholder="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <input
        className="w-full border rounded p-2"
        placeholder="Brand"
        name="brand"
        value={form.brand}
        onChange={handleChange}
      />

      <input
        type="number"
        className="w-full border rounded p-2"
        placeholder="Category ID"
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block font-medium mb-2">
          Product Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {uploading && (
          <p className="text-blue-600 mt-2">
            Uploading...
          </p>
        )}

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="mt-3 w-48 rounded border"
          />
        )}
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
// ═══════════════════════════════════════════════════════
// Part 1 — Imports
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import adminProductService from "../../services/adminProductService";
import uploadService from "../../services/uploadService";
import ImageUploader from "./ImageUploader";

// ═══════════════════════════════════════════════════════
// Part 2 — Component
// ═══════════════════════════════════════════════════════
export default function ProductForm({
    mode = "create",
    productId = null
}) {

    const navigate = useNavigate();

    // ═══════════════════════════════════════════════════
    // Part 3 — State
    // ═══════════════════════════════════════════════════
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({

        name: "",
        slug: "",
        brand: "",
        category_id: "",

        description: "",
        short_description: "",

        sku: "",
        barcode: "",

        price: "",
        discount_price: "",
        cost_price: "",

        quantity: 0,
        low_stock: 5,

        track_inventory: true,

        image: "",

        featured: false,
        active: true,

        weight: "",
        color: "",
        warranty: "",

        meta_title: "",
        meta_description: ""

    });

    // ═══════════════════════════════════════════════════
    // Part 4 — Auto Slug
    // ═══════════════════════════════════════════════════
    function makeSlug(text) {

        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

    }

    // ═══════════════════════════════════════════════════
    // Part 5 — Input Handler
    // ═══════════════════════════════════════════════════
    function handleChange(e) {

        const { name, value, type, checked } = e.target;

        setForm(prev => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    }

    // ═══════════════════════════════════════════════════
    // Part 6 — Name Handler
    //
    //   When typing
    //     Gaming Laptop HP Victus
    //   it automatically becomes
    //     gaming-laptop-hp-victus
    // ═══════════════════════════════════════════════════
    function handleName(e) {

        const value = e.target.value;

        setForm(prev => ({

            ...prev,

            name: value,

            slug: makeSlug(value)

        }));

    }

    // ═══════════════════════════════════════════════════
    // Part 7 — Load Categories
    // ═══════════════════════════════════════════════════
    useEffect(() => {

        async function loadCategories() {

            try {

                const res = await fetch("http://127.0.0.1:5000/api/categories");

                const data = await res.json();

                setCategories(data);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadCategories();

    }, []);

    // Load product for edit mode
    useEffect(() => {

        if (mode !== "edit" || !productId) return;

        async function loadProduct() {

            try {

                setLoading(true);

                const data = await adminProductService.getProduct(productId);

                setForm(prev => ({

                    ...prev,

                    ...data,

                    // Ensure defaults for missing fields
                    image: data.image || "",
                    short_description: data.short_description || "",
                    sku: data.sku || "",
                    barcode: data.barcode || "",
                    discount_price: data.discount_price || "",
                    cost_price: data.cost_price || "",
                    low_stock: data.low_stock ?? 5,
                    track_inventory: data.track_inventory ?? true,
                    weight: data.weight || "",
                    color: data.color || "",
                    warranty: data.warranty || "",
                    meta_title: data.meta_title || "",
                    meta_description: data.meta_description || ""

                }));

            }

            catch (err) {

                console.error(err);

                setError("Failed to load product.");

            }

            finally {

                setLoading(false);

            }

        }

        loadProduct();

    }, [mode, productId]);

    // ═══════════════════════════════════════════════════
    // Part 8 — Upload Image
    //
    //   Connects directly to your working Cloudinary
    //   uploader.
    // ═══════════════════════════════════════════════════
    async function handleImage(file) {

        try {

            const url = await uploadService.uploadImage(file);

            setForm(prev => ({

                ...prev,

                image: url

            }));

        }

        catch (err) {

            console.error(err);

            alert("Image upload failed");

        }

    }

    // ═══════════════════════════════════════════════════
    // Submit Handler
    // ═══════════════════════════════════════════════════
    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setSaving(true);

            // Convert numeric fields
            const payload = {

                ...form,

                price: parseFloat(form.price) || 0,
                discount_price: form.discount_price
                    ? parseFloat(form.discount_price)
                    : null,
                cost_price: form.cost_price
                    ? parseFloat(form.cost_price)
                    : null,
                quantity: parseInt(form.quantity, 10) || 0,
                low_stock: parseInt(form.low_stock, 10) || 5,
                category_id: form.category_id
                    ? parseInt(form.category_id, 10)
                    : null,
                weight: form.weight
                    ? parseFloat(form.weight)
                    : null

            };

            if (mode === "edit") {

                await adminProductService.updateProduct(productId, payload);

            }

            else {

                await adminProductService.createProduct(payload);

            }

            navigate("/admin/products");

        }

        catch (err) {

            console.error(err);

            setError("Failed to save product.");

        }

        finally {

            setSaving(false);

        }

    }

    // ═══════════════════════════════════════════════════
    // Loading state
    // ═══════════════════════════════════════════════════
    if (loading) {

        return (

            <div className="flex items-center justify-center p-12">

                <p className="text-gray-500 text-lg">
                    Loading product…
                </p>

            </div>

        );

    }

    // ═══════════════════════════════════════════════════
    // Render
    // ═══════════════════════════════════════════════════
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                {mode === "create" ? "Add Product" : "Edit Product"}
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >

                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Basic Information
                        </h2>

                        <div className="space-y-4">

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleName}
                                placeholder="Product Name"
                                className="w-full border rounded-lg p-3"
                                required
                            />

                            <input
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                placeholder="Slug"
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                placeholder="Brand"
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="SKU"
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                name="barcode"
                                value={form.barcode}
                                onChange={handleChange}
                                placeholder="Barcode"
                                className="w-full border rounded-lg p-3"
                            />

                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Pricing
                        </h2>

                        <div className="grid grid-cols-3 gap-4">

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="border rounded-lg p-3"
                            />

                            <input
                                type="number"
                                name="discount_price"
                                value={form.discount_price}
                                onChange={handleChange}
                                placeholder="Discount Price"
                                className="border rounded-lg p-3"
                            />

                            <input
                                type="number"
                                name="cost_price"
                                value={form.cost_price}
                                onChange={handleChange}
                                placeholder="Cost Price"
                                className="border rounded-lg p-3"
                            />

                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Inventory
                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Quantity"
                                className="border rounded-lg p-3"
                            />

                            <input
                                type="number"
                                name="low_stock"
                                value={form.low_stock}
                                onChange={handleChange}
                                placeholder="Low Stock"
                                className="border rounded-lg p-3"
                            />

                        </div>

                        <label className="flex items-center gap-3 mt-4">
                            <input
                                type="checkbox"
                                name="track_inventory"
                                checked={form.track_inventory}
                                onChange={handleChange}
                            />
                            Track Inventory
                        </label>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Description
                        </h2>

                        <textarea
                            rows={8}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            placeholder="Product Description"
                        />
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Product Image
                        </h2>

                        <ImageUploader
                            value={form.image}
                            onChange={(url) =>
                                setForm(prev => ({ ...prev, image: url }))
                            }
                            label="Main Product Image"
                        />
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Category
                        </h2>

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
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

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Status
                        </h2>

                        <div className="space-y-4">

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                />
                                Featured
                            </label>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleChange}
                                />
                                Active
                            </label>

                        </div>

                        <div className="flex gap-4 pt-6">

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : mode === "edit"
                                        ? "Update Product"
                                        : "Save Product"
                                }
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/products")}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>

                </div>

            </form>
        </div>
    );

}


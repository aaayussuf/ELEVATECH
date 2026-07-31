import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [saving, setSaving] = useState(false);

    function handleImage(e) {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        setPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSaving(true);

        try {

            // Cloudinary upload comes next

            console.log({
                name,
                description,
                active,
                image,
            });

        } finally {

            setSaving(false);

        }
    }

    return (
        <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-2xl shadow-lg">

                <div className="border-b px-8 py-6">

                    <h1 className="text-3xl font-bold">

                        Create Category

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Add a new category to your store.

                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 space-y-8"
                >

                    <div>

                        <label className="block mb-2 font-semibold">

                            Category Name

                        </label>

                        <input
                            className="w-full border rounded-xl px-4 py-3"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="Laptops"
                            required
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-semibold">

                            Description

                        </label>

                        <textarea
                            rows="5"
                            className="w-full border rounded-xl px-4 py-3"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-semibold">

                            Category Image

                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />

                    </div>

                    {preview && (

                        <div>

                            <img
                                src={preview}
                                alt=""
                                className="w-48 h-48 object-cover rounded-xl border"
                            />

                        </div>

                    )}

                    <div>

                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e)=>setActive(e.target.checked)}
                            />

                            Active Category

                        </label>

                    </div>

                    <div className="flex gap-4">

                        <button
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl"
                        >

                            {saving ? "Saving..." : "Save Category"}

                        </button>

                        <button
                            type="button"
                            onClick={()=>navigate("/admin/categories")}
                            className="border px-8 py-3 rounded-xl"
                        >

                            Cancel

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
const categories = [
  { id: 1, name: "Laptops" },
  { id: 2, name: "Printers" },
  { id: 3, name: "Phones" },
  { id: 4, name: "Accessories" },
];

const brands = [
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Samsung",
  "Canon",
];

export default function ShopSidebar({
  category,
  setCategory,
  brand,
  setBrand,
  featured,
  setFeatured,
}) {
  return (
    <aside className="w-full lg:w-72 space-y-6">

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h3 className="text-xl font-bold mb-5">
          Categories
        </h3>

        <div className="space-y-3">

          <button
            type="button"
            onClick={() => setCategory("")}
            className={`block w-full text-left ${
              category === ""
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
            }`}
          >
            All Categories
          </button>

          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(String(item.id))}
              className={`block w-full text-left ${
                category === String(item.id)
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600"
              }`}
            >
              {item.name}
            </button>
          ))}

        </div>

      </div>

      {/* Brands */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h3 className="text-xl font-bold mb-5">
          Brands
        </h3>

        <button
          type="button"
          onClick={() => setBrand("")}
          className="text-blue-600 text-sm mb-4"
        >
          Clear Brand Filter
        </button>

        <div className="space-y-3">

          {brands.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="brand"
                checked={brand === item}
                onChange={() => setBrand(item)}
              />

              {item}
            </label>
          ))}

        </div>

      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h3 className="text-xl font-bold mb-5">
          Availability
        </h3>

        <label className="flex gap-3 items-center">
          <input type="checkbox" />

          In Stock
        </label>

        <label className="flex gap-3 items-center mt-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(e.target.checked)
            }
          />

          Featured
        </label>

        <label className="flex gap-3 items-center mt-3">
          <input type="checkbox" />

          On Sale
        </label>

      </div>

    </aside>
  );
}
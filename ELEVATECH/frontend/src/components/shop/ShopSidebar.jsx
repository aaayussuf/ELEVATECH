import { useState, useEffect } from "react";

import {
  ChevronDown,
  ChevronRight,
  Check,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import categoryService from "../../services/categoryService";

const fallbackCategories = [
  { id: 1, name: "Laptops" },
  { id: 2, name: "Printers" },
  { id: 3, name: "Phones" },
  { id: 4, name: "Accessories" },
];

const knownBrands = [
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Samsung",
  "Canon",
];

function SectionTitle({ icon: Icon, children }) {
  return (
    <h3 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.14em] text-slate-300">
      <Icon size={16} className="text-blue-400" />
      {children}
    </h3>
  );
}

export default function ShopSidebar({
  categories,
  category,
  setCategory,
  brand,
  setBrand,
  featured,
  setFeatured,
  inStock,
  setInStock,
  onSale,
  setOnSale,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  products,
  onClearAll,
}) {
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setLoaded(data);
        }
      })
      .catch(() => {});
  }, []);

  const list = loaded && loaded.length ? loaded : categories;
  const displayCategories = list && list.length
    ? list
    : fallbackCategories;

  const productBrands = Array.from(
    new Set(
      (products || [])
        .map((p) => p?.brand)
        .filter((b) => b && String(b).trim())
    )
  );

  const allBrands = Array.from(
    new Set([...knownBrands, ...productBrands])
  ).sort((a, b) => a.localeCompare(b));

  function chip(label, active, onRemove) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className="w-full flex items-center gap-2 text-sm text-slate-200 group"
      >
        <span
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
            active
              ? "bg-blue-500 border-blue-500 text-white"
              : "border-white/20 text-transparent"
          }`}
        >
          <Check size={13} strokeWidth={3} />
        </span>

        <span className="flex-1 text-left">{label}</span>

        {active && (
          <X
            size={14}
            className="text-slate-500 opacity-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <aside className="w-full lg:w-72 space-y-5">
      {/* Categories */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <SectionTitle icon={ChevronDown}>Categories</SectionTitle>

        <div className="mt-5 space-y-1.5">
          {displayCategories.map((item) => {
            const active = category === String(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(active ? "" : String(item.id))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-[#101C31] border border-blue-400/40 text-white font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.name}
                  {item.products ? (
                    <span className="text-[10px] text-slate-500">
                      {item.products}
                    </span>
                  ) : null}
                </span>

                <ChevronRight
                  size={15}
                  className={active
                    ? "text-blue-400"
                    : "text-slate-600 group-hover:text-white"}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <SectionTitle icon={Tag}>Brands</SectionTitle>

        <div className="mt-5 space-y-1.5">
          {allBrands.map((item) => {
            const active = brand === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setBrand(active ? "" : item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                  active
                    ? "bg-[#101C31] border border-blue-400/40 text-white font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    active
                      ? "border-blue-400"
                      : "border-white/20"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </span>

                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <SectionTitle icon={Sparkles}>Availability</SectionTitle>

        <div className="mt-5 space-y-1.5">
          {chip("In stock", inStock, () => setInStock(!inStock))}

          {chip("On sale", onSale, () => setOnSale(!onSale))}

          {chip(
            "Featured",
            featured,
            () => setFeatured(!featured)
          )}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <SectionTitle icon={SlidersHorizontal}>Price range</SectionTitle>

        <div className="mt-5 flex items-center gap-3">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            className="w-full min-w-0 flex-1 bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5 rounded-xl placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none"
          />

          <span className="text-slate-500">–</span>

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            className="w-full min-w-0 flex-1 bg-white/5 border border-white/10 text-sm text-white px-3 py-2.5 rounded-xl placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none"
          />
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          Prices shown in Kenyan Shillings (KSh).
        </p>
      </div>

      {/* Clear all */}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-400/50 text-slate-300 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition"
        >
          <X size={15} />
          Clear all filters
        </button>
      )}
    </aside>
  );
}
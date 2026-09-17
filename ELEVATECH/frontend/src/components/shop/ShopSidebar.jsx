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
    <h3 className="flex min-w-0 items-center gap-2.5 text-xs font-black uppercase tracking-[0.13em] text-slate-300 sm:text-sm sm:tracking-[0.14em]">
      <Icon size={16} className="shrink-0 text-blue-400" />
      <span className="min-w-0 truncate">{children}</span>
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
    let cancelled = false;
    categoryService
      .getCategories()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) {
          setLoaded(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
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
        aria-pressed={active}
        className="group flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-200 transition hover:bg-white/5"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
            active
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-white/20 text-transparent"
          }`}
        >
          <Check size={13} strokeWidth={3} />
        </span>

        <span className="min-w-0 flex-1 truncate text-left">{label}</span>

        {active && (
          <X
            size={14}
            className="shrink-0 text-slate-500 opacity-60 transition group-hover:text-slate-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <aside className="w-full min-w-0 space-y-3.5 sm:space-y-4 lg:space-y-5">
      {/* CATEGORIES */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <SectionTitle icon={ChevronDown}>Categories</SectionTitle>

        <div className="mt-4 space-y-1 sm:mt-5 sm:space-y-1.5">
          {displayCategories.map((item) => {
            const active = category === String(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(active ? "" : String(item.id))}
                aria-pressed={active}
                className={`group flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition active:scale-[0.99] ${
                  active
                    ? "border border-blue-400/40 bg-[#101C31] font-bold text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="min-w-0 truncate">{item.name}</span>
                  {item.products ? (
                    <span className="shrink-0 text-[10px] text-slate-500">
                      {item.products}
                    </span>
                  ) : null}
                </span>

                <ChevronRight
                  size={15}
                  className={`shrink-0 transition ${
                    active
                      ? "text-blue-400"
                      : "text-slate-600 group-hover:text-white"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANDS */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <SectionTitle icon={Tag}>Brands</SectionTitle>

        <div className="mt-4 space-y-1 sm:mt-5 sm:space-y-1.5">
          {allBrands.map((item) => {
            const active = brand === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setBrand(active ? "" : item)}
                aria-pressed={active}
                className={`flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition active:scale-[0.99] ${
                  active
                    ? "border border-blue-400/40 bg-[#101C31] font-bold text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-blue-400" : "border-white/20"
                  }`}
                >
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  )}
                </span>

                <span className="min-w-0 truncate text-left">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <SectionTitle icon={Sparkles}>Availability</SectionTitle>

        <div className="mt-4 space-y-1 sm:mt-5 sm:space-y-1.5">
          {chip("In stock", inStock, () => setInStock(!inStock))}

          {chip("On sale", onSale, () => setOnSale(!onSale))}

          {chip(
            "Featured",
            featured,
            () => setFeatured(!featured)
          )}
        </div>
      </div>

      {/* PRICE */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <SectionTitle icon={SlidersHorizontal}>Price range</SectionTitle>

        <div className="mt-4 grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:mt-5 sm:gap-3">
          <div className="min-w-0">
            <label htmlFor="shop-min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="shop-min-price"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="min-h-11 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.07]"
            />
          </div>

          <span className="shrink-0 text-slate-500" aria-hidden="true">–</span>

          <div className="min-w-0">
            <label htmlFor="shop-max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="shop-max-price"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="min-h-11 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.07]"
            />
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
          Prices shown in Kenyan Shillings (KSh).
        </p>
      </div>

      {/* CLEAR ALL */}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.99] sm:rounded-2xl"
        >
          <X size={15} className="shrink-0" />
          Clear all filters
        </button>
      )}
    </aside>
  );
}
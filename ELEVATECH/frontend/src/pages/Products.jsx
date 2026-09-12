import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Headphones,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import ShopSidebar from "../components/shop/ShopSidebar";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import { CartContext } from "../context/CartContext";

const PER_PAGE = 12;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const trustItems = [
  { icon: BadgeCheck, label: "100% genuine products" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Truck, label: "Kenya-wide delivery" },
  { icon: Headphones, label: "Expert support" },
];

const fallbackCategories = [
  { id: 1, name: "Laptops" },
  { id: 2, name: "Printers" },
  { id: 3, name: "Phones" },
  { id: 4, name: "Accessories" },
];

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(() => {
    const raw = Number(searchParams.get("page") || 1);
    return raw > 0 ? raw : 1;
  });

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [brand, setBrand] = useState(
    searchParams.get("brand") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "newest"
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("min_price") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("max_price") || ""
  );

  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true"
  );

  const [inStock, setInStock] = useState(
    searchParams.get("in_stock") === "true"
  );

  const [onSale, setOnSale] = useState(
    searchParams.get("on_sale") === "true"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const filters = {
          search,
          category,
          brand,
          sort,
          min_price: minPrice,
          max_price: maxPrice,
          page,
          per_page: PER_PAGE,
        };

        if (featured) {
          filters.featured = "true";
        }

        if (inStock) {
          filters.in_stock = "true";
        }

        if (onSale) {
          filters.on_sale = "true";
        }

        const data = await productService.getProducts(filters);

        if (cancelled) {
          return;
        }

        if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
          setPages(1);
          setPage(1);
        } else {
          setProducts(data.products || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
          setPage(data.page || 1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Products error:", err);
          setError(err?.message || "Unable to load products.");
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    category,
    brand,
    sort,
    minPrice,
    maxPrice,
    featured,
    inStock,
    onSale,
    page,
    retry,
  ]);

  function updateUrl(updates) {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== false
      ) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
    updateUrl({ search: value, page: 1 });
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
    updateUrl({ category: value, page: 1 });
  }

  function handleBrandChange(value) {
    setBrand(value);
    setPage(1);
    updateUrl({ brand: value, page: 1 });
  }

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
    updateUrl({ sort: value, page: 1 });
  }

  function handleMinPriceChange(value) {
    setMinPrice(value);
    setPage(1);
    updateUrl({ min_price: value, page: 1 });
  }

  function handleMaxPriceChange(value) {
    setMaxPrice(value);
    setPage(1);
    updateUrl({ max_price: value, page: 1 });
  }

  function handleFeaturedChange(value) {
    setFeatured(value);
    setPage(1);
    updateUrl({ featured: value, page: 1 });
  }

  function handleInStockChange(value) {
    setInStock(value);
    setPage(1);
    updateUrl({ in_stock: value, page: 1 });
  }

  function handleOnSaleChange(value) {
    setOnSale(value);
    setPage(1);
    updateUrl({ on_sale: value, page: 1 });
  }

  function handlePageChange(value) {
    setPage(value);
    updateUrl({ page: value });
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);
    setInStock(false);
    setOnSale(false);
    setPage(1);

    setSearchParams({});
  }

  function handleAddToCart(product) {
    const inStockProduct =
      product.in_stock ??
      Number(product.quantity || 0) > 0;

    if (!inStockProduct) {
      return;
    }

    addToCart(product);
    alert(`${product.name} added to cart.`);
  }

  const activeCategories =
    categories.length ? categories : fallbackCategories;

  function categoryName(id) {
    const match = activeCategories.find(
      (item) => String(item.id) === String(id)
    );

    return match ? match.name : `Category ${id}`;
  }

  const hasActiveFilters = Boolean(
    search ||
    category ||
    brand ||
    featured ||
    inStock ||
    onSale ||
    minPrice ||
    maxPrice
  );

  const chips = [];

  if (search) {
    chips.push({
      key: "search",
      label: `\u201C${search}\u201D`,
      onRemove: () => handleSearchChange(""),
    });
  }

  if (category) {
    chips.push({
      key: "category",
      label: categoryName(category),
      onRemove: () => handleCategoryChange(""),
    });
  }

  if (brand) {
    chips.push({
      key: "brand",
      label: brand,
      onRemove: () => handleBrandChange(""),
    });
  }

  if (minPrice) {
    chips.push({
      key: "min_price",
      label: `From KSh ${Number(minPrice).toLocaleString()}`,
      onRemove: () => handleMinPriceChange(""),
    });
  }

  if (maxPrice) {
    chips.push({
      key: "max_price",
      label: `Up to KSh ${Number(maxPrice).toLocaleString()}`,
      onRemove: () => handleMaxPriceChange(""),
    });
  }

  if (featured) {
    chips.push({
      key: "featured",
      label: "Featured",
      onRemove: () => handleFeaturedChange(false),
    });
  }

  if (inStock) {
    chips.push({
      key: "in_stock",
      label: "In stock",
      onRemove: () => handleInStockChange(false),
    });
  }

  if (onSale) {
    chips.push({
      key: "on_sale",
      label: "On sale",
      onRemove: () => handleOnSaleChange(false),
    });
  }

  function pageNumbers(current, totalPages) {
    if (totalPages <= 1) {
      return [];
    }

    const end = Math.min(
      totalPages,
      Math.max(current + 2, 5)
    );
    const start = Math.max(1, end - 4);
    const out = [];

    for (let i = start; i <= end; i += 1) {
      out.push(i);
    }

    return out;
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white">

      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-24 right-0 w-80 h-80 rounded-full bg-yellow-400/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-14">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Products</span>
          </nav>

          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-blue-300">
              <ShieldCheck size={13} />
              Trusted technology store
            </span>

            <h1 className="mt-4 text-3xl min-[480px]:text-4xl sm:text-5xl font-black tracking-tight text-balance">
              Shop technology you can{" "}
              <span className="text-yellow-400">trust.</span>
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400 leading-7">
              Genuine laptops, phones, printers and accessories from the
              brands you know — with real warranties, secure checkout and
              delivery across Kenya.
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-7">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search for laptops, phones, printers and more..."
              value={search}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 focus:border-blue-400/60 focus:outline-none text-white placeholder:text-slate-500 rounded-2xl pl-12 pr-4 py-4 text-base"
            />
          </div>

          {/* Quick categories */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Popular:
            </span>

            {activeCategories.slice(0, 4).map((item) => {
              const active = category === String(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      active ? "" : String(item.id)
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition ${
                    active
                      ? "bg-yellow-400 text-black font-bold"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Trust bar */}
          <div className="grid grid-cols-2 xl:grid-cols-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden mt-8">
            {trustItems.map(
              ({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    index ? "border-l border-white/10" : ""
                  } ${
                    index >= 2
                      ? "border-t border-white/10 xl:border-t-0"
                      : ""
                  }`}
                >
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Icon size={18} className="text-blue-300" />
                  </span>

                  <span className="text-xs sm:text-sm font-semibold leading-5 text-slate-200">
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ============================= CATALOG ============================= */}
      <section className="bg-[#07101D] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Sidebar — desktop */}
          <div className="hidden lg:block lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <ShopSidebar
                categories={activeCategories}
                category={category}
                setCategory={handleCategoryChange}
                brand={brand}
                setBrand={handleBrandChange}
                featured={featured}
                setFeatured={handleFeaturedChange}
                inStock={inStock}
                setInStock={handleInStockChange}
                onSale={onSale}
                setOnSale={handleOnSaleChange}
                minPrice={minPrice}
                setMinPrice={handleMinPriceChange}
                maxPrice={maxPrice}
                setMaxPrice={handleMaxPriceChange}
                products={products}
                onClearAll={clearFilters}
              />
            </div>
          </div>

          {/* Mobile filter drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-[#07101D] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <p className="flex items-center gap-2 font-black text-white">
                    <SlidersHorizontal size={18} className="text-yellow-400" />
                    Filters
                  </p>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-200"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ShopSidebar
                    categories={activeCategories}
                    category={category}
                    setCategory={handleCategoryChange}
                    brand={brand}
                    setBrand={handleBrandChange}
                    featured={featured}
                    setFeatured={handleFeaturedChange}
                    inStock={inStock}
                    setInStock={handleInStockChange}
                    onSale={onSale}
                    setOnSale={handleOnSaleChange}
                    minPrice={minPrice}
                    setMinPrice={handleMinPriceChange}
                    maxPrice={maxPrice}
                    setMaxPrice={handleMaxPriceChange}
                    products={products}
                    onClearAll={clearFilters}
                  />
                </div>
                <div className="border-t border-white/10 p-4">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="min-h-[52px] w-full rounded-2xl bg-yellow-400 font-black text-black transition hover:bg-yellow-300"
                  >
                    Show {total} result{total === 1 ? "" : "s"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">

            {/* Results / sort bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center gap-3">
              <div className="min-w-0">
                <h2 className="font-black text-white text-lg">
                  {loading
                    ? "Loading products..."
                    : `${total} products found`}
                </h2>

                {!loading && total > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {products.length} of {total}{" "}
                    {hasActiveFilters
                      ? "with active filters"
                      : "in the collection"}
                  </p>
                )}
              </div>

              <div className="flex w-full min-[480px]:w-auto min-[480px]:ml-auto items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex min-h-[44px] flex-1 min-[480px]:flex-none items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-white transition hover:bg-white/10 lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {chips.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[11px] font-black text-black">
                      {chips.length}
                    </span>
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="hidden min-h-[44px] items-center gap-1.5 px-2 text-sm font-semibold text-red-300 hover:text-red-400 transition sm:inline-flex"
                  >
                    <X size={15} />
                    Clear
                  </button>
                )}

                <label className="sr-only" htmlFor="sort">
                  Sort products
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) =>
                    handleSortChange(e.target.value)
                  }
                  className="min-h-[44px] flex-1 min-[480px]:flex-none bg-[#0B1628] border border-white/10 text-white text-sm font-semibold rounded-xl px-3.5 focus:border-blue-400/60 focus:outline-none [color-scheme:dark]"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Filters:
                </span>

                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-red-500/20 hover:text-red-200 transition"
                  >
                    {chip.label}
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 rounded-2xl p-6 mt-8">
                <p className="font-black">
                  Unable to load products
                </p>

                <p className="text-sm mt-2">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setRetry(retry + 1)}
                  className="mt-4 bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && !error && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8" aria-label="Loading products">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-white/10" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-24 bg-white/10 rounded" />
                      <div className="h-4 w-full bg-white/10 rounded" />
                      <div className="h-4 w-2/3 bg-white/10 rounded" />
                      <div className="h-10 bg-white/10 rounded-xl" />
                      <div className="h-11 bg-blue-600/20 rounded-2xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-16 sm:p-20 text-center mt-8">
                <span className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles size={32} className="text-blue-300" />
                </span>

                <h2 className="mt-6 text-2xl sm:text-3xl font-black text-white">
                  No products found
                </h2>

                <p className="mt-2 text-slate-400 leading-6">
                  Try a different search, or remove some filters to
                  see more of the collection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Clear all filters
                </button>

              </div>
            )}

            {/* Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">

                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}

              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ArrowRight size={16} className="rotate-180" />
                </button>

                {pageNumbers(page, pages).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePageChange(num)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                      num === page
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => handlePageChange(page + 1)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ArrowRight size={16} />
                </button>

              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}


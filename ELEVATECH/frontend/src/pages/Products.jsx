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
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [featured, setFeatured] = useState(searchParams.get("featured") === "true");
  const [inStock, setInStock] = useState(searchParams.get("in_stock") === "true");
  const [onSale, setOnSale] = useState(searchParams.get("on_sale") === "true");
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
  }, [search, category, brand, sort, minPrice, maxPrice, featured, inStock, onSale, page, retry]);
  function updateUrl(updates) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined && value !== false) {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const inStockProduct = product.in_stock ?? Number(product.quantity || 0) > 0;
    if (!inStockProduct) {
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }
  const activeCategories = categories.length ? categories : fallbackCategories;
  function categoryName(id) {
    const match = activeCategories.find((item) => String(item.id) === String(id));
    return match ? match.name : `Category ${id}`;
  }
  const hasActiveFilters = Boolean(search || category || brand || featured || inStock || onSale || minPrice || maxPrice);
  const chips = [];
  if (search) {
    chips.push({ key: "search", label: `"${search}"`, onRemove: () => handleSearchChange("") });
  }
  if (category) {
    chips.push({ key: "category", label: categoryName(category), onRemove: () => handleCategoryChange("") });
  }
  if (brand) {
    chips.push({ key: "brand", label: brand, onRemove: () => handleBrandChange("") });
  }
  if (minPrice) {
    chips.push({ key: "min_price", label: `From KSh ${Number(minPrice).toLocaleString()}`, onRemove: () => handleMinPriceChange("") });
  }
  if (maxPrice) {
    chips.push({ key: "max_price", label: `Up to KSh ${Number(maxPrice).toLocaleString()}`, onRemove: () => handleMaxPriceChange("") });
  }
  if (featured) {
    chips.push({ key: "featured", label: "Featured", onRemove: () => handleFeaturedChange(false) });
  }
  if (inStock) {
    chips.push({ key: "in_stock", label: "In stock", onRemove: () => handleInStockChange(false) });
  }
  if (onSale) {
    chips.push({ key: "on_sale", label: "On sale", onRemove: () => handleOnSaleChange(false) });
  }
  function pageNumbers(current, totalPages) {
    if (totalPages <= 1) {
      return [];
    }
    const end = Math.min(totalPages, Math.max(current + 2, 5));
    const start = Math.max(1, end - 4);
    const out = [];
    for (let i = start; i <= end; i += 1) {
      out.push(i);
    }
    return out;
  }
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050B14] text-white">
      <section className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-yellow-400/5 blur-3xl sm:h-80 sm:w-80" />
        <div className="relative mx-auto w-full max-w-7xl px-3 pb-9 pt-6 sm:px-5 sm:pb-12 sm:pt-8 md:px-6 md:pb-14 lg:px-8 lg:pb-16 lg:pt-10">
          <nav className="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-slate-400 sm:text-sm" aria-label="Breadcrumb">
            <Link to="/" className="shrink-0 transition hover:text-white">Home</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="truncate text-white">Products</span>
          </nav>
          <div className="mt-6 min-w-0 sm:mt-8">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-blue-300 sm:text-[11px] sm:tracking-[0.16em]">
              <ShieldCheck size={13} className="shrink-0" />
              <span className="truncate">Trusted technology store</span>
            </span>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.04] tracking-tight min-[375px]:text-4xl sm:text-5xl md:text-6xl">
              Shop technology you can <span className="text-yellow-400">trust.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 md:text-lg md:leading-8">
              Genuine laptops, phones, printers and accessories from the brands you know — with real warranties, secure checkout and delivery across Kenya.
            </p>
          </div>
          <div className="relative mt-6 sm:mt-7 md:max-w-4xl">
            <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input id="product-search" type="text" placeholder="Search for laptops, phones, printers and more..." value={search} onChange={(e) => handleSearchChange(e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.07] sm:py-4 sm:text-base" />
          </div>
          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:text-[11px] sm:tracking-[0.14em]">Popular:</span>
            {activeCategories.slice(0, 4).map((item) => {
              const active = category === String(item.id);
              return (
                <button key={item.id} type="button" onClick={() => handleCategoryChange(active ? "" : String(item.id))} className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-xs transition active:scale-[0.98] sm:min-h-11 sm:px-3.5 sm:text-sm ${active ? "bg-yellow-400 font-bold text-black" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="mt-7 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, label }, index) => (
              <div key={label} className={`flex min-w-0 items-center gap-3 px-4 py-3.5 sm:px-5 ${index > 0 ? "border-t border-white/10 min-[480px]:border-t-0" : ""} ${index % 2 === 1 ? "min-[480px]:border-l min-[480px]:border-white/10" : ""} ${index >= 2 ? "lg:border-l lg:border-white/10" : ""}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon size={18} className="text-blue-300" />
                </span>
                <span className="min-w-0 text-xs font-semibold leading-5 text-slate-200 sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full overflow-hidden bg-[#07101D] py-7 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 px-3 sm:px-5 md:px-6 lg:flex-row lg:gap-7 lg:px-8 xl:gap-8">
          <div className="hidden shrink-0 lg:block lg:w-64 xl:w-72">
            <div className="sticky top-24">
              <ShopSidebar categories={activeCategories} category={category} setCategory={handleCategoryChange} brand={brand} setBrand={handleBrandChange} featured={featured} setFeatured={handleFeaturedChange} inStock={inStock} setInStock={handleInStockChange} onSale={onSale} setOnSale={handleOnSaleChange} minPrice={minPrice} setMinPrice={handleMinPriceChange} maxPrice={maxPrice} setMaxPrice={handleMaxPriceChange} products={products} onClearAll={clearFilters} />
            </div>
          </div>
          {filtersOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
              <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div className="absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col overflow-hidden bg-[#07101D] shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
                  <p className="flex items-center gap-2 font-black text-white">
                    <SlidersHorizontal size={18} className="text-yellow-400" />
                    Filters
                  </p>
                  <button type="button" onClick={() => setFiltersOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:bg-white/5" aria-label="Close filters">
                    <X size={20} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <ShopSidebar categories={activeCategories} category={category} setCategory={handleCategoryChange} brand={brand} setBrand={handleBrandChange} featured={featured} setFeatured={handleFeaturedChange} inStock={inStock} setInStock={handleInStockChange} onSale={onSale} setOnSale={handleOnSaleChange} minPrice={minPrice} setMinPrice={handleMinPriceChange} maxPrice={maxPrice} setMaxPrice={handleMaxPriceChange} products={products} onClearAll={clearFilters} />
                </div>
                <div className="shrink-0 border-t border-white/10 p-4">
                  <button type="button" onClick={() => setFiltersOpen(false)} className="min-h-12 w-full rounded-2xl bg-yellow-400 px-4 font-black text-black transition hover:bg-yellow-300 active:scale-[0.99]">
                    Show {total} result{total === 1 ? "" : "s"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-white sm:text-lg">
                  {loading ? "Loading products..." : `${total} products found`}
                </h2>
                {!loading && total > 0 && (
                  <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                    Showing {products.length} of {total} {hasActiveFilters ? "with active filters" : "in the collection"}
                  </p>
                )}
              </div>
              <div className="flex w-full min-w-0 gap-2 min-[480px]:w-auto">
                <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-white transition hover:bg-white/10 min-[480px]:flex-none sm:px-4 sm:text-sm lg:hidden">
                  <SlidersHorizontal size={16} className="shrink-0" />
                  <span>Filters</span>
                  {chips.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black text-black">{chips.length}</span>
                  )}
                </button>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="hidden min-h-11 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-400 sm:inline-flex">
                    <X size={15} />
                    Clear
                  </button>
                )}
                <label className="sr-only" htmlFor="sort">Sort products</label>
                <select id="sort" value={sort} onChange={(e) => handleSortChange(e.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B1628] px-3 text-xs font-semibold text-white outline-none focus:border-blue-400/60 min-[480px]:w-auto min-[480px]:flex-none sm:px-3.5 sm:text-sm [color-scheme:dark]">
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {chips.length > 0 && (
              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 sm:mt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 sm:text-[11px] sm:tracking-[0.14em]">Filters:</span>
                {chips.map((chip) => (
                  <button key={chip.key} type="button" onClick={chip.onRemove} className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-red-500/20 hover:text-red-200 sm:text-xs">
                    <span className="min-w-0 truncate">{chip.label}</span>
                    <X size={12} className="shrink-0" />
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-300 sm:mt-8 sm:p-6">
                <p className="font-black">Unable to load products</p>
                <p className="mt-2 break-words text-sm leading-6">{error}</p>
                <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 min-h-11 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 active:scale-[0.99]">
                  Try Again
                </button>
              </div>
            )}
            {loading && !error && (
              <div className="mt-6 grid min-w-0 grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:gap-5" aria-label="Loading products">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-pulse sm:rounded-3xl">
                    <div className="aspect-[4/3] bg-white/10" />
                    <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
                      <div className="h-2.5 w-20 rounded bg-white/10 sm:h-3 sm:w-24" />
                      <div className="h-3.5 w-full rounded bg-white/10 sm:h-4" />
                      <div className="h-3.5 w-2/3 rounded bg-white/10 sm:h-4" />
                      <div className="h-9 rounded-xl bg-white/10 sm:h-10" />
                      <div className="h-11 rounded-2xl bg-blue-600/20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center sm:mt-8 sm:rounded-3xl sm:p-12 md:p-16">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-16 sm:w-16">
                  <Sparkles size={28} className="text-blue-300 sm:h-8 sm:w-8" />
                </span>
                <h2 className="mt-5 text-xl font-black text-white sm:mt-6 sm:text-3xl">No products found</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Try a different search, or remove some filters to see more of the collection.
                </p>
                <button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99] sm:mt-6 sm:px-6">
                  Clear all filters
                </button>
              </div>
            )}
            {!loading && !error && products.length > 0 && (
              <div className="mt-5 grid min-w-0 grid-cols-2 gap-2.5 min-[375px]:gap-3 min-[480px]:gap-4 sm:mt-7 md:grid-cols-3 lg:gap-5 xl:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="min-w-0">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && pages > 1 && (
              <div className="mt-8 flex min-w-0 flex-wrap items-center justify-center gap-1.5 sm:mt-10 sm:gap-2" aria-label="Pagination">
                <button type="button" disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
                  <ArrowRight size={16} className="rotate-180" />
                </button>
                {pageNumbers(page, pages).map((num) => (
                  <button key={num} type="button" onClick={() => handlePageChange(num)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${num === page ? "bg-blue-600 text-white" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                    {num}
                  </button>
                ))}
                <button type="button" disabled={page >= pages} onClick={() => handlePageChange(page + 1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
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


import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import ShopSidebar from "../components/shop/ShopSidebar";
import productService from "../services/productService";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, [
    search,
    category,
    brand,
    sort,
    minPrice,
    maxPrice,
    featured,
  ]);

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
      };

      if (featured) {
        filters.featured = "true";
      }

      const data = await productService.getProducts(filters);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Products error:", err);
      setError(
        err?.message || "Unable to load products."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

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
    updateUrl({ search: value });
  }

  function handleCategoryChange(value) {
    setCategory(value);
    updateUrl({ category: value });
  }

  function handleBrandChange(value) {
    setBrand(value);
    updateUrl({ brand: value });
  }

  function handleSortChange(value) {
    setSort(value);
    updateUrl({ sort: value });
  }

  function handleMinPriceChange(value) {
    setMinPrice(value);
    updateUrl({ min_price: value });
  }

  function handleMaxPriceChange(value) {
    setMaxPrice(value);
    updateUrl({ max_price: value });
  }

  function handleFeaturedChange(value) {
    setFeatured(value);
    updateUrl({ featured: value });
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);

    setSearchParams({});
  }

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500">
            Home / Shop
          </p>

          <h1 className="text-5xl font-black mt-2">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Browse our latest electronics and accessories.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <ShopSidebar
            category={category}
            setCategory={handleCategoryChange}
            brand={brand}
            setBrand={handleBrandChange}
            featured={featured}
            setFeatured={handleFeaturedChange}
          />

          {/* Products */}
          <div className="flex-1">

            {/* Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">

              <div>
                <h2 className="font-bold text-xl">
                  {loading
                    ? "Loading products..."
                    : `${products.length} Products Found`}
                </h2>

                {!loading && (
                  <p className="text-sm text-gray-500 mt-1">
                    Browse, filter and add products to your cart.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>

            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                <input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                />

                <select
                  value={category}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                >
                  <option value="">
                    All Categories
                  </option>

                  <option value="1">
                    Laptops
                  </option>

                  <option value="2">
                    Printers
                  </option>

                  <option value="3">
                    Phones
                  </option>

                  <option value="4">
                    Accessories
                  </option>
                </select>

                <input
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) =>
                    handleBrandChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Minimum price"
                  value={minPrice}
                  onChange={(e) =>
                    handleMinPriceChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Maximum price"
                  value={maxPrice}
                  onChange={(e) =>
                    handleMaxPriceChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                />

                <select
                  value={sort}
                  onChange={(e) =>
                    handleSortChange(e.target.value)
                  }
                  className="border rounded-lg p-3"
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="price_asc">
                    Price ↑
                  </option>

                  <option value="price_desc">
                    Price ↓
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                  <option value="bestseller">
                    Best Seller
                  </option>
                </select>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-8">
                <p className="font-semibold">
                  Unable to load products
                </p>

                <p className="text-sm mt-1">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && !error && (
              <div className="bg-white rounded-2xl p-16 text-center">
                <p className="text-gray-500">
                  Loading products...
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-2xl p-20 text-center">

                <h2 className="text-3xl font-bold">
                  No products found
                </h2>

                <p className="text-gray-500 mt-3">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>

              </div>
            )}

            {/* Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


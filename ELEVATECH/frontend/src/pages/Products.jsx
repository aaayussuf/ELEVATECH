import { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ShopSidebar from "../components/shop/ShopSidebar";
import productService from "../services/productService";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [
    search,
    category,
    brand,
    sort,
    minPrice,
    maxPrice,
  ]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await productService.getProducts({
        search,
        category,
        brand,
        sort,
        min_price: minPrice,
        max_price: maxPrice,
      });

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
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

      </div>

    </div>

    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex gap-8">

        {/* Sidebar */}

        <ShopSidebar
          brand={brand}
          setBrand={setBrand}
          featured={featured}
          setFeatured={setFeatured}
        />

        {/* Products */}

        <div className="flex-1">

          {/* Top Bar */}

          <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">

            <h2 className="font-bold text-xl">
              {products.length} Products Found
            </h2>

          </div>

          {/* Filter Bar */}

          <div className="grid md:grid-cols-6 gap-4 mb-10">

            <input
              placeholder="Search..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="border rounded-lg p-3"
            />

            <select
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="border rounded-lg p-3"
            >
              <option value="">All Categories</option>
              <option>Laptops</option>
              <option>Phones</option>
              <option>Printers</option>
              <option>Accessories</option>
            </select>

            <input
              placeholder="Brand"
              value={brand}
              onChange={(e)=>setBrand(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e)=>setMinPrice(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e)=>setMaxPrice(e.target.value)}
              className="border rounded-lg p-3"
            />

            <select
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
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

          {/* Grid */}

          {products.length === 0 ? (

            <div className="bg-white rounded-2xl p-20 text-center">

              <h2 className="text-3xl font-bold">
                No products found
              </h2>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {products.map(product => (

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

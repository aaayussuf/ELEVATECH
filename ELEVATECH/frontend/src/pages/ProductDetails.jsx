import { useContext, useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useParams } from "react-router-dom";

import productService from "../services/productService";
import ProductActions from "../components/products/ProductActions";
import RecentlyViewed from "../components/products/RecentlyViewed";
import ReviewSection from "../components/products/ReviewSection";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function ProductDetails() {
  const { slug } = useParams();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    let viewed =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    viewed = viewed.filter((p) => p.id !== product.id);

    viewed.unshift(product);

    viewed = viewed.slice(0, 8);

    localStorage.setItem(
      "recentProducts",
      JSON.stringify(viewed)
    );
  }, [product]);

  async function loadProduct() {
    try {
      setLoading(true);

      const data = await productService.getProduct(slug);

      setProduct(data);
      setQuantity(1);
    } catch (err) {
      console.error("Product details error:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product) return;

    const stock = Number(product.quantity || 0);

    if (stock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    if (quantity > stock) {
      alert(`Only ${stock} units are available.`);
      return;
    }

    addToCart({
      ...product,
      quantity,
    });

    alert(
      `${quantity} × ${product.name} added to cart.`
    );
  }

  function increaseQuantity() {
    const stock = Number(product?.quantity || 0);

    if (quantity >= stock) {
      return;
    }

    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  }

  function handleWishlist() {
    if (!product) return;

    toggleWishlist(product);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-10">
        <h2 className="text-2xl font-bold">
          Loading product...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-100 p-10">
        <h2 className="text-2xl font-bold">
          Product not found.
        </h2>

        <p className="text-gray-500 mt-2">
          The product may have been removed or is unavailable.
        </p>
      </div>
    );
  }

  const stock = Number(product.quantity || 0);

  const saved = wishlist?.some(
    (item) => item.id === product.id
  );

  const hasDiscount = Boolean(product.has_discount);

  const price = Number(product.price || 0);

  const discountPrice = Number(
    product.discount_price || 0
  );

  const savings =
    hasDiscount && discountPrice
      ? price - discountPrice
      : 0;

  return (
    <div className="bg-slate-100 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* PRODUCT IMAGE */}

          <div>
            <div className="bg-white rounded-2xl p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-[600px] object-contain rounded-xl"
              />
            </div>
          </div>

          {/* PRODUCT INFORMATION */}

          <div>

            <p className="text-blue-600 font-semibold">
              {product.brand}
            </p>

            <h1 className="text-5xl font-black mt-2">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="flex items-center gap-3 mt-3">

              <div className="text-yellow-500 text-xl">
                ⭐⭐⭐⭐⭐
              </div>

              <span className="font-semibold">
                {product.rating || "4.8"}
              </span>

              <span className="text-gray-500">
                ({product.reviews || 0} Reviews)
              </span>

            </div>

            {/* Discount */}

            {hasDiscount && (
              <div className="inline-flex bg-red-600 text-white px-4 py-2 rounded-full font-bold mt-6">
                SAVE {product.discount_percent}%
              </div>
            )}

            {/* PRICE */}

            <div className="mt-6">

              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-5">

                    <h2 className="text-5xl font-black text-blue-600">
                      KSh{" "}
                      {discountPrice.toLocaleString()}
                    </h2>

                    <span className="line-through text-2xl text-gray-400">
                      KSh {price.toLocaleString()}
                    </span>

                  </div>

                  <p className="text-green-600 mt-2 font-semibold">
                    You save KSh{" "}
                    {savings.toLocaleString()}
                  </p>
                </>
              ) : (
                <h2 className="text-5xl font-black text-blue-600">
                  KSh {price.toLocaleString()}
                </h2>
              )}

            </div>

            {/* STOCK */}

            <div className="mt-6">

              {stock > 10 ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  ✔ In Stock
                </span>
              ) : stock > 0 ? (
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                  Only {stock} left
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                  Out of Stock
                </span>
              )}

            </div>

            {/* DELIVERY */}

            <div className="mt-8 bg-blue-50 rounded-xl p-5">

              <h4 className="font-bold text-lg">
                Delivery
              </h4>

              <p className="text-gray-600 mt-2">
                Nairobi: 1-2 Days
              </p>

              <p className="text-gray-600">
                Other Counties: 2-4 Days
              </p>

            </div>

            {/* PAYMENT */}

            <div className="mt-8">

              <h4 className="font-bold mb-4">
                Secure Payments
              </h4>

              <div className="flex gap-4 flex-wrap">

                <span className="px-5 py-3 rounded-xl bg-green-100 font-semibold">
                  M-Pesa
                </span>

                <span className="px-5 py-3 rounded-xl bg-blue-100 font-semibold">
                  Visa
                </span>

                <span className="px-5 py-3 rounded-xl bg-purple-100 font-semibold">
                  MasterCard
                </span>

                <span className="px-5 py-3 rounded-xl bg-gray-100 font-semibold">
                  Stripe
                </span>

              </div>

            </div>

            {/* DESCRIPTION */}

            <p className="mt-8 text-gray-600 leading-8">
              {product.description ||
                "No description available."}
            </p>

            {/* BASIC DETAILS */}

            <div className="mt-10 space-y-3">

              <p>
                <strong>Category:</strong>{" "}
                {product.category || "-"}
              </p>

              <p>
                <strong>Brand:</strong>{" "}
                {product.brand || "-"}
              </p>

              <p>
                <strong>SKU:</strong>{" "}
                {product.sku || "-"}
              </p>

            </div>

            {/* QUANTITY */}

            <div className="mt-10">

              <label className="font-semibold">
                Quantity
              </label>

              <div className="flex items-center gap-4 mt-3">

                <button
                  onClick={decreaseQuantity}
                  disabled={stock <= 0 || quantity <= 1}
                  className="w-10 h-10 rounded-lg border bg-white disabled:opacity-40"
                >
                  -
                </button>

                <span className="text-xl font-bold min-w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={
                    stock <= 0 || quantity >= stock
                  }
                  className="w-10 h-10 rounded-lg border bg-white disabled:opacity-40"
                >
                  +
                </button>

              </div>

            </div>

            {/* MAIN ACTIONS */}

            <div className="flex gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />

                {stock <= 0
                  ? "Out of Stock"
                  : "Add To Cart"}
              </button>

              <button
                disabled={stock <= 0}
                className="border bg-white px-8 py-4 rounded-xl disabled:opacity-50"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlist}
                className="border bg-white p-4 rounded-xl"
                aria-label="Add to wishlist"
              >
                <Heart
                  fill={saved ? "red" : "none"}
                  color="red"
                />
              </button>

            </div>

            {/* EXISTING PRODUCT ACTIONS */}

            <ProductActions product={product} />

            {/* BENEFITS */}

            <div className="grid grid-cols-2 gap-4 mt-10">

              <div className="bg-gray-100 rounded-xl p-5 text-center">
                🚚
                <h4 className="font-bold mt-2">
                  Free Delivery
                </h4>
              </div>

              <div className="bg-gray-100 rounded-xl p-5 text-center">
                🔒
                <h4 className="font-bold mt-2">
                  Secure Checkout
                </h4>
              </div>

              <div className="bg-gray-100 rounded-xl p-5 text-center">
                ↩
                <h4 className="font-bold mt-2">
                  Easy Returns
                </h4>
              </div>

              <div className="bg-gray-100 rounded-xl p-5 text-center">
                ✔
                <h4 className="font-bold mt-2">
                  Genuine Products
                </h4>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* TABS */}

      <section className="max-w-7xl mx-auto mt-20 px-6">

        <div className="border-b flex gap-10">

          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 font-semibold ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-4 font-semibold ${
              activeTab === "specifications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Specifications
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 font-semibold ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Reviews
          </button>

        </div>

        <div className="bg-white rounded-b-2xl shadow p-8">

          {activeTab === "description" && (
            <div>

              <h3 className="text-2xl font-bold mb-4">
                Product Description
              </h3>

              <p className="text-gray-600 leading-8">
                {product.description ||
                  "No description available."}
              </p>

            </div>
          )}

          {activeTab === "specifications" && (
            <table className="w-full">

              <tbody>

                <tr className="border-b">
                  <td className="py-4 font-semibold">
                    Brand
                  </td>

                  <td>
                    {product.brand || "-"}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-4 font-semibold">
                    Category
                  </td>

                  <td>
                    {product.category || "-"}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-4 font-semibold">
                    Warranty
                  </td>

                  <td>
                    {product.warranty || "1 Year"}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-4 font-semibold">
                    SKU
                  </td>

                  <td>
                    {product.sku || "-"}
                  </td>
                </tr>

              </tbody>

            </table>
          )}

          {activeTab === "reviews" && (
            <ReviewSection productId={product.id} />
          )}

        </div>

      </section>

      {/* RECENTLY VIEWED */}

      <div className="max-w-7xl mx-auto px-6">

        <RecentlyViewed />

      </div>

    </div>
  );
}


import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import productService from "../services/productService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const FREE_DELIVERY_THRESHOLD = 5000;

const FALLBACK_IMAGE = "https://placehold.co/500x500?text=ElevaTech";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function formatPrice(value) {
  return `KSh ${Number(value || 0).toLocaleString()}`;
}

function hasDiscount(item) {
  return Boolean(
    item?.has_discount &&
      Number(item.discount_price) > 0 &&
      Number(item.discount_price) < Number(item.price)
  );
}

function getUnitPrice(item) {
  return hasDiscount(item)
    ? Number(item.discount_price)
    : Number(item.price || 0);
}

// ----------------------------------------------------------------
// Page sub-components
// ----------------------------------------------------------------

function CartHeader({ totalItems }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-gray-500">Home / Cart</p>

        <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl min-[480px]:text-4xl sm:text-5xl font-black mt-2 text-balance">Your Cart</h1>

            <p className="text-gray-500 mt-2">
              {totalItems > 0
                ? `${totalItems} item${totalItems === 1 ? "" : "s"} in your cart`
                : "Add items to get started"}
            </p>
          </div>

          <div className="hidden min-[480px]:flex w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center shrink-0">
            <ShoppingCart size={26} className="text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

function Recommendations({ suggestions, onAdd }) {
  if (!suggestions.length) return null;

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-blue-600 font-bold text-sm">
            Complete your order
          </p>

          <h2 className="text-3xl font-black mt-1">You may also like</h2>
        </div>

        <Link
          to="/products"
          className="text-blue-600 font-bold hover:text-blue-700 transition hidden sm:block"
        >
          View all products &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {suggestions.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
          >
            <Link to={`/product/${product.slug}`} className="block flex-1">
              <div className="p-4 pb-0">
                <img
                  src={product.image || FALLBACK_IMAGE}
                  alt={product.name}
                  className="w-full h-40 object-contain"
                />
              </div>

              <div className="p-5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {product.brand}
                </p>

                <h3 className="font-bold mt-1 line-clamp-2">{product.name}</h3>

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="font-black text-blue-600">
                    {formatPrice(
                      hasDiscount(product)
                        ? product.discount_price
                        : product.price
                    )}
                  </span>

                  {hasDiscount(product) && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="w-full bg-gray-900 hover:bg-blue-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Cart page
// ----------------------------------------------------------------

export default function Cart() {
  const { token } = useContext(AuthContext);

  const {
    cartItems,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    addToCart,
  } = useContext(CartContext);

  const { toggleWishlist } = useContext(WishlistContext);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponType, setCouponType] = useState("success"); // "success" | "error"
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [recommended, setRecommended] = useState([]);

  // ------------------------------------------------------------
  // Totals
  // ------------------------------------------------------------

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.quantity,
    0
  );

  const originalSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const itemSavings = Math.max(0, originalSubtotal - subtotal);
  const totalSavings = itemSavings + couponDiscount;
  const total = Math.max(0, subtotal - couponDiscount);

  const freeDeliveryUnlocked = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) * 100
  );
  const amountToFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  // ------------------------------------------------------------
  // Recommendations (cross-sell)
  // ------------------------------------------------------------

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await productService.getFeaturedProducts();
        if (!active) return;
        setRecommended(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Failed to load cart recommendations:", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const cartIds = new Set(cartItems.map((item) => item.id));
  const suggestions = recommended
    .filter((product) => !cartIds.has(product.id))
    .slice(0, 4);

  // ------------------------------------------------------------
  // Coupon
  // ------------------------------------------------------------

  async function applyCoupon() {
    setCouponMessage("");
    setCouponType("success");

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponMessage("Enter a coupon code first.");
      setCouponType("error");
      return;
    }

    setApplyingCoupon(true);

    try {
      const response = await fetch(`${API_BASE}/api/coupons/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCouponDiscount(0);
        setAppliedCode("");
        setCouponMessage(data.message || "Invalid coupon code.");
        setCouponType("error");
        return;
      }

      setCouponDiscount(Number(data.discount) || 0);
      setAppliedCode(code);
      setCouponMessage(
        `Coupon ${code} applied! You saved ${formatPrice(data.discount)}.`
      );
      setCouponType("success");
    } catch {
      setCouponMessage("Unable to validate the coupon right now.");
      setCouponType("error");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setAppliedCode("");
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage("");
  }

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------

  async function handleMoveToWishlist(item) {
    try {
      if (token) {
        await toggleWishlist(item);
      }
    } catch (err) {
      console.error("Move to wishlist failed:", err);
    }

    removeFromCart(item.id);
  }

  function handleClearCart() {
    if (
      window.confirm(
        "Are you sure you want to remove all items from your cart?"
      )
    ) {
      clearCart();
    }
  }

// ------------------------------------------------------------
  // Empty cart view
  // ------------------------------------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 pb-16">
        <CartHeader totalItems={0} />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border p-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={48} className="text-blue-600" />
            </div>

            <h2 className="text-3xl font-black mt-6">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-3">
              Looks like you haven't added anything yet. Explore our tech
              collection and find something you'll love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart size={18} /> Shop Now
              </Link>

              {token && (
                <Link
                  to="/account/wishlist"
                  className="border bg-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition text-blue-600"
                >
                  <Heart size={18} /> View Wishlist
                </Link>
              )}
            </div>
          </div>

          <Recommendations suggestions={suggestions} onAdd={addToCart} />
        </div>
      </div>
    );
  }

// ------------------------------------------------------------
  // Full cart view
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100 pb-24 lg:pb-16">
      <CartHeader totalItems={totalItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* ---------------------------------------- */}
          {/* Items column                            */}
          {/* ---------------------------------------- */}
          <div className="md:col-span-2 lg:col-span-2 space-y-5 sm:space-y-6 min-w-0">
            {/* Free delivery progress */}
            <div className="bg-white rounded-3xl shadow-sm border p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Truck size={22} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold">
                    {freeDeliveryUnlocked
                      ? "Congratulations! You've unlocked FREE delivery 🎉"
                      : `Add ${formatPrice(
                          amountToFreeDelivery
                        )} more to unlock FREE delivery`}
                  </p>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Free shipping on all orders above{" "}
                    {formatPrice(FREE_DELIVERY_THRESHOLD)}.
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Cart items */}
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <div className="px-4 sm:px-6 py-5 border-b flex items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-black">Items ({totalItems})</h2>

                <button
                  type="button"
                  onClick={handleClearCart}
                  className="min-h-[44px] px-2 text-sm text-red-500 hover:text-red-600 font-semibold transition"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const unit = getUnitPrice(item);
                  const isDiscounted = hasDiscount(item);
                  const lineTotal = unit * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col min-[520px]:flex-row gap-4 sm:gap-5"
                    >
                      <Link
                        to={`/product/${item.slug}`}
                        className="shrink-0"
                      >
                        <img
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name}
                          loading="lazy"
                          className="w-full min-[520px]:w-28 h-48 min-[520px]:h-28 object-contain border rounded-2xl bg-white p-2"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            {item.brand && (
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                                {item.brand}
                              </p>
                            )}

                            <Link
                              to={`/product/${item.slug}`}
                              className="block font-bold text-lg mt-0.5 hover:text-blue-600 transition line-clamp-2"
                            >
                              {item.name}
                            </Link>

                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                              <span className="text-lg font-black text-blue-600">
                                {formatPrice(unit)}
                              </span>

                              {isDiscounted && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="shrink-0 w-9 h-9 rounded-xl border hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-400 flex items-center justify-center transition"
                            title="Remove item"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

<div className="mt-5 flex items-center justify-between flex-wrap gap-4">
                          {/* Quantity stepper */}
                          <div className="flex items-center border rounded-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
                              title="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="w-10 text-center font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition"
                              title="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Line total + wishlist */}
                          <div className="flex items-center gap-5 flex-wrap">
                            <span className="text-xl font-black">
                              {formatPrice(lineTotal)}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleMoveToWishlist(item)}
                              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 font-semibold transition"
                            >
                              <Heart size={15} /> Move to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

<aside className="md:col-span-2 lg:col-span-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-sm border p-5 sm:p-6 lg:sticky lg:top-6 space-y-5">
              {/* Coupon */}
              <div>
                <p className="flex items-center gap-2 font-bold text-sm mb-3">
                  <Tag size={16} className="text-blue-600" />
                  Have a promo code?
                </p>

                {appliedCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <p className="text-sm font-bold text-green-700">
                      &check; {appliedCode} applied
                    </p>

                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter promo code"
                      className="flex-1 min-w-0 border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applyingCoupon}
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-5 font-bold text-sm disabled:opacity-50 transition"
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}

                {couponMessage && (
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      couponType === "success"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              <hr className="border-dashed" />

              {/* Summary */}
              <h2 className="text-2xl font-black">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                  </span>

                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                {itemSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Item savings</span>

                    <strong className="text-green-600">
                      -{formatPrice(itemSavings)}
                    </strong>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Coupon ({appliedCode})
                    </span>

                    <strong className="text-green-600">
                      -{formatPrice(couponDiscount)}
                    </strong>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Truck size={16} /> Delivery
                  </span>

                  {freeDeliveryUnlocked ? (
                    <strong className="text-green-600">FREE &#127881;</strong>
                  ) : (
                    <span className="text-gray-400">
                      Free over {formatPrice(FREE_DELIVERY_THRESHOLD)}
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-dashed" />

              <div className="flex items-end justify-between">
                <span className="font-bold text-lg">Total</span>

                <span className="text-3xl font-black text-blue-600">
                  {formatPrice(total)}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-green-600 shrink-0" />

                  <p className="text-sm font-bold text-green-700">
                    You're saving {formatPrice(totalSavings)} today!
                  </p>
                </div>
              )}

<Link
                to="/checkout"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 px-6 font-black text-center flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              {/* Payment methods */}
              <div className="flex flex-wrap gap-2 justify-center pt-1">
                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-xs font-bold">
                  M-Pesa
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                  Visa
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold">
                  MasterCard
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold">
                  Stripe
                </span>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-600" />
                  Secure Checkout
                </span>

                <span className="flex items-center gap-1">
                  <RotateCcw size={14} className="text-blue-600" />
                  7-day Returns
                </span>

                <span className="flex items-center gap-1">
                  <BadgeCheck size={14} className="text-yellow-500" />
                  Genuine Products
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Cross-sell */}
        <Recommendations suggestions={suggestions} onAdd={addToCart} />
      </div>
    </div>
  );
}

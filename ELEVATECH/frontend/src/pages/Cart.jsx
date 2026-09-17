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

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:5000";

const FREE_DELIVERY_THRESHOLD = 5000;

const FALLBACK_IMAGE =
  "https://placehold.co/500x500?text=ElevaTech";

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
      Number(item.discount_price) <
        Number(item.price)
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
    <header className="border-b bg-white">
      <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8">
        <p className="text-xs text-gray-500 sm:text-sm">
          Home / Cart
        </p>

        <div className="mt-3 flex min-w-0 items-center justify-between gap-4 sm:mt-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-black tracking-tight text-gray-950 min-[375px]:text-4xl sm:text-5xl">
              Your Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              {totalItems > 0
                ? `${totalItems} item${
                    totalItems === 1 ? "" : "s"
                  } in your cart`
                : "Add items to get started"}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-14 sm:w-14 sm:rounded-2xl">
            <ShoppingCart
              size={21}
              className="text-blue-600 sm:h-[26px] sm:w-[26px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Recommendations({ suggestions, onAdd }) {
  if (!suggestions.length) return null;

  return (
    <section className="mt-10 sm:mt-14 md:mt-16">
      <div className="mb-5 flex min-w-0 items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <p className="text-xs font-bold text-blue-600 sm:text-sm">
            Complete your order
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
            You may also like
          </h2>
        </div>

        <Link
          to="/products"
          className="hidden shrink-0 text-sm font-bold text-blue-600 transition hover:text-blue-700 sm:block"
        >
          View all products →
        </Link>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {suggestions.map((product) => (
          <div
            key={product.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
          >
            <Link
              to={`/product/${product.slug}`}
              className="block min-w-0 flex-1"
            >
              <div className="p-2.5 pb-0 sm:p-4 sm:pb-0">
                <div className="flex h-32 items-center justify-center sm:h-40">
                  <img
                    src={
                      product.image ||
                      FALLBACK_IMAGE
                    }
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="min-w-0 p-3 sm:p-5">
                {product.brand && (
                  <p className="truncate text-[9px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                    {product.brand}
                  </p>
                )}

                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-gray-900 sm:text-base">
                  {product.name}
                </h3>

                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-sm font-black text-blue-600 sm:text-base">
                    {formatPrice(
                      hasDiscount(product)
                        ? product.discount_price
                        : product.price
                    )}
                  </span>

                  {hasDiscount(product) && (
                    <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="px-3 pb-3 sm:px-5 sm:pb-5">
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-2.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-[0.99] sm:gap-2 sm:px-4 sm:text-sm"
              >
                <ShoppingCart
                  size={15}
                  className="shrink-0 sm:h-4 sm:w-4"
                />
                <span className="truncate">
                  Add to Cart
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/products"
        className="mt-4 flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50 sm:hidden"
      >
        View all products
      </Link>
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

  const { toggleWishlist } =
    useContext(WishlistContext);

  const [couponCode, setCouponCode] =
    useState("");
  const [appliedCode, setAppliedCode] =
    useState("");
  const [couponMessage, setCouponMessage] =
    useState("");
  const [couponType, setCouponType] =
    useState("success");
  const [couponDiscount, setCouponDiscount] =
    useState(0);
  const [applyingCoupon, setApplyingCoupon] =
    useState(false);

  const [recommended, setRecommended] =
    useState([]);

  // ------------------------------------------------------------
  // Totals
  // ------------------------------------------------------------

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      getUnitPrice(item) * item.quantity,
    0
  );

  const originalSubtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          item.quantity,
      0
    );

  const itemSavings = Math.max(
    0,
    originalSubtotal - subtotal
  );

  const totalSavings =
    itemSavings + couponDiscount;

  const total = Math.max(
    0,
    subtotal - couponDiscount
  );

  const freeDeliveryUnlocked =
    subtotal >= FREE_DELIVERY_THRESHOLD;

  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) *
      100
  );

  const amountToFreeDelivery =
    Math.max(
      0,
      FREE_DELIVERY_THRESHOLD - subtotal
    );

  // ------------------------------------------------------------
  // Recommendations
  // ------------------------------------------------------------

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data =
          await productService.getFeaturedProducts();

        if (!active) return;

        setRecommended(
          Array.isArray(data)
            ? data
            : data.products || []
        );
      } catch (err) {
        console.error(
          "Failed to load cart recommendations:",
          err
        );
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const cartIds = new Set(
    cartItems.map((item) => item.id)
  );

  const suggestions = recommended
    .filter(
      (product) => !cartIds.has(product.id)
    )
    .slice(0, 4);

  // ------------------------------------------------------------
  // Coupon
  // ------------------------------------------------------------

  async function applyCoupon() {
    setCouponMessage("");
    setCouponType("success");

    const code = couponCode
      .trim()
      .toUpperCase();

    if (!code) {
      setCouponMessage(
        "Enter a coupon code first."
      );
      setCouponType("error");
      return;
    }

    setApplyingCoupon(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/coupons/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            code,
            subtotal,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setCouponDiscount(0);
        setAppliedCode("");
        setCouponMessage(
          data.message ||
            "Invalid coupon code."
        );
        setCouponType("error");
        return;
      }

      setCouponDiscount(
        Number(data.discount) || 0
      );

      setAppliedCode(code);

      setCouponMessage(
        `Coupon ${code} applied! You saved ${formatPrice(
          data.discount
        )}.`
      );

      setCouponType("success");
    } catch {
      setCouponMessage(
        "Unable to validate the coupon right now."
      );
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
      console.error(
        "Move to wishlist failed:",
        err
      );
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 pb-12 sm:pb-16">
        <CartHeader totalItems={0} />
        <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-5 sm:py-10 md:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 text-center shadow-sm sm:rounded-3xl sm:p-10 md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 sm:h-24 sm:w-24 sm:rounded-3xl">
              <ShoppingCart size={38} className="text-blue-600 sm:h-12 sm:w-12" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-gray-950 sm:mt-6 sm:text-3xl">
              Your cart is empty
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
              Looks like you haven't added anything yet. Explore our tech
              collection and find something you'll love.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
              <Link to="/products" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99] sm:px-8">
                <ShoppingCart size={18} />
                Shop Now
              </Link>
              {token && (
                <Link to="/account/wishlist" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50 active:scale-[0.99] sm:px-8">
                  <Heart size={18} />
                  View Wishlist
                </Link>
              )}
            </div>
          </div>
          <Recommendations suggestions={suggestions} onAdd={addToCart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-28 lg:pb-16">
      <CartHeader totalItems={totalItems} />
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-7 md:px-6 md:py-10 lg:px-8">
        <div className="grid min-w-0 items-start gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="min-w-0 space-y-4 sm:space-y-5 md:space-y-6 lg:col-span-2">
            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-11 sm:w-11 sm:rounded-2xl">
                  <Truck size={20} className="text-blue-600 sm:h-[22px] sm:w-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-5 text-gray-900 sm:text-base sm:leading-6">
                    {freeDeliveryUnlocked
                      ? "Congratulations! You've unlocked FREE delivery 🎉"
                      : `Add ${formatPrice(amountToFreeDelivery)} more to unlock FREE delivery`}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    Free shipping on all orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}.
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100 sm:h-3">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" style={{ width: `${deliveryProgress}%` }} />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
              <div className="flex min-w-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="text-base font-black text-gray-950 sm:text-xl">
                  Items ({totalItems})
                </h2>
                <button type="button" onClick={handleClearCart} className="min-h-11 shrink-0 rounded-xl px-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 sm:text-sm">
                  Clear Cart
                </button>
              </div>
              <div className="divide-y divide-gray-100">

                {cartItems.map((item) => {
                  const unit = getUnitPrice(item);
                  const isDiscounted = hasDiscount(item);
                  const lineTotal = unit * item.quantity;
                  return (
                    <div key={item.id} className="min-w-0 p-4 sm:p-5 md:p-6">
                      <div className="flex min-w-0 gap-3 sm:gap-5">
                        <Link to={`/product/${item.slug}`} className="block w-[92px] shrink-0 sm:w-28">
                          <div className="flex h-[92px] items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 sm:h-28 sm:rounded-2xl sm:p-2">
                            <img src={item.image || FALLBACK_IMAGE} alt={item.name} loading="lazy" className="h-full w-full object-contain" />
                          </div>
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0 flex-1">
                              {item.brand && (
                                <p className="truncate text-[9px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                                  {item.brand}
                                </p>
                              )}
                              <Link to={`/product/${item.slug}`} className="mt-0.5 block line-clamp-2 text-sm font-bold leading-5 text-gray-900 transition hover:text-blue-600 sm:text-lg sm:leading-6">
                                {item.name}
                              </Link>
                              <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
                                <span className="text-sm font-black text-blue-600 sm:text-lg">
                                  {formatPrice(unit)}
                                </span>
                                {isDiscounted && (
                                  <span className="text-[10px] text-gray-400 line-through sm:text-sm">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-[0.97] sm:h-9 sm:w-9" title="Remove item" aria-label={`Remove ${item.name} from cart`}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-4 flex min-w-0 flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between sm:mt-5">
                            <div className="flex w-fit items-center overflow-hidden rounded-xl border">
                              <button type="button" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1} className="flex h-11 w-11 items-center justify-center transition hover:bg-gray-50 disabled:opacity-40 sm:h-10 sm:w-10" title="Decrease quantity" aria-label={`Decrease ${item.name} quantity`}>
                                <Minus size={16} />
                              </button>
                              <span className="flex h-11 w-10 items-center justify-center text-sm font-bold sm:h-10">
                                {item.quantity}
                              </span>
                              <button type="button" onClick={() => increaseQuantity(item.id)} className="flex h-11 w-11 items-center justify-center transition hover:bg-gray-50 sm:h-10 sm:w-10" title="Increase quantity" aria-label={`Increase ${item.name} quantity`}>
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 min-[480px]:justify-end sm:gap-5">
                              <span className="text-lg font-black text-gray-950 sm:text-xl">
                                {formatPrice(lineTotal)}
                              </span>
                              <button type="button" onClick={() => handleMoveToWishlist(item)} className="flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-xs font-semibold text-gray-500 transition hover:text-red-500 sm:text-sm">
                                <Heart size={15} className="shrink-0" />
                                <span className="hidden min-[400px]:inline">Move to Wishlist</span>
                                <span className="min-[400px]:hidden">Wishlist</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:col-span-1">
            <div className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-5 md:p-6 lg:sticky lg:top-6">
              <div className="min-w-0">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <Tag size={16} className="shrink-0 text-blue-600" />
                  Have a promo code?
                </p>
                {appliedCode ? (
                  <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 sm:px-4">
                    <p className="min-w-0 truncate text-xs font-bold text-green-700 sm:text-sm">
                      ✓ {appliedCode} applied
                    </p>

                    <button type="button" onClick={removeCoupon} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-100 hover:text-green-800" title="Remove coupon" aria-label="Remove coupon">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex min-w-0 gap-2">
                    <label htmlFor="cart-coupon" className="sr-only">Promo code</label>
                    <input id="cart-coupon" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter promo code" className="min-h-11 min-w-0 flex-1 rounded-xl border px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:text-sm" />
                    <button type="button" onClick={applyCoupon} disabled={applyingCoupon} className="min-h-11 shrink-0 rounded-xl bg-gray-900 px-3 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 sm:px-5 sm:text-sm">
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p role="status" className={`mt-2 text-xs font-semibold leading-5 sm:text-sm ${couponType === "success" ? "text-green-600" : "text-red-500"}`}>
                    {couponMessage}
                  </p>
                )}
              </div>
              <hr className="border-dashed" />
              <h2 className="text-xl font-black text-gray-950 sm:text-2xl">
                Order Summary
              </h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="min-w-0 text-gray-500">
                    Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                  </span>
                  <strong className="shrink-0">{formatPrice(subtotal)}</strong>
                </div>
                {itemSavings > 0 && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">Item savings</span>
                    <strong className="shrink-0 text-green-600">-{formatPrice(itemSavings)}</strong>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="min-w-0 text-gray-500">Coupon ({appliedCode})</span>
                    <strong className="shrink-0 text-green-600">-{formatPrice(couponDiscount)}</strong>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Truck size={15} className="shrink-0" />
                    Delivery
                  </span>
                  {freeDeliveryUnlocked ? (
                    <strong className="shrink-0 text-green-600">FREE 🎉</strong>
                  ) : (
                    <span className="text-right text-gray-400">Free over {formatPrice(FREE_DELIVERY_THRESHOLD)}</span>
                  )}
                </div>
              </div>
              <hr className="border-dashed" />
              <div className="flex items-end justify-between gap-4">
                <span className="text-base font-bold text-gray-900 sm:text-lg">Total</span>
                <span className="text-2xl font-black text-blue-600 sm:text-3xl">{formatPrice(total)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-3 sm:px-4">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-green-600" />
                  <p className="min-w-0 text-xs font-bold leading-5 text-green-700 sm:text-sm">
                    You're saving {formatPrice(totalSavings)} today!
                  </p>
                </div>
              )}
              <Link to="/checkout" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] sm:rounded-2xl sm:py-4">
                Proceed to Checkout
                <ArrowRight size={18} className="shrink-0" />
              </Link>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1 sm:gap-2">
                <span className="rounded-lg bg-green-100 px-2.5 py-1.5 text-[10px] font-bold text-green-800 sm:px-3 sm:text-xs">M-Pesa</span>
                <span className="rounded-lg bg-blue-100 px-2.5 py-1.5 text-[10px] font-bold text-blue-800 sm:px-3 sm:text-xs">Visa</span>
                <span className="rounded-lg bg-purple-100 px-2.5 py-1.5 text-[10px] font-bold text-purple-800 sm:px-3 sm:text-xs">MasterCard</span>
                <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[10px] font-bold text-gray-800 sm:px-3 sm:text-xs">Stripe</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-1 text-[10px] text-gray-500 sm:gap-4 sm:text-xs">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="shrink-0 text-green-600" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={14} className="shrink-0 text-blue-600" />
                  7-day Returns
                </span>
                <span className="flex items-center gap-1">
                  <BadgeCheck size={14} className="shrink-0 text-yellow-500" />
                  Genuine Products
                </span>
              </div>
            </div>
          </aside>
        </div>
        <Recommendations suggestions={suggestions} onAdd={addToCart} />
      </div>
    </div>
  );
}


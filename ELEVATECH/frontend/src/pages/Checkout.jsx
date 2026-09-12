import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setCouponMessage("");

    if (!couponCode.trim()) {
      setCouponMessage("Enter a coupon code.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/coupons/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: couponCode.trim(),
            subtotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setDiscount(0);
        setCouponMessage(data.message || "Invalid coupon.");
        return;
      }

      setDiscount(data.discount || 0);
      setCouponMessage("Coupon applied successfully!");
    } catch {
      setCouponMessage("Unable to validate coupon.");
    }
  }

  async function handlePay(e) {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("Please login first.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (paymentMethod === "M-Pesa" && phone.trim() === "") {
      setError("Please enter your M-Pesa phone number.");
      return;
    }

    setLoading(true);

    let createdOrderId = null;

    try {
      // ===========================
      // STEP 1: CREATE ORDER
      // ===========================

      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
            coupon_code: couponCode.trim() || undefined,
            items: cartItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const orderData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok || !orderData.order) {
        throw new Error(orderData.message || "Failed to create order.");
      }

      createdOrderId = orderData.order.id;

      // Update state with backend's authoritative values
      if (typeof orderData.discount === "number") {
        setDiscount(orderData.discount);
      }

      // ===========================
      // STRIPE PAYMENT
      // ===========================

      if (paymentMethod === "Stripe") {
        const stripeResponse = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: createdOrderId,
            }),
          }
        );

        const stripeData = await stripeResponse.json().catch(() => ({}));

        if (!stripeResponse.ok || !stripeData.url) {
          throw new Error(
            stripeData.error || "Failed to create Stripe Checkout session."
          );
        }

        window.location.href = stripeData.url;
        return;
      }

      // ===========================
      // M-PESA PAYMENT
      // ===========================

      const mpesaResponse = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/mpesa/stkpush`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: createdOrderId,
            phone: phone,
          }),
        }
      );

      const mpesaData = await mpesaResponse.json().catch(() => ({}));

      if (!mpesaResponse.ok || !mpesaData.success) {
        throw new Error(
          mpesaData.error ||
            mpesaData.message ||
            "Failed to initiate M-Pesa payment."
        );
      }

      alert(
        mpesaData.CustomerMessage ||
          "M-Pesa prompt sent successfully. Please check your phone to authorize payment."
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");

      // If order was created but initiating payment failed, ensure order is cancelled and inventory restored
      if (createdOrderId) {
        fetch(
          `${import.meta.env.VITE_API_BASE}/api/orders/${createdOrderId}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#07101D] px-4 py-14 text-center text-white">
        <h2 className="text-2xl font-black sm:text-3xl">Your Cart is Empty</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-400">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-yellow-400 px-8 font-black text-black transition hover:bg-yellow-300"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07101D] pb-24 text-white lg:pb-16">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Secure checkout
        </p>
        <h2 className="mt-2 text-3xl font-black text-balance min-[480px]:text-4xl">Checkout</h2>

        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          Choose your preferred payment method.
        </p>

        <form
          onSubmit={handlePay}
          className="mt-6 grid gap-4 sm:gap-5"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <h3 className="font-bold">Coupon</h3>

            <div className="mt-3 flex flex-col gap-2 min-[480px]:flex-row sm:gap-3">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="min-h-[52px] w-full min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B1628] px-4 text-base text-white placeholder:text-slate-500 focus:border-yellow-400/60 focus:outline-none"
            />

            <button
              type="button"
              onClick={applyCoupon}
              className="min-h-[52px] shrink-0 rounded-xl bg-white/10 px-6 font-bold text-white transition hover:bg-white/15 active:scale-95"
            >
              Apply
            </button>
          </div>

          {couponMessage && (
            <p className="mt-3 text-sm text-slate-300">
              {couponMessage}
            </p>
          )}
        </div>

        <div className="grid gap-2 sm:gap-3">
        <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
          <input
            type="radio"
            value="Stripe"
            checked={paymentMethod === "Stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5 shrink-0 accent-yellow-400"
          />
          <span className="font-semibold">Stripe <span className="text-xs font-normal text-slate-400">· Card</span></span>
        </label>

        <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
          <input
            type="radio"
            value="M-Pesa"
            checked={paymentMethod === "M-Pesa"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5 shrink-0 accent-yellow-400"
          />
          <span className="font-semibold">M-Pesa <span className="text-xs font-normal text-slate-400">Mobile money</span></span>
        </label>
        </div>

        {paymentMethod === "M-Pesa" && (
          <input
            type="tel"
            placeholder="Enter M-Pesa phone e.g. 0712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="min-h-[52px] w-full rounded-xl border border-white/10 bg-[#0B1628] px-4 text-base text-white placeholder:text-slate-500 focus:border-yellow-400/60 focus:outline-none"
          />
)}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h3 className="font-bold">Order Summary</h3>

          <p className="mt-3 flex items-center justify-between gap-3 text-slate-300">
            Subtotal:
            <strong className="text-white">
              {" "}
              KES {subtotal.toFixed(2)}
            </strong>
          </p>

          <p className="mt-1.5 flex items-center justify-between gap-3 text-slate-300">
            Discount:
            <strong className="text-emerald-300">
              {" "}
              -KES {discount.toFixed(2)}
            </strong>
          </p>

          <hr className="my-4 border-white/10" />

          <h3 className="flex items-center justify-between gap-3 text-lg">
            Total:
            <strong className="text-yellow-300">
              {" "}
              KES {total.toFixed(2)}
            </strong>
          </h3>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-h-[56px] w-full rounded-2xl bg-yellow-400 px-6 font-black text-black transition hover:bg-yellow-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
            {error}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
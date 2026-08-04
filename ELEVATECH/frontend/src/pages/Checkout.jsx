import { useContext, useState } from "react";
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
  const [subtotal, setSubtotal] = useState(
    cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  );

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
            code: couponCode,
            subtotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setDiscount(0);
        setCouponMessage(data.message || "Invalid coupon.");
        return;
      }

      setDiscount(data.discount);
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

    if (paymentMethod === "Mpesa" && phone.trim() === "") {
      setError("Please enter your M-Pesa phone number.");
      return;
    }

    setLoading(true);

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
            coupon_code: couponCode,
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity
            }))
          }),
        }
      );

      const orderData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create order.");
      }

      const orderId = orderData.order.id;

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
              order_id: orderId,
            }),
          }
        );

        const stripeData = await stripeResponse.json().catch(() => ({}));

        if (!stripeResponse.ok) {
          throw new Error(
            stripeData.error || "Failed to create Stripe Checkout."
          );
        }

        if (!stripeData.url) {
          throw new Error("Stripe Checkout URL not returned.");
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
            order_id: orderId,
            phone: phone,
          }),
        }
      );

      const mpesaData = await mpesaResponse.json().catch(() => ({}));

      if (!mpesaResponse.ok) {
        throw new Error(
          mpesaData.error ||
            mpesaData.message ||
            "Failed to initiate M-Pesa payment."
        );
      }

      alert(
        mpesaData.CustomerMessage ||
          "M-Pesa prompt sent successfully. Check your phone."
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 550,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h2>Checkout</h2>

      <p style={{ color: "#666" }}>
        Choose your preferred payment method.
      </p>

      <form
        onSubmit={handlePay}
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 8,
          }}
        >
          <h3>Coupon</h3>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              style={{
                flex: 1,
                padding: 10,
              }}
            />

            <button
              type="button"
              onClick={applyCoupon}
            >
              Apply
            </button>
          </div>

          {couponMessage && (
            <p style={{ marginTop: 10 }}>
              {couponMessage}
            </p>
          )}
        </div>

        <label>
          <input
            type="radio"
            value="Stripe"
            checked={paymentMethod === "Stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Stripe
        </label>

        <label>
          <input
            type="radio"
            value="Mpesa"
            checked={paymentMethod === "Mpesa"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          M-Pesa
        </label>

        {paymentMethod === "Mpesa" && (
          <input
            type="tel"
            placeholder="2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              padding: 12,
              width: "100%",
            }}
          />
)}

        <div
          style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <h3>Order Summary</h3>

          <p>
            Subtotal:
            <strong>
              {" "}
              KES {subtotal.toFixed(2)}
            </strong>
          </p>

          <p>
            Discount:
            <strong>
              {" "}
              -KES {discount.toFixed(2)}
            </strong>
          </p>

          <hr />

          <h3>
            Total:
            <strong>
              {" "}
              KES {(subtotal - discount).toFixed(2)}
            </strong>
          </h3>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && (
          <div
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
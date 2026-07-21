import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function PaymentSuccess() {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Stripe sends this automatically
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      console.log("Stripe Session:", sessionId);
    }

    // Empty the shopping cart
    clearCart();
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "green" }}>
        ✅ Payment Successful
      </h1>

      <p>
        Thank you for your purchase.
      </p>

      <p>
        Your order has been placed successfully.
      </p>

      <Link to="/orders">
        <button
          style={{
            padding: "12px 20px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          View My Orders
        </button>
      </Link>
    </div>
  );
}
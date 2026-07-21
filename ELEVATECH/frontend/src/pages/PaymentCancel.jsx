import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "red" }}>
        ❌ Payment Cancelled
      </h1>

      <p>
        Your payment was cancelled.
      </p>

      <p>
        No money has been charged.
      </p>

      <Link to="/checkout">
        <button
          style={{
            padding: "12px 20px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </Link>
    </div>
  );
}
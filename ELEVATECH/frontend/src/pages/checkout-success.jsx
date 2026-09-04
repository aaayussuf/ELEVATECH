import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (!sessionId) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("elevatech_token");

    fetch(`/api/checkout/verify/${sessionId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVerification(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
        <h2>Verifying payment...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
        <h2>Verification Error</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h2>Payment successful</h2>
      <p style={{ color: "#666" }}>Your payment was completed. You can check your order status in the account section.</p>
      {verification && (
        <div style={{ marginTop: 16, background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
          <p><strong>Paid:</strong> {verification.paid ? "Yes" : "No"}</p>
          <p><strong>Status:</strong> {verification.status}</p>
          <p><strong>Order ID:</strong> {verification.order_id}</p>
          <p><strong>Payment Intent:</strong> {verification.payment_intent}</p>
        </div>
      )}
    </div>
  );
}


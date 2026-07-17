import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    const id = Number(orderId);
    if (!id) {
      setError("Enter a valid order id");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ order_id: id }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Missing checkout url in response");
    } catch (err) {
      setError(err?.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Checkout (Stripe)</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        This page initiates a Stripe Checkout Session for an existing order.
      </p>

      <form onSubmit={handlePay} style={{ display: "grid", gap: 10 }}>
        <label>
          Order ID
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 1"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating session..." : "Pay with Stripe"}
        </button>

        {error ? <div style={{ color: "#b00020" }}>{error}</div> : null}
      </form>
    </div>
  );
}


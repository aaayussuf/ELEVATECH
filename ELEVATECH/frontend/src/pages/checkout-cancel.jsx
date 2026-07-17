export default function CheckoutCancel() {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h2>Payment cancelled</h2>
      <p style={{ color: "#666" }}>You cancelled the Stripe checkout. Your order is still pending.</p>
    </div>
  );
}


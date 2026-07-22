import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MyOrders() {
  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE || ""}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div style={{ padding: 30 }}>
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 30, color: "red" }}>
        {error}
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "30px auto",
        padding: 20,
      }}
    >
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginBottom: 25,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <div>
                <h3>Order #{order.id}</h3>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.status}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment_method}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  KSh {Number(order.total).toLocaleString()}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <hr />

            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE || ""}${item.image}`}
                  alt={item.name}
                  width="90"
                  height="90"
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>

                  <p>Quantity: {item.quantity}</p>

                  <p>
                    Price: KSh{" "}
                    {Number(item.price).toLocaleString()}
                  </p>

                  <p>
                    Subtotal: KSh{" "}
                    {Number(item.subtotal).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}


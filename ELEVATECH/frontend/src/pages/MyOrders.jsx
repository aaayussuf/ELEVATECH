import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { joinCustomerRoom } from "../services/socketService";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export default function MyOrders() {
  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load your orders."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response from server.");
      }

      setOrders(data);
    } catch (err) {
      console.error("Load orders error:", err);
      setError(
        err.message || "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

   
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your orders.");
      return;
    }

    joinCustomerRoom(token);
    loadOrders();
  }, [token, loadOrders]);

  function statusClass(status) {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 1000,
          margin: "50px auto",
          padding: 30,
          textAlign: "center",
        }}
      >
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: "50px auto",
          padding: 30,
          textAlign: "center",
        }}
      >
        <h2>My Orders</h2>

        <p
          style={{
            color: "red",
            marginTop: 15,
          }}
        >
          {error}
        </p>

        {!token && (
          <Link to="/login">
            <button
              style={{
                marginTop: 20,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "30px auto",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <h1>My Orders</h1>

        <Link to="/products">
          <button
            style={{
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 40,
            textAlign: "center",
          }}
        >
          <h2>No orders found</h2>

          <p
            style={{
              color: "#666",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            You have not placed any orders yet.
          </p>

          <Link to="/products">
            <button
              style={{
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 25,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* ORDER HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  Order #{order.id}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#666",
                  }}
                >
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString()
                    : "-"}
                </p>
              </div>

              <span
                className={statusClass(order.status)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontWeight: "600",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                {order.status || "Pending"}
              </span>
            </div>

            {/* ORDER INFORMATION */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 15,
                marginBottom: 20,
              }}
            >
              <div>
                <strong>Payment Method</strong>
                <p>
                  {order.payment_method || "-"}
                </p>
              </div>

              <div>
                <strong>Payment Status</strong>
                <p>
                  {order.payment_status || "-"}
                </p>
              </div>

              <div>
                <strong>Total</strong>
                <p>
                  KSh{" "}
                  {Number(order.total || 0).toLocaleString()}
                </p>
              </div>

              <div>
                <strong>Discount</strong>
                <p>
                  KSh{" "}
                  {Number(order.discount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <hr />

            {/* ORDER ITEMS */}

            <h3
              style={{
                marginTop: 20,
                marginBottom: 15,
              }}
            >
              Items
            </h3>

            {Array.isArray(order.items) &&
            order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                    padding: "15px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        marginBottom: 6,
                      }}
                    >
                      {item.product_name ||
                        `Product #${item.product_id}`}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color: "#666",
                      }}
                    >
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                      }}
                    >
                      KSh{" "}
                      {Number(
                        item.price || 0
                      ).toLocaleString()}
                    </p>

                    <strong>
                      KSh{" "}
                      {Number(
                        item.subtotal ||
                          item.price * item.quantity ||
                          0
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found for this order.</p>
            )}

            {/* SHIPPING */}

            {(order.tracking_number ||
              order.courier ||
              order.shipped_at ||
              order.delivered_at) && (
              <div
                style={{
                  marginTop: 20,
                  padding: 15,
                  background: "#f8f8f8",
                  borderRadius: 8,
                }}
              >
                <h3>Shipping Information</h3>

                {order.courier && (
                  <p>
                    <strong>Courier:</strong>{" "}
                    {order.courier}
                  </p>
                )}

                {order.tracking_number && (
                  <p>
                    <strong>Tracking Number:</strong>{" "}
                    {order.tracking_number}
                  </p>
                )}

                {order.shipped_at && (
                  <p>
                    <strong>Shipped:</strong>{" "}
                    {new Date(
                      order.shipped_at
                    ).toLocaleString()}
                  </p>
                )}

                {order.delivered_at && (
                  <p>
                    <strong>Delivered:</strong>{" "}
                    {new Date(
                      order.delivered_at
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}


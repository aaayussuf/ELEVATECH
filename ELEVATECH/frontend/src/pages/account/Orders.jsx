import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import socket from "../../services/socketService";

import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

export default function Orders() {
  const {
    user,
    token,
    isLoading: authLoading,
    logout,
  } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const data = await accountService.getOrders(token);

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Load orders error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

   
  useEffect(() => {
    if (authLoading || !token) {
      return;
    }

    loadOrders();
  }, [authLoading, token, loadOrders]);

  useEffect(() => {
    if (authLoading || !token) {
      return;
    }

    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await accountService.getOrders(token);

        if (!isMounted) {
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load orders error:", err);

        if (!isMounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load orders."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [authLoading, token]);

  useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.order_id
            ? {
                ...order,
                status: updatedOrder.status,
                payment_status:
                  updatedOrder.payment_status,
                tracking_number:
                  updatedOrder.tracking_number,
                courier:
                  updatedOrder.courier,
                shipped_at:
                  updatedOrder.shipped_at,
                delivered_at:
                  updatedOrder.delivered_at,
              }
            : order
        )
      );
    };

    socket.on(
      "customer_order_updated",
      handleOrderUpdate
    );

    return () => {
      socket.off(
        "customer_order_updated",
        handleOrderUpdate
      );
    };
  }, []);

  async function handleCancelOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(orderId);
      setError("");

      const updatedOrder =
        await accountService.cancelOrder(
          token,
          orderId
        );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...updatedOrder,
                status:
                  updatedOrder?.status ||
                  "Cancelled",
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  }

  if (authLoading || loading) {
    return (
      <AccountLayout
        user={user}
        onLogout={logout}
      >
        <div className="p-8 text-center">
          Loading your orders...
        </div>
      </AccountLayout>
    );
  }

  if (error && orders.length === 0) {
    return (
      <AccountLayout
        user={user}
        onLogout={logout}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
          <h2 className="font-bold text-lg">
            Unable to load orders
          </h2>

          <p className="mt-2">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      user={user}
      onLogout={logout}
    >
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-black">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            View your orders and track their status.
          </p>
        </div>

        {error && orders.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (

          <div className="bg-white border rounded-3xl p-12 text-center">

            <h2 className="text-2xl font-bold">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your completed and pending orders
              will appear here.
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {orders.map((order) => {

              const isPending =
                String(order.status || "")
                  .toLowerCase() === "pending";

              const isCancelling =
                cancellingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border rounded-3xl p-6 shadow-sm"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <h2 className="text-xl font-black">
                        #{order.id}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${
                          isPending
                            ? "bg-yellow-50 text-yellow-700"
                            : order.status === "Cancelled"
                            ? "bg-red-50 text-red-700"
                            : order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${
                          order.payment_status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {order.payment_status ||
                          "Payment Pending"}
                      </span>

                    </div>

                  </div>

                  <div className="border-t my-5" />

                  <div className="grid md:grid-cols-3 gap-5">

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-bold mt-1">
                        {order.payment_method || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Items
                      </p>

                      <p className="font-bold mt-1">
                        {(order.items || []).reduce(
                          (sum, item) =>
                            sum +
                            Number(
                              item.quantity || 0
                            ),
                          0
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="font-black text-xl text-blue-600 mt-1">
                        KSh{" "}
                        {Number(
                          order.total || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="border-t my-5" />

                  <div className="space-y-3">

                    {(order.items || []).map(
                      (item) => (

                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 bg-gray-50 rounded-2xl p-4"
                        >

                          <div>

                            <p className="font-bold">
                              {item.product_name ||
                                `Product #${item.product_id}`}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <p className="font-semibold">
                            KSh{" "}
                            {Number(
                              item.subtotal ??
                              Number(
                                item.price || 0
                              ) *
                              Number(
                                item.quantity || 0
                              )
                            ).toLocaleString()}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-5">

                    {isPending && (
                      <button
                        type="button"
                        disabled={isCancelling}
                        onClick={() =>
                          handleCancelOrder(
                            order.id
                          )
                        }
                        className={`px-5 py-3 rounded-xl font-bold border ${
                          isCancelling
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-red-600 border-red-300 hover:bg-red-50"
                        }`}
                      >
                        {isCancelling
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}

                    <Link
                      to={`/account/orders/${order.id}`}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-bold text-center"
                    >
                      View Order
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    </AccountLayout>
  );
}
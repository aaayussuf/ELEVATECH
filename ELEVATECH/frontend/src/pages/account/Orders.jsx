import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import socket from "../../services/socketService";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

function getStatusClasses(status) {
  const value = String(status || "Pending").toLowerCase();

  if (value === "cancelled") {
    return "bg-red-50 text-red-700";
  }

  if (value === "delivered") {
    return "bg-green-50 text-green-700";
  }

  if (value === "shipped") {
    return "bg-purple-50 text-purple-700";
  }

  if (value === "paid") {
    return "bg-blue-50 text-blue-700";
  }

  if (value === "processing") {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-yellow-50 text-yellow-700";
}

function getPaymentClasses(paymentStatus) {
  const value = String(paymentStatus || "").toLowerCase();

  if (value === "paid") {
    return "bg-green-50 text-green-700";
  }

  if (value === "failed") {
    return "bg-red-50 text-red-700";
  }

  return "bg-yellow-50 text-yellow-700";
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString();
}

function getItemCount(items) {
  return (items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
}

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
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await accountService.getOrders(token);

      setOrders(Array.isArray(data) ? data : []);
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
    const handleOrderUpdate = (updatedOrder) => {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          Number(order.id) === Number(updatedOrder.order_id)
            ? {
                ...order,
                status:
                  updatedOrder.status ?? order.status,
                payment_status:
                  updatedOrder.payment_status ??
                  order.payment_status,
                tracking_number:
                  updatedOrder.tracking_number ??
                  order.tracking_number,
                courier:
                  updatedOrder.courier ?? order.courier,
                shipped_at:
                  updatedOrder.shipped_at ??
                  order.shipped_at,
                delivered_at:
                  updatedOrder.delivered_at ??
                  order.delivered_at,
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
          Number(order.id) === Number(orderId)
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
          <div className="text-2xl font-black text-gray-100">
            Loading your orders...
          </div>

          <p className="text-gray-400 mt-2">
            Please wait while we retrieve your order history.
          </p>
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
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6">
          <h2 className="text-xl font-black">
            Unable to load orders
          </h2>

          <p className="mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadOrders}
            className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold"
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

        {/* PAGE HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-yellow-400 uppercase tracking-wide">
              Account
            </p>

            <h1 className="text-4xl font-black text-white mt-1">
              My Orders
            </h1>

            <p className="text-gray-400 mt-2">
              View your order history and track your purchases.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-yellow-400 text-black hover:opacity-90 px-5 py-3 rounded-xl font-bold"
          >
            Continue Shopping
          </Link>
        </div>

        {/* ERROR */}

        {error && orders.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl">
              🛍️
            </div>

            <h2 className="text-2xl font-black text-gray-900 mt-5">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Your completed and pending orders will appear here
              after you make a purchase.
            </p>

            <Link
              to="/products"
              className="inline-flex mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              Start Shopping
            </Link>

          </div>
        ) : (

          /* ORDER LIST */

          <div className="space-y-5">

            {orders.map((order) => {
              const itemCount = getItemCount(order.items);

              const isPending =
                String(order.status || "")
                  .toLowerCase() === "pending";

              const isCancelling =
                cancellingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
                >

                  {/* ORDER HEADER */}

                  <div className="p-6 border-b bg-gray-50/60">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div>
                        <p className="text-sm text-gray-500">
                          Order
                        </p>

                        <h2 className="text-2xl font-black text-gray-900">
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
                          className={`px-4 py-2 rounded-full font-bold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>

                        <span
                          className={`px-4 py-2 rounded-full font-bold ${getPaymentClasses(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status ||
                            "Payment Pending"}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* ORDER SUMMARY */}

                  <div className="p-6">

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">
                          Payment Method
                        </p>

                        <p className="font-bold text-gray-900 mt-1">
                          {order.payment_method || "—"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">
                          Items
                        </p>

                        <p className="font-bold text-gray-900 text-xl mt-1">
                          {itemCount}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">
                          Discount
                        </p>

                        <p className="font-bold text-green-600 mt-1">
                          KSh{" "}
                          {formatMoney(
                            order.discount
                          )}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">
                          Order Total
                        </p>

                        <p className="font-black text-xl text-blue-600 mt-1">
                          KSh{" "}
                          {formatMoney(
                            order.total
                          )}
                        </p>
                      </div>

                    </div>


                    {/* ITEMS */}

                    <div className="mt-6">

                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-black text-lg">
                          Items
                        </h3>

                        <span className="text-sm text-gray-500">
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </span>
                      </div>

                      <div className="space-y-3">

                        {(order.items || []).map(
                          (item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-2xl p-4"
                            >

                              <div>
                                <p className="font-bold text-gray-900">
                                  {item.product_name ||
                                    `Product #${item.product_id}`}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                  Qty:{" "}
                                  {item.quantity}{" "}
                                  · Unit price: KSh{" "}
                                  {formatMoney(
                                    item.price
                                  )}
                                </p>
                              </div>

                              <p className="font-black text-gray-900">
                                KSh{" "}
                                {formatMoney(
                                  item.subtotal ??
                                    Number(
                                      item.price || 0
                                    ) *
                                      Number(
                                        item.quantity || 0
                                      )
                                )}
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>


                    {/* SHIPPING */}

                    {(order.courier ||
                      order.tracking_number) && (
                      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">

                        <h3 className="font-black text-lg">
                          Shipping
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4 mt-3">

                          {order.courier && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Courier
                              </p>

                              <p className="font-bold mt-1">
                                {order.courier}
                              </p>
                            </div>
                          )}

                          {order.tracking_number && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Tracking Number
                              </p>

                              <p className="font-bold mt-1 break-all">
                                {order.tracking_number}
                              </p>
                            </div>
                          )}

                        </div>

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">

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

                </div>
              );
            })}

          </div>
        )}

      </div>
    </AccountLayout>
  );
}



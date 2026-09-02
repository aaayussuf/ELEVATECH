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
          <div className="text-2xl font-black text-gray-900">
            Loading your orders...
          </div>

          <p className="text-gray-500 mt-2">
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

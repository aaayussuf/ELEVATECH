import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

import socket from "../../services/socketService";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

function getStatusClasses(status) {
  const value = String(status || "Pending").toLowerCase();
  if (value === "cancelled") {
    return "bg-red-50 text-red-700 border-red-100";
  }
  if (value === "delivered") {
    return "bg-green-50 text-green-700 border-green-100";
  }
  if (value === "shipped") {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }
  if (value === "paid") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }
  if (value === "processing") {
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  }
  return "bg-yellow-50 text-yellow-700 border-yellow-100";
}

function getPaymentClasses(paymentStatus) {
  const value = String(paymentStatus || "").toLowerCase();
  if (value === "paid") {
    return "bg-green-50 text-green-700 border-green-100";
  }
  if (value === "failed") {
    return "bg-red-50 text-red-700 border-red-100";
  }
  return "bg-yellow-50 text-yellow-700 border-yellow-100";
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

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return date.toLocaleString();
}

function StatusBadge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-1.5 text-[11px] font-black capitalize sm:px-4 sm:text-xs ${className}`}
    >
      {children}
    </span>
  );
}
function OrderSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
      <div className="border-b border-gray-100 bg-gray-50 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-7 w-24 rounded bg-gray-200" />
            <div className="h-3 w-40 rounded bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-full bg-gray-200" />
            <div className="h-9 w-24 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 md:grid-cols-4 md:p-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-2xl bg-gray-50 p-4">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="mt-2 h-5 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
        {[1, 2].map((item) => (
          <div key={item} className="h-16 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
export default function Orders() {
  const { user, token, isLoading: authLoading, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const loadOrders = useCallback(async () => {
    if (!token) { return; }
    try {
      setLoading(true);
      setError("");
      const data = await accountService.getOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load orders error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    if (authLoading || !token) { return; }
    loadOrders();
  }, [authLoading, token, loadOrders]);
  useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          Number(order.id) === Number(updatedOrder.order_id)
            ? {
                ...order,
                status: updatedOrder.status ?? order.status,
                payment_status: updatedOrder.payment_status ?? order.payment_status,
                tracking_number: updatedOrder.tracking_number ?? order.tracking_number,
                courier: updatedOrder.courier ?? order.courier,
                shipped_at: updatedOrder.shipped_at ?? order.shipped_at,
                delivered_at: updatedOrder.delivered_at ?? order.delivered_at,
              }
            : order
        )
      );
    };
    socket.on("customer_order_updated", handleOrderUpdate);
    return () => { socket.off("customer_order_updated", handleOrderUpdate); };
  }, []);
  async function handleCancelOrder(orderId) {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) { return; }
    try {
      setCancellingId(orderId);
      setError("");
      const updatedOrder = await accountService.cancelOrder(token, orderId);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          Number(order.id) === Number(orderId)
            ? { ...order, ...updatedOrder, status: updatedOrder?.status || "Cancelled" }
            : order
        )
      );
    } catch (err) {
      console.error("Cancel order error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  }
  if (authLoading || loading) {
    return (
      <AccountLayout user={user} onLogout={logout}>
        <div className="w-full min-w-0 space-y-5 sm:space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="animate-pulse">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="mt-2 h-9 w-40 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-full max-w-md rounded bg-gray-100" />
            </div>
          </div>
          <div className="space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        </div>
      </AccountLayout>
    );
  }
  if (error && orders.length === 0) {
    return (
      <AccountLayout user={user} onLogout={logout}>
        <div className="w-full min-w-0 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:rounded-3xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <RefreshCw size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black sm:text-xl">Unable to load orders</h2>
              <p className="mt-2 break-words text-sm leading-6">{error}</p>
              <button type="button" onClick={loadOrders} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.99] sm:w-auto">
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AccountLayout>
    );
  }
  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="w-full min-w-0 space-y-5 sm:space-y-6 md:space-y-7">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 sm:text-xs sm:tracking-[0.2em]">Account</p>
              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl md:text-4xl">My Orders</h1>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">View your order history, payment status, shipping information, and track your purchases.</p>
            </div>
            <Link to="/products" className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-400 px-5 py-3 text-xs font-black text-black transition hover:opacity-90 active:scale-[0.99] sm:w-auto sm:text-sm">
              <ShoppingBag size={16} className="shrink-0" />
              Continue Shopping
            </Link>
          </div>
        </div>
        {error && orders.length > 0 && (
          <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
              <RefreshCw size={17} />
            </div>
            <p className="min-w-0 flex-1 break-words text-xs font-bold leading-5 sm:text-sm">{error}</p>
          </div>
        )}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:rounded-3xl sm:p-10 md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl sm:h-16 sm:w-16 sm:rounded-full">🛍️</div>
            <h2 className="mt-4 text-xl font-black text-gray-900 sm:mt-5 sm:text-2xl">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">Your completed and pending orders will appear here after you make a purchase.</p>
            <Link to="/products" className="mt-5 inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black text-white transition hover:bg-blue-700 active:scale-[0.99] sm:mt-6 sm:w-auto sm:text-sm">
              <ShoppingBag size={16} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="min-w-0 space-y-4 sm:space-y-5">
            {orders.map((order) => {
              const itemCount = getItemCount(order.items);
              const isPending = String(order.status || "").toLowerCase() === "pending";
              const isCancelling = cancellingId === order.id;
              return (
                <article key={order.id} className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
                  <div className="border-b border-gray-200 bg-gray-50/70 p-4 sm:p-5 md:p-6">
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Package size={17} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Order</p>
                            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">#{order.id}</h2>
                          </div>
                        </div>
                        <div className="mt-3 flex min-w-0 items-start gap-2 text-xs text-gray-500 sm:text-sm">
                          <CalendarDays size={15} className="mt-0.5 shrink-0" />
                          <span className="min-w-0 break-words">{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-wrap gap-2">
                        <StatusBadge className={getStatusClasses(order.status)}>{order.status || "Pending"}</StatusBadge>
                        <StatusBadge className={getPaymentClasses(order.payment_status)}>{order.payment_status || "Payment Pending"}</StatusBadge>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 p-4 sm:p-5 md:p-6">
                    <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-4">
                      <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="shrink-0 text-gray-400" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Payment Method</p>
                        </div>
                        <p className="mt-2 break-words text-sm font-bold text-gray-900 sm:text-base">{order.payment_method || "-"}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="shrink-0 text-gray-400" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Items</p>
                        </div>
                        <p className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">{itemCount}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl bg-green-50 p-4">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign size={16} className="shrink-0 text-green-500" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 sm:text-xs">Discount</p>
                        </div>
                        <p className="mt-2 break-words text-sm font-black text-green-600 sm:text-base">KSh {formatMoney(order.discount)}</p>
                      </div>
                      <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign size={16} className="shrink-0 text-blue-500" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 sm:text-xs">Order Total</p>
                        </div>
                        <p className="mt-1 break-words text-xl font-black text-blue-600 sm:text-2xl">KSh {formatMoney(order.total)}</p>
                      </div>
                    </div>
                    <div className="mt-6 min-w-0">
                      <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                        <h3 className="text-base font-black text-gray-900 sm:text-lg">Items</h3>
                        <span className="shrink-0 text-[11px] font-bold text-gray-500 sm:text-sm">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                      </div>
                      <div className="min-w-0 space-y-3">
                        {(order.items || []).map((item) => (
                          <div key={item.id} className="flex min-w-0 flex-col gap-3 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-bold leading-5 text-gray-900 sm:text-base">{item.product_name || `Product #${item.product_id}`}</p>
                              <p className="mt-1 break-words text-[11px] leading-5 text-gray-500 sm:text-sm">Qty: {item.quantity} <span className="mx-1.5">·</span> Unit price: KSh {formatMoney(item.price)}</p>
                            </div>
                            <p className="shrink-0 text-sm font-black text-gray-900 sm:text-base">KSh {formatMoney(item.subtotal ?? Number(item.price || 0) * Number(item.quantity || 0))}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(order.courier || order.tracking_number) && (
                      <div className="mt-5 min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:mt-6 sm:p-5">
                        <div className="flex items-center gap-2">
                          <Truck size={18} className="shrink-0 text-blue-600" />
                          <h3 className="text-base font-black text-gray-900 sm:text-lg">Shipping</h3>
                        </div>
                        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
                          {order.courier && (
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Courier</p>
                              <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">{order.courier}</p>
                            </div>
                          )}
                          {order.tracking_number && (
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Tracking Number</p>
                              <p className="mt-1 break-all text-sm font-bold text-gray-900 sm:text-base">{order.tracking_number}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-5 flex min-w-0 flex-col gap-2.5 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
                      {isPending && (
                        <button type="button" disabled={isCancelling} onClick={() => handleCancelOrder(order.id)} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-xs font-black transition active:scale-[0.99] sm:w-auto sm:text-sm ${isCancelling ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" : "border-red-300 bg-white text-red-600 hover:bg-red-50"}`}>
                          {isCancelling ? (<><RefreshCw size={15} className="animate-spin" />Cancelling...</>) : ("Cancel Order")}
                        </button>
                      )}
                      <Link to={`/account/orders/${order.id}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto sm:text-sm">
                        View Order
                        <ArrowUpRight size={15} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

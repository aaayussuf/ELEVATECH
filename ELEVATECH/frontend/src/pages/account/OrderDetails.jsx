import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, CreditCard, Package, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";
import socket from "../../services/socketService";
import OrderTimeline from "../../components/account/OrderTimeline";
function formatMoney(v) { return Number(v || 0).toLocaleString(); }
function formatDate(v) { if (!v) return "Date unavailable"; const d = new Date(v); return Number.isNaN(d.getTime()) ? "Date unavailable" : d.toLocaleString(); }
function getStatusClasses(s) { const v = String(s || "Pending").toLowerCase(); if (v === "cancelled") return "bg-red-50 text-red-700 border-red-100"; if (v === "delivered") return "bg-green-50 text-green-700 border-green-100"; if (v === "shipped") return "bg-purple-50 text-purple-700 border-purple-100"; if (v === "paid") return "bg-blue-50 text-blue-700 border-blue-100"; if (v === "processing") return "bg-indigo-50 text-indigo-700 border-indigo-100"; return "bg-yellow-50 text-yellow-700 border-yellow-100"; }
function getPaymentClasses(s) { const v = String(s || "").toLowerCase(); if (v === "paid") return "bg-green-50 text-green-700 border-green-100"; if (v === "failed") return "bg-red-50 text-red-700 border-red-100"; return "bg-yellow-50 text-yellow-700 border-yellow-100"; }
function Skeleton() { return (<div className="w-full animate-pulse space-y-5"><div className="h-5 w-32 rounded bg-gray-200" /><div className="rounded-2xl bg-white p-5 sm:rounded-3xl sm:p-6"><div className="h-8 w-32 rounded bg-gray-200" /><div className="mt-3 h-4 w-48 rounded bg-gray-100" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => (<div key={i} className="h-24 rounded-2xl bg-gray-200" />))}</div><div className="h-48 rounded-3xl bg-gray-200" /></div>); }
export default function OrderDetails() {
  const { user, token, isLoading: authLoading, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  useEffect(() => {
    if (!authLoading && !token) { navigate("/login"); return; }
    if (!authLoading && token) {
      let m = true;
      const load = async () => {
        try { setLoading(true); setError(""); const data = await accountService.getOrderDetails(token, id); if (m) setOrder(data); }
        catch (e) { console.error("Load order details error:", e); if (m) setError(e?.response?.data?.message || e?.message || "Unable to load order."); }
        finally { if (m) setLoading(false); }
      };
      load();
      return () => { m = false; };
    }
  }, [authLoading, token, id, navigate]);
  useEffect(() => {
    const h = (u) => {
      if (Number(u.order_id) !== Number(id)) return;
      setOrder((c) => { if (!c) return c; return { ...c, status: u.status ?? c.status, payment_status: u.payment_status ?? c.payment_status, tracking_number: u.tracking_number ?? c.tracking_number, courier: u.courier ?? c.courier, shipped_at: u.shipped_at ?? c.shipped_at, delivered_at: u.delivered_at ?? c.delivered_at }; });
    };
    socket.on("customer_order_updated", h);
    return () => { socket.off("customer_order_updated", h); };
  }, [id]);
  async function handleCancelOrder() {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try { setCancelling(true); setError(""); const u = await accountService.cancelOrder(token, id); setOrder(u); }
    catch (e) { console.error("Cancel order error:", e); setError(e?.response?.data?.message || e?.message || "Unable to cancel this order."); }
    finally { setCancelling(false); }
  }
  if (authLoading || loading) { return (<AccountLayout user={user} onLogout={logout}><Skeleton /></AccountLayout>); }
  if (error || !order) {
    return (
      <AccountLayout user={user} onLogout={logout}>
        <div className="w-full min-w-0 rounded-2xl border border-red-200 bg-red-50 p-4 sm:rounded-3xl sm:p-6">
          <h2 className="text-lg font-black text-red-700 sm:text-xl">Order not found</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-600">{error || "This order could not be found."}</p>
          <Link to="/account/orders" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto"><ArrowLeft size={16} />Back to Orders</Link>
        </div>
      </AccountLayout>
    );
  }
  const items = order.items || [];
  const itemCount = items.reduce((s, it) => s + Number(it.quantity || 0), 0);
  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
  const discount = Number(order.discount || 0);
  const isPending = String(order.status || "").toLowerCase() === "pending";
  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="w-full min-w-0 space-y-5 sm:space-y-6 md:space-y-7">
        <Link to="/account/orders" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-xs font-black text-blue-600 transition hover:text-blue-700 sm:text-sm"><ArrowLeft size={16} />Back to Orders</Link>
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 sm:text-xs">Order Details</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl md:text-4xl">#{order.id}</h1>
              <div className="mt-2 flex min-w-0 items-start gap-2 text-xs text-gray-500 sm:text-sm"><CalendarDays size={15} className="mt-0.5 shrink-0" /><span className="break-words">{formatDate(order.created_at)}</span></div>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <span className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-[11px] font-black capitalize sm:px-4 sm:text-xs ${getStatusClasses(order.status)}`}>{order.status || "Pending"}</span>
              <span className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-[11px] font-black capitalize sm:px-4 sm:text-xs ${getPaymentClasses(order.payment_status)}`}>{order.payment_status || "Payment Pending"}</span>
              {isPending && (<button type="button" onClick={handleCancelOrder} disabled={cancelling} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-xs">{cancelling && (<RefreshCw size={13} className="animate-spin" />)}{cancelling ? "Cancelling..." : "Cancel Order"}</button>)}
            </div>
          </div>
        </section>
        {error && (<div className="flex min-w-0 items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"><RefreshCw size={17} className="mt-0.5 shrink-0" /><p className="min-w-0 break-words text-xs font-bold leading-5 sm:text-sm">{error}</p></div>)}
        <div className="min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl"><OrderTimeline order={order} /></div>
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2"><CreditCard size={17} className="shrink-0 text-gray-400" /><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Payment Method</p></div>
            <p className="mt-2 break-words text-sm font-bold text-gray-900 sm:text-base">{order.payment_method || "—"}</p>
          </div>
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2"><Package size={17} className="shrink-0 text-gray-400" /><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Items</p></div>
            <p className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">{itemCount}</p>
          </div>
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Subtotal</p>
            <p className="mt-2 break-words text-lg font-black text-gray-900 sm:text-xl">KSh {formatMoney(subtotal)}</p>
          </div>
          <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 sm:text-xs">Order Total</p>
            <p className="mt-1 break-words text-xl font-black text-blue-600 sm:text-2xl">KSh {formatMoney(order.total)}</p>
            {discount > 0 && (<p className="mt-1 text-xs font-bold text-green-600">Saved KSh {formatMoney(discount)}</p>)}
          </div>
        </div>
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:rounded-3xl sm:p-5 md:p-6">
          <h2 className="text-lg font-black text-gray-900 sm:text-xl">Price Breakdown</h2>
          <div className="mt-4 w-full space-y-3 sm:ml-auto sm:max-w-md">
            <div className="flex items-center justify-between gap-4 text-sm"><span className="text-gray-500">Subtotal</span><span className="shrink-0 font-semibold text-gray-900">KSh {formatMoney(subtotal)}</span></div>
            <div className="flex items-center justify-between gap-4 text-sm"><span className="text-gray-500">Discount</span><span className="shrink-0 font-semibold text-green-600">- KSh {formatMoney(discount)}</span></div>
            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3"><span className="text-base font-black text-gray-900">Total</span><span className="shrink-0 text-lg font-black text-blue-600 sm:text-xl">KSh {formatMoney(order.total)}</span></div>
          </div>
        </section>
        <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:rounded-3xl">
          <div className="border-b border-gray-200 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="text-lg font-black text-gray-900 sm:text-2xl">Order Items</h2><p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">{itemCount} {itemCount === 1 ? "item" : "items"}</p></div>
              <Package size={20} className="shrink-0 text-gray-300" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {items.length === 0 ? (<div className="p-6 text-center text-sm text-gray-500 sm:p-8">No items found.</div>) : (items.map((item) => {
              const itemSubtotal = Number(item.subtotal ?? Number(item.price || 0) * Number(item.quantity || 0));
              return (
                <div key={item.id} className="flex min-w-0 flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    {item.image ? (<img src={item.image} alt={item.product_name || "Product"} className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover sm:h-20 sm:w-20" />) : (<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[10px] font-bold text-gray-400 sm:h-20 sm:w-20 sm:text-xs">No image</div>)}
                    <div className="min-w-0">
                      {item.product_slug ? (<Link to={`/product/${item.product_slug}`} className="group inline-flex max-w-full items-start gap-1 text-sm font-black leading-5 text-gray-900 transition hover:text-blue-600 sm:text-base"><span className="break-words">{item.product_name || `Product #${item.product_id}`}</span><ArrowUpRight size={13} className="mt-1 shrink-0 opacity-50 group-hover:opacity-100" /></Link>) : (<h3 className="break-words text-sm font-black leading-5 text-gray-900 sm:text-base">{item.product_name || `Product #${item.product_id}`}</h3>)}
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">Quantity: {item.quantity}</p>
                      <p className="text-xs text-gray-500 sm:text-sm">Unit price: KSh {formatMoney(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 md:block md:border-0 md:pt-0"><span className="text-xs font-bold text-gray-400 md:hidden">Item total</span><p className="shrink-0 text-base font-black text-gray-900 sm:text-lg">KSh {formatMoney(itemSubtotal)}</p></div>
                </div>
              );
            }))}
          </div>
        </section>


        {(order.courier || order.tracking_number) && (
          <section className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:rounded-3xl sm:p-5 md:p-6">
            <div className="flex items-center gap-2"><Truck size={19} className="shrink-0 text-blue-600" /><h2 className="text-lg font-black text-gray-900 sm:text-xl">Shipping Details</h2></div>
            <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
              {order.courier && (<div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Courier</p><p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">{order.courier}</p></div>)}
              {order.tracking_number && (<div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Tracking Number</p><p className="mt-1 break-all text-sm font-bold text-gray-900 sm:text-base">{order.tracking_number}</p></div>)}
            </div>
          </section>
        )}
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:rounded-3xl sm:p-5 md:p-6">
          <h2 className="text-lg font-black text-gray-900 sm:text-xl">Order Information</h2>
          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Order Status</p><p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">{order.status || "—"}</p></div>
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Payment Status</p><p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">{order.payment_status || "—"}</p></div>
            {order.tracking_number && (<div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Tracking Number</p><p className="mt-1 break-all text-sm font-bold text-gray-900 sm:text-base">{order.tracking_number}</p></div>)}
            {order.courier && (<div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400 sm:text-xs">Courier</p><p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">{order.courier}</p></div>)}
          </div>
        </section>
        <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Link to="/account/orders" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-black text-gray-900 transition hover:bg-gray-50 active:scale-[0.99] sm:w-auto sm:text-sm"><ArrowLeft size={15} />All Orders</Link>
          <Link to="/products" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto sm:text-sm"><ShoppingBag size={15} />Continue Shopping</Link>
        </div>
      </div>
    </AccountLayout>
  );
}



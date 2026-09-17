import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, Smartphone, Tag, ShieldCheck, ShoppingBag } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
const FALLBACK_IMAGE = "https://placehold.co/500x500?text=ElevaTech";
function formatPrice(v) { return `KSh ${Number(v || 0).toLocaleString()}`; }
export default function Checkout() {
const { token } = useContext(AuthContext);
const { cartItems } = useContext(CartContext);
const [paymentMethod, setPaymentMethod] = useState("Stripe");
const [phone, setPhone] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [couponCode, setCouponCode] = useState("");
const [couponMessage, setCouponMessage] = useState("");
const [discount, setDiscount] = useState(0);
const subtotal = cartItems.reduce((s, i) => s + Number(i.price || 0) * i.quantity, 0);
const total = Math.max(0, subtotal - Number(discount || 0));
async function applyCoupon() {
setCouponMessage("");
if (!couponCode.trim()) { setCouponMessage("Enter a coupon code."); return; }
try {
const r = await fetch(`${API_BASE}/api/coupons/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode.trim(), subtotal }) });
const d = await r.json();
if (!r.ok || !d.success) { setDiscount(0); setCouponMessage(d.message || "Invalid coupon."); return; }
setDiscount(Number(d.discount) || 0);
setCouponMessage("Coupon applied successfully!");
} catch { setCouponMessage("Unable to validate coupon."); }
}
async function handlePay(e) {
e.preventDefault();
setError("");
if (!token) { setError("Please login first."); return; }
if (cartItems.length === 0) { setError("Your cart is empty."); return; }
if (paymentMethod === "M-Pesa" && phone.trim() === "") { setError("Please enter your M-Pesa phone number."); return; }
setLoading(true);
let createdOrderId = null;
try {
const or = await fetch(`${API_BASE}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ payment_method: paymentMethod, coupon_code: couponCode.trim() || undefined, items: cartItems.map((it) => ({ product_id: it.id, quantity: it.quantity })) }) });
const od = await or.json().catch(() => ({}));
if (!or.ok || !od.order) throw new Error(od.message || "Failed to create order.");
createdOrderId = od.order.id;
if (typeof od.discount === "number") setDiscount(od.discount);
if (paymentMethod === "Stripe") {
const sr = await fetch(`${API_BASE}/api/checkout`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ order_id: createdOrderId }) });
const sd = await sr.json().catch(() => ({}));
if (!sr.ok || !sd.url) throw new Error(sd.error || "Failed to create Stripe Checkout session.");
window.location.href = sd.url;
return;
}
const mr = await fetch(`${API_BASE}/api/mpesa/stkpush`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ order_id: createdOrderId, phone }) });
const md = await mr.json().catch(() => ({}));
if (!mr.ok || !md.success) throw new Error(md.error || md.message || "Failed to initiate M-Pesa payment.");
alert(md.CustomerMessage || "M-Pesa prompt sent successfully. Please check your phone to authorize payment.");
} catch (err) {
console.error(err);
setError(err.message || "Something went wrong.");
if (createdOrderId) fetch(`${API_BASE}/api/orders/${createdOrderId}/cancel`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }).catch(() => {});
} finally { setLoading(false); }
}
if (cartItems.length === 0) {
return (
<div className="min-h-[65vh] bg-[#07101D] px-3 py-12 text-center text-white sm:px-5 sm:py-16">
<div className="mx-auto max-w-xl">
<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-24 sm:w-24 sm:rounded-3xl">
<ShoppingBag size={38} className="text-yellow-400" />
</div>
<h2 className="mt-6 text-2xl font-black sm:text-3xl">Your Cart is Empty</h2>
<p className="mx-auto mt-3 max-w-md text-sm text-slate-400">Add items to your cart before proceeding to checkout.</p>
<Link to="/products" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-yellow-400 px-8 py-3.5 text-sm font-black text-black hover:bg-yellow-300">Browse Products</Link>
</div>
</div>
);
}
return (
<div className="min-h-screen overflow-x-hidden bg-[#07101D] pb-12 text-white sm:pb-16">
<div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-5 sm:py-8 lg:px-8">
<Link to="/cart" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white sm:text-sm"><ArrowLeft size={16} className="shrink-0" />Back to cart</Link>
<div className="mt-5">
<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400 sm:text-xs"><ShieldCheck size={15} className="shrink-0" />Secure checkout</div>
<h1 className="mt-2 text-3xl font-black sm:text-5xl">Checkout</h1>
<p className="mt-2 max-w-xl text-sm text-slate-400">Choose your preferred payment method and complete your order securely.</p>
</div>
<form onSubmit={handlePay} className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
<div className="min-w-0 space-y-4">
<section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-6">
<div className="flex items-center gap-2"><Tag size={17} className="text-yellow-400" /><h2 className="text-base font-black sm:text-lg">Promo code</h2></div>
<div className="mt-4 flex flex-col gap-2.5 min-[480px]:flex-row">
<label htmlFor="checkout-coupon" className="sr-only">Promo code</label>
<input id="checkout-coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter promo code" autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B1628] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-yellow-400/60 sm:text-base" />
<button type="button" onClick={applyCoupon} className="min-h-12 rounded-xl bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/15">Apply</button>
</div>
{couponMessage && (<p role="status" className={`mt-3 text-xs font-semibold sm:text-sm ${couponMessage.includes("successfully") ? "text-emerald-300" : "text-slate-300"}`}>{couponMessage}</p>)}
</section>
<section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-6">
<h2 className="text-base font-black sm:text-lg">Payment method</h2>
<p className="mt-1 text-xs text-slate-500 sm:text-sm">Select how you would like to pay.</p>
<div className="mt-4 grid gap-3" role="radiogroup" aria-label="Payment method">
<label className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${paymentMethod === "Stripe" ? "border-yellow-400/50 bg-yellow-400/5" : "border-white/10 bg-[#0B1628]"}`}>
<input type="radio" value="Stripe" checked={paymentMethod === "Stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-5 w-5 accent-yellow-400" />
<div className="flex flex-1 items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><CreditCard size={19} className="text-blue-400" /></div><div><p className="text-sm font-bold sm:text-base">Stripe</p><p className="text-xs text-slate-500">Card payment</p></div></div>
{paymentMethod === "Stripe" && <CheckCircle2 size={18} className="text-yellow-400" />}
</label>
<label className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${paymentMethod === "M-Pesa" ? "border-yellow-400/50 bg-yellow-400/5" : "border-white/10 bg-[#0B1628]"}`}>
<input type="radio" value="M-Pesa" checked={paymentMethod === "M-Pesa"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-5 w-5 accent-yellow-400" />
<div className="flex flex-1 items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Smartphone size={19} className="text-emerald-400" /></div><div><p className="text-sm font-bold sm:text-base">M-Pesa</p><p className="text-xs text-slate-500">Mobile money</p></div></div>
{paymentMethod === "M-Pesa" && <CheckCircle2 size={18} className="text-yellow-400" />}
</label>
</div>
{paymentMethod === "M-Pesa" && (
<div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
<label htmlFor="mpesa-phone" className="block text-xs font-bold text-emerald-300 sm:text-sm">M-Pesa phone number</label>
<p className="mt-1 text-[11px] text-slate-500 sm:text-xs">Use the Kenyan number that should receive the payment prompt.</p>
<input id="mpesa-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-3 min-h-12 w-full rounded-xl border border-white/10 bg-[#0B1628] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 sm:text-base" />
</div>
)}
</section>
<section className="rounded-2xl border border-white/10 bg-[#0B1628] p-4 sm:p-5">
<div className="grid gap-3 min-[480px]:grid-cols-3">
<div className="flex items-start gap-2.5"><LockKeyhole size={17} className="mt-0.5 text-emerald-400" /><div><p className="text-xs font-bold">Secure payment</p><p className="text-[10px] text-slate-500">Protected checkout</p></div></div>
<div className="flex items-start gap-2.5"><ShieldCheck size={17} className="mt-0.5 text-blue-400" /><div><p className="text-xs font-bold">Trusted checkout</p><p className="text-[10px] text-slate-500">Safe order processing</p></div></div>
<div className="flex items-start gap-2.5"><ShoppingBag size={17} className="mt-0.5 text-yellow-400" /><div><p className="text-xs font-bold">Genuine products</p><p className="text-[10px] text-slate-500">Carefully selected tech</p></div></div>
</div>
</section>
{error && (<div role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div>)}
<button type="submit" disabled={loading} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-60 lg:hidden">{loading ? "Processing..." : (<><span>Pay {formatPrice(total)}</span><ArrowRight size={18} /></>)}</button>
</div>
<aside className="min-w-0 lg:sticky lg:top-6">
<div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:rounded-3xl sm:p-6">
<div className="flex items-center justify-between gap-3">
<h2 className="text-xl font-black sm:text-2xl">Order Summary</h2>
<span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400">{cartItems.length} product{cartItems.length === 1 ? "" : "s"}</span>
</div>
<div className="mt-5 space-y-3">
{cartItems.map((item) => (
<div key={item.id} className="flex items-center gap-3">
<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0B1628] p-1.5">
<img src={item.image || FALLBACK_IMAGE} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
</div>
<div className="min-w-0 flex-1">
<p className="line-clamp-2 text-xs font-bold leading-5 text-white">{item.name}</p>
<p className="mt-0.5 text-[10px] text-slate-500">Qty: {item.quantity}</p>
</div>
<span className="text-xs font-bold text-slate-200">{formatPrice(Number(item.price || 0) * item.quantity)}</span>
</div>
))}
</div>
<hr className="my-5 border-white/10" />
<div className="space-y-3 text-sm">
<div className="flex items-center justify-between gap-4 text-slate-400"><span>Subtotal</span><strong className="text-white">{formatPrice(subtotal)}</strong></div>
<div className="flex items-center justify-between gap-4 text-slate-400"><span>Discount</span><strong className="text-emerald-300">-{formatPrice(discount)}</strong></div>
</div>
<hr className="my-5 border-white/10" />
<div className="flex items-end justify-between gap-4"><span className="text-base font-bold">Total</span><span className="text-2xl font-black text-yellow-300 sm:text-3xl">{formatPrice(total)}</span></div>
<button type="submit" disabled={loading} className="mt-5 hidden min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-60 lg:flex">{loading ? "Processing..." : (<><span>Pay {formatPrice(total)}</span><ArrowRight size={18} /></>)}</button>
<div className="mt-4 flex flex-wrap justify-center gap-1.5">
<span className="rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-300">M-Pesa</span>
<span className="rounded-lg bg-blue-400/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-300">Visa</span>
<span className="rounded-lg bg-purple-400/10 px-2.5 py-1.5 text-[10px] font-bold text-purple-300">MasterCard</span>
<span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-bold text-slate-300">Stripe</span>
</div>
<p className="mt-4 text-center text-[10px] text-slate-500">By continuing, you confirm your order details and selected payment method.</p>
</div>
</aside>
</form>
</div>
</div>
);
}



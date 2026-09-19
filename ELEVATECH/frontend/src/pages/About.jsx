import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  PackageCheck,
  CreditCard,
  RotateCcw,
  Headset,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PHONE_DISPLAY = "+254 703683152";
const PHONE_TEL = "tel:+254703683152";
const WHATSAPP_URL =
  "https://wa.me/254703683152?text=Hi%20ELEVATECH!%20I%20have%20a%20question%20about%20a%20product.";
const EMAIL = "store.elevatech@gmail.com";

const stats = [
  { value: "8,500+", label: "Happy customers across Kenya" },
  { value: "4.9/5", label: "From 2,300+ verified reviews" },
  { value: "100%", label: "Genuine, sealed products" },
  { value: "47", label: "Counties served with tracking" },
];

const promises = [
  {
    icon: BadgeCheck,
    title: "100% Genuine, Factory-Sealed",
    text: "Every laptop, phone, printer and accessory is brand-new and sealed from authorized distributors. Serial numbers you can verify — no refurbished surprises, no grey imports.",
  },
  {
    icon: ShieldCheck,
    title: "Official Warranty + Proper Receipt",
    text: "Every order comes with official manufacturer warranty (typically 12 months, stated per product) plus a proper receipt and invoice you can use for business, insurance or warranty claims.",
  },
  {
    icon: CreditCard,
    title: "Pay Safely — Never Share Your PIN",
    text: "Checkout is encrypted. Pay with M-Pesa prompt on your phone, card or bank transfer. We never ask for your M-Pesa PIN — not on call, not on WhatsApp, not ever.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Replacement Guarantee",
    text: "Wrong item or faulty on arrival? Send us a photo or video on WhatsApp and we replace or refund fast. No long stories, no stress, no hidden conditions.",
  },
  {
    icon: Truck,
    title: "Tracked Delivery, Kenya-Wide",
    text: "Nairobi same/next-day delivery. Upcountry 1–3 days via trusted couriers. You can track in My Orders, and we call before delivery. Fees are shown upfront — no surprises.",
  },
  {
    icon: Headset,
    title: "Real Humans Before & After You Buy",
    text: "Talk to a real tech advisor before you spend a shilling — on WhatsApp or by calling +254 703683152. After delivery we help you set up your device free of charge.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      <section className="relative overflow-hidden bg-[#07101D]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[380px] w-[380px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
            <BadgeCheck size={13} /> About ELEVATECH
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Tech you can trust. <span className="text-yellow-400">People you can reach.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            ELEVATECH is a Nairobi-based technology store built on one simple promise:
            every shilling you spend with us buys a genuine product, protected payment,
            tracked delivery and real human support. No fakes. No games. No disappearing sellers.
          </p>
          <div className="mt-7 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
            <Link to="/products" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-sm font-black text-black shadow-xl shadow-yellow-400/20 transition hover:bg-yellow-300">
              Shop genuine tech <ArrowRight size={17} />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-black text-white transition hover:bg-emerald-400">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
            <a href={PHONE_TEL} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10">
              <Phone size={17} /> {PHONE_DISPLAY}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Star size={13} className="fill-yellow-400 text-yellow-400" /> 4.9/5 from 2,300+ verified buyers</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Buyer protection on every order</span>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#0A1322] p-5 text-center">
                <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">{s.value}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-white/5 bg-[#050B14] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
              <ShieldCheck size={13} /> The ELEVATECH Promise
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Why thousands of Kenyans <span className="text-yellow-400">shop with confidence</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Buying tech online should never feel risky. Here is exactly how we protect you.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#0A1322] p-6 transition hover:-translate-y-1 hover:border-yellow-400/30 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10">
                  <Icon size={22} className="text-yellow-400" />
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-white/5 bg-[#07101D] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                <PackageCheck size={14} /> Simple and transparent
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Ordering is easy. <span className="text-yellow-400">Tracking is automatic.</span>
              </h2>
              <div className="mt-7 space-y-4">
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1628] p-5">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div><p className="font-black text-white">1. Choose your product</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">Genuine stock, clear prices, warranty on every page.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1628] p-5">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div><p className="font-black text-white">2. Pay securely</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">M-Pesa prompt, card or bank transfer. Instant confirmation.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1628] p-5">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div><p className="font-black text-white">3. We confirm and pack</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">We confirm on phone or WhatsApp, then pack sealed + receipt.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1628] p-5">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div><p className="font-black text-white">4. Track to your door</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">Nairobi same/next-day, upcountry 1-3 days. Call before delivery.</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-[#0B1628] to-blue-500/10 p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400">
                <MapPin size={22} className="text-black" />
              </div>
              <h3 className="mt-5 text-2xl font-black">Visit us or verify us.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Come to Nairobi, video-call us on WhatsApp to see stock live,
                or call in working hours. A real person answers.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <Phone size={17} className="shrink-0 text-yellow-400" />
                  <a href={PHONE_TEL} className="font-black text-white">{PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <MapPin size={17} className="shrink-0 text-yellow-400" />
                  <span className="font-bold text-slate-200">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <Clock size={17} className="shrink-0 text-yellow-400" />
                  <span className="font-bold text-slate-200">Mon - Sat: 8am - 6pm</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-black text-white">
                  <MessageCircle size={17} /> WhatsApp Us
                </a>
                <a href={`mailto:${EMAIL}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white">
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#050B14] py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="rounded-[24px] border border-yellow-400/25 bg-gradient-to-br from-[#1A2B47] via-[#0D1A2D] to-[#0A1120] px-6 py-10 text-center">
            <h2 className="text-3xl font-black tracking-tight">
              Ready to shop <span className="text-yellow-400">without risk?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Genuine products, M-Pesa secured, tracked delivery, 7-day protection.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 min-[480px]:flex-row">
              <Link to="/products" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-black text-black">
                Shop genuine tech <ArrowRight size={18} />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white">
                <MessageCircle size={18} /> Chat first
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Link } from "react-router-dom";
import { CreditCard, MousePointerClick, PackageCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    step: "Step 1",
    title: "Find your perfect tech",
    text: "Browse verified products with clear specs, real photos and honest prices. Chat with us if unsure.",
  },
  {
    icon: CreditCard,
    step: "Step 2",
    title: "Pay safely your way",
    text: "Check out securely with M-Pesa, card or bank transfer. You get instant confirmation + receipt.",
  },
  {
    icon: PackageCheck,
    step: "Step 3",
    title: "Receive & enjoy, tracked",
    text: "We pack, seal and ship with tracking. Nairobi same-day, upcountry 1–3 days. 7-day return cover.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#050B14] py-10 sm:py-14 border-y border-white/5" aria-label="How ordering works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Simple & safe by design</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
              Ordering is easy. <span className="text-yellow-400">Trust is built-in.</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl leading-7">
              No guesswork, no risk. From the moment you click to the moment you unbox, you are protected.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition"
          >
            Start shopping <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map(({ icon: Icon, step, title, text }, i) => (
            <div key={title} className="relative rounded-3xl border border-white/10 bg-[#0B1628] p-7 overflow-hidden group hover:border-blue-400/40 transition">
              <span className="absolute -top-2 -right-2 text-[90px] font-black text-white/[0.04] leading-none select-none">
                {i + 1}
              </span>
              <span className="inline-flex rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">
                {step}
              </span>
              <div className="mt-5 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                <Icon size={22} className="text-blue-300" />
              </div>
              <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        {/* Payment trust strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-5">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 mr-2">Secure checkout with</span>
          {["M-PESA", "Visa", "Mastercard", "Bank Transfer", "SSL Secured"].map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/10 bg-[#0B1628] px-4 py-2 text-xs font-black tracking-wide text-slate-200"
            >
              {p === "M-PESA" ? <span className="text-emerald-400">{p}</span> : p === "SSL Secured" ? <span className="text-yellow-400">🔒 {p}</span> : p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

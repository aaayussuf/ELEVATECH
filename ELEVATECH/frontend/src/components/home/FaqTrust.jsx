import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronDown, MessageCircle, ShieldCheck } from "lucide-react";

const faqs = [
  {
    q: "Are your products 100% genuine?",
    a: "Yes. Brand-new, factory-sealed from authorized distributors. Verifiable serial, official warranty, receipt with every order. Not as described? Replace or refund in 7 days.",
  },
  {
    q: "How do I pay safely?",
    a: "Encrypted checkout. Pay with M-Pesa prompt on your phone, card or bank transfer. We never ask for your PIN. Instant SMS + email confirmation.",
  },
  {
    q: "How fast is delivery? Can I track it?",
    a: "Nairobi same/next-day. Upcountry 1-3 days via trusted couriers. Track anytime in My Orders + we call before delivery. Fees shown upfront.",
  },
  {
    q: "What if item is wrong or faulty?",
    a: "7-day replacement guarantee. WhatsApp us a photo/video (+254 700 000 000) and we replace or refund fast. Warranty claims handled by us.",
  },
  {
    q: "Warranty and after-sale support?",
    a: "Official warranty (typically 12 months, stated per product) + free setup help in-store or on WhatsApp after purchase.",
  },
  {
    q: "Can I verify you before paying?",
    a: "Yes — visit us in Nairobi Mon-Sat 8-6, call +254 700 000 000, or video-call on WhatsApp to see stock. Registered business, proper invoices.",
  },
];

export default function FaqTrust() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#050B14] py-10 sm:py-14 border-t border-white/5" aria-label="FAQ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck size={14} /> No fine print. Just answers.
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">Questions? <span className="text-yellow-400">Answered honestly.</span></h2>
            <p className="mt-4 text-slate-400 leading-7 max-w-md">Everything customers ask before their first order — answered openly. Still unsure? Talk to a real person.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://wa.me/254700000000?text=Hi%20ELEVATECH!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black text-white hover:bg-emerald-400 transition">
                <MessageCircle size={18} /> Ask on WhatsApp
              </a>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition">About ELEVATECH</Link>
            </div>
            <div className="mt-7 rounded-2xl border border-white/10 bg-[#0B1628] p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <BadgeCheck size={20} className="text-yellow-400" />
              </div>
              <p className="text-sm leading-6 text-slate-300"><span className="font-black text-white">Buyer Protection:</span> genuine product or your money back.</p>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className={`rounded-2xl border overflow-hidden transition ${isOpen ? "border-yellow-400/30 bg-[#101C31]" : "border-white/10 bg-[#0B1628]"}`}>
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left">
                    <span className="font-bold text-white text-sm sm:text-base">{f.q}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOpen ? "bg-yellow-400 text-black" : "bg-white/5 text-slate-400"}`}>
                      <ChevronDown size={17} className={isOpen ? "rotate-180" : ""} />
                    </span>
                  </button>
                  {isOpen && (<div className="px-5 pb-6 -mt-1"><p className="text-sm leading-7 text-slate-400">{f.a}</p></div>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

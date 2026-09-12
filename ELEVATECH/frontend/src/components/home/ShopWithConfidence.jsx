import { Award, FileCheck, MapPin, MessageCircle, PackageCheck, RotateCcw, ShieldCheck, Smartphone } from "lucide-react";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "100% Genuine & Sealed",
    text: "Every device is brand-new, factory-sealed with serial numbers you can verify. No refurbished surprises.",
    badge: "Verified Authentic",
  },
  {
    icon: FileCheck,
    title: "Warranty + Receipt",
    text: "Official warranty on every product plus proper VAT receipt & invoice for business claims.",
    badge: "Warranty Included",
  },
  {
    icon: Smartphone,
    title: "Pay Securely with M-Pesa",
    text: "Lipa na M-Pesa, cards or bank transfer through encrypted checkout. You never share PIN with us.",
    badge: "M-Pesa • Visa • Mastercard",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Returns",
    text: "Wrong item or faulty on arrival? We replace or refund fast — no long stories, no stress.",
    badge: "Buyer Protection",
  },
  {
    icon: PackageCheck,
    title: "Tracked Kenya-Wide Delivery",
    text: "Nairobi same-day, countrywide 1-3 days. You get tracking + delivery confirmation call.",
    badge: "Nairobi → 47 Counties",
  },
  {
    icon: MessageCircle,
    title: "Real Human Support",
    text: "Talk to a real tech advisor before you buy on WhatsApp or call. After-sale setup help free.",
    badge: "7 Days a Week",
  },
];

export default function ShopWithConfidence() {
  return (
    <section className="bg-[#07101D] py-10 sm:py-14" aria-label="Why shop with ELEVATECH">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
            <Award size={13} /> The ELEVATECH Promise
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
            Shop with <span className="text-yellow-400">100% confidence.</span>
          </h2>
          <p className="mt-4 text-slate-400 leading-7">
            Buying tech online in Kenya should never feel risky. Here is exactly
            how we protect every shilling you spend with us.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guarantees.map(({ icon: Icon, title, text, badge }) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#0A1322] p-6 sm:p-7 hover:border-emerald-400/40 hover:-translate-y-1 transition duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-emerald-300" />
                </div>
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {badge}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 via-[#0B1628] to-blue-500/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shrink-0">
              <MapPin size={22} className="text-black" />
            </div>
            <div>
              <p className="font-black text-white text-lg">Visit us or verify us — we are real.</p>
              <p className="mt-1 text-sm text-slate-400 leading-6">
                Nairobi, Kenya • +254 700 000 000 • store.elevatech@gmail.com • Open Mon–Sat 8am–6pm.
                Come see the product before you pay, or order online with full tracking.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://wa.me/254700000000?text=Hi%20ELEVATECH!%20I%20need%20help%20choosing%20a%20product."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black text-white hover:bg-emerald-400 transition"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <a
              href="tel:+254700000000"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition"
            >
              Call Store
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

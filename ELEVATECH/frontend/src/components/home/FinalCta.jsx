import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, Star } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="bg-[#07101D] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[24px] border border-yellow-400/25 bg-gradient-to-br from-[#1A2B47] via-[#0D1A2D] to-[#0A1120] px-6 py-8 sm:px-10 sm:py-10 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-yellow-400/10 blur-[100px] rounded-full" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">
              <Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9/5 from 2,300+ verified buyers
            </p>
            <h2 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight leading-[1.05]">
              Ready to shop tech <span className="text-yellow-400">without the risk?</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-slate-400 leading-7">
              Genuine products, secure M-Pesa checkout, tracked delivery and
              7-day buyer protection — on every single order.
            </p>
            <div className="mt-8 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap justify-center gap-3">
              <Link to="/products" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-black text-black hover:bg-yellow-300 transition shadow-xl shadow-yellow-400/20">
                Shop genuine tech <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/254703683152" target="_blank" rel="noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition">
                <MessageCircle size={18} /> Chat first
              </a>
            </div>
            <p className="mt-6 inline-flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Buyer protection</span>
              <span>• M-Pesa secured</span>
              <span>• Nairobi store you can visit</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

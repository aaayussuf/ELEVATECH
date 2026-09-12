import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
  Check,
} from "lucide-react";

const products = [
  {
    src: "/assets/products/macbook-pro-m4.png",
    label: "MacBook Pro M4",
    className:
      "w-[72%] top-7 left-[-2%] rotate-[-5deg]",
  },

  {
    src: "/assets/products/iphone-17.png",
    label: "iPhone 17",
    className:
      "w-[35%] bottom-3 right-[2%] rotate-[5deg]",
  },

  {
    src: "/assets/products/gaming-keyboard.png",
    label: "Gaming",
    className:
      "w-[43%] bottom-5 left-[7%] rotate-[2deg]",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07101D]">

      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-300px] left-[-200px] w-[600px] h-[600px] rounded-full bg-yellow-400/10 blur-[160px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10 lg:pt-10 lg:pb-12 elevatech-hero-inner">

        <div className="grid lg:grid-cols-[1.02fr_.98fr] hero-grid-tablet gap-8 lg:gap-12 items-center">

          {/* LEFT */}
          <div className="min-w-0">

            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-[11px] font-black tracking-[0.14em] text-yellow-300 uppercase">

              <Zap
                size={14}
                className="text-yellow-400 shrink-0"
              />

              <span className="truncate">The smarter way to shop tech</span>

            </div>

            <h1 className="text-display mt-7 max-w-2xl font-black">

              Smarter

              <br />

              <span className="text-yellow-400">made for more.</span>

            </h1>

            <p className="mt-7 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-300">

              Premium laptops, smartphones, printers and accessories from trusted brands, carefully selected for the way you live, work and create.

            </p>
<div className="mt-9 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap gap-3">

              <Link
                to="/products"
                className="inline-flex w-full min-[480px]:w-auto items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 min-h-[52px] font-black text-[#050B14] hover:bg-yellow-300 transition shadow-xl shadow-yellow-400/10"
              >
                Shop the collection

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products?featured=true"
                className="inline-flex w-full min-[480px]:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 min-h-[52px] font-bold text-white hover:bg-white/[0.08] transition"
              >
                Browse best sellers

                <ChevronRight size={18} />
              </Link>

            </div>

            <div className="mt-9 grid grid-cols-1 min-[480px]:grid-cols-3 gap-x-5 gap-y-4 max-w-xl">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center">
                  <ShieldCheck
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Trusted shopping
                  </p>

                  <p className="text-[10px] text-slate-500">
                    M-Pesa & card ready
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/10 flex items-center justify-center">
                  <Truck
                    size={18}
                    className="text-yellow-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Kenya-wide
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Delivery available
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center">
                  <Zap
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Curated tech
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Built for modern life
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT PRODUCT COMPOSITION */}
          <div className="hero-visual relative min-h-[380px] min-[480px]:min-h-[430px] sm:min-h-[540px] min-w-0">
<div className="absolute inset-10 rounded-full bg-blue-500/15 blur-[100px]" />

            <div className="absolute inset-0 rounded-[42px] border border-white/10 bg-gradient-to-br from-[#142A49] via-[#0B182B] to-[#091321] overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

              <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-400/5 rounded-full blur-[70px]" />

            </div>

            <div className="absolute bottom-5 left-5 z-30 hidden sm:block rounded-2xl border border-white/10 bg-[#091321]/95 px-4 py-3 shadow-2xl">
              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Shopping, simplified</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white">
                <Check size={14} className="text-emerald-400" />
                Carefully checked. Clearly priced.
              </p>
            </div>

            {/* LOGO BADGE */}
            <div className="hero-badge-top absolute top-5 left-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/90 backdrop-blur-xl p-3 shadow-2xl">

              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH"
                className="w-[135px]"
              />

            </div>

            {/* STANDARD BADGE */}
            <div className="hero-badge-standard absolute top-5 right-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/90 backdrop-blur-xl px-4 py-3 shadow-2xl max-w-[46%] sm:max-w-none">

              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                ELEVATECH standard
              </p>

              <div className="mt-1 flex items-center gap-2 font-bold text-xs text-white">

                <ShieldCheck
                  size={15}
                  className="text-yellow-400"
                />

                Smarter choices

              </div>

            </div>

            {/* PRODUCTS */}
            {products.map((product) => (
              <div
                key={product.src}
                className={`absolute ${product.className}`}
              >

                <div className="rounded-3xl border border-white/10 bg-[#08111F]/80 backdrop-blur-md p-4 shadow-2xl shadow-black/50">

                  <img
                    src={product.src}
                    alt={product.label}
                    className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,.55)]"
                  />

                </div>

              </div>
            ))}
{/* BOTTOM CARD */}
            <div className="hero-bottom-card absolute bottom-5 right-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/95 backdrop-blur-xl p-4 shadow-2xl max-w-[200px] min-[480px]:max-w-[220px]">

              <div className="flex items-center gap-2 text-sm font-bold text-white">

                <Truck
                  size={17}
                  className="text-blue-400"
                />

                Kenya-wide delivery

              </div>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Professional service from checkout
                through delivery.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
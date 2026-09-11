import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
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
    <section className="relative overflow-hidden bg-[#050B14]">

      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-300px] left-[-200px] w-[600px] h-[600px] rounded-full bg-yellow-400/10 blur-[160px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-14 lg:pt-20 lg:pb-20">

        <div className="grid lg:grid-cols-[1.02fr_.98fr] gap-12 lg:gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black tracking-[0.14em] text-blue-300 uppercase">

              <Zap
                size={14}
                className="text-yellow-400"
              />

              Premium technology. Better selected.

            </div>

            <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl xl:text-[78px] font-black leading-[0.96] tracking-[-0.045em]">

              Smarter

              <br />

              <span className="text-white">
                tech.
              </span>

              <br />

              <span className="text-yellow-400">
                Better living.
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-base sm:text-lg leading-8 text-slate-300">

              Discover premium laptops, smartphones,
              printers, gaming gear and accessories
              from trusted brands — carefully selected
              for the way you live, work and create.

            </p>
<div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-xl shadow-yellow-400/10"
              >
                Shop Collection

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products?featured=true"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 font-bold text-white hover:bg-white/[0.08] transition"
              >
                Explore Deals

                <ChevronRight size={18} />
              </Link>

            </div>

            <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">

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
                    Secure checkout
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
          <div className="relative min-h-[430px] sm:min-h-[540px]">
<div className="absolute inset-10 rounded-full bg-blue-500/15 blur-[100px]" />

            <div className="absolute inset-0 rounded-[42px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.025] to-transparent overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

              <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-400/5 rounded-full blur-[70px]" />

            </div>

            {/* LOGO BADGE */}
            <div className="absolute top-5 left-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/90 backdrop-blur-xl p-3 shadow-2xl">

              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH"
                className="w-[135px]"
              />

            </div>

            {/* STANDARD BADGE */}
            <div className="absolute top-5 right-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/90 backdrop-blur-xl px-4 py-3 shadow-2xl">

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
            <div className="absolute bottom-5 right-5 z-30 rounded-2xl border border-white/10 bg-[#091321]/95 backdrop-blur-xl p-4 shadow-2xl max-w-[220px]">

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
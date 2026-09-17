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
      <div className="pointer-events-none absolute -right-32 -top-48 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[120px] sm:h-[560px] sm:w-[560px] sm:blur-[150px] lg:h-[700px] lg:w-[700px] lg:blur-[160px]" />

      <div className="pointer-events-none absolute -bottom-[220px] -left-[160px] h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-[120px] sm:h-[520px] sm:w-[520px] sm:blur-[150px] lg:h-[600px] lg:w-[600px] lg:blur-[160px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] opacity-[0.025] [background-size:24px_24px]" />

      <div className="elevatech-hero-inner relative mx-auto w-full max-w-7xl px-3 pb-8 pt-5 sm:px-5 sm:pb-10 sm:pt-7 md:px-6 md:pb-12 md:pt-8 lg:px-8 lg:pt-10">
        <div className="hero-grid-tablet grid min-w-0 grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-yellow-300 min-[375px]:text-[10px] sm:px-4 sm:text-[11px] sm:tracking-[0.14em]">
              <Zap
                size={13}
                className="shrink-0 text-yellow-400 sm:h-[14px] sm:w-[14px]"
              />

              <span className="truncate">
                The smarter way to shop tech
              </span>
            </div>

            <h1 className="text-display mt-5 max-w-2xl font-black sm:mt-7">
              Smarter
              <br />
              <span className="text-yellow-400">
                made for more.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 min-[375px]:text-base min-[375px]:leading-7 sm:mt-7 sm:text-lg sm:leading-8">
              Premium laptops, smartphones, printers and
              accessories from trusted brands, carefully
              selected for the way you live, work and create.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-7 flex min-w-0 flex-col gap-2.5 min-[480px]:flex-row min-[480px]:flex-wrap sm:mt-9 sm:gap-3">
              <Link
                to="/products"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-black text-[#050B14] shadow-xl shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-[0.99] min-[480px]:w-auto sm:px-7 sm:py-4"
              >
                <span>Shop the collection</span>
                <ArrowRight size={17} className="shrink-0 sm:h-[18px] sm:w-[18px]" />
              </Link>

              <Link
                to="/products?featured=true"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08] active:scale-[0.99] min-[480px]:w-auto sm:px-7 sm:py-4"
              >
                <span>Browse best sellers</span>
                <ChevronRight size={17} className="shrink-0 sm:h-[18px] sm:w-[18px]" />
              </Link>
            </div>

            {/* TRUST POINTS */}
            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 min-[480px]:grid-cols-3 min-[480px]:gap-4 sm:mt-9 sm:gap-x-5 sm:gap-y-4">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  <ShieldCheck size={17} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-white sm:text-xs">
                    Trusted shopping
                  </p>
                  <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">
                    M-Pesa & card ready
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/10 bg-yellow-400/10">
                  <Truck size={17} className="text-yellow-400" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-white sm:text-xs">
                    Kenya-wide
                  </p>
                  <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">
                    Delivery available
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  <Zap size={17} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-white sm:text-xs">
                    Curated tech
                  </p>
                  <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">
                    Built for modern life
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PRODUCT COMPOSITION */}
          <div className="hero-visual relative min-h-[310px] min-w-0 min-[375px]:min-h-[350px] min-[480px]:min-h-[410px] sm:min-h-[500px] md:min-h-[540px]">
            <div className="absolute inset-8 rounded-full bg-blue-500/15 blur-[75px] sm:inset-10 sm:blur-[100px]" />

            <div className="absolute inset-0 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#142A49] via-[#0B182B] to-[#091321] sm:rounded-[36px] lg:rounded-[42px]">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-blue-500/10 blur-[65px] sm:h-64 sm:w-64 sm:blur-[80px]" />

              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-yellow-400/5 blur-[60px] sm:h-56 sm:w-56 sm:blur-[70px]" />
            </div>

            {/* DESKTOP SUPPORT CARD */}
            <div className="absolute bottom-5 left-5 z-30 hidden rounded-2xl border border-white/10 bg-[#091321]/95 px-4 py-3 shadow-2xl sm:block">
              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Shopping, simplified
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white">
                <Check size={14} className="text-emerald-400" />
                Carefully checked. Clearly priced.
              </p>
            </div>

            {/* LOGO BADGE */}
            <div className="hero-badge-top absolute left-3 top-3 z-30 rounded-xl border border-white/10 bg-[#091321]/90 p-2.5 shadow-2xl backdrop-blur-xl min-[375px]:left-4 min-[375px]:top-4 sm:left-5 sm:top-5 sm:rounded-2xl sm:p-3">
              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH"
                className="w-[95px] min-[375px]:w-[110px] sm:w-[135px]"
              />
            </div>

            {/* STANDARD BADGE */}
            <div className="hero-badge-standard absolute right-3 top-3 z-30 max-w-[48%] rounded-xl border border-white/10 bg-[#091321]/90 px-2.5 py-2 shadow-2xl backdrop-blur-xl min-[375px]:right-4 min-[375px]:top-4 sm:right-5 sm:top-5 sm:max-w-none sm:rounded-2xl sm:px-4 sm:py-3">
              <p className="truncate text-[7px] uppercase tracking-[0.12em] text-slate-500 min-[375px]:text-[8px] sm:text-[9px] sm:tracking-[0.18em]">
                ELEVATECH standard
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[9px] font-bold text-white min-[375px]:text-[10px] sm:gap-2 sm:text-xs">
                <ShieldCheck
                  size={13}
                  className="shrink-0 text-yellow-400 sm:h-[15px] sm:w-[15px]"
                />
                <span className="truncate">Smarter choices</span>
              </div>
            </div>

            {/* PRODUCTS */}
            {products.map((product) => (
              <div
                key={product.src}
                className={`absolute ${product.className}`}
              >
                <div className="rounded-2xl border border-white/10 bg-[#08111F]/80 p-2.5 shadow-2xl shadow-black/50 backdrop-blur-md min-[480px]:rounded-3xl min-[480px]:p-3 sm:p-4">
                  <img
                    src={product.src}
                    alt={product.label}
                    className="h-auto w-full object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,.55)] sm:drop-shadow-[0_25px_35px_rgba(0,0,0,.55)]"
                  />
                </div>
              </div>
            ))}

            {/* BOTTOM CARD */}
            <div className="hero-bottom-card absolute bottom-3 right-3 z-30 max-w-[155px] rounded-xl border border-white/10 bg-[#091321]/95 p-2.5 shadow-2xl backdrop-blur-xl min-[375px]:bottom-4 min-[375px]:right-4 min-[375px]:max-w-[175px] sm:bottom-5 sm:right-5 sm:max-w-[220px] sm:rounded-2xl sm:p-4">
              <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold text-white min-[375px]:text-[11px] sm:gap-2 sm:text-sm">
                <Truck
                  size={14}
                  className="shrink-0 text-blue-400 sm:h-[17px] sm:w-[17px]"
                />

                <span className="truncate">
                  Kenya-wide delivery
                </span>
              </div>

              <p className="mt-1 text-[9px] leading-4 text-slate-400 min-[375px]:text-[10px] sm:text-xs sm:leading-5">
                Professional service from checkout through delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

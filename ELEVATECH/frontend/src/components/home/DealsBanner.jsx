import { Link } from "react-router-dom";

import {
  ArrowRight,
  Tag,
} from "lucide-react";

export default function DealsBanner() {
  return (
    <section className="w-full overflow-hidden bg-[#07101D] py-8 sm:py-12 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-[#172640] via-[#0D1A2D] to-[#09111E] px-4 py-7 min-[375px]:rounded-3xl min-[375px]:px-5 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:rounded-[32px] lg:px-12 lg:py-14">
          {/* BACKGROUND GLOWS */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-yellow-400/10 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-24 right-4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl sm:right-10 sm:h-64 sm:w-64" />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_white_1px,_transparent_1px)] opacity-[0.025] [background-size:22px_22px]" />

          <div className="relative flex min-w-0 flex-col gap-7 md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            {/* CONTENT */}
            <div className="min-w-0 max-w-3xl">
              <span className="inline-flex max-w-full items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-400 sm:text-xs sm:tracking-[0.2em]">
                <Tag
                  size={14}
                  className="shrink-0 sm:h-[15px] sm:w-[15px]"
                />
                <span>Selected offers</span>
              </span>

              <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white min-[375px]:text-3xl sm:mt-4 sm:text-4xl md:text-5xl">
                Smart upgrades.
                <br className="hidden min-[480px]:block" />
                <span className="text-yellow-400">
                  {" "}Better value.
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7 md:text-lg md:leading-8">
                Discover selected technology at compelling prices
                without compromising on the ELEVATECH shopping
                experience.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/products?featured=true"
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-black text-black shadow-xl shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-[0.99] min-[480px]:w-fit sm:px-7 sm:py-4"
            >
              <span>Explore deals</span>
              <ArrowRight
                size={18}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

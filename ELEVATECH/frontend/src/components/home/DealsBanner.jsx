import { Link } from "react-router-dom";

import {
  ArrowRight,
  Tag,
} from "lucide-react";

export default function DealsBanner() {
  return (
    <section className="bg-[#07101D] py-8 sm:py-14">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="relative overflow-hidden rounded-[32px] border border-yellow-400/20 bg-gradient-to-br from-[#172640] via-[#0D1A2D] to-[#09111E] px-6 py-10 sm:px-10 sm:py-12">

          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="absolute right-10 bottom-[-100px] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">

                <Tag size={15} />

                Selected offers

              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl font-black">
                Smart upgrades. Better value.
              </h2>

              <p className="mt-3 text-slate-400 leading-7">
                Discover selected technology at compelling prices without compromising on the ELEVATECH shopping experience.
              </p>

            </div>

            <Link
              to="/products?featured=true"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-black text-black hover:bg-yellow-300 transition"
            >
              Explore deals
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}
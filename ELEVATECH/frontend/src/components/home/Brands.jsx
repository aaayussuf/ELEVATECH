import { Link } from "react-router-dom";

const brands = [
  "Apple",
  "Samsung",
  "Dell",
  "HP",
  "Lenovo",
  "Canon",
];

export default function Brands() {
  return (
    <section className="w-full overflow-hidden border-y border-white/5 bg-[#07101D] py-8 sm:py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="min-w-0 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-[0.2em] md:text-xs md:tracking-[0.22em]">
            Technology from trusted names
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5 min-[375px]:gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-3.5 md:mt-8 md:grid-cols-6 md:gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${encodeURIComponent(brand)}`}
                className="flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.05] hover:text-white active:scale-[0.98] min-[375px]:px-4 sm:rounded-full sm:text-sm md:min-h-12"
              >
                <span className="truncate">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
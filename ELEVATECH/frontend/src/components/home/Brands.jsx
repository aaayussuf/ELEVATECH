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
    <section className="bg-[#07101D] py-16 border-y border-white/5">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center">

          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Technology from trusted names
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">

            {brands.map((brand) => (

              <Link
                key={brand}
                to={`/products?brand=${encodeURIComponent(brand)}`}
                className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.025] text-sm font-bold text-slate-300 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.05] transition"
              >
                {brand}
              </Link>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Laptop,
  Smartphone,
  Printer,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

const fallback = [
  {
    id: 1,
    name: "Laptops",
    description: "Workstations for work, study and creation.",
    image: "/assets/products/brands/laptops.png",
  },
  {
    id: 3,
    name: "Phones",
    description: "Powerful smartphones for every day.",
    image: "/assets/products/brands/phones.png",
  },
  {
    id: 2,
    name: "Printers",
    description: "Reliable printing for home and office.",
    image: "/assets/products/brands/printers.png",
  },
  {
    id: 4,
    name: "Accessories",
    description: "The finishing touches for your setup.",
    image: "/assets/products/brands/accessories.png",
  },
];

const icons = {
  laptops: Laptop,
  phones: Smartphone,
  printers: Printer,
  accessories: Headphones,
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState(fallback);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/categories")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full overflow-hidden bg-[#07101D] py-10 sm:py-14 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-7 flex min-w-0 flex-col gap-4 sm:mb-9 sm:gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-400 sm:text-xs sm:tracking-[0.22em]">
              Explore the collection
            </p>

            <h2 className="mt-2.5 max-w-2xl text-3xl font-black leading-[1.05] tracking-tight text-white min-[375px]:text-[34px] sm:mt-3 sm:text-4xl md:text-5xl">
              Shop by category
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Start with the technology that fits your world.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white transition hover:border-blue-400/30 hover:bg-white/[0.06] hover:text-yellow-400 active:scale-[0.99] sm:border-0 sm:bg-transparent sm:px-0 sm:py-2"
          >
            <span>View all products</span>
            <ArrowUpRight size={17} className="shrink-0" />
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {categories.slice(0, 4).map((category) => {
            const Icon =
              icons[category.name?.toLowerCase()] || Laptop;

            const image = category.image
              ? category.image.startsWith(
                  "/assets/products/brands/"
                )
                ? category.image
                : `/assets/products/brands/${
                    category.image.split("/").pop()
                  }`
              : "";

            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative flex min-h-[300px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#091321] p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-950/20 active:scale-[0.995] min-[375px]:min-h-[315px] min-[375px]:rounded-3xl min-[375px]:p-5 sm:min-h-[340px] sm:p-5 md:min-h-[360px] lg:min-h-[380px] lg:p-6"
              >
                {/* TOP CONTROLS */}
                <div className="relative z-20 flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-300 sm:h-11 sm:w-11">
                    <Icon size={19} />
                  </span>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition duration-300 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black sm:h-11 sm:w-11">
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                {/* IMAGE AREA */}
                <div className="pointer-events-none absolute inset-x-4 top-[68px] flex h-[170px] items-center justify-center min-[375px]:inset-x-5 min-[375px]:top-[72px] min-[375px]:h-[180px] sm:top-[78px] sm:h-[195px] md:h-[205px] lg:top-[82px] lg:h-[215px]">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-[78%] object-contain opacity-90 drop-shadow-[0_18px_25px_rgba(0,0,0,.35)] transition duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 sm:max-w-[80%]"
                    />
                  ) : (
                    <Icon
                      size={88}
                      strokeWidth={1.5}
                      className="text-blue-500/50 sm:h-[100px] sm:w-[100px]"
                    />
                  )}
                </div>

                {/* BOTTOM CONTENT */}
                <div className="relative z-20 mt-auto min-w-0 pt-[190px] min-[375px]:pt-[200px] sm:pt-[215px] md:pt-[225px] lg:pt-[235px]">
                  <h3 className="text-xl font-black leading-tight text-white min-[375px]:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                    {category.description ||
                      "Explore our latest selection."}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300 opacity-90 transition group-hover:text-yellow-400 sm:mt-4 sm:text-[11px]">
                    <span>Explore category</span>
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

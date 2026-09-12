import { Link } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

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
    description:
      "Workstations for work, study and creation.",
    image:
      "/assets/products/brands/laptops.png",
  },
  {
    id: 3,
    name: "Phones",
    description:
      "Powerful smartphones for every day.",
    image:
      "/assets/products/brands/phones.png",
  },
  {
    id: 2,
    name: "Printers",
    description:
      "Reliable printing for home and office.",
    image:
      "/assets/products/brands/printers.png",
  },
  {
    id: 4,
    name: "Accessories",
    description:
      "The finishing touches for your setup.",
    image:
      "/assets/products/brands/accessories.png",
  },
];

const icons = {
  laptops: Laptop,
  phones: Smartphone,
  printers: Printer,
  accessories: Headphones,
};

export default function CategoriesSection() {

  const [categories, setCategories] =
    useState(fallback);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:5000/api/categories")
      .then((res) => {

        if (
          Array.isArray(res.data) &&
          res.data.length
        ) {
          setCategories(res.data);
        }

      })
      .catch(() => {});

  }, []);

  return (
    <section className="bg-[#07101D] py-10 sm:py-14">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              Explore the collection
            </p>

            <h2 className="mt-3 text-3xl min-[480px]:text-4xl sm:text-5xl font-black tracking-tight text-balance">
              Shop by category
            </h2>

            <p className="mt-3 text-slate-400 max-w-xl">
              Start with the technology that fits your world.
            </p>

          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-400 transition"
          >
            View all products
            <ArrowUpRight size={17} />
          </Link>

        </div>

        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4">

          {categories
            .slice(0, 4)
            .map((category) => {

              const Icon =
                icons[
                  category.name?.toLowerCase()
                ] || Laptop;

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
                  className="group relative min-h-[330px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#091321] p-5 flex flex-col justify-between hover:border-blue-400/50 transition"
                >

                  <div className="flex items-start justify-between relative z-10">

                    <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-300">
                      <Icon size={19} />
                    </span>

                    <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-yellow-400 group-hover:text-black transition">
                      <ArrowUpRight size={17} />
                    </span>

                  </div>

                  <div className="absolute inset-x-5 top-16 h-44 flex items-center justify-center">

                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="max-h-40 max-w-[78%] object-contain opacity-90 group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <Icon
                        size={100}
                        className="text-blue-500/60"
                      />
                    )}

                  </div>

                  <div className="relative z-10">

                    <h3 className="text-2xl font-black">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {category.description ||
                        "Explore our latest selection."}
                    </p>

                  </div>

                </Link>
              );

            })}

        </div>

      </div>

    </section>
  );
}
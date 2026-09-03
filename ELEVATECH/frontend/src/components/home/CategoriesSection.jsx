import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Laptop,
  Smartphone,
  Printer,
  Headphones,
  ArrowRight,
} from "lucide-react";

const icons = {
  laptops: Laptop,
  phones: Smartphone,
  printers: Printer,
  accessories: Headphones,
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/categories")
      .then((res) => {
setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <section className="bg-[#07101D] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-blue-500 font-semibold uppercase tracking-widest">
              Browse
            </p>

            <h2 className="text-5xl font-black mt-2">
              Shop By Category
            </h2>
          </div>

          <button className="text-blue-400 flex items-center gap-2 hover:text-yellow-400 transition">
            View All
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {categories.map((category) => {
            const Icon =
              icons[category.name.toLowerCase()] || Laptop;

            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
className="group rounded-3xl border border-slate-800 bg-gradient-to-b from-[#101C31] to-[#0B1425] overflow-hidden hover:border-blue-500 transition duration-300 hover:-translate-y-2 block"
              >
                <div className="h-56 bg-[#09101B] flex items-center justify-center">

                  {category.image ? (
                    <img
                      src={
                        category.image?.startsWith("/assets/products/brands/")
                          ? category.image
                          : `/assets/products/brands/${category.image?.split("/").pop()}`
                      }
                      alt={category.name}
                      className="w-40 h-40 object-contain group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <Icon
                      size={90}
                      className="text-blue-500"
                    />
                  )}

                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-bold">
                    {category.name}
                  </h3>

                  <p className="text-gray-400 mt-3 text-sm">
                    {category.description}
                  </p>

                  <div className="mt-6 text-yellow-400 flex items-center gap-2 group-hover:text-blue-400 transition">
                    Shop Now
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
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

import {
  useEffect,
  useState,
  useContext,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import ProductCard from "../ProductCard";

import productService from "../../services/productService";

import { CartContext } from "../../context/CartContext";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    productService
      .getFeaturedProducts()
      .then((data) => {
        setProducts(
          Array.isArray(data)
            ? data
            : data.products || []
        );
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-slate-50 py-10 text-slate-900 sm:py-14 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-7 flex min-w-0 flex-col gap-4 sm:mb-9 sm:gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="inline-flex max-w-full items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 sm:text-xs sm:tracking-[0.22em]">
              <Sparkles
                size={13}
                className="shrink-0 sm:h-[14px] sm:w-[14px]"
              />
              <span>Curated for you</span>
            </p>

            <h2 className="mt-2.5 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight min-[375px]:text-[34px] sm:mt-3 sm:text-4xl md:text-5xl">
              Featured technology
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              A focused selection of standout products.
            </p>
          </div>

          <Link
            to="/products?featured=true"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 active:scale-[0.99] sm:border-0 sm:bg-transparent sm:px-0 sm:py-2 sm:shadow-none"
          >
            <span>Shop featured</span>
            <ArrowRight
              size={17}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid min-w-0 grid-cols-2 gap-2.5 min-[375px]:gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="min-w-0"
            >
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

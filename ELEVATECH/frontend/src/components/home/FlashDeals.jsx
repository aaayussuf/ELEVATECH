import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import {
  ArrowRight,
  Flame,
  ShoppingCart,
  Star,
  Tag,
} from "lucide-react";

import { CartContext } from "../../context/CartContext";

import productService from "../../services/productService";

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;
const SECOND_MS = 1000;

function nextMidnight() {
  const target = new Date();
  target.setHours(23, 59, 59, 999);
  return target;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function FlashDeals() {
  const [products, setProducts] = useState([]);

  const [now, setNow] = useState(new Date());

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    productService
      .getProducts({ per_page: 20 })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || [];
        const deals = list.filter((product) => product.has_discount);
        setProducts(deals.length >= 4 ? deals : list.slice(0, 4));
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products.length) {
    return null;
  }

  const diff = Math.max(nextMidnight() - now, 0);

  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((diff % MINUTE_MS) / SECOND_MS);

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Mins" },
    { value: seconds, label: "Secs" },
  ];

  return (
    <section className="bg-[#050B14] py-20 sm:py-24 overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[32px] border border-yellow-400/25 bg-gradient-to-br from-[#1A2B47] via-[#101C31] to-[#0A1120] p-7 sm:p-10 lg:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-red-300 animate-glow">
                <Flame size={13} />
                Limited time
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Today&rsquo;s hottest
                <span className="text-yellow-400"> deals.</span>
              </h2>

              <p className="mt-3 text-slate-400 leading-7 max-w-xl">
                Big savings on selected technology &mdash; while stock lasts.
                No compromise on authenticity, warranty or delivery.
              </p>

              <Link
                to="/products?featured=true"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white hover:bg-white/[0.08] transition"
              >
                View all deals
                <ArrowRight size={16} />
              </Link>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Offers end in
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-yellow-400/25 bg-[#0B1628] p-4">
                {units.map(({ value, label }, index) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center rounded-xl bg-yellow-400/10 px-3 py-2 min-w-[58px] ${
                      index < units.length - 1 ? "" : "ring-2 ring-yellow-400/40"
                    }`}
                  >
                    <span className="text-2xl font-black text-yellow-400 tabular-nums">
                      {pad(value)}
                    </span>

                    <span className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="relative group rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#091321] hover:border-yellow-400/40 hover:-translate-y-1 transition duration-300 overflow-hidden"
            >
              {product.has_discount && (
                <span className="absolute top-3 left-3 z-20 rounded-full bg-red-500 text-white text-[10px] font-black px-2.5 py-1 inline-flex items-center gap-1">
                  <Tag size={11} />
                  -{product.discount_percent}%
                </span>
              )}

              <Link
                to={`/product/${product.slug}`}
                className="block relative aspect-[4/3] bg-[#0B1628]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
                />
              </Link>
<div className="p-4">
                <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wide">
                  {product.brand || "ELEVATECH"}
                </p>

                <Link
                  to={`/product/${product.slug}`}
                  className="mt-1 block text-sm font-bold text-white leading-5 line-clamp-2 hover:text-yellow-400 transition"
                >
                  {product.name}
                </Link>

                <div className="mt-1.5 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={11}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}

                  <span className="text-[10px] text-slate-500">
                    ({product.reviews || 0})
                  </span>
                </div>

                <div className="mt-2.5">
                  {product.has_discount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-yellow-400">
                        KSh{" "}
                        {Number(product.discount_price).toLocaleString()}
                      </span>

                      <span className="text-sm text-slate-500 line-through">
                        KSh {Number(product.price).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-white">
                      KSh {Number(product.price).toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#050B14] py-3 font-black text-sm flex items-center justify-center gap-2 transition"
                >
                  <ShoppingCart size={16} />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
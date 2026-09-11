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

  const { addToCart } =
    useContext(CartContext);

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
    <section className="bg-slate-50 py-20 sm:py-24 text-slate-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">

          <div>

            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600">

              <Sparkles size={14} />

              Curated for you

            </p>

            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
              Featured technology
            </h2>

            <p className="mt-3 text-slate-500">
              A focused selection of standout products.
            </p>

          </div>

          <Link
            to="/products?featured=true"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            Shop featured
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {products
            .slice(0, 4)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}

        </div>

      </div>

    </section>
  );
}
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import productService from "../../services/productService";
import ProductCard from "../ProductCard";
import { CartContext } from "../../context/CartContext";

export default function RelatedProducts({ productId }) {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    setProducts(null);

    productService
      .getRelatedProducts(productId)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, [productId]);

  if (!products) {
    return (
      <section
        className="mt-10 sm:mt-12 md:mt-14 lg:mt-16"
        aria-busy="true"
      >
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-[#0F1111]">
            Products related to this item
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="pdp-skeleton h-56 rounded-xl sm:h-64 sm:rounded-2xl md:h-72"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  function handleAdd(product) {
    addToCart(product);
    toast.success("Added to cart");
  }

  return (
    <section className="pdp-recommendations mt-10 min-w-0 sm:mt-12 md:mt-14">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="pdp-eyebrow">More to explore</p>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-[#0F1111]">
            Suggested for you
          </h2>
        </div>

        <span className="hidden shrink-0 text-xs text-[#565959] sm:block">
          Similar products from ELEVATECH
        </span>
      </div>

      <div className="pdp-recommendation-grid mt-5 grid min-w-0 grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-6">
        {products.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard
              product={product}
              onAddToCart={handleAdd}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
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
      <section className="mt-16" aria-busy="true">
        <h2 className="text-xl md:text-2xl font-bold text-[#0F1111]">
          Products related to this item
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="pdp-skeleton h-72 rounded-2xl" />
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
    <section className="pdp-recommendations mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="pdp-eyebrow">More to explore</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F1111]">
            Suggested for you
          </h2>
        </div>
        <span className="hidden sm:block text-xs text-[#565959]">
          Similar products from ELEVATECH
        </span>
      </div>

      <div className="pdp-recommendation-grid grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAdd}
          />
        ))}
      </div>
    </section>
  );
}
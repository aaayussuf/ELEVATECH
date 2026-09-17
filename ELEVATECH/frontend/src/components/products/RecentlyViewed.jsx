import { useContext, useState } from "react";
import { toast } from "react-toastify";

import ProductCard from "../ProductCard";
import { CartContext } from "../../context/CartContext";

export default function RecentlyViewed() {
  const { addToCart } = useContext(CartContext);

  const [products] = useState(
    () => JSON.parse(localStorage.getItem("recentProducts")) || []
  );

  if (!products.length) {
    return null;
  }

  function handleAdd(product) {
    addToCart(product);
    toast.success("Added to cart");
  }

  return (
    <section className="mt-10 min-w-0 sm:mt-12 md:mt-14 lg:mt-16">
      <div className="min-w-0">
        <p className="pdp-eyebrow">Your browsing history</p>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-[#0F1111]">
          Recently viewed
        </h2>
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:gap-6">
        {products.slice(0, 4).map((product) => (
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

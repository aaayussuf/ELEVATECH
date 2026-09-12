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
    <section className="mt-16">
      <h2 className="text-xl md:text-2xl font-bold text-[#0F1111]">
        Recently viewed
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {products.slice(0, 4).map((product) => (
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
import { Link } from "react-router-dom";
import { useContext } from "react";
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Tag,
} from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";

export default function ProductCard({ product, onAddToCart }) {
  const {
    wishlist,
    toggleWishlist,
  } = useContext(WishlistContext);

  const saved =
    wishlist.find(
      p => p.id === product.id
    );

  const image =
    product.image ||
    "https://placehold.co/500x500?text=ElevaTech";

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition duration-300 hover:-translate-y-2">

      <div className="relative">

        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
        >
          <Heart
            size={20}
            fill={saved ? "red" : "none"}
            color="red"
          />
        </button>

        <img
          src={image}
          alt={product.name}
          className="w-full h-64 object-contain transition duration-500 hover:scale-110"
        />

        {product.has_discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Tag size={12} />
            {product.discount_percent}% OFF
          </div>
        )}

        <div className="absolute top-20 right-4 flex flex-col gap-3">

          <Link
            to={`/product/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
          >
            <Eye size={18} />
          </Link>

        </div>

      </div>

      <div className="p-6">

        <p className="text-sm text-blue-600 font-semibold">
          {product.brand}
        </p>

        <h3 className="text-xl font-bold mt-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-3">

          <Star
            size={16}
            className="text-yellow-500 fill-yellow-500"
          />
          <span className="font-semibold">
            {product.rating || 5}
          </span>

          <span className="text-gray-500 text-sm">
            ({product.reviews || 0} Reviews)
          </span>

        </div>

        <div className="mt-5">

          {product.has_discount ? (

            <>
              <div className="text-3xl font-black text-blue-600">
                KSh {Number(product.discount_price).toLocaleString()}
              </div>

              <div className="line-through text-gray-400">
                KSh {Number(product.price).toLocaleString()}
              </div>
            </>

          ) : (

            <div className="text-3xl font-black text-blue-600">
              KSh {Number(product.price).toLocaleString()}
            </div>

          )}

        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition"
        >
          <ShoppingCart size={20} />
          Add To Cart
        </button>

      </div>

    </div>
  );
}
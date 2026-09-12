import { Link } from "react-router-dom";
import { useContext } from "react";
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Tag,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";

function formatCount(value) {
  const num = Number(value || 0);

  if (num >= 1000000) {
    return `${Math.round(num / 100000) / 10}M`;
  }

  if (num >= 1000) {
    return `${Math.round(num / 100) / 10}K`;
  }

  return String(num);
}

function formatPrice(value) {
  return `KSh ${Number(value || 0).toLocaleString()}`;
}

export default function ProductCard({ product, onAddToCart }) {
  const {
    wishlist,
    toggleWishlist,
  } = useContext(WishlistContext);

  const saved = wishlist.some(
    (item) => item.product?.id === product.id
  );

  const image =
    product.image ||
    "https://placehold.co/500x500?text=ElevaTech";

  const inStock =
    product.in_stock ??
    Number(product.quantity || 0) > 0;

  const lowStock =
    inStock &&
    Number(product.quantity || 0) > 0 &&
    Number(product.quantity || 0) <=
      Number(product.low_stock || 5);

  const rating = Math.max(
    0,
    Math.min(5, Number(product.rating || 0))
  );

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition duration-300 hover:-translate-y-2 min-w-0">

      <div className="relative">

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow cursor-pointer active:scale-95"
        >
          <Heart
            size={20}
            fill={saved ? "red" : "none"}
            color="red"
          />
        </button>

        <Link
          to={`/product/${product.slug}`}
          className="block overflow-hidden bg-slate-50"
          aria-label={`View ${product.name}`}
        >
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/500x500?text=ElevaTech";
            }}
            className="w-full h-52 min-[480px]:h-60 sm:h-64 object-contain transition duration-500 hover:scale-105"
          />
        </Link>

        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {product.has_discount && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Tag size={12} />
              {product.discount_percent}% OFF
            </span>
          )}

          {Number(product.sold || 0) > 0 && (
            <span className="bg-blue-50 text-blue-700 text-[11px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <PackageCheck size={12} />
              {formatCount(product.sold)}+ sold
            </span>
          )}
        </div>

        <div className="absolute top-20 right-4 flex flex-col gap-3">

          <Link
            to={`/product/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
          >
            <Eye size={18} />
          </Link>

        </div>

      </div>

      <div className="p-4 sm:p-6 min-w-0">

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-blue-600 font-semibold">
            {product.brand || "ELEVATECH"}
          </p>

          {!inStock && (
            <span className="text-[11px] font-bold text-red-600 bg-red-50 rounded-full px-2.5 py-1">
              Out of stock
            </span>
          )}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="mt-1 block text-lg sm:text-xl font-bold clamp-2 hover:text-blue-700 transition break-anywhere"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={15}
              className={
                i <= Math.round(rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-300"
              }
            />
          ))}

          <span className="font-semibold text-sm">
            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>

          <span className="text-gray-500 text-sm">
            ({product.reviews || 0} Reviews)
          </span>
        </div>

        {inStock && (
          <p className={`mt-1.5 text-xs font-semibold flex items-center gap-1.5 ${
            lowStock
              ? "text-amber-600"
              : "text-emerald-600"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              lowStock ? "bg-amber-500" : "bg-emerald-500"
            }`} />
            {lowStock
              ? `Low stock — only ${product.quantity} left`
              : "In stock"}
          </p>
        )}

        {product.warranty && (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-500" />
            {product.warranty}
          </p>
        )}

        <div className="mt-4">

          {product.has_discount ? (

            <>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 break-anywhere">
                {formatPrice(product.discount_price)}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="line-through text-gray-400">
                  {formatPrice(product.price)}
                </span>

                <span className="text-emerald-600 font-semibold">
                  Save{" "}
                  {formatPrice(
                    Number(product.price) -
                      Number(product.discount_price)
                  )}
                </span>
              </div>
            </>

          ) : (

            <div className="text-2xl sm:text-3xl font-black text-blue-600 break-anywhere">
              {formatPrice(product.price)}
            </div>

          )}

        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          className={`mt-5 w-full min-h-[52px] py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition active:scale-[0.98] ${
            inStock
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={20} />
          {inStock ? "Add To Cart" : "Notify me"}
        </button>

      </div>

    </div>
  );
}
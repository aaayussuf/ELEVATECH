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
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

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
    Number(product.quantity || 0) <= Number(product.low_stock || 5);

  const rating = Math.max(
    0,
    Math.min(5, Number(product.rating || 0))
  );

  return (
    <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:hover:-translate-y-2">
      {/* IMAGE */}
      <div className="relative min-w-0">
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className="absolute right-2.5 top-2.5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:bg-white active:scale-95 sm:right-3 sm:top-3 sm:h-11 sm:w-11"
        >
          <Heart
            size={19}
            className="sm:h-5 sm:w-5"
            fill={saved ? "red" : "none"}
            color="red"
          />
        </button>

        {/* Product image */}
        <Link
          to={`/product/${product.slug}`}
          className="block min-w-0 overflow-hidden bg-slate-50"
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
            className="h-44 w-full object-contain transition duration-500 hover:scale-105 min-[375px]:h-48 min-[480px]:h-56 sm:h-64 md:h-60 lg:h-64 xl:h-72"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex max-w-[65%] flex-col items-start gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {product.has_discount && (
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold leading-4 text-white sm:px-3 sm:py-1 sm:text-xs">
              <Tag size={11} className="shrink-0" />
              <span className="truncate">
                {product.discount_percent}% OFF
              </span>
            </span>
          )}

          {Number(product.sold || 0) > 0 && (
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold leading-4 text-blue-700 sm:px-3 sm:py-1 sm:text-[11px]">
              <PackageCheck size={11} className="shrink-0" />
              <span className="truncate">
                {formatCount(product.sold)}+ sold
              </span>
            </span>
          )}
        </div>

        {/* Quick view */}
        <Link
          to={`/product/${product.slug}`}
          aria-label={`Quick view ${product.name}`}
          className="absolute right-2.5 top-[4.25rem] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-blue-600 hover:text-white sm:right-4 sm:top-20 sm:h-10 sm:w-10"
        >
          <Eye size={17} className="sm:h-[18px] sm:w-[18px]" />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5 md:p-6">
        {/* Brand / stock */}
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="min-w-0 truncate text-xs font-semibold text-blue-600 sm:text-sm">
            {product.brand || "ELEVATECH"}
          </p>

          {!inStock && (
            <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold leading-4 text-red-600 sm:px-2.5 sm:text-[11px]">
              Out of stock
            </span>
          )}
        </div>

        {/* Product name */}
        <Link
          to={`/product/${product.slug}`}
          className="mt-1 block min-w-0 text-base font-bold leading-6 text-[#0F1111] transition hover:text-blue-700 sm:text-lg sm:leading-7 md:text-xl"
        >
          <span className="line-clamp-2 break-words">
            {product.name}
          </span>
        </Link>

        {/* Rating */}
        <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 sm:mt-3">
          <div className="flex shrink-0 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={13}
                className={`sm:h-[15px] sm:w-[15px] ${
                  i <= Math.round(rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-semibold sm:text-sm">
            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>

          <span className="text-xs text-gray-500 sm:text-sm">
            ({product.reviews || 0} Reviews)
          </span>
        </div>

        {/* Stock */}
        {inStock && (
          <p
            className={`mt-1.5 flex min-w-0 items-start gap-1.5 text-[11px] font-semibold leading-5 sm:text-xs ${
              lowStock ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                lowStock ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />

            <span className="min-w-0 break-words">
              {lowStock
                ? `Low stock — only ${product.quantity} left`
                : "In stock"}
            </span>
          </p>
        )}

        {/* Warranty */}
        {product.warranty && (
          <p className="mt-1.5 flex min-w-0 items-start gap-1.5 text-[11px] leading-5 text-gray-500 sm:text-xs">
            <ShieldCheck
              size={13}
              className="mt-0.5 shrink-0 text-blue-500"
            />

            <span className="min-w-0 break-words">
              {product.warranty}
            </span>
          </p>
        )}

        {/* PRICE */}
        <div className="mt-3 min-w-0 sm:mt-4">
          {product.has_discount ? (
            <>
              <div className="break-words text-xl font-black leading-7 text-blue-600 min-[375px]:text-2xl sm:text-3xl">
                {formatPrice(product.discount_price)}
              </div>

              <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
                <span className="text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>

                <span className="font-semibold text-emerald-600">
                  Save{" "}
                  {formatPrice(
                    Number(product.price) -
                      Number(product.discount_price)
                  )}
                </span>
              </div>
            </>
          ) : (
            <div className="break-words text-xl font-black leading-7 text-blue-600 min-[375px]:text-2xl sm:text-3xl">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        {/* CART BUTTON */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          className={`mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition active:scale-[0.98] sm:mt-5 sm:min-h-[52px] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 ${
            inStock
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          <ShoppingCart
            size={18}
            className="shrink-0 sm:h-5 sm:w-5"
          />

          <span className="truncate">
            {inStock ? "Add To Cart" : "Notify me"}
          </span>
        </button>
      </div>
    </article>
  );
}


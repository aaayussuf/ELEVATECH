import { ArrowRight, Heart, Lock, ShoppingCart } from "lucide-react";

import DeliveryEstimate from "./DeliveryEstimate";

export default function BuyBox({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  saved,
  justAdded,
}) {
  const stock = Number(product.quantity || 0);
  const inStock = stock > 0;
  const hasDiscount = Boolean(product.has_discount);
  const price = Number(product.price || 0);
  const discountPrice = Number(product.discount_price || 0);
  const savings =
    hasDiscount && discountPrice ? price - discountPrice : 0;
  const lowStock =
    inStock && stock <= Number(product.low_stock || 5);

  return (
    <div className="pdp-card pdp-card-hover w-full min-w-0 p-4 sm:p-5 md:p-6">
      {/* SELLER LINE */}
      <p className="text-xs sm:text-sm leading-5 text-[#565959]">
        Ships from and sold by{" "}
        <span className="font-semibold text-[#0F1111]">
          ELEVATECH
        </span>
        <span className="text-emerald-600"> ✓</span>
      </p>

      {/* PRICE */}
      <div className="mt-4">
        {hasDiscount ? (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-[#565959] line-through">
                KSh {price.toLocaleString()}
              </span>

              <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded-full">
                -{product.discount_percent}%
              </span>
            </div>

            <p className="mt-1 text-2xl sm:text-3xl font-black leading-tight text-[#0F1111]">
              KSh {discountPrice.toLocaleString()}
            </p>

            <p className="text-sm text-emerald-700 font-semibold mt-1">
              You save KSh {savings.toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-2xl sm:text-3xl font-black leading-tight text-[#0F1111]">
            KSh {price.toLocaleString()}
          </p>
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="mt-4">
        {!inStock ? (
          <p className="font-semibold text-red-600 text-sm sm:text-base">
            Currently out of stock
          </p>
        ) : lowStock ? (
          <p className="font-semibold text-amber-700 text-sm sm:text-base leading-5">
            Only {stock} left in stock — order soon.
          </p>
        ) : (
          <p className="font-semibold text-emerald-700 text-sm sm:text-base">
            In stock
          </p>
        )}
      </div>

      {/* DELIVERY */}
      {inStock && (
        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
          <DeliveryEstimate inStock compact={false} />
        </div>
      )}

      {/* QUANTITY */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="product-quantity"
          className="text-sm font-semibold text-[#0F1111]"
        >
          Quantity:
        </label>

        <div
          id="product-quantity"
          className="inline-flex w-fit items-center border border-[#D5D9D9] rounded-lg overflow-hidden bg-white"
        >
          <button
            type="button"
            onClick={onDecrease}
            disabled={!inStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="h-11 w-11 sm:h-10 sm:w-10 text-lg font-bold hover:bg-[#E3E6E6] active:bg-[#D5D9D9] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            −
          </button>

          <span
            aria-live="polite"
            className="h-11 w-12 sm:h-10 sm:w-12 flex items-center justify-center font-bold text-[#0F1111] border-x border-[#D5D9D9]"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={onIncrease}
            disabled={!inStock || quantity >= stock}
            aria-label="Increase quantity"
            className="h-11 w-11 sm:h-10 sm:w-10 text-lg font-bold hover:bg-[#E3E6E6] active:bg-[#D5D9D9] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            +
          </button>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!inStock}
          className="w-full min-h-12 pdp-btn-add px-4 py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart size={18} />

          <span>
            {justAdded ? "Added to cart ✓" : "Add to Cart"}
          </span>
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={!inStock}
          className="w-full min-h-12 pdp-btn-buy px-4 py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <span>Buy Now</span>

          <ArrowRight size={18} />
        </button>
      </div>

      {/* PAYMENT / SECURITY */}
      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
        <p className="text-xs sm:text-sm leading-5 text-[#565959] flex items-start gap-2">
          <Lock
            size={14}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <span>
            Secure checkout · M-PESA, Visa, Mastercard
          </span>
        </p>
      </div>

      {/* WISHLIST */}
      <button
        type="button"
        onClick={onToggleWishlist}
        className="mt-4 min-h-11 text-sm pdp-link flex items-center gap-2"
      >
        <Heart
          size={16}
          fill={saved ? "red" : "none"}
          color="red"
          className={saved ? "" : "text-red-500"}
        />

        <span>
          {saved ? "Added to wishlist" : "Add to wishlist"}
        </span>
      </button>
    </div>
  );
}

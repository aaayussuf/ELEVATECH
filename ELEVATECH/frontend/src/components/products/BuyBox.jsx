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
  const savings = hasDiscount && discountPrice ? price - discountPrice : 0;
  const lowStock = inStock && stock <= Number(product.low_stock || 5);

  return (
    <div className="pdp-card pdp-card-hover p-6">
      {/* SELLER LINE */}
      <p className="text-xs text-[#565959]">
        Ships from and sold by{" "}
        <span className="font-semibold text-[#0F1111]">ELEVATECH</span>
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

              <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                -{product.discount_percent}%
              </span>
            </div>

            <p className="text-3xl font-black text-[#0F1111] mt-1">
              KSh {discountPrice.toLocaleString()}
            </p>

            <p className="text-sm text-emerald-700 font-semibold">
              You save KSh {savings.toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-3xl font-black text-[#0F1111]">
            KSh {price.toLocaleString()}
          </p>
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="mt-4">
        {!inStock ? (
          <p className="font-semibold text-red-600">Currently out of stock</p>
        ) : lowStock ? (
          <p className="font-semibold text-amber-700">
            Only {stock} left in stock — order soon.
          </p>
        ) : (
          <p className="font-semibold text-emerald-700">In stock</p>
        )}
      </div>

      {/* DELIVERY */}
      {inStock && (
        <div className="mt-3">
          <DeliveryEstimate inStock compact={false} />
        </div>
      )}

      {/* QUANTITY */}
      <div className="mt-5 flex items-center justify-between">
        <label className="text-sm font-semibold text-[#0F1111]">
          Quantity:
        </label>

        <div className="flex items-center border border-[#D5D9D9] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={onDecrease}
            disabled={!inStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="w-9 h-9 text-lg font-bold hover:bg-[#E3E6E6] disabled:opacity-40"
          >
            −
          </button>

          <span
            aria-live="polite"
            className="w-10 h-9 flex items-center justify-center font-bold text-[#0F1111]"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={onIncrease}
            disabled={!inStock || quantity >= stock}
            aria-label="Increase quantity"
            className="w-9 h-9 text-lg font-bold hover:bg-[#E3E6E6] disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <button
        type="button"
        onClick={onAddToCart}
        disabled={!inStock}
        className="w-full pdp-btn-add py-3 flex items-center justify-center gap-2"
      >
        <ShoppingCart size={18} />

        {justAdded ? "Added to cart ✓" : "Add to Cart"}
      </button>

      <button
        type="button"
        onClick={onBuyNow}
        disabled={!inStock}
        className="w-full mt-2 pdp-btn-buy py-3 flex items-center justify-center gap-2"
      >
        Buy Now

        <ArrowRight size={18} />
      </button>

      <p className="text-xs text-[#565959] mt-2 flex items-center gap-1.5">
        <Lock size={12} className="text-emerald-600" />
        Secure checkout · M-PESA, Visa, Mastercard
      </p>

      {/* WISHLIST */}
      <button
        type="button"
        onClick={onToggleWishlist}
        className="mt-3 text-sm pdp-link flex items-center gap-1.5"
      >
        <Heart
          size={15}
          fill={saved ? "red" : "none"}
          color="red"
          className={saved ? "" : "text-red-500"}
        />

        {saved ? "Added to wishlist" : "Add to wishlist"}
      </button>
    </div>
  );
}
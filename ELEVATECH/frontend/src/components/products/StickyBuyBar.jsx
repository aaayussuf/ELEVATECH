import { ArrowRight, ShoppingCart } from "lucide-react";

/* Android-style persistent buy bar, shown on mobile only
   after the customer scrolls past the main buy box. */
export default function StickyBuyBar({
  product,
  quantity,
  visible,
  onIncrease,
  onDecrease,
  onAddToCart,
  onBuyNow,
}) {
  if (!visible) {
    return null;
  }

  const stock = Number(product.quantity || 0);
  const inStock = stock > 0;
  const price = product.has_discount
    ? Number(product.discount_price || 0)
    : Number(product.price || 0);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white border-t border-[#D5D9D9] shadow-lg sticky-buy-bar-safe">
      <div className="max-w-7xl mx-auto px-3 min-[480px]:px-4 pt-3 flex items-center justify-between gap-2 min-[480px]:gap-3">
        <div className="min-w-0">
          <p className="text-base min-[480px]:text-lg font-black text-[#0F1111] break-anywhere">
            KSh {price.toLocaleString()}
          </p>

          {product.has_discount && (
            <p className="text-xs line-through text-[#565959]">
              KSh {Number(product.price || 0).toLocaleString()}
            </p>
          )}
        </div>

        {inStock ? (
          <div className="flex items-center gap-1.5 min-[480px]:gap-2">
            <div className="hidden min-[480px]:flex items-center border border-[#D5D9D9] rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-9 h-11 text-lg font-bold disabled:opacity-40"
              >
                −
              </button>

              <span className="w-9 h-11 flex items-center justify-center text-sm font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= stock}
                aria-label="Increase quantity"
                className="w-9 h-11 text-lg font-bold disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={onAddToCart}
              className="pdp-btn-add min-h-[48px] px-3 min-[480px]:px-3.5 py-2.5 flex items-center gap-1.5 text-sm min-[480px]:text-base"
            >
              <ShoppingCart size={15} />
              Add
            </button>

            <button
              type="button"
              onClick={onBuyNow}
              className="pdp-btn-buy min-h-[48px] px-3 min-[480px]:px-3.5 py-2.5 flex items-center gap-1.5 text-sm min-[480px]:text-base whitespace-nowrap"
            >
              Buy Now
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-red-600">
            Currently out of stock
          </p>
        )}
      </div>
    </div>
  );
}
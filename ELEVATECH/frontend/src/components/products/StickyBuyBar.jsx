import { ArrowRight, ShoppingCart } from "lucide-react";

/* Responsive persistent buy bar, shown on mobile/tablet
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
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden overflow-hidden border-t border-[#D5D9D9] bg-white/95 shadow-[0_-4px_18px_rgba(15,17,17,0.12)] backdrop-blur-md">
      <div className="sticky-buy-bar-safe safe-area-bottom">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center gap-1.5 px-2.5 py-2 sm:gap-2.5 sm:px-4 sm:py-3">
          {/* PRICE */}
          <div className="min-w-0 max-w-[92px] shrink sm:max-w-none">
            <p className="truncate text-sm font-black leading-tight text-[#0F1111] sm:text-lg">
              KSh {price.toLocaleString()}
            </p>

            {product.has_discount && (
              <p className="truncate text-[9px] leading-4 text-[#565959] line-through sm:text-xs">
                KSh {Number(product.price || 0).toLocaleString()}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          {inStock ? (
            <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex-none sm:gap-2">
              {/* QUANTITY */}
              <div className="hidden shrink-0 items-center overflow-hidden rounded-lg border border-[#D5D9D9] bg-white min-[480px]:flex">
                <button
                  type="button"
                  onClick={onDecrease}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="h-11 w-9 text-lg font-bold text-[#0F1111] transition hover:bg-[#E3E6E6] active:bg-[#D5D9D9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span
                  aria-live="polite"
                  className="flex h-11 w-9 items-center justify-center border-x border-[#D5D9D9] text-sm font-bold text-[#0F1111]"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={onIncrease}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                  className="h-11 w-9 text-lg font-bold text-[#0F1111] transition hover:bg-[#E3E6E6] active:bg-[#D5D9D9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={onAddToCart}
                className="pdp-btn-add flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-sm font-bold sm:px-3.5 sm:text-base"
                aria-label="Add product to cart"
              >
                <ShoppingCart size={16} />

                <span className="hidden min-[400px]:inline">
                  Add
                </span>
              </button>

              {/* BUY NOW */}
              <button
                type="button"
                onClick={onBuyNow}
                className="pdp-btn-buy flex min-h-11 min-w-0 shrink items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-xs font-bold whitespace-nowrap sm:px-3.5 sm:text-base"
              >
                <span className="truncate">Buy Now</span>

                <ArrowRight size={15} className="shrink-0" />
              </button>
            </div>
          ) : (
            <p className="ml-auto min-w-0 text-right text-[11px] font-semibold leading-4 text-red-600 sm:text-sm">
              Currently out of stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


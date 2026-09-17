import { useContext, useState } from "react";
import { Heart, Link2, Scale, Share2 } from "lucide-react";
import { toast } from "react-toastify";

import { WishlistContext } from "../../context/WishlistContext";

const COMPARE_KEY = "elevatech_compare";

function readCompareList() {
  try {
    const list = JSON.parse(localStorage.getItem(COMPARE_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function ProductActions({ product }) {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const [compareState, setCompareState] = useState({});

  const saved = wishlist.some(
    (item) => item.product?.id === product.id
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url,
        });
        return;
      } catch {
        /* fall through to copy fallback */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share it anywhere");
    } catch {
      toast.error("Could not share this link");
    }
  }

  function toggleCompare() {
    let list = readCompareList();
    const exists = list.some((item) => item.id === product.id);

    if (exists) {
      list = list.filter((item) => item.id !== product.id);
    } else {
      list = [
        ...list,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          discount_price: product.discount_price,
        },
      ];
    }

    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    setCompareState({ [product.id]: !exists });

    toast.success(
      exists ? "Removed from compare" : "Added to compare"
    );
  }

  function wishlistToggle() {
    const wasSaved = saved;

    toggleWishlist(product);

    toast.success(
      wasSaved
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  }

  const buttonBase =
    "flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition active:scale-[0.98] sm:gap-2 sm:px-3 sm:text-sm";

  return (
    <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
      {/* WISHLIST */}
      <button
        type="button"
        onClick={wishlistToggle}
        className={`${buttonBase} ${
          saved
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#E3E6E6]"
        }`}
        aria-label={
          saved
            ? "Remove product from wishlist"
            : "Add product to wishlist"
        }
      >
        <Heart
          size={16}
          className="shrink-0"
          fill={saved ? "red" : "none"}
          color="red"
        />

        <span className="truncate">
          {saved ? "Wishlisted" : "Wishlist"}
        </span>
      </button>

      {/* COMPARE */}
      <button
        type="button"
        onClick={toggleCompare}
        className={`${buttonBase} ${
          compareState[product.id]
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#E3E6E6]"
        }`}
        aria-label={
          compareState[product.id]
            ? "Remove product from comparison"
            : "Add product to comparison"
        }
      >
        <Scale size={16} className="shrink-0" />

        <span className="truncate">
          {compareState[product.id] ? "Added ✓" : "Compare"}
        </span>
      </button>

      {/* SHARE */}
      <button
        type="button"
        onClick={share}
        className={`${buttonBase} border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#E3E6E6]`}
        aria-label="Share product"
      >
        <Share2 size={16} className="shrink-0" />
        <span className="truncate">Share</span>
      </button>

      {/* COPY LINK */}
      <button
        type="button"
        onClick={copyLink}
        className={`${buttonBase} border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#E3E6E6]`}
        aria-label="Copy product link"
      >
        <Link2 size={16} className="shrink-0" />
        <span className="truncate">Copy Link</span>
      </button>
    </div>
  );
}

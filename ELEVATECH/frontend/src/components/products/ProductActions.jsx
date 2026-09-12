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
        await navigator.share({ title: product.name, url });
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
    toast.success(exists ? "Removed from compare" : "Added to compare");
  }

  function wishlistToggle() {
    const wasSaved = saved;
    toggleWishlist(product);
    toast.success(wasSaved ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button
        type="button"
        onClick={wishlistToggle}
        className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm transition ${
          saved
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-white text-[#0F1111] border-[#D5D9D9] hover:bg-[#E3E6E6]"
        }`}
      >
        <Heart
          size={16}
          fill={saved ? "red" : "none"}
          color="red"
        />

        {saved ? "Wishlisted" : "Wishlist"}
      </button>

      <button
        type="button"
        onClick={toggleCompare}
        className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm transition ${
          compareState[product.id]
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-white text-[#0F1111] border-[#D5D9D9] hover:bg-[#E3E6E6]"
        }`}
      >
        <Scale size={16} />

        {compareState[product.id] ? "Added ✓" : "Compare"}
      </button>

      <button
        type="button"
        onClick={share}
        className="flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm bg-white text-[#0F1111] border-[#D5D9D9] hover:bg-[#E3E6E6] transition"
      >
        <Share2 size={16} />
        Share
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm bg-white text-[#0F1111] border-[#D5D9D9] hover:bg-[#E3E6E6] transition"
      >
        <Link2 size={16} />
        Copy Link
      </button>
    </div>
  );
}
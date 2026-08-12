import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import wishlistService from "../services/wishlistService";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isLoading } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!isLoading && token) {
      loadWishlist();
    } else if (!token) {
      setWishlist([]);
    }
  }, [token, isLoading]);

  async function loadWishlist() {
    try {
      const data = await wishlistService.getWishlist(token);

      const items =
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.wishlist ||
            [];

      setWishlist(items);
    } catch (error) {
      console.error("Wishlist load error:", error);
      setWishlist([]);
    }
  }

  async function toggleWishlist(product) {
    if (!token) {
      alert("Please login to use your wishlist.");
      return;
    }

    try {
      const exists = wishlist.some(
        (p) =>
          Number(p.id ?? p.product_id) ===
          Number(product.id)
      );

      if (exists) {
        await wishlistService.remove(
          product.id,
          token
        );
      } else {
        await wishlistService.add(
          product.id,
          token
        );
      }

      await loadWishlist();
    } catch (error) {
      console.error("Wishlist toggle error:", error);

      alert(
        error?.message ||
          "Unable to update wishlist."
      );
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
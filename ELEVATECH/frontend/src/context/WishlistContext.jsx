import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import wishlistService from "../services/wishlistService";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { token, isLoading } = useContext(AuthContext);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const data = await wishlistService.getWishlist();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      void Promise.resolve().then(loadWishlist);
    }
  }, [isLoading, loadWishlist]);

  async function toggleWishlist(product) {
    try {
      const existing = wishlist.find(
        (item) => item.product?.id === product.id
      );

      if (existing) {
        await wishlistService.remove(existing.id);
      } else {
        await wishlistService.add(product.id);
      }

      await loadWishlist();
    } catch (error) {
      console.error("Wishlist error:", error);
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
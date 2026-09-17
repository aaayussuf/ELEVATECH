import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

const STORAGE_KEY = "elevatech_cart";

function readStoredCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function unitPriceOf(item) {
  if (item?.has_discount && Number(item.discount_price) > 0) return Number(item.discount_price);
  return Number(item?.price || 0);
}

function productNameOf(product) {
  return product?.name || "Item";
}

function stockOf(product) {
  if (typeof product?.quantity !== "undefined" && product.quantity !== null && product.quantity !== "") {
    const n = Number(product.quantity);
    if (Number.isFinite(n)) return n;
  }
  if (product?.in_stock === false) return 0;
  return Infinity;
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [lastAddedAt, setLastAddedAt] = useState(null);
  const toastId = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors (private mode etc.)
    }
  }, [cartItems]);

  const showAddedToast = useCallback((product, qty) => {
    const name = productNameOf(product);
    const message = (
      <div>
        <div style={{ fontWeight: 800 }}>Added to cart</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>
          {qty} × {name}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
          {unitPriceOf(product).toLocaleString()} KSh each
        </div>
      </div>
    );
    // Dismiss the previous add-toast so rapid clicks don't stack.
    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = toast.success(message, { autoClose: 2200 });
  }, []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      if (!product?.id) return { ok: false, reason: "invalid" };
      const amount = Number.isInteger(qty) && qty > 0 ? qty : 1;
      const available = stockOf(product);
      if (available <= 0) {
        toast.error(`${productNameOf(product)} is currently out of stock.`);
        return { ok: false, reason: "out_of_stock" };
      }

      let result = { ok: true, added: amount };
      setCartItems((items) => {
        const existing = items.find((i) => i.id === product.id);
        const currentQty = existing ? Number(existing.quantity || 0) : 0;
        if (Number.isFinite(available) && currentQty + amount > available) {
          result = { ok: false, reason: "exceeds_stock", available };
          return items;
        }
        setLastAddedAt(Date.now());
        if (existing) {
          return items.map((i) =>
            i.id === product.id ? { ...i, ...product, quantity: i.quantity + amount } : i
          );
        }
        return [...items, { ...product, quantity: amount }];
      });

      // Stock check runs inside the updater; surface feedback on next tick.
      setTimeout(() => {
        if (result.ok) showAddedToast(product, amount);
        else if (result.reason === "exceeds_stock")
          toast.warning(`Only ${result.available} unit(s) of ${productNameOf(product)} available.`);
      }, 0);
      return result;
    },
    [showAddedToast]
  );

  function removeFromCart(id) {
    setCartItems((items) => {
      const removed = items.find((i) => i.id === id);
      if (removed) toast.info(`Removed ${productNameOf(removed)} from cart.`);
      return items.filter((i) => i.id !== id);
    });
  }

  function increaseQuantity(id) {
    setCartItems((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  function decreaseQuantity(id) {
    setCartItems((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0)
    );
  }

  function updateQuantity(id, qty) {
    const next = Number(qty);
    if (!Number.isFinite(next) || next <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((items) => items.map((i) => (i.id === id ? { ...i, quantity: Math.floor(next) } : i)));
  }

  function clearCart(silent = false) {
    setCartItems([]);
    if (!silent) toast.info("Cart cleared.");
  }

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + unitPriceOf(item) * Number(item.quantity || 0),
    0
  );

  const value = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrice,
      lastAddedAt,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      clearCart,
    }),
    [cartItems, totalItems, totalPrice, lastAddedAt, addToCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


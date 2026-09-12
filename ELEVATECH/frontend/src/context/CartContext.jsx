import { createContext, useEffect, useMemo, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

const STORAGE_KEY = "elevatech_cart";

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, qty = 1) {
    const amount =
      Number.isInteger(qty) && qty > 0 ? qty : 1;

    setCartItems((items) => {
      const existing = items.find((i) => i.id === product.id);

      if (existing) {
        return items.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + amount }
            : i
        );
      }

      return [...items, { ...product, quantity: amount }];
    });
  }

  function removeFromCart(id) {
    setCartItems((items) => items.filter((i) => i.id !== id));
  }

  function increaseQuantity(id) {
    setCartItems((items) =>
      items.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }

  function decreaseQuantity(id) {
    setCartItems((items) =>
      items
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [cartItems, totalItems, totalPrice]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}


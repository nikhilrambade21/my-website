"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /* ---------- Load Cart ---------- */
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  /* ---------- Save Cart ---------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------- Add Item ---------- */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* ---------- Remove Item ---------- */
  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );
  };

  /* ---------- Update Quantity ---------- */
  const updateQuantity = (id, size, qty) => {
    if (qty <= 0) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  /* ---------- ⭐ Clear Cart ---------- */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // optional but cleaner
  };

  /* ---------- Count ---------- */
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ---------- Total ---------- */
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // ⭐ Added
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

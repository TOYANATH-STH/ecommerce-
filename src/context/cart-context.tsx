"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = useCallback((product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

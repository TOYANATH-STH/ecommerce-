"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isLoading: boolean;
  addItem: (product: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.productId === product.productId)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        isLoading,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

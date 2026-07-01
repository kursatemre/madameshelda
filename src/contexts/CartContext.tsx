"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;        // unique: productId or productId_variantId
  slug: string;
  title: string;
  price: number;
  bg: string;
  variantName?: string;
  variantHex?: string;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ms_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("ms_cart", JSON.stringify(items));
  }, [items, mounted]);

  const add = (item: CartItem) => {
    setItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item]);
    setIsOpen(true);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items, add, remove, clear,
        total: items.reduce((s, i) => s + i.price, 0),
        count: items.length,
        isOpen, setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

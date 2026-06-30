"use client";

import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shared/CartDrawer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}

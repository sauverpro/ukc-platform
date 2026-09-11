"use client";
import { CartProvider } from "./CartContext";
import { DarkProvider } from "./DarkContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DarkProvider>
      <CartProvider>{children}</CartProvider>
    </DarkProvider>
  );
}

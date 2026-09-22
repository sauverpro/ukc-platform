"use client";
import { AuthProvider } from "../lib/auth";
import { CartProvider } from "./CartContext";
import { DarkProvider } from "./DarkContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DarkProvider>
        <CartProvider>{children}</CartProvider>
      </DarkProvider>
    </AuthProvider>
  );
}

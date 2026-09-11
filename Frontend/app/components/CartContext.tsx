"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  title: string;
  img: string;
  price: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (title: string) => void;
  updateQty: (title: string, qty: number) => void;
  clearCart: () => void;
  count: number;
};

const CartContext = createContext<CartCtx>({
  items: [], addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {}, count: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "qty">) =>
    setItems(prev =>
      prev.find(i => i.title === item.title)
        ? prev.map(i => i.title === item.title ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }]
    );

  const removeItem = (title: string) =>
    setItems(prev => prev.filter(i => i.title !== title));

  const updateQty = (title: string, qty: number) =>
    setItems(prev => prev.map(i => i.title === title ? { ...i, qty } : i));

  const clearCart = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

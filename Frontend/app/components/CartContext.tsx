"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export type CartItem = {
  id?: number; // Backend cart item ID
  product_id?: number;
  title: string;
  img: string;
  price: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
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
  const { isAuthenticated, user } = useAuth();

  // Load cart from API on mount/login
  useEffect(() => {
    if (isAuthenticated) {
      api.get<any>("/cart").then(res => {
         if (res && res.items) {
            setItems(res.items.map((i: any) => ({
              id: i.id,
              product_id: i.product_id,
              title: i.product.name,
              img: i.product.featured_image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
              price: i.unit_price,
              qty: i.quantity
            })));
         }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const addItem = (item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.title === item.title);
      let newQty = item.qty || 1;
      let newItems;
      if (existing) {
        newQty = existing.qty + (item.qty || 1);
        newItems = prev.map(i => i.title === item.title ? { ...i, qty: newQty } : i);
      } else {
        newItems = [...prev, { ...item, qty: newQty }];
      }

      // Sync to API if we have a product_id
      if (isAuthenticated && item.product_id) {
         api.post("/cart/items", { product_id: item.product_id, quantity: newQty }).catch(() => {});
      }

      return newItems;
    });
  };

  const removeItem = (title: string) => {
    setItems(prev => {
      const item = prev.find(i => i.title === title);
      if (isAuthenticated && item && item.id) {
         api.delete(`/cart/items/${item.id}`).catch(() => {});
      }
      return prev.filter(i => i.title !== title);
    });
  };

  const updateQty = (title: string, qty: number) => {
    setItems(prev => {
      const item = prev.find(i => i.title === title);
      if (isAuthenticated && item && item.id) {
         api.patch(`/cart/items/${item.id}`, { quantity: qty }).catch(() => {});
      }
      return prev.map(i => i.title === title ? { ...i, qty } : i);
    });
  };

  const clearCart = () => {
    setItems([]);
    if (isAuthenticated) {
       api.delete("/cart").catch(() => {});
    }
  };

  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

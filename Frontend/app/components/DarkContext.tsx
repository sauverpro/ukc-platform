"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DarkCtx = { dark: boolean; toggle: () => void };
const DarkContext = createContext<DarkCtx>({ dark: false, toggle: () => {} });

export function DarkProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return <DarkContext.Provider value={{ dark, toggle }}>{children}</DarkContext.Provider>;
}

export const useDark = () => useContext(DarkContext);

"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import { useDark } from "../components/DarkContext";
import Button from "../components/Button";

const SHIPPING = 5000;

export default function CartPage() {
  const { items, removeItem, updateQty } = useCart();
  const { dark } = useDark();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + (items.length ? SHIPPING : 0);

  const bg = dark ? "#0d1f10" : "white";
  const cardBg = dark ? "#1a2e1e" : "white";
  const textPrimary = dark ? "#f0fdf4" : "#1a1a1a";
  const textMuted = dark ? "#9ca3af" : "#6b7280";
  const textSec = dark ? "#d1d5db" : "#374151";
  const border = dark ? "#2d4a32" : "#e5e7eb";
  const inputBg = dark ? "#152318" : "white";

  return (
    <div  className="max-w-5xl mx-auto"  style={{ background: bg, fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      <Navbar active="" />

      <main className="flex-1 px-8 md:px-16" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <h1 className="text-2xl font-bold mb-8" style={{ color: textPrimary }}>Cart</h1>

        {items.length === 0 ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 mb-6 text-sm" style={{ background: dark ? "#1a2e1e" : "#f3f4f6", color: textMuted }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Your cart is currently empty.
            </div>
            <Button href="/products" size="sm">Return to shop</Button>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left */}
            <div className="flex-1">
              <div className="grid text-xs font-semibold uppercase tracking-widest pb-3 mb-2"
                style={{ gridTemplateColumns: "2fr 1fr 1fr auto", borderBottom: `1px solid ${border}`, color: textMuted }}>
                <span>Product</span><span>Quantity</span><span>Subtotal</span><span></span>
              </div>

              {items.map(item => (
                <div key={item.title} className="grid items-center py-4"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr auto", borderBottom: `1px dashed ${border}` }}>
                  <div className="flex items-center gap-3">
                    <img src={item.img} alt={item.title} className="object-cover flex-shrink-0" style={{ width: "56px", height: "56px" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#0d9e72" }}>{item.title}</p>
                      <p className="text-xs" style={{ color: textMuted }}>Fr {item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center border" style={{ width: "72px", borderColor: border, background: inputBg }}>
                    <input type="number" min={1} value={item.qty}
                      onChange={e => updateQty(item.title, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center text-sm outline-none py-1"
                      style={{ color: textPrimary, background: inputBg }} />
                    <div className="flex flex-col border-l" style={{ borderColor: border }}>
                      <button className="px-1 text-xs leading-none py-0.5" style={{ color: textPrimary, background: inputBg }}
                        onClick={() => updateQty(item.title, item.qty + 1)}>▲</button>
                      <button className="px-1 text-xs leading-none py-0.5" style={{ color: textPrimary, background: inputBg }}
                        onClick={() => updateQty(item.title, Math.max(1, item.qty - 1))}>▼</button>
                    </div>
                  </div>

                  <span className="text-sm font-semibold" style={{ color: textSec }}>Fr {(item.price * item.qty).toLocaleString()}</span>

                  <button onClick={() => removeItem(item.title)} className="ml-4 hover:text-red-500 transition" style={{ color: textMuted }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-3 mt-6">
                <input type="text" placeholder="Coupon code" className="text-sm px-3 py-2 outline-none"
                  style={{ border: `1px solid ${border}`, color: textPrimary, background: inputBg, width: "180px" }} />
                <Button size="sm">Apply coupon</Button>
                <Button size="sm" variant="ghost" className="ml-auto">Update cart</Button>
              </div>
            </div>

            {/* Right: totals */}
            <div className="w-full lg:w-72 flex-shrink-0" style={{ border: `1px solid ${border}`, padding: "24px", background: cardBg }}>
              <h3 className="font-bold text-base mb-5" style={{ color: textPrimary }}>Cart totals</h3>
              <div className="flex justify-between text-sm py-3" style={{ borderBottom: `1px solid ${border}` }}>
                <span style={{ color: textSec }}>Subtotal</span>
                <span className="font-semibold" style={{ color: textSec }}>Fr {subtotal.toLocaleString()}</span>
              </div>
              <div className="py-3" style={{ borderBottom: `1px solid ${border}` }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#0d9e72" }}>Shipping</p>
                <p className="text-xs" style={{ color: "#0d9e72" }}>quick delivery: Fr {SHIPPING.toLocaleString()}</p>
                <p className="text-xs mt-2" style={{ color: textMuted }}>Shipping options will be updated during checkout.</p>
                <a href="#" className="text-xs font-semibold" style={{ color: "#0d9e72" }}>Calculate shipping</a>
              </div>
              <div className="flex justify-between text-sm font-bold py-4" style={{ borderBottom: `1px solid ${border}` }}>
                <span style={{ color: textPrimary }}>Total</span>
                <span style={{ color: textPrimary }}>Fr {total.toLocaleString()}</span>
              </div>
              <Button href="/checkout" fullWidth className="mt-5">Proceed to checkout</Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

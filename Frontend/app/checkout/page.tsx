"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import { useDark } from "../components/DarkContext";
import Button from "../components/Button";

const SHIPPING = 5000;

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { dark } = useDark();
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + (items.length ? SHIPPING : 0);

  const [form, setForm] = useState({
    firstName: "", lastName: "", company: "",
    street: "", street2: "", city: "", postcode: "",
    phone: "", email: "", shipDiff: false, notes: "",
  });
  const [payMethod, setPayMethod] = useState<"momo" | "flutterwave">("momo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);

  const bg = dark ? "#0d1f10" : "#f9fafb";
  const cardBg = dark ? "#1a2e1e" : "white";
  const textPrimary = dark ? "#f0fdf4" : "#1a1a1a";
  const textMuted = dark ? "#9ca3af" : "#6b7280";
  const textSec = dark ? "#d1d5db" : "#374151";
  const border = dark ? "#2d4a32" : "#e5e7eb";
  const inputBg = dark ? "#152318" : "white";
  const labelColor = dark ? "#d1d5db" : "#374151";

  const REQUIRED = ["firstName", "lastName", "street", "city", "postcode", "phone", "email"] as const;

  function validate() {
    const e: Record<string, string> = {};
    REQUIRED.forEach(f => { if (!form[f].trim()) e[f] = "This field is required."; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  }

  function handleChange(field: string, value: string | boolean) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  }

  function handlePlaceOrder() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    clearCart();
    setPlaced(true);
  }

  const inp = (field?: string) => ({
    width: "100%", padding: "9px 12px", fontSize: "14px", outline: "none",
    background: inputBg, color: textPrimary,
    border: `1px solid ${field && errors[field] ? "#ef4444" : border}`,
  });

  if (placed) return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <Navbar active="" />
      <main className="flex-1 flex flex-col items-center justify-center px-8" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#0d9e72" }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>Order Placed!</h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: textMuted }}>
            Thank you, <strong style={{ color: textPrimary }}>{form.firstName}</strong>! Your order has been received.
            We&apos;ll contact you at <strong style={{ color: textPrimary }}>{form.email}</strong> with confirmation details.
          </p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      <Navbar active="" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-16" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <h1 className="text-2xl font-bold mb-8" style={{ color: textPrimary }}>Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Billing form ── */}
          <div className="flex-1 min-w-0 p-6 md:p-8" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <h2 className="text-sm font-bold mb-6" style={{ color: "#0d9e72" }}>Billing details</h2>

            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {(["firstName", "lastName"] as const).map((f, i) => (
                <div key={f}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                    {i === 0 ? "First name" : "Last name"} <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input style={inp(f)} value={form[f]} onChange={e => handleChange(f, e.target.value)} />
                  {errors[f] && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors[f]}</p>}
                </div>
              ))}
            </div>

            {/* Company */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Company name <span style={{ color: textMuted }}>(optional)</span>
              </label>
              <input style={inp()} value={form.company} onChange={e => handleChange("company", e.target.value)} />
            </div>

            {/* Country — fixed */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Country / Region <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div className="px-3 py-2 text-sm" style={{ background: dark ? "#1e3a22" : "#f3f4f6", color: textSec, border: `1px solid ${border}` }}>
                Rwanda
              </div>
            </div>

            {/* Street */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Street address <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input style={{ ...inp("street"), marginBottom: "8px" }} placeholder="House number and street name"
                value={form.street} onChange={e => handleChange("street", e.target.value)} />
              {errors.street && <p className="text-xs mb-2" style={{ color: "#ef4444" }}>{errors.street}</p>}
              <input style={inp()} placeholder="Apartment, suite, unit, etc. (optional)"
                value={form.street2} onChange={e => handleChange("street2", e.target.value)} />
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Town / City <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input style={inp("city")} value={form.city} onChange={e => handleChange("city", e.target.value)} />
              {errors.city && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.city}</p>}
            </div>

            {/* Postcode */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Postcode / ZIP <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input style={inp("postcode")} value={form.postcode} onChange={e => handleChange("postcode", e.target.value)} />
              {errors.postcode && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.postcode}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Phone <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="tel" style={inp("phone")} value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
              {errors.phone && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Email address <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="email" style={inp("email")} value={form.email} onChange={e => handleChange("email", e.target.value)} />
              {errors.email && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.email}</p>}
            </div>

            {/* Ship to different address */}
            <label className="flex items-center gap-2 cursor-pointer mb-6 text-sm font-semibold" style={{ color: "#0d9e72" }}>
              <input type="checkbox" className="accent-[#1a5c2a] w-4 h-4"
                checked={form.shipDiff} onChange={e => handleChange("shipDiff", e.target.checked)} />
              Ship to a different address?
            </label>

            {/* Order notes */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: labelColor }}>
                Order notes <span style={{ color: textMuted }}>(optional)</span>
              </label>
              <textarea rows={4} placeholder="Notes about your order, e.g. special notes for delivery."
                style={{ ...inp(), resize: "vertical" } as React.CSSProperties}
                value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
            </div>
          </div>

          {/* ── RIGHT: Order summary + payment ── */}
          <div className="w-full lg:w-80 flex-shrink-0" style={{ background: cardBg, border: `1px solid ${border}`, padding: "24px" }}>
            <h2 className="text-base font-bold mb-5" style={{ color: textPrimary }}>Your order</h2>

            <div className="flex justify-between text-xs font-bold uppercase tracking-widest pb-3"
              style={{ borderBottom: `2px solid ${border}`, color: textMuted }}>
              <span>Product</span><span>Subtotal</span>
            </div>

            {items.length === 0
              ? <p className="text-sm py-4" style={{ color: textMuted }}>No items in cart.</p>
              : items.map(item => (
                <div key={item.title} className="flex justify-between items-center py-3 text-sm"
                  style={{ borderBottom: `1px dashed ${border}` }}>
                  <span style={{ color: textSec }}>
                    {item.title} <strong style={{ color: textPrimary }}>× {item.qty}</strong>
                  </span>
                  <span className="font-semibold" style={{ color: textSec }}>Fr {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))
            }

            <div className="flex justify-between text-sm py-3" style={{ borderBottom: `1px solid ${border}` }}>
              <span style={{ color: textSec }}>Subtotal</span>
              <span className="font-semibold" style={{ color: textSec }}>Fr {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm py-3" style={{ borderBottom: `1px solid ${border}` }}>
              <span style={{ color: textSec }}>Shipping</span>
              <span className="text-xs" style={{ color: "#0d9e72" }}>quick delivery: Fr {SHIPPING.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-bold py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <span style={{ color: textPrimary }}>Total</span>
              <span style={{ color: textPrimary }}>Fr {total.toLocaleString()}</span>
            </div>

            {/* Payment options */}
            <div className="mt-5 space-y-3">
              {/* MOMO */}
              <label className="flex items-start gap-3 cursor-pointer p-3"
                style={{
                  border: `1px solid ${payMethod === "momo" ? "#0d9e72" : border}`,
                  background: payMethod === "momo" ? (dark ? "#1e3a22" : "#f0fdf4") : "transparent",
                }}>
                <input type="radio" name="pay" className="mt-0.5 accent-[#0d9e72]"
                  checked={payMethod === "momo"} onChange={() => setPayMethod("momo")} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: textPrimary }}>Pay With Mobile Money Code (MOMO)</p>
                  {payMethod === "momo" && (
                    <p className="text-xs mt-2 font-mono px-2 py-1"
                      style={{ background: dark ? "#0d1f10" : "#e5e7eb", color: textSec }}>
                      *182*8*1*016822*AMOUNT#
                    </p>
                  )}
                </div>
              </label>

              {/* Flutterwave */}
              <label className="flex items-center gap-3 cursor-pointer p-3"
                style={{
                  border: `1px solid ${payMethod === "flutterwave" ? "#0d9e72" : border}`,
                  background: payMethod === "flutterwave" ? (dark ? "#1e3a22" : "#f0fdf4") : "transparent",
                }}>
                <input type="radio" name="pay" className="accent-[#0d9e72]"
                  checked={payMethod === "flutterwave"} onChange={() => setPayMethod("flutterwave")} />
                <p className="text-sm font-semibold flex-1" style={{ color: textPrimary }}>Flutterwave</p>
                {/* Trust badge inline right */}
                <div className="relative rounded-lg px-3 pt-4 pb-2" style={{ border: `1px solid ${border}`, background: dark ? "#0d1f10" : "white" }}>
                  <p className="absolute px-1" style={{ top: "-8px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: "9px", color: textMuted, background: dark ? "#0d1f10" : "white" }}>
                    🔒 Trusted by <strong style={{ color: textPrimary }}>Flutterwave</strong>
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img src="/Mastercard-logo.svg" alt="Mastercard" style={{ height: "20px", width: "auto" }} />
                    <img src="/visa.jpg" alt="Visa" style={{ height: "14px", width: "auto" }} />
                    <img src="/verve.png" alt="Verve" style={{ height: "16px", width: "auto" }} />
                  </div>
                </div>
              </label>
            </div>

            <p className="text-xs mt-4 leading-relaxed" style={{ color: textMuted }}>
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
              <a href="#" className="underline" style={{ color: "#0d9e72" }}>privacy policy</a>.
            </p>

            <Button onClick={handlePlaceOrder} fullWidth className="mt-5">Place order</Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

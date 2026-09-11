"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";
import { useDark } from "./DarkContext";
import Button from "./Button";

const NAV_LINKS = ["HOME", "OUR SHOP", "SERVICES", "CONTACT"];

const SEARCH_ITEMS = [
  { title: "Feed Pellets", category: "Product", href: "/products/feed-pellets" },
  { title: "Fodder Silage", category: "Product", href: "/products/fodder-silage" },
  { title: "Hydroponic Green Fodder", category: "Product", href: "/products/hydroponic-green-fodder" },
  { title: "Training Programs", category: "Service", href: "/services" },
  { title: "Technology Installation", category: "Service", href: "/services" },
  { title: "Rapid Feed Testing", category: "Service", href: "/services" },
  { title: "Research & Development", category: "Service", href: "/services" },
];

const LINK_HREFS: Record<string, string> = {
  HOME: "/",
  "OUR SHOP": "/products",
  SERVICES: "/services",
  CONTACT: "/contact",
};

export default function Navbar({ active = "HOME", transparent = false }: { active?: string; transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { items, removeItem, count } = useCart();
  const { dark, toggle } = useDark();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.length > 0
    ? SEARCH_ITEMS.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const displayedSearchItems = searchQuery.length > 0 ? searchResults : SEARCH_ITEMS.slice(0, 4);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!transparent) return;
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const navClass = `navbar ${transparent && !scrolled ? "navbar--transparent" : "navbar--solid"}`;

  return (
    <>
      <header className={navClass}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col">
          <div className="h-16 flex items-center">

            {/* Logo — left */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.jpg" alt="UKC" className="h-7 w-auto" />
            </Link>

            {/* Center group: nav links + icons — desktop only */}
            <div className="desktop-nav gap-6" style={{ margin: "0 auto" }}>
              {NAV_LINKS.map(link => (
                <Link key={link} href={LINK_HREFS[link]}
                  className={`nav-link ${link === active ? "nav-link--active" : ""}`}>
                  {link}
                </Link>
              ))}

              <span className="nav-divider" />

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button className="nav-icon-btn" title="Search" onClick={() => setSearchOpen(o => !o)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
                {searchOpen && (
                  <div className="search-dropdown">
                    <div className="search-dropdown__input-row">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 search-dropdown__arrow" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                      </svg>
                      <input autoFocus type="text" placeholder="Search products & services..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="search-dropdown__input"
                        onKeyDown={e => e.key === "Escape" && setSearchOpen(false)} />
                      {searchQuery && (
                        <button className="search-dropdown__arrow" style={{ background: "none", border: "none", cursor: "pointer" }}
                          onClick={() => setSearchQuery("")}>✕</button>
                      )}
                    </div>
                    {searchQuery.length > 0 && searchResults.length === 0 ? (
                      <p className="search-dropdown__empty">No results for &quot;{searchQuery}&quot;</p>
                    ) : (
                      displayedSearchItems.map(r => (
                        <Link key={r.href + r.title} href={r.href} className="search-dropdown__item"
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                          <span className="search-dropdown__arrow">{searchQuery ? "→" : "↗"}</span>
                          <div>
                            <p className="search-dropdown__title">{r.title}</p>
                            <p className="search-dropdown__category">{r.category}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Login */}
              <button className="nav-icon-btn" title="Login" onClick={() => setLoginOpen(true)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
                </svg>
              </button>

              {/* Cart */}
              <div className="relative" ref={cartRef}>
                <button className="nav-icon-btn relative" title="Cart" onClick={() => setCartOpen(o => !o)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                    <path strokeLinecap="round" d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white flex items-center justify-center"
                      style={{ background: "#0d9e72", fontSize: "10px", fontWeight: 700 }}>
                      {count}
                    </span>
                  )}
                </button>
                {cartOpen && (
                  <div className="cart-dropdown">
                    <div className="cart-dropdown__arrow" />
                    {items.length === 0 ? (
                      <p className="cart-dropdown__empty">Your cart is empty.</p>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-y-auto px-4 pt-4 space-y-3">
                          {items.map(item => (
                            <div key={item.title} className="flex items-center gap-3">
                              <img src={item.img} alt={item.title}
                                className="w-12 h-12 object-cover flex-shrink-0 rounded"
                                style={{ border: "1px solid var(--border-light)" }} />
                              <div className="flex-1 min-w-0">
                                <p className="cart-item__title truncate">{item.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: "#0d9e72" }}>
                                  {item.qty} × Fr {item.price.toLocaleString()}
                                </p>
                              </div>
                              <button className="flex-shrink-0 text-gray-400 hover:text-red-500 transition"
                                onClick={() => removeItem(item.title)}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="cart-subtotal__row">
                          <span className="cart-subtotal__label">Subtotal</span>
                          <span className="cart-subtotal__value">Fr {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                          <Button href="/cart" variant="outline" size="sm" fullWidth onClick={() => setCartOpen(false)}>View Cart</Button>
                          <Button href="/checkout" size="sm" fullWidth onClick={() => setCartOpen(false)}>Checkout</Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Dark/Light toggle */}
              <button className="nav-icon-btn" title={dark ? "Light mode" : "Dark mode"} onClick={toggle}>
                {dark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>

            {/* VIEW OFFERS — desktop only, far right */}
            <div className="desktop-nav" style={{ flexShrink: 0 }}>
              <Link href="/products"
                className="text-xs font-bold tracking-widest text-white border border-white/30 px-4 py-2 transition hover:border-[#0d9e72] hover:text-[#0d9e72]">
                VIEW OFFERS
              </Link>
            </div>

            {/* Mobile hamburger — hidden on desktop */}
            <button className="hamburger-btn nav-icon-btn text-white" onClick={() => setMenuOpen(o => !o)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Bottom line — transparent pages before scroll */}
          {transparent && !scrolled && (
            <div className="hidden md:block" style={{ height: "1px", background: "rgba(255,255,255,0.16)" }} />
          )}
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu md:hidden ${menuOpen ? "mobile-menu--open" : "mobile-menu--closed"}`}>
          <div className="px-8 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link key={link} href={LINK_HREFS[link]}
                className="text-white/80 font-semibold text-sm tracking-wide hover:text-[#0d9e72] transition">
                {link}
              </Link>
            ))}
            <div className="flex items-center gap-5 pt-2 mobile-menu__border">
              <button className="nav-icon-btn" onClick={() => setLoginOpen(true)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
                </svg>
              </button>
              <Link href="/cart" className="nav-icon-btn relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <path strokeLinecap="round" d="M16 10a4 4 0 01-8 0" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ background: "#0d9e72", fontSize: "10px", fontWeight: 700 }}>{count}</span>
                )}
              </Link>
              <button className="nav-icon-btn" onClick={toggle}>
                {dark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {loginOpen && (
        <div className="login-modal__overlay" onClick={() => setLoginOpen(false)}>
          <div className="login-modal__box" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 transition text-xl leading-none"
              style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#9ca3af" : "#6b7280" }}
              onClick={() => setLoginOpen(false)}>×</button>
            <h2 className="login-modal__title">Login</h2>
            <p className="login-modal__subtitle">Sign in to your account</p>
            <div className="space-y-4">
              <div>
                <label className="login-modal__label">Username or Email</label>
                <input type="text" placeholder="Enter your email" className="login-modal__input" />
              </div>
              <div>
                <label className="login-modal__label">Password</label>
                <input type="password" placeholder="Enter your password" className="login-modal__input" />
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#1a5c2a]" /> Remember me
                </label>
                <a href="#" className="hover:text-[#0d9e72] transition">Lost your password?</a>
              </div>
              <Button type="submit" fullWidth>LOG IN</Button>
            </div>
            <p className="login-modal__footer">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold hover:text-[#0d9e72] transition" style={{ color: "#0d9e72" }}>Register</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

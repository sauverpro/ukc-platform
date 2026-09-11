"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import Button from "../components/Button";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";

export const PRODUCTS = [
  {
    slug: "feed-pellets",
    title: "Feed Pellets",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    ],
    price: "Fr 400 – Fr 650",
    priceNum: 400,
    rating: 0,
    description: "Our premium feed pellets are formulated to provide balanced nutrition for all livestock. Made from high-quality ingredients, they support optimal growth, health, and productivity for cattle, goats, sheep, and poultry.",
    tmr: "High-energy pellet blend with essential vitamins and minerals.",
  },
  {
    slug: "fodder-silage",
    title: "Fodder Silage",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    ],
    price: "Fr 120",
    priceNum: 120,
    rating: 4,
    description: "Our high-quality fodder silage, formulated as a Total Mixed Ration (TMR), delivers a balanced, nutrient-rich, and cost-effective feed solution for livestock.",
    tmr: "Total Mixed Ration (TMR)",
  },
  {
    slug: "hydroponic-green-fodder",
    title: "Hydroponic Green Fodder",
    img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80",
    imgs: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    ],
    price: "Fr 250",
    priceNum: 250,
    rating: 0,
    description: "Fresh hydroponic green fodder grown without soil using our advanced systems. Rich in nutrients, highly digestible, and available year-round.",
    tmr: "Fresh hydroponic sprout — high moisture, high digestibility.",
  },
];

function Stars({ count }: { count: number }) {
  if (!count) return null;
  return (
    <div className="flex justify-center gap-0.5 my-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className="w-4 h-4" fill={s <= count ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ slug, title, img, price, priceNum, rating, index }: { slug: string; title: string; img: string; price: string; priceNum: number; rating: number; index: number }) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const added = items.some(i => i.title === title);
  const ref = useAnimateOnScroll("animate__fadeInUp", index * 0.12);
  return (
    <div ref={ref} className="animate-on-scroll product-card group">
      <Link href={`/products/${slug}`} className="product-card__img-wrap block">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="product-card__body">
        <Link href={`/products/${slug}`}><h3 className="product-card__title">{title}</h3></Link>
        <p className="product-card__price">{price}</p>
        <Stars count={rating} />
        <p className="product-card__tag">UNCATEGORIZED</p>
        <div className="flex flex-col gap-2 mt-3 w-full px-2">
          <Button fullWidth size="sm" onClick={() => added ? router.push("/cart") : addItem({ title, img, price: priceNum })}>
            {added ? "View cart" : "Add to cart"}
          </Button>
          <Button href={`/products/${slug}`} fullWidth size="sm" variant="outline">View details</Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [sort, setSort] = useState("default");

  const sorted = [...PRODUCTS].sort((a, b) => {
    if (sort === "popularity" || sort === "rating") return b.rating - a.rating;
    if (sort === "latest") return PRODUCTS.indexOf(b) - PRODUCTS.indexOf(a);
    if (sort === "price-asc") return a.priceNum - b.priceNum;
    if (sort === "price-desc") return b.priceNum - a.priceNum;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar active="OUR SHOP" transparent />

      {/* Hero */}
      <section className="page-hero" style={{ minHeight: "220px" }}>
        <div className="page-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')" }} />
        <div className="absolute inset-0 hero-overlay" />
        <div className="page-hero__content">
          <p className="breadcrumb mb-3">
            <Link href="/" className="breadcrumb__link">HOME</Link>
            <span className="mx-2">›</span>
            <span className="breadcrumb__active">PRODUCTS</span>
          </p>
          <h1 className="text-5xl font-black text-white">Products</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 px-8 md:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>
              Showing all {PRODUCTS.length} results
            </p>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-sm border px-3 py-2 rounded outline-none"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>
              <option value="default">Default sorting</option>
              <option value="popularity">Sort by popularity</option>
              <option value="rating">Sort by average rating</option>
              <option value="latest">Sort by latest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {sorted.map((p, i) => <ProductCard key={p.title} {...p} index={i} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

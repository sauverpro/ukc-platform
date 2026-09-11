"use client";
import { useRouter } from "next/navigation";
import { useDark } from "./DarkContext";
import { useCart } from "./CartContext";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import Button from "./Button";

const PRODUCTS = [
  { title: "Feed Pellets", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80", price: 400, rating: 0 },
  { title: "Fodder Silage", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", price: 120, rating: 4 },
  { title: "Hydroponic Green Fodder", img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80", price: 250, rating: 0 },
];

function Stars({ count }: { count: number }) {
  if (!count) return null;
  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className="w-5 h-5" fill={s <= count ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ title, img, price, rating, index }: { title: string; img: string; price: number; rating: number; index: number }) {
  const { dark } = useDark();
  const { addItem } = useCart();
  const router = useRouter();
  const ref = useAnimateOnScroll("animate__fadeInUp", index * 0.12);

  return (
    <div ref={ref} className="animate-on-scroll group cursor-pointer flex flex-col">
      <div className="overflow-hidden rounded-t-xl h-64 shadow-md">
        <img src={img} alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="pt-5 pb-6 px-2 flex flex-col gap-2" style={{ background: dark ? "#1a2e1e" : "white" }}>
        <h3 className="text-center font-bold text-lg tracking-wide" style={{ color: dark ? "#f0fdf4" : "#1f2937" }}>{title}</h3>
        <p className="text-center text-sm" style={{ color: "#1a5c2a" }}>Fr {price}</p>
        <Stars count={rating} />
        <p className="text-center text-xs font-semibold tracking-widest" style={{ color: "#9ca3af" }}>UNCATEGORIZED</p>
        <div className="mt-3">
          <Button fullWidth size="sm" onClick={() => { addItem({ title, img, price }); router.push("/cart"); }}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { dark } = useDark();
  const headingRef = useAnimateOnScroll("animate__fadeInDown", 0);

  return (
    <section className="py-24 px-8 md:px-16" style={{ background: dark ? "#0d1f10" : "white" }}>
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="animate-on-scroll flex justify-center mb-14">
          <h2 className="border-2 text-sm font-bold tracking-widest px-14 py-4"
            style={{ borderColor: "#0d9e72", color: "#1a5c2a" }}>
            FEATURED PRODUCTS
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {PRODUCTS.map((p, i) => <ProductCard key={p.title} {...p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

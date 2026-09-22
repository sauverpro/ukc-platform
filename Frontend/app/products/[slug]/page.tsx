"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../components/CartContext";
import { useDark } from "../../components/DarkContext";
import Button from "../../components/Button";
import { api, Product, PaginatedResponse } from "../../lib/api";

const FALLBACK_PRODUCTS = [
  { slug: "feed-pellets", title: "Feed Pellets", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80", price: "Fr 400 – Fr 650", priceNum: 400, rating: 0, description: "Total Mixed Ration (TMR)" },
  { slug: "fodder-silage", title: "Fodder Silage", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", price: "Fr 120", priceNum: 120, rating: 4, description: "High quality silage" },
  { slug: "hydroponic-green-fodder", title: "Hydroponic Green Fodder", img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80", price: "Fr 250", priceNum: 250, rating: 0, description: "Fresh hydroponic fodder" },
];

function Stars({ count, reviews }: { count: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className="w-4 h-4" fill={s <= count ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
      {reviews !== undefined && (
        <span className="text-xs" style={{ color: "#9ca3af" }}>({reviews} customer review)</span>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem, items } = useCart();
  const { dark } = useDark();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<Product>(`/products/${slug}`)
      .then((p) => {
        setProduct({
          slug: p.slug,
          title: p.name,
          img: p.featured_image || FALLBACK_PRODUCTS[0].img,
          imgs: [p.featured_image || FALLBACK_PRODUCTS[0].img],
          price: `Fr ${p.base_price.toLocaleString()}`,
          priceNum: p.base_price,
          rating: Math.round(p.average_rating),
          description: p.description,
          category: p.category?.name || "UNCATEGORIZED",
          reviews: p.reviews,
        });

        // fetch related
        api.get<PaginatedResponse<Product>>(`/products?per_page=3`)
          .then(res => {
             const rel = res.data.filter(r => r.slug !== slug).map(r => ({
                slug: r.slug,
                title: r.name,
                img: r.featured_image || FALLBACK_PRODUCTS[0].img,
                price: `Fr ${r.base_price.toLocaleString()}`,
                priceNum: r.base_price,
             }));
             setRelated(rel);
          }).catch(() => {});
      })
      .catch(() => {
         const fb = FALLBACK_PRODUCTS.find(p => p.slug === slug);
         if (fb) {
           setProduct({ ...fb, imgs: [fb.img], category: "UNCATEGORIZED", reviews: [] });
           setRelated(FALLBACK_PRODUCTS.filter(p => p.slug !== slug));
         }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const bg = dark ? "#0d1f10" : "white";
  const cardBg = dark ? "#1a2e1e" : "white";
  const textPrimary = dark ? "#f0fdf4" : "#1a1a1a";
  const textMuted = dark ? "#9ca3af" : "#6b7280";
  const textGreen = dark ? "#4ade80" : "#1a5c2a";
  const border = dark ? "#2d4a32" : "#e5e7eb";
  const inputBg = dark ? "#152318" : "white";
  const inputText = dark ? "#f0fdf4" : "#374151";


  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");

  if (loading) return <div className="p-20 text-center" style={{ color: textPrimary, background: bg, minHeight: "100vh" }}>Loading product...</div>;
  if (!product) return <div className="p-20 text-center" style={{ color: textPrimary, background: bg, minHeight: "100vh" }}>Product not found.</div>;

  const inCart = items.some(i => i.title === product.title);

  return (
    <div className="max-w-5xl mx-auto" style={{ background: bg, fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      <Navbar active="OUR SHOP" />

      <main className="mx-auto px-8 md:px-16" style={{ maxWidth: "900px", paddingTop: "100px", paddingBottom: "80px" }}>

       
        <p className="text-xs mb-8" style={{ color: textMuted }}>
          <Link href="/" className="hover:text-[#0d9e72] transition uppercase">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/products" className="hover:text-[#0d9e72] transition uppercase">{product.category}</Link>
          <span className="mx-2">›</span>
          <span className="font-semibold uppercase" style={{ color: textPrimary }}>{product.title}</span>
        </p>

        {/* Product top */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="overflow-hidden mb-3" style={{ height: "280px" }}>
              <img src={product.imgs[activeImg]} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {product.imgs.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="overflow-hidden flex-shrink-0"
                  style={{ width: "72px", height: "56px", border: activeImg === i ? "2px solid #0d9e72" : `2px solid ${border}` }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>{product.title}</h1>
            {product.rating > 0 && <div className="mb-3"><Stars count={product.rating} reviews={product.reviews?.length || 0} /></div>}
            <p className="text-xl font-bold mb-4" style={{ color: "#0d9e72" }}>{product.price}</p>
            <p className="text-sm mb-6" style={{ color: textMuted, lineHeight: 1.8 }}>{product.description}</p>

            {/* Qty + cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border" style={{ borderColor: border, width: "80px", background: inputBg }}>
                <input type="number" min={1} value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center text-sm py-2 outline-none"
                  style={{ color: inputText, background: inputBg }} />
                <div className="flex flex-col border-l" style={{ borderColor: border }}>
                  <button className="px-1 text-xs leading-none py-0.5"
                    style={{ color: inputText, background: inputBg }}
                    onClick={() => setQty(q => q + 1)}>▲</button>
                  <button className="px-1 text-xs leading-none py-0.5"
                    style={{ color: inputText, background: inputBg }}
                    onClick={() => setQty(q => Math.max(1, q - 1))}>▼</button>
                </div>
              </div>
              <Button
                className="flex-1"
                onClick={() => { if (inCart) router.push("/cart"); else addItem({ title: product.title, img: product.img, price: product.priceNum, qty }); }}
              >
                {inCart ? "View cart" : "Add to cart"}
              </Button>
            </div>

            <p className="text-xs" style={{ color: textMuted }}>
              <span className="font-semibold uppercase tracking-widest">Category:</span>{" "}
              <span style={{ color: "#0d9e72" }}>{product.category}</span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${border}` }} className="flex gap-8 mb-6">
          {(["description", "reviews"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="pb-3 text-sm font-semibold capitalize transition-all"
              style={{
                color: tab === t ? "#0d9e72" : textMuted,
                borderBottom: tab === t ? "2px solid #0d9e72" : "2px solid transparent",
                marginBottom: "-1px",
              }}>
              {t === "reviews" ? `Reviews (${product.reviews?.length || 0})` : "Description"}
            </button>
          ))}
        </div>

        <div className="mb-16 text-sm" style={{ color: textMuted }}>
          {tab === "description" ? (
            <p>{product.description}</p>
          ) : (
            product.reviews?.length > 0 ? (
               <div className="space-y-4">
                  {product.reviews.map((r: any) => (
                    <div key={r.id} className="p-4 border rounded" style={{ borderColor: border }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{r.user?.name}</span>
                        <Stars count={r.rating} />
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))}
               </div>
            ) : (
               <p style={{ color: textMuted }}>No reviews yet.</p>
            )
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-6" style={{ color: textPrimary }}>Related products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {related.map(p => {
                const relAdded = items.some(i => i.title === p.title);
                return (
                  <div key={p.slug} className="group flex flex-col" style={{ background: cardBg }}>
                    <Link href={`/products/${p.slug}`} className="overflow-hidden block" style={{ height: "160px" }}>
                      <img src={p.img} alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <div className="pt-3 pb-4 flex flex-col items-center gap-1 px-2">
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-bold text-center text-sm hover:text-[#0d9e72] transition" style={{ color: textGreen }}>{p.title}</h3>
                      </Link>
                      <p className="text-sm font-semibold" style={{ color: "#0d9e72" }}>{p.price}</p>
                      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: textMuted }}>{p.category || "UNCATEGORIZED"}</p>
                      <Button
                        size="sm"
                        onClick={() => { if (relAdded) router.push("/cart"); else addItem({ title: p.title, img: p.img, price: p.priceNum, qty: 1 }); }}
                      >
                        {relAdded ? "View cart" : "Add to cart"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

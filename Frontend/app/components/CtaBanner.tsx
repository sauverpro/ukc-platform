"use client";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import Button from "./Button";

export default function CtaBanner() {
  const ref = useAnimateOnScroll("animate__fadeInUp", 0);

  return (
    <section className="relative py-20 px-8 md:px-16 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a2e1a 0%, #1a5c2a 60%, #0d9e72 100%)" }}>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(13,158,114,0.15)", filter: "blur(60px)" }} />

      <div ref={ref} className="animate-on-scroll max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Ready to transform your livestock feed?
        </h2>
        <p className="mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
          Join hundreds of farmers across Rwanda who trust UKC for sustainable, high-quality animal feed solutions.
        </p>
        <Button href="/products" size="lg">GET STARTED TODAY</Button>
      </div>
    </section>
  );
}

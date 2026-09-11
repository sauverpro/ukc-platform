"use client";
import { useDark } from "./DarkContext";
import Button from "./Button";

export default function Hero() {
  const { dark } = useDark();
  const waveFill = dark ? "#0d1f10" : "white";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')" }} />
      <div className="absolute inset-0 hero-overlay" />

      <div className="absolute top-24 right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(13,158,114,0.18)", filter: "blur(60px)" }} />
      <div className="absolute bottom-32 left-1/3 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "rgba(26,92,42,0.25)", filter: "blur(48px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-48 pb-44 w-full">
        <div className="max-w-2xl">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-8 animate__animated animate__fadeInDown"
            style={{ letterSpacing: "-0.5px" }}
          >
            URUHIMBI <span style={{ color: "#0d9e72" }}>KAGEYO</span> LTD
          </h1>

          <p className="text-lg leading-loose mb-10 animate__animated animate__fadeInUp animate__delay-1s"
            style={{ color: "rgba(255,255,255,0.78)", maxWidth: "500px" }}>
            UKC specializes in sustainable and innovative animal feed solutions, offering premium hydroponic fodder, high-quality feed pellets and expert agricultural services.
          </p>

          <div className="flex flex-wrap gap-5 animate__animated animate__fadeInUp animate__delay-1s">
            <Button href="/products" size="lg">
              SHOP WITH US
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Button>
            <Button href="/services" size="lg" variant="outline">OUR SERVICES</Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "70px" }}>
          <path d="M0 70L1440 70L1440 25C1200 65 960 5 720 25C480 45 240 5 0 25L0 70Z" fill={waveFill} />
        </svg>
      </div>
    </section>
  );
}

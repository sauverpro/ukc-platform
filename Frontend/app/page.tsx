"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Services from "./components/Services";
import Photos from "./components/Photos";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      <Navbar active="HOME" transparent />
      <Hero />
      <FeaturedProducts />
      <Services />
      <Photos />
      <CtaBanner />
      <Footer />
    </div>
  );
}

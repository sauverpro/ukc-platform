"use client";

import { useDark } from "./DarkContext";

const PHOTOS = [
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
];

export default function Photos() {
  const { dark } = useDark();

  return (
    <section
      className="py-24 px-8 md:px-16"
      style={{ background: dark ? "#0d1f10" : "white" }}
    >
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-center mb-12 animate__animated animate__fadeInDown">
          <h2
            className="border-2 text-sm font-bold tracking-widest px-16 py-4"
            style={{
              borderColor: "#0d9e72",
              color: dark ? "#4ade80" : "#1a5c2a",
            }}
          >
            PHOTOS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl h-52 group cursor-pointer shadow-sm animate__animated ${
                i % 2 === 0
                  ? "animate__fadeInUp"
                  : "animate__fadeInDown"
              }`}
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
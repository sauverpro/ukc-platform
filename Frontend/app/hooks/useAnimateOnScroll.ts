"use client";
import { useEffect, useRef } from "react";

export function useAnimateOnScroll(animation = "animate__fadeInUp", delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}s`;
          el.classList.add("animate__animated", animation, "animated");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay]);

  return ref;
}

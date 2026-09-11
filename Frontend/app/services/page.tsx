"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDark } from "../components/DarkContext";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";

const ACCORDION_ITEMS = [
  {
    title: "Basic Training",
    body: (
      <div className="text-sm space-y-2">
        <p className="font-semibold">Rwf 150,000</p>
        <p><span className="font-semibold">Duration:</span> 3 days (on-site)</p>
        <p className="font-semibold mt-1">Package Includes</p>
        <p>– Introduction to hydroponic fodder production</p>
        <p>– Best practices for feeding and storage</p>
        <p>– Nutritional benefits and cost-saving strategies</p>
      </div>
    ),
  },
  {
    title: "Intensive Training",
    body: (
      <div className="text-sm space-y-2">
        <p className="font-semibold">Rwf 300,000</p>
        <p><span className="font-semibold">Duration:</span> 7 days (on-site)</p>
        <p className="font-semibold mt-1">Package Includes</p>
        <p>– Full hydroponic system setup and management</p>
        <p>– Advanced feeding and nutrition strategies</p>
        <p>– Business planning and market access</p>
      </div>
    ),
  },
];

function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="accordion">
      {ACCORDION_ITEMS.map((item, i) => (
        <div key={i} className="accordion__item">
          <button className="accordion__trigger" onClick={() => setOpen(open === i ? null : i)}>
            {item.title}
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="accordion__body">{item.body}</div>}
        </div>
      ))}
    </div>
  );
}

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Training Programs",
    desc: "Hands-on and theoretical training to equip farmers and agripreneurs with the skills to optimize livestock feed systems.",
    modal: (
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=700&q=80" alt="Training"
          className="w-full object-cover rounded" style={{ height: "220px" }} />
        <div>
          <h3 className="text-xl font-bold mb-2">Training Programs</h3>
          <p className="text-sm mb-5" style={{ lineHeight: 1.7 }}>
            UKC offers hands-on and theoretical training to equip farmers and agripreneurs with the necessary knowledge and skills to optimize their livestock feed systems.
          </p>
          <Accordion />
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Technology Installation",
    desc: "Customized hydroponic system installation including greenhouse setup, automated irrigation and climate control.",
    modal: (
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-xl font-bold mb-5">Technology Installation</h3>
          <ul className="text-sm space-y-4" style={{ listStyle: "disc", paddingLeft: "18px" }}>
            <li>
              <span className="font-semibold" style={{ color: "#0d9e72" }}>Price Range</span><br />
              Prices vary depending with production capacity — number of animals and greenhouse capacity.
            </li>
            <li>
              <span className="font-semibold" style={{ color: "#0d9e72" }}>Description</span><br />
              UKC provides customized hydroponic system installation based on daily feeding requirements. Services include greenhouse setup, automated irrigation, climate control and customized shelving.
            </li>
            <li><span className="font-semibold" style={{ color: "#0d9e72" }}>Key Benefits</span></li>
          </ul>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80" alt="Hydroponic" className="w-full object-cover" style={{ height: "130px" }} />
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80" alt="Greenhouse" className="w-full object-cover" style={{ height: "130px" }} />
          </div>
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80" alt="Installation" className="w-full object-cover" style={{ height: "130px" }} />
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Rapid Feed Testing",
    desc: "Fast and reliable animal feed testing with results in approximately 3 minutes per test at 60,000 RWF.",
    modal: (
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-xl font-bold mb-5">Rapid Animal Feed Testing Services</h3>
          <ul className="text-sm space-y-2" style={{ listStyle: "disc", paddingLeft: "18px" }}>
            <li><span className="font-semibold" style={{ color: "#0d9e72" }}>Turnaround Time:</span> Approximately 3 minutes per test</li>
            <li><span className="font-semibold">Price:</span> <span style={{ color: "#0d9e72" }}>60,000 RWF</span> per test</li>
          </ul>
          <p className="text-sm font-semibold mt-5 mb-2">Benefits:</p>
          <ul className="text-sm space-y-1">
            {["Instant and reliable results", "Supports informed feeding decisions", "Helps improve livestock productivity and health"].map(t => (
              <li key={t} className="flex items-start gap-2">
                <span style={{ color: "#0d9e72", fontSize: "10px", marginTop: "4px" }}>○</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80" alt="Feed testing"
          className="w-full object-cover rounded" style={{ height: "280px" }} />
      </div>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Research & Development",
    desc: "Advanced hydroponic fodder techniques, system management, feed optimization and business-oriented insights.",
    modal: (
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-xl font-bold mb-5">Research &amp; Development (R&amp;D) Services</h3>
          <ul className="text-sm space-y-2" style={{ listStyle: "disc", paddingLeft: "18px" }}>
            {["Advanced hydroponic fodder production techniques", "System management and troubleshooting", "Feed optimization and business-oriented insights", "Practical, hands-on experience"].map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <img src="https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=500&q=80" alt="Map" className="w-full object-cover" style={{ height: "220px" }} />
          <div className="flex flex-col gap-2">
            <img src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=400&q=80" alt="R&D" className="w-full object-cover" style={{ height: "106px" }} />
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" alt="R&D" className="w-full object-cover" style={{ height: "106px" }} />
          </div>
        </div>
      </div>
    ),
  },
];

function ServiceCard({ icon, title, desc, index, onMore }: { icon: React.ReactNode; title: string; desc: string; index: number; onMore: () => void }) {
  const ref = useAnimateOnScroll("animate__fadeInUp", index * 0.1);
  return (
    <div ref={ref} className="animate-on-scroll service-card">
      <div className="service-card__icon">{icon}</div>
      <p className="service-card__title">{title}</p>
      <p className="service-card__desc">{desc}</p>
      <button className="service-card__more" onClick={onMore}>MORE</button>
    </div>
  );
}

export default function ServicesPage() {
  const { dark } = useDark();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const active = SERVICES.find(s => s.title === activeModal);

  return (
    <div className="min-h-screen">
      <Navbar active="SERVICES" transparent />

      {/* Hero */}
      <section className="page-hero" style={{ minHeight: "230px" }}>
        <div className="page-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')" }} />
        <div className="absolute inset-0 hero-overlay" />
        <div className="page-hero__content">
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#0d9e72" }}>WHAT WE DO</p>
          <h1 className="text-5xl font-black text-white">Services</h1>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 px-12" style={{ background: dark ? "#152318" : "#f0f0f0" }}>
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {SERVICES.map(({ icon, title, desc }, i) => (
              <ServiceCard key={title} icon={icon} title={title} desc={desc} index={i} onMore={() => setActiveModal(title)} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && active && (
          <motion.div className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}>
            <motion.div className="modal-box"
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
              {active.modal}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

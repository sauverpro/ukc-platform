"use client";

const SERVICES = [
  {
    icon: <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" /></svg>,
    title: "Training Programs",
    desc: "UKC offers hands-on and theoretical training to equip farmers and agripreneurs with the necessary knowledge and skills to optimize their livestock feed systems.",
  },
  {
    icon: <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /><circle cx="16" cy="9" r="2" /><path d="M14 9H8" strokeLinecap="round" /></svg>,
    title: "Technology Installation",
    desc: "UKC provides customized hydroponic system installation based on the daily feeding requirements of livestock.",
  },
  {
    icon: <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    title: "Research & Development (R&D) Services",
    desc: "UKC provides specialized research and development services tailored to improving livestock nutrition, enhancing hydroponic farming techniques and optimizing feed efficiency.",
  },
];

export default function Services() {
  return (
    <section
      className="py-24 px-8 md:px-16"
      style={{ background: "#2d5a27" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Section title */}
        <h2 className="text-center text-white font-black text-xl tracking-widest mb-14 animate__animated animate__fadeIn">
          ABOUT OUR SERVICES
        </h2>

        {/* Services */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {SERVICES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="h-full animate__animated animate__fadeIn"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <div className="services-card">
                <div className="mt-2">{icon}</div>

                <h3 className="font-bold text-lg leading-snug">
                  {title}
                </h3>

                <p
                  className="text-sm leading-loose flex-1"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
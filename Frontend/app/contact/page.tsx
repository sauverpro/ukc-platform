
"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDark } from "../components/DarkContext";
import Button from "../components/Button";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";

const INFO_CARDS = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        style={{ color: "#0d9e72" }}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    title: "Physical Address",
    detail: "Northern Province, Rwanda Gicumbi, Kageyo",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="#0d9e72"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Address",
    detail: "info@ukc.rw",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="#0d9e72"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Phone Numbers",
    detail: "+250 791921186",
  },
];

function InfoCard({
  icon,
  title,
  detail,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  index: number;
}) {
  const { dark } = useDark();

  const cardBg = dark ? "#1a2e1e" : "#f3f4f6";
  const textMuted = dark ? "#e5e7eb" : "#6b7280";

  const ref = useAnimateOnScroll(
    "animate__fadeInUp",
    index * 0.15
  );

  return (
    <div
      ref={ref}
      className="animate-on-scroll p-7 rounded-sm"
      style={{ background: cardBg }}
    >
      <div className="mb-3">{icon}</div>

      <h3
        className="font-bold text-sm mb-2"
        style={{ color: "#0d9e72" }}
      >
        {title}
      </h3>

      <p
        className="text-sm leading-relaxed"
        style={{ color: textMuted }}
      >
        {detail}
      </p>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const { dark } = useDark();

  const bg = dark ? "#0d1f10" : "white";
  const cardBg = dark ? "#1a2e1e" : "#f3f4f6";
  const inputBg = dark ? "#152318" : "white";
  const textPrimary = dark ? "#ffffff" : "#1f2937";
  const borderColor = dark ? "#2d4a32" : "#e5e7eb";
  const labelColor = dark ? "#f0fdf4" : "#374151";

  const imageRef = useAnimateOnScroll(
    "animate__fadeInUp",
    0
  );

  const formRef = useAnimateOnScroll(
    "animate__fadeInUp",
    0.15
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: bg,
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
      }}
    >
      <Navbar active="CONTACT" transparent />

      {/* Contact Hero */}
      <section
        className="relative pt-20"
        style={{ minHeight: "260px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(234deg, rgba(0,0,0,0.8) 0%, rgba(10,10,10,0.5) 100%)",
          }}
        />

        {/* No animation here */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6 text-center">
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: "#0d9e72" }}
          >
            LET'S TALK
          </p>

          <h1 className="text-5xl font-black text-white">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section
        className="py-16 px-8 md:px-16"
        style={{ background: bg }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {INFO_CARDS.map(
              ({ icon, title, detail }, i) => (
                <InfoCard
                  key={title}
                  icon={icon}
                  title={title}
                  detail={detail}
                  index={i}
                />
              )
            )}
          </div>

          {/* Image + Form */}
          <div className="grid md:grid-cols-2 gap-10 items-start">

            {/* Image */}
            <div
              ref={imageRef}
              className="animate-on-scroll overflow-hidden rounded-xl h-80 md:h-full min-h-64"
            >
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80"
                alt="UKC Farm"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Form */}
            <div
              ref={formRef}
              className="animate-on-scroll p-8 rounded-sm"
              style={{ background: cardBg }}
            >
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: textPrimary }}
              >
                Send us a message
              </h2>

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                {[
                  {
                    label: "Name",
                    key: "name",
                    type: "text",
                  },
                  {
                    label: "Phone",
                    key: "phone",
                    type: "tel",
                  },
                  {
                    label: "Email Address",
                    key: "email",
                    type: "email",
                  },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: labelColor }}
                    >
                      {label}{" "}
                      <span style={{ color: "#0d9e72" }}>
                        *
                      </span>
                    </label>

                    <input
                      type={type}
                      required
                      value={
                        form[key as keyof typeof form]
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 text-sm border outline-none transition-all duration-200"
                      style={{
                        borderColor,
                        background: inputBg,
                        color: textPrimary,
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor =
                          "#0d9e72";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor =
                          borderColor;
                      }}
                    />
                  </div>
                ))}

                {/* Message */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: labelColor }}
                  >
                    Your Message{" "}
                    <span style={{ color: "#0d9e72" }}>
                      *
                    </span>
                  </label>

                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 text-sm border outline-none transition-all duration-200 resize-y"
                    style={{
                      borderColor,
                      background: inputBg,
                      color: textPrimary,
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor =
                        "#0d9e72";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor =
                        borderColor;
                    }}
                  />
                </div>

                <Button type="submit" size="sm">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


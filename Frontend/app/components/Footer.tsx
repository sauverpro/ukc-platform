"use client";
import Link from "next/link";
import Image from "next/image";
import { useDark } from "./DarkContext";

const SOCIAL_ICONS = [
  <svg key="fb" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  <svg key="x" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  <svg key="ig" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  <svg key="yt" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>,
];

const MENU_LINKS = [["Home", "/"], ["Products", "/products"], ["Contact", "/contact"]];

export default function Footer() {
  const { dark } = useDark();
  const borderColor = dark ? "#2d4a32" : "#f0f0f0";

  return (
    <footer className="border-t pt-14 pb-8 px-8 md:px-16" style={{ borderColor }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-10">

          {/* Brand */}
          <div>
            <div className="mb-5">
              <Image src="/logo.jpg" alt="UKC Logo" width={100} height={50} className="object-contain" />
            </div>
            <div className="space-y-2 text-sm text-muted">
              <p>Phone: +250 791921186</p>
              <p>Email: info@ukc.rw</p>
              <p>Address: Northern Province,<br />Rwanda Gicumbi, Kageyo</p>
            </div>
          </div>

          {/* Main Menu */}
          <div>
            <h4 className="font-bold text-base mb-5">Main Menu</h4>
            <ul className="space-y-3 text-sm text-muted">
              {MENU_LINKS.map(([label, to]) => (
                <li key={label}>
                  <Link href={to} className="hover:text-[#0d9e72] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-base mb-5">Account</h4>
            <ul className="space-y-3 text-sm text-muted">
              {([["My Cart", "/cart"], ["Check Out", "/checkout"]] as [string, string][]).map(([item, href]) => (
                <li key={item}><Link href={href} className="hover:text-[#0d9e72] transition">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${borderColor}` }}>
          <p className="text-sm text-muted">Copyright © 2026 UKC</p>
          <div className="flex items-center gap-3">
            {SOCIAL_ICONS.map((icon, i) => (
              <a key={i} href="#" className="footer-social-btn">{icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

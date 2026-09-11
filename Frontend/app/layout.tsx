import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "animate.css";
import Providers from "./components/Providers";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "URUHIMBIKAGEYO LTD - Sustainable Animal Feed Solutions",
  description: "Premium hydroponic fodder, feed pellets and agricultural services",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

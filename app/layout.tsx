import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://dealfinder.example"),
  title: { default: "DealFinder — Better deals from independent sellers", template: "%s | DealFinder" },
  description: "Discover discounted products and active coupons from independent Etsy sellers.",
  openGraph: { title: "DealFinder — Find Better Deals", description: "Thoughtful products, better prices, and active coupons.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${display.variable}`}><Header /><main>{children}</main><Footer /></body></html>;
}

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter, Cairo, Montserrat, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-gotham-fallback",
});

export const metadata: Metadata = {
  title: "Topicrem & Novexpert Jordan | Premium French Skincare",
  description:
    "Official distributor of Topicrem and Novexpert in Jordan. Authentic French skincare - dermatologically tested, clinically proven. Shop premium skincare solutions.",
  generator: "v0.app",
  icons: {
    icon: "/topicremlogo.png",
    apple: "/topicremlogo.png",
  },
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

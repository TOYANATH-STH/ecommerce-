import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Yato Shop - Nepal's Trusted Online Shopping Destination",
    template: "%s | Yato Shop",
  },
  description:
    "Shop online in Nepal with confidence. Quality products, fast delivery across Nepal, secure eSewa payments, and easy cash on delivery.",
  keywords: [
    "Nepal",
    "e-commerce",
    "online shopping",
    "eSewa",
    "Kathmandu",
    "delivery",
  ],
  openGraph: {
    type: "website",
    locale: "en_NP",
    siteName: "Yato Shop",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

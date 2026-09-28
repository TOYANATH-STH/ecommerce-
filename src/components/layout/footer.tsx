"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Subscribe to our Newsletter</h3>
              <p className="text-sm">Get updates on new products and exclusive offers</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 md:w-80"
                disabled={status === "loading"}
              />
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {status === "success" && (
              <p className="text-green-400 text-sm mt-2">Thank you for subscribing!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Yato<span className="text-red-500">Shop</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              Yato Shop is Nepal&apos;s trusted online shopping destination. Quality products, fast delivery, and secure payments with eSewa.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-red-500 transition-colors">Shop All Products</Link></li>
              <li><Link href="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-red-500 transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/return-policy" className="hover:text-red-500 transition-colors">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-red-500 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-red-500 transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-red-500 transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-red-500 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-red-500 transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500 shrink-0" />
                <span>+977-01-4567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500 shrink-0" />
                <span>support@yatoshop.com.np</span>
              </li>
            </ul>

            {/* Payment methods */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-2">We Accept</h5>
              <div className="flex gap-2">
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-600">eSewa</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-green-600">COD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            <p>&copy; {new Date().getFullYear()} Yato Shop. All rights reserved.</p>
            <p>Made with love in Nepal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

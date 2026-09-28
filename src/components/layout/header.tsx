"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const categories = [
  { name: "Men's Fashion", href: "/category/mens-fashion" },
  { name: "Women's Fashion", href: "/category/womens-fashion" },
  { name: "Shoes", href: "/category/shoes" },
];

export function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-red-600 text-white text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>Free delivery inside Kathmandu Valley on orders above Rs. 2,000</p>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/about" className="hover:underline">About Us</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">
              Yato<span className="text-red-600">Shop</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-24 rounded-r-none border-r-0"
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 h-full rounded-l-none bg-red-600 hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full">
              <Heart className="h-6 w-6 text-gray-700" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>

            {/* User */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 cursor-pointer text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="hidden md:flex">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-0 top-0 h-full rounded-l-none bg-red-600 hover:bg-red-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Category navigation */}
      <nav className="border-t bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Button
              variant="ghost"
              className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 py-3"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">All Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
            </Button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-full md:w-64 bg-white border rounded-lg shadow-lg z-50 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop category links */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {!session && (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block px-3 py-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

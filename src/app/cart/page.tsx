"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const deliveryCharge = 100; // Default delivery charge
  const total = subtotal - couponDiscount + deliveryCharge;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();

      if (res.ok) {
        setCouponDiscount(data.discount);
        setCouponApplied(true);
        toast({
          title: "Coupon Applied",
          description: `You saved ${formatPrice(data.discount)}!`,
          variant: "success",
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.error || "The coupon code you entered is not valid.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to validate coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponCode("");
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-24 h-24 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/shop">
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 border rounded-lg bg-white"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="font-semibold text-gray-900 hover:text-red-600 line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {formatPrice(item.discountPrice || item.price)} each
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">
                      {formatPrice((item.discountPrice || item.price) * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        removeItem(item.productId);
                        toast({
                          title: "Removed from Cart",
                          description: `${item.name} has been removed.`,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Link href="/shop">
              <Button variant="outline">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div>
                    <p className="font-semibold text-green-700">{couponCode}</p>
                    <p className="text-sm text-green-600">
                      You saved {formatPrice(couponDiscount)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout with eSewa & Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

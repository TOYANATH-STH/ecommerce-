"use client";

import { useWishlist } from "@/context/wishlist-context";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">
            Save items you love to your wishlist and revisit them later.
          </p>
          <Link href="/shop">
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
      </Container>
    );
  }

  // Convert wishlist items to product format for ProductGrid
  const products = items.map((item) => ({
    id: item.productId,
    name: item.name,
    slug: item.productId,
    description: "",
    price: item.price,
    discountPrice: item.discountPrice,
    categoryId: "",
    sku: "",
    stock: 1,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isPopular: false,
    isDiscount: false,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    createdAt: "",
    updatedAt: "",
    images: [{ id: "", productId: item.productId, url: item.image, isPrimary: true, sortOrder: 0 }],
  }));

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <p className="text-gray-500 mb-6">{items.length} items in your wishlist</p>

      <ProductGrid products={products as any} />
    </Container>
  );
}

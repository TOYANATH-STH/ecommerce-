"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const discountPercentage = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const isInCartAlready = isInCart(product.id);
  const isInWishlistAlready = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: primaryImage?.url || "/images/placeholder.png",
      stock: product.stock,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "success",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlistAlready) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: primaryImage?.url || "/images/placeholder.png",
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
        variant: "success",
      });
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={primaryImage?.url || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-red-600 text-white">-{discountPercentage}%</Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-green-600 text-white">New</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className={`h-8 w-8 rounded-full ${isInWishlistAlready ? "bg-red-100 text-red-600" : ""}`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlistAlready ? "fill-current" : ""}`} />
            </Button>
            <Link href={`/products/${product.slug}`}>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.brand && (
            <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${
                    star <= product.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant={isInCartAlready ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInCartAlready ? "Add More" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

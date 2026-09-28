"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const discountPercentage = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const isInCartAlready = isInCart(product.id);
  const isInWishlistAlready = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0]?.url || "/images/placeholder.png",
        stock: product.stock,
      },
      quantity
    );

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "success",
    });
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0]?.url || "/images/placeholder.png",
        stock: product.stock,
      },
      quantity
    );

    window.location.href = "/checkout";
  };

  const handleToggleWishlist = () => {
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
        image: product.images?.[0]?.url || "/images/placeholder.png",
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
        variant: "success",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.images?.[selectedImage]?.url || "/images/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  selectedImage === index ? "border-red-600" : "border-gray-200"
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.brand && (
            <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <p className="text-green-600 mt-1">
              You save {formatPrice(product.price - (product.discountPrice || product.price))} ({discountPercentage}%)
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {product.stock > 0 ? (
            <Badge variant="success" className="text-sm px-3 py-1">
              In Stock ({product.stock} available)
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Specifications</h3>
            <dl className="space-y-2">
              {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="w-1/3 text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="w-2/3 text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <Separator />

        {/* Quantity & Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant={isInCartAlready ? "secondary" : "default"}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isInCartAlready ? "Add More" : "Add to Cart"}
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              variant="outline"
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleWishlist}
              className={isInWishlistAlready ? "text-red-600 border-red-600" : ""}
            >
              <Heart className={`h-5 w-5 ${isInWishlistAlready ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-5 w-5 text-red-600" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5 text-red-600" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-5 w-5 text-red-600" />
            <span>Easy Returns</span>
          </div>
        </div>

        {/* SKU */}
        <p className="text-sm text-gray-500">
          SKU: <span className="font-medium">{product.sku}</span>
        </p>
      </div>
    </div>
  );
}

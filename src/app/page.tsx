import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  ArrowRight,
  Star,
} from "lucide-react";
import Image from "next/image";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getNewArrivals() {
  return db.product.findMany({
    where: { isActive: true, isNewArrival: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getPopularProducts() {
  return db.product.findMany({
    where: { isActive: true, isPopular: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { soldCount: "desc" },
  });
}

async function getDiscountProducts() {
  return db.product.findMany({
    where: { isActive: true, isDiscount: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true, parentId: null, slug: { in: ["mens-fashion", "womens-fashion", "shoes"] } },
    include: { children: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const [featuredProducts, newArrivals, popularProducts, discountProducts, categories] =
    await Promise.all([
      getFeaturedProducts(),
      getNewArrivals(),
      getPopularProducts(),
      getDiscountProducts(),
      getCategories(),
    ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Shop the Best Products in Nepal
            </h1>
            <p className="text-lg md:text-xl mb-8 text-red-100">
              Quality products, fast delivery across Nepal, secure eSewa payments, and easy cash on delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" variant="secondary" className="text-red-600">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/category/electronics">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Explore Electronics
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <div className="h-full w-full bg-gradient-to-l from-red-500/50 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-gray-50 border-b">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Truck className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-sm">Fast Delivery</h3>
                <p className="text-xs text-gray-500">Across Nepal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-sm">Secure Payment</h3>
                <p className="text-xs text-gray-500">eSewa & COD</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <CreditCard className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-sm">Easy Payment</h3>
                <p className="text-xs text-gray-500">Multiple options</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Headphones className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-sm">24/7 Support</h3>
                <p className="text-xs text-gray-500">Dedicated support</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link href="/shop">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <span className="text-red-600 font-bold text-2xl">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link href="/shop?filter=featured">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts as any} />
        </Container>
      </section>

      {/* Promotional Banner */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 md:p-12">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Special Offer!</h3>
                <p className="text-lg mb-4">Up to 50% off on selected items</p>
                <Link href="/shop?filter=discount">
                  <Button variant="secondary" className="text-red-600">
                    Shop Now
                  </Button>
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20">
                <Star className="h-48 w-48" />
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">New Arrivals</h3>
                <p className="text-lg mb-4">Check out the latest products</p>
                <Link href="/shop?filter=new">
                  <Button variant="secondary" className="text-blue-600">
                    Explore
                  </Button>
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20">
                <Star className="h-48 w-48" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link href="/shop?filter=new">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={newArrivals as any} />
        </Container>
      </section>

      {/* Popular Products */}
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Products</h2>
            <Link href="/shop?filter=popular">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={popularProducts as any} />
        </Container>
      </section>

      {/* Discount Products */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Discounted Products</h2>
            <Link href="/shop?filter=discount">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={discountProducts as any} />
        </Container>
      </section>

      {/* Customer Reviews */}
      <section className="py-12">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ram Sharma",
                location: "Kathmandu",
                comment:
                  "Excellent service! Products were delivered on time and in perfect condition. The eSewa payment was very convenient.",
                rating: 5,
              },
              {
                name: "Sita Thapa",
                location: "Pokhara",
                comment:
                  "Great quality products at reasonable prices. Customer support is very helpful. Highly recommended!",
                rating: 5,
              },
              {
                name: "Hari Prasad",
                location: "Biratnagar",
                comment:
                  "Fast delivery and easy returns. The website is very user-friendly. Will definitely shop again!",
                rating: 4,
              },
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&quot;{review.comment}&quot;</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Delivery Info */}
      <section className="py-12 bg-red-50">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Delivery Across Nepal
            </h2>
            <p className="text-gray-600">
              We deliver to all 77 districts of Nepal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="font-bold text-lg text-red-600 mb-2">
                Inside Kathmandu Valley
              </h3>
              <p className="text-2xl font-bold mb-1">Rs. 100</p>
              <p className="text-sm text-gray-500">Same day or next day delivery</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="font-bold text-lg text-red-600 mb-2">
                Outside Kathmandu Valley
              </h3>
              <p className="text-2xl font-bold mb-1">Rs. 150</p>
              <p className="text-sm text-gray-500">2-4 business days</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="font-bold text-lg text-red-600 mb-2">Remote Areas</h3>
              <p className="text-2xl font-bold mb-1">Rs. 250</p>
              <p className="text-sm text-gray-500">5-7 business days</p>
            </div>
          </div>
        </Container>
      </section>

      {/* eSewa Payment Info */}
      <section className="py-12">
        <Container>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Pay Securely with eSewa
                </h2>
                <p className="text-green-100">
                  Nepal&apos;s leading digital wallet. Fast, secure, and convenient payments.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm">Secure</p>
                </div>
                <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm">Available</p>
                </div>
                <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
                  <p className="text-2xl font-bold">Fast</p>
                  <p className="text-sm">Payment</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

import { Suspense } from "react";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Category } from "@/types";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
    filter?: string;
  }>;
}

async function getProducts(searchParams: ShopPageProps["searchParams"]) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  const where: any = { isActive: true };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { brand: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.brand) {
    where.brand = params.brand;
  }

  if (params.minPrice || params.maxPrice) {
    where.AND = where.AND || [];
    if (params.minPrice) {
      where.AND.push({ price: { gte: parseFloat(params.minPrice) } });
    }
    if (params.maxPrice) {
      where.AND.push({ price: { lte: parseFloat(params.maxPrice) } });
    }
  }

  if (params.rating) {
    where.rating = { gte: parseFloat(params.rating) };
  }

  if (params.filter) {
    switch (params.filter) {
      case "featured":
        where.isFeatured = true;
        break;
      case "new":
        where.isNewArrival = true;
        break;
      case "popular":
        where.isPopular = true;
        break;
      case "discount":
        where.isDiscount = true;
        break;
    }
  }

  let orderBy: any = { createdAt: "desc" };
  switch (params.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "popular":
      orderBy = { soldCount: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy,
      skip: offset,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

async function getBrands() {
  const products = await db.product.findMany({
    where: { isActive: true, brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
  });
  return products.map((p) => p.brand).filter(Boolean);
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [{ products, pagination }, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(),
  ]);

  const params = await searchParams;
  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const brandOptions = brands.map((b) => ({ label: b!, value: b! }));

  const buildUrl = (pageNum: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        sp.set(key, value);
      }
    });
    sp.set("page", pageNum.toString());
    return `/shop?${sp.toString()}`;
  };

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters
            categories={categoryOptions}
            brands={brandOptions}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {params.q
                  ? `Search results for "${params.q}"`
                  : params.filter
                  ? `${params.filter.charAt(0).toUpperCase() + params.filter.slice(1)} Products`
                  : "All Products"}
              </h1>
              <p className="text-gray-500">
                {pagination.total} products found
              </p>
            </div>
          </div>

          {/* Products */}
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            }
          >
            <ProductGrid products={products as Product[]} />
          </Suspense>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={buildUrl(pageNum)}
                    className={`px-4 py-2 rounded-md border ${
                      pageNum === pagination.page
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

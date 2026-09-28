import { Suspense } from "react";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

async function searchProducts(query: string, page: number = 1, limit: number = 12) {
  const where = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
      { brand: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");

  const { products, pagination } = await searchProducts(query, page);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-500 mb-8">
          {pagination.total} products found
        </p>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <ProductGrid products={products as any} />
        </Suspense>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <a
                  key={pageNum}
                  href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
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
    </Container>
  );
}

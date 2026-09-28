import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategory(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      children: true,
      products: {
        where: { isActive: true },
        include: { images: true, category: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description || `Shop ${category.name} products at Yato Shop`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const pageNum = parseInt(page || "1");
  const limit = 12;
  const products = category.products.slice((pageNum - 1) * limit, pageNum * limit);
  const totalPages = Math.ceil(category.products.length / limit);

  const buildUrl = (pageNum: number) => {
    return `/category/${slug}?page=${pageNum}`;
  };

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 mb-8">{category.description}</p>
        )}

        {category.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {category.children.map((child) => (
              <a
                key={child.id}
                href={`/category/${child.slug}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                {child.name}
              </a>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <>
            <ProductGrid products={products as any} />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <a
                      key={pageNum}
                      href={buildUrl(pageNum)}
                      className={`px-4 py-2 rounded-md border ${
                        pageNum === pageNum
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
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </Container>
  );
}

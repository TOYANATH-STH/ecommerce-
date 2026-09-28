import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return db.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      isActive: true,
    },
    include: { images: true, category: true },
    take: 4,
  });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription ||
      product.description.substring(0, 160),
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description.substring(0, 160),
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category?.name || "", href: `/category/${product.category?.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8">
        <ProductDetails product={product as any} />
      </div>

      {/* Product Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold">
                        {review.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.user?.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h4 className="font-semibold mb-1">{review.title}</h4>
                )}
                <p className="text-gray-600">{review.comment}</p>
                {review.isVerified && (
                  <span className="inline-block mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts as any} />
        </section>
      )}
    </Container>
  );
}

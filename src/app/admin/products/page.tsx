import { db } from "@/lib/db";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

async function getProducts() {
  return db.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{product.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(product.discountPrice || product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "destructive"}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.isActive ? "success" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/products/${product.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

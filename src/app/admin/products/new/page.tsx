"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    brand: "",
    sku: "",
    stock: "",
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isPopular: false,
    isDiscount: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          stock: parseInt(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      toast({
        title: "Product Created",
        description: "The product has been created successfully.",
        variant: "success",
      });

      router.push("/admin/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (NPR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="discountPrice">Discount Price (NPR)</Label>
              <Input
                id="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId">Category ID</Label>
              <Input
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="h-4 w-4"
              />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Popular</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDiscount}
                onChange={(e) => setFormData({ ...formData, isDiscount: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Discount</span>
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Product
        </Button>
      </form>
    </div>
  );
}

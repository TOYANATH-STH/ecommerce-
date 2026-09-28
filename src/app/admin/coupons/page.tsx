import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

async function getCoupons() {
  return db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Code</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Discount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Min Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Usage</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Expires</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : formatPrice(coupon.discountValue)}
                  </td>
                  <td className="px-6 py-4 text-sm">{formatPrice(coupon.minOrderAmount)}</td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.usageCount}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={coupon.isActive ? "success" : "secondary"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/coupons/${coupon.id}/edit`}>
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

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getOrders() {
  return db.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Payment</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[order.orderStatus]}>
                      {order.orderStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
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

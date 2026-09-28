import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

async function getOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { images: true } } },
      },
      address: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

const statusConfig = {
  PENDING: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  CONFIRMED: { icon: CheckCircle, color: "bg-blue-100 text-blue-800", label: "Confirmed" },
  PROCESSING: { icon: Package, color: "bg-purple-100 text-purple-800", label: "Processing" },
  SHIPPED: { icon: Truck, color: "bg-indigo-100 text-indigo-800", label: "Shipped" },
  DELIVERED: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Delivered" },
  CANCELLED: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Cancelled" },
  RETURNED: { icon: XCircle, color: "bg-gray-100 text-gray-800", label: "Returned" },
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getOrders(session.user.id);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Orders" }]}
      />

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">
            When you place an order, it will appear here.
          </p>
          <Link href="/shop">
            <Link href="/shop">
              <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700">
                Start Shopping
              </button>
            </Link>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.orderStatus as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="border rounded-lg p-6 bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold text-lg">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-lg text-red-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div>
                    <Badge className={`${status.color} flex items-center gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <p className="text-sm text-gray-500">
                        +{order.items.length - 4} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-end">
                  <Link href={`/orders/${order.id}`}>
                    <button className="text-red-600 hover:underline font-medium">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

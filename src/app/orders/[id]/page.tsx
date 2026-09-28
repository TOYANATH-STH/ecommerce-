import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CreditCard, Package, Truck } from "lucide-react";

async function getOrder(orderId: string, userId: string, userRole: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { include: { images: true } } },
      },
      address: true,
      payment: true,
      user: {
        select: { name: true, email: true, phone: true },
      },
    },
  });

  if (!order) {
    return null;
  }

  // Check authorization
  if (userRole !== "ADMIN" && order.userId !== userId) {
    return null;
  }

  return order;
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

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const order = await getOrder(params.id, session.user.id, session.user.role);

  if (!order) {
    notFound();
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <Badge className={statusColors[order.orderStatus]}>
            {order.orderStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-3 border-b last:border-0"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.address?.fullName}</p>
                  <p className="text-gray-600">
                    Ward No. {order.address?.wardNumber}, {order.address?.tole}
                    {order.address?.houseNumber && `, House No. ${order.address.houseNumber}`}
                  </p>
                  <p className="text-gray-600">
                    {order.address?.municipality}, {order.address?.district}
                  </p>
                  <p className="text-gray-600">{order.address?.province}</p>
                  <p className="text-gray-600">Phone: {order.address?.phone}</p>
                  {order.address?.landmark && (
                    <p className="text-gray-500 text-sm">
                      Landmark: {order.address.landmark}
                    </p>
                  )}
                  {order.address?.deliveryInstructions && (
                    <p className="text-gray-500 text-sm">
                      Instructions: {order.address.deliveryInstructions}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({order.couponCode})</span>
                      <span>-{formatPrice(order.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span>{formatPrice(order.deliveryCharge)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">
                      {order.paymentMethod === "ESEWA" ? "eSewa" : "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant={
                        order.paymentStatus === "PAID"
                          ? "success"
                          : order.paymentStatus === "FAILED"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-xs">{order.transactionId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Order Placed</span>
                  </div>
                  {order.orderStatus !== "PENDING" && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span>Order Confirmed</span>
                    </div>
                  )}
                  {["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.orderStatus) && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span>Processing</span>
                    </div>
                  )}
                  {["SHIPPED", "DELIVERED"].includes(order.orderStatus) && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span>Shipped</span>
                    </div>
                  )}
                  {order.orderStatus === "DELIVERED" && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span>Delivered</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

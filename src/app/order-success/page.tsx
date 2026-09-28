import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import Link from "next/link";

interface OrderSuccessPageProps {
  searchParams: {
    orderId?: string;
  };
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with Yato Shop. Your order has been received and is being processed.
        </p>

        {searchParams.orderId && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-2xl font-bold text-red-600">{searchParams.orderId}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4">
            <Package className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Order Confirmed</h3>
            <p className="text-sm text-gray-500">Your order is being prepared</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <Truck className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Shipping</h3>
            <p className="text-sm text-gray-500">Will ship within 1-2 days</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Payment</h3>
            <p className="text-sm text-gray-500">
              {searchParams.orderId ? "Payment pending" : "Cash on Delivery"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" size="lg">
              Track Order
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

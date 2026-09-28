import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PaymentFailedPageProps {
  searchParams: {
    orderId?: string;
    error?: string;
  };
}

export default function PaymentFailedPage({ searchParams }: PaymentFailedPageProps) {
  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">
          {searchParams.error
            ? `Error: ${searchParams.error}`
            : "We couldn't process your payment. Please try again or choose a different payment method."}
        </p>

        {searchParams.orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-bold">{searchParams.orderId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          {searchParams.orderId && (
            <Link href={`/checkout?orderId=${searchParams.orderId}`}>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}

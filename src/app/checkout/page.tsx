"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatPrice, getDeliveryCharge } from "@/lib/utils";
import { nepalProvinces } from "@/lib/nepal-data";
import {
  CreditCard,
  Banknote,
  ChevronRight,
  ChevronLeft,
  MapPin,
  User,
  Package,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const steps = [
  { id: 1, name: "Customer Info", icon: User },
  { id: 2, name: "Delivery Address", icon: MapPin },
  { id: 3, name: "Order Summary", icon: Package },
  { id: 4, name: "Payment", icon: CreditCard },
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    email: session?.user?.email || "",
  });

  // Address
  const [address, setAddress] = useState({
    province: "",
    district: "",
    municipality: "",
    wardNumber: 1,
    tole: "",
    houseNumber: "",
    landmark: "",
    deliveryInstructions: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"ESEWA" | "COD">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const deliveryCharge = address.district
    ? getDeliveryCharge(address.district)
    : 100;
  const total = subtotal - couponDiscount + deliveryCharge;

  const selectedProvince = nepalProvinces.find((p) => p.name === address.province);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          address,
          paymentMethod,
          couponCode: couponCode || undefined,
          cartItems: items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();

      if (paymentMethod === "ESEWA" && data.paymentUrl) {
        // Redirect to eSewa payment
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        Object.entries(data.formData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // COD - redirect to success page
        router.push(`/order-success?orderId=${data.order.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isActive
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? "text-red-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Customer Info */}
          {currentStep === 1 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={customerInfo.fullName}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    placeholder="98XXXXXXXX"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your 10-digit Nepali mobile number
                  </p>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Delivery Address */}
          {currentStep === 2 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <select
                      id="province"
                      value={address.province}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          province: e.target.value,
                          district: "",
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Province</option>
                      {nepalProvinces.map((province) => (
                        <option key={province.name} value={province.name}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <select
                      id="district"
                      value={address.district}
                      onChange={(e) =>
                        setAddress({ ...address, district: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      required
                      disabled={!address.province}
                    >
                      <option value="">Select District</option>
                      {selectedProvince?.districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="municipality">Municipality *</Label>
                    <Input
                      id="municipality"
                      value={address.municipality}
                      onChange={(e) =>
                        setAddress({ ...address, municipality: e.target.value })
                      }
                      placeholder="e.g., Kathmandu Metropolitan City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="wardNumber">Ward Number *</Label>
                    <Input
                      id="wardNumber"
                      type="number"
                      min={1}
                      max={36}
                      value={address.wardNumber}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          wardNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tole">Tole/Street *</Label>
                    <Input
                      id="tole"
                      value={address.tole}
                      onChange={(e) =>
                        setAddress({ ...address, tole: e.target.value })
                      }
                      placeholder="e.g., New Baneshwor"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="houseNumber">House Number</Label>
                    <Input
                      id="houseNumber"
                      value={address.houseNumber}
                      onChange={(e) =>
                        setAddress({ ...address, houseNumber: e.target.value })
                      }
                      placeholder="e.g., 123"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={address.landmark}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                    placeholder="e.g., Near City Mall"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                  <textarea
                    id="deliveryInstructions"
                    value={address.deliveryInstructions}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        deliveryInstructions: e.target.value,
                      })
                    }
                    placeholder="Any special delivery instructions..."
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Summary */}
          {currentStep === 3 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} x {formatPrice(item.discountPrice || item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice((item.discountPrice || item.price) * item.quantity)}
                    </p>
                  </div>
                ))}

                {/* Coupon */}
                <div className="pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code (optional)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (couponCode.toUpperCase() === "DASH10") {
                          setCouponDiscount(subtotal * 0.1);
                          toast({
                            title: "Coupon Applied",
                            variant: "success",
                          });
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "ESEWA"
                      ? "border-red-600 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ESEWA"
                    checked={paymentMethod === "ESEWA"}
                    onChange={() => setPaymentMethod("ESEWA")}
                    className="h-4 w-4 text-red-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">eSewa</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Pay securely with your eSewa wallet
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-red-600 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="h-4 w-4 text-red-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Pay when your order is delivered
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "ESEWA"
                  ? `Pay ${formatPrice(total)} with eSewa`
                  : "Place Order"}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

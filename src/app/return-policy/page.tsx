import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function ReturnPolicyPage() {
  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Return & Refund Policy" }]}
      />

      <div className="mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Return Policy</h2>
          <p className="text-gray-600 mb-6">
            We want you to be completely satisfied with your purchase. If you&apos;re not
            happy with your order, we offer easy returns within 7 days of delivery.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">Eligibility for Returns</h3>
          <p className="text-gray-600 mb-4">To be eligible for a return, your item must be:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Unused and in the same condition that you received it</li>
            <li>In the original packaging with all tags attached</li>
            <li>Accompanied by the receipt or proof of purchase</li>
            <li>Returned within 7 days of delivery</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Non-Returnable Items</h3>
          <p className="text-gray-600 mb-4">The following items cannot be returned:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Grocery and perishable items</li>
            <li>Personal care products (for hygiene reasons)</li>
            <li>Items marked as &quot;Non-Returnable&quot; on the product page</li>
            <li>Gift cards</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Return Process</h2>
          <p className="text-gray-600 mb-4">To initiate a return, please follow these steps:</p>
          <ol className="list-decimal pl-6 text-gray-600 space-y-2 mb-6">
            <li>Contact our support team via email or phone</li>
            <li>Provide your order number and reason for return</li>
            <li>Our team will provide you with a return authorization and instructions</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Ship the item to the provided address or wait for pickup</li>
          </ol>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Refund Policy</h2>
          <p className="text-gray-600 mb-6">
            Once your return is received and inspected, we will send you an email to
            notify you of the approval or rejection of your refund.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">Approved Refunds</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>eSewa payments: Refund will be processed to your eSewa account within 5-7 business days</li>
            <li>Cash on Delivery: Refund will be processed via bank transfer within 7-10 business days</li>
            <li>Original delivery charges are non-refundable</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Exchanges</h2>
          <p className="text-gray-600 mb-6">
            If you need to exchange a product for a different size, color, or variant, please
            contact our support team. We will guide you through the exchange process.
            Exchanges are subject to product availability.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Damaged or Defective Items</h2>
          <p className="text-gray-600 mb-6">
            If you receive a damaged or defective item, please contact us within 48 hours
            of delivery with photos of the damage. We will arrange a replacement or full
            refund, including delivery charges.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact Us</h2>
          <p className="text-gray-600 mb-6">
            For any questions about returns or refunds, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email:</strong> returns@yatoshop.com.np</p>
            <p><strong>Phone:</strong> +977-01-4567890</p>
            <p><strong>Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

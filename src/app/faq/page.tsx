import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add items to your cart, and proceed to checkout. Fill in your delivery address, select a payment method (eSewa or Cash on Delivery), and confirm your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently accept eSewa (Nepal's leading digital wallet) and Cash on Delivery (COD). More payment options will be added soon.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location: Inside Kathmandu Valley: 1-2 business days. Outside Kathmandu Valley: 2-4 business days. Remote areas: 5-7 business days.",
  },
  {
    question: "What are the delivery charges?",
    answer:
      "Delivery charges are: Inside Kathmandu Valley: Rs. 100. Outside Kathmandu Valley: Rs. 150. Remote areas: Rs. 250. Free delivery on orders above Rs. 2,000 inside Kathmandu Valley.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes, we offer easy returns within 7 days of delivery. The product must be unused and in its original packaging. Please contact our support team to initiate a return.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by logging into your account and visiting the 'My Orders' section. You'll see real-time updates on your order status.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard security measures. For eSewa payments, your transaction is processed through eSewa's secure payment gateway. We never store your payment details.",
  },
  {
    question: "Do you deliver outside Kathmandu Valley?",
    answer:
      "Yes, we deliver to all 77 districts of Nepal. Delivery charges and times vary based on your location.",
  },
  {
    question: "How do I use a coupon code?",
    answer:
      "Enter your coupon code in the 'Coupon Code' field during checkout and click 'Apply'. The discount will be automatically calculated and applied to your order total.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "If you receive a damaged product, please contact us within 48 hours with photos of the damage. We will arrange a replacement or refund as per our return policy.",
  },
];

export default function FAQPage() {
  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">
          Find answers to common questions about shopping with Yato Shop.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-red-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Can&apos;t find the answer you&apos;re looking for? Please contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </Container>
  );
}

import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <div className="mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            Yato Shop (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our website and services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Personal information (name, email address, phone number)</li>
            <li>Delivery address information</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Order history and preferences</li>
            <li>Communications with our support team</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Send promotional offers and newsletters (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and enhance security</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Information Sharing</h2>
          <p className="text-gray-600 mb-6">
            We do not sell, trade, or rent your personal information to third parties.
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Delivery partners to fulfill your orders</li>
            <li>Payment processors to process transactions</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. All payment
            transactions are processed through secure, PCI-compliant payment gateways.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use cookies and similar tracking technologies to enhance your browsing
            experience, analyze site traffic, and understand user behavior. You can control
            cookie settings through your browser preferences.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email:</strong> privacy@yatoshop.com.np</p>
            <p><strong>Phone:</strong> +977-01-4567890</p>
            <p><strong>Address:</strong> New Baneshwor, Kathmandu, Nepal</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

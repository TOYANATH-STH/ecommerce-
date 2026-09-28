import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function TermsPage() {
  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
      />

      <div className="mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using Yato Shop, you accept and agree to be bound by these
            Terms and Conditions. If you do not agree to these terms, please do not use
            our website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Website</h2>
          <p className="text-gray-600 mb-4">You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Use the website in any way that violates any applicable laws</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in any conduct that restricts or inhibits anyone&apos;s use of the website</li>
            <li>Attempt to gain unauthorized access to any portion of the website</li>
            <li>Use any robot, spider, or other automatic device to access the website</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Products and Pricing</h2>
          <p className="text-gray-600 mb-6">
            We strive to provide accurate product descriptions and pricing. However, we do
            warrant that product descriptions or other content on this website are accurate,
            complete, or error-free. We reserve the right to correct any errors and to
            change or update information at any time without prior notice.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Orders and Payment</h2>
          <p className="text-gray-600 mb-6">
            All orders are subject to acceptance and availability. We reserve the right to
            refuse or cancel any order for any reason. Payment must be received in full
            before orders are processed and shipped. We accept eSewa and Cash on Delivery.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Delivery</h2>
          <p className="text-gray-600 mb-6">
            Delivery times are estimates and not guaranteed. We are not responsible for
            delays caused by circumstances beyond our control. Risk of loss and title for
            items purchased pass to you upon delivery.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Returns and Refunds</h2>
          <p className="text-gray-600 mb-6">
            Please refer to our Return & Refund Policy for detailed information about
            returns, exchanges, and refunds.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on this website, including text, graphics, logos, images, and
            software, is the property of Yato Shop and is protected by copyright and other
            intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            Yato Shop shall not be liable for any indirect, incidental, special, or
            consequential damages arising out of or in connection with your use of the
            website or services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these Terms and Conditions at any time. Changes
            will be effective immediately upon posting to the website. Your continued use
            of the website constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Information</h2>
          <p className="text-gray-600 mb-6">
            For any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email:</strong> legal@yatoshop.com.np</p>
            <p><strong>Phone:</strong> +977-01-4567890</p>
            <p><strong>Address:</strong> New Baneshwor, Kathmandu, Nepal</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

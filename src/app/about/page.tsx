import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Users, Target, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div className="mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">About Yato Shop</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Yato Shop is Nepal&apos;s premier online shopping destination, committed to providing
            quality products, exceptional customer service, and a seamless shopping experience
            to customers across all 77 districts of Nepal.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded in 2024, Yato Shop was born from a simple idea: to make online shopping
            accessible, reliable, and enjoyable for everyone in Nepal. We understand the unique
            challenges of e-commerce in Nepal, from diverse geography to varying levels of
            digital infrastructure, and we&apos;ve built our platform to address these challenges
            head-on.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To empower Nepali consumers with access to quality products at fair prices,
            while providing local businesses with a platform to reach customers across the
            country. We aim to bridge the gap between urban and rural Nepal through reliable
            delivery and secure digital payments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-red-50 p-6 rounded-lg">
              <Target className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To become Nepal&apos;s most trusted e-commerce platform, known for quality,
                reliability, and customer satisfaction.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <Users className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Our Team</h3>
              <p className="text-gray-600">
                A dedicated team of professionals committed to providing the best shopping
                experience for our customers.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <Award className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product on our platform is carefully selected and quality-checked to
                ensure customer satisfaction.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <Heart className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Customer First</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to exceed
                expectations at every touchpoint.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Wide selection of quality products from trusted brands</li>
            <li>Fast and reliable delivery across all 77 districts of Nepal</li>
            <li>Secure payment options including eSewa and Cash on Delivery</li>
            <li>Easy returns and refunds within 7 days</li>
            <li>Dedicated customer support available 24/7</li>
            <li>Competitive prices with regular discounts and offers</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            We&apos;d love to hear from you! Whether you have a question, feedback, or need
            assistance with an order, our team is here to help.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email:</strong> support@yatoshop.com.np</p>
            <p><strong>Phone:</strong> +977-01-4567890</p>
            <p><strong>Address:</strong> New Baneshwor, Kathmandu, Nepal</p>
            <p><strong>Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon.",
        variant: "success",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">
          Have a question or need help? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={6}
                  className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-500">
                      New Baneshwor, Kathmandu, Nepal
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-500">+977-01-4567890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">support@yatoshop.com.np</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-500">
                      Sunday - Friday
                      <br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available to help you with any questions or issues.
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

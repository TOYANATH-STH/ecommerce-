"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setIsSubmitted(true);
      toast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
          <p className="text-gray-500 mb-6">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <Link href="/login">
            <Button variant="outline">Back to Login</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-gray-500 mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-red-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </Container>
  );
}

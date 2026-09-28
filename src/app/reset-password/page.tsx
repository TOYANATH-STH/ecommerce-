"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { useToast } from "@/hooks/use-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "No reset token provided.",
        variant: "destructive",
      });
      router.push("/forgot-password");
      return;
    }

    // Validate token
    fetch(`/api/auth/reset-password?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setIsValid(true);
        } else {
          toast({
            title: "Invalid or Expired Link",
            description: data.error || "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          router.push("/forgot-password");
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to validate reset link.",
          variant: "destructive",
        });
        router.push("/forgot-password");
      })
      .finally(() => setIsValidating(false));
  }, [token, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. Please log in.",
          variant: "success",
        });
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Validating reset link...</p>
        </div>
      </Container>
    );
  }

  if (!isValid) {
    return null;
  }

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
          <p className="text-gray-500 text-center mb-6">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

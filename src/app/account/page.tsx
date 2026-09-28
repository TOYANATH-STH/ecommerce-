import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Package, Heart, Settings } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
      />

      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">
                  {session.user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">{session.user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{session.user.role}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{session.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>Not provided</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/orders">
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Orders</h3>
                    <p className="text-sm text-gray-500">Track and view your orders</p>
                  </div>
                </div>
              </Link>

              <Link href="/wishlist">
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Wishlist</h3>
                    <p className="text-sm text-gray-500">View saved items</p>
                  </div>
                </div>
              </Link>

              <Link href="/account/addresses">
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Addresses</h3>
                    <p className="text-sm text-gray-500">Manage delivery addresses</p>
                  </div>
                </div>
              </Link>

              <Link href="/account/settings">
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Account Settings</h3>
                    <p className="text-sm text-gray-500">Password and preferences</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

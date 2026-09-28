import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/addresses");
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "My Addresses" },
        ]}
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Home
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Default
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Ram Sharma</p>
                <p className="text-gray-600">
                  Ward No. 10, New Baneshwor
                </p>
                <p className="text-gray-600">
                  Kathmandu Metropolitan City, Kathmandu
                </p>
                <p className="text-gray-600">Bagmati Province</p>
                <p className="text-gray-600">Phone: 9841234567</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add New Address Card */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">Add New Address</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Add a new delivery address for faster checkout
              </p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Bell } from "lucide-react";

export default async function AccountSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/settings");
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Settings" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={session.user.name || ""} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={session.user.email} disabled />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="98XXXXXXXX" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive order updates via email
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive order updates via SMS
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotional Emails</p>
                <p className="text-sm text-gray-500">
                  Receive offers and promotions
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </label>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Yato Shop" />
            </div>
            <div>
              <Label htmlFor="siteEmail">Contact Email</Label>
              <Input id="siteEmail" type="email" defaultValue="support@yatoshop.com.np" />
            </div>
            <div>
              <Label htmlFor="sitePhone">Contact Phone</Label>
              <Input id="sitePhone" defaultValue="+977-01-4567890" />
            </div>
            <div>
              <Label htmlFor="siteAddress">Address</Label>
              <Input id="siteAddress" defaultValue="New Baneshwor, Kathmandu, Nepal" />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="insideKTM">Inside Kathmandu Valley (Rs.)</Label>
              <Input id="insideKTM" type="number" defaultValue="100" />
            </div>
            <div>
              <Label htmlFor="outsideKTM">Outside Kathmandu Valley (Rs.)</Label>
              <Input id="outsideKTM" type="number" defaultValue="150" />
            </div>
            <div>
              <Label htmlFor="remote">Remote Areas (Rs.)</Label>
              <Input id="remote" type="number" defaultValue="250" />
            </div>
          </CardContent>
        </Card>

        {/* eSewa Settings */}
        <Card>
          <CardHeader>
            <CardTitle>eSewa Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="esewaMerchant">Merchant ID</Label>
              <Input id="esewaMerchant" defaultValue="EPAYTEST" />
            </div>
            <div>
              <Label htmlFor="esewaSecret">Secret Key</Label>
              <Input id="esewaSecret" type="password" defaultValue="********" />
            </div>
            <div>
              <Label htmlFor="esewaProduct">Product Code</Label>
              <Input id="esewaProduct" defaultValue="EPAYTEST" />
            </div>
          </CardContent>
        </Card>

        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

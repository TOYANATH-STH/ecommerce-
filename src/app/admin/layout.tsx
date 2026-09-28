import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/coupons", label: "Coupons", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Welcome, {session.user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

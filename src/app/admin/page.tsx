import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

async function getDashboardStats() {
  const [
    totalSales,
    todaySales,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
  ] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    db.order.aggregate({
      _sum: { total: true },
      where: {
        paymentStatus: "PAID",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    db.order.count(),
    db.order.count({ where: { orderStatus: "PENDING" } }),
    db.order.count({ where: { orderStatus: "DELIVERED" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count(),
    db.product.count({ where: { stock: { lte: 10 } } }),
  ]);

  return {
    totalSales: totalSales._sum.total || 0,
    todaySales: todaySales._sum.total || 0,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Sales",
      value: formatPrice(stats.totalSales),
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Today's Sales",
      value: formatPrice(stats.todaySales),
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recent orders to display.</p>
        </CardContent>
      </Card>
    </div>
  );
}

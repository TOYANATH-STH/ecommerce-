import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      todaySales: todaySales._sum.total || 0,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

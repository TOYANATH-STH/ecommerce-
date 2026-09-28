import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await db.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

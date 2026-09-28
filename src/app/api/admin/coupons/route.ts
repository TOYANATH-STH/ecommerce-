import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { couponSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = couponSchema.parse(body);

    const coupon = await db.coupon.create({
      data: {
        ...validatedData,
        code: validatedData.code.toUpperCase(),
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create coupon error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

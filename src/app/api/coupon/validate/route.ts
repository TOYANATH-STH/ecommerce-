import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = validateSchema.parse(body);

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "This coupon is no longer active" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < coupon.startsAt || now > coupon.expiresAt) {
      return NextResponse.json(
        { error: "This coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of Rs. ${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.round(discount * 100) / 100,
      description: coupon.description,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

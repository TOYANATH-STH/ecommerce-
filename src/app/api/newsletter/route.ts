import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);

    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 200 }
      );
    }

    await db.newsletter.create({
      data: { email },
    });

    return NextResponse.json(
      { message: "Thank you for subscribing!" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

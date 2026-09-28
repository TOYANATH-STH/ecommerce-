import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    const category = await db.category.create({
      data: {
        ...validatedData,
        slug: validatedData.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create category error:", error);
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

    const categories = await db.category.findMany({
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

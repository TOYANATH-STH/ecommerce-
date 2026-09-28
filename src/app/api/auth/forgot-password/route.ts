import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json(
        { message: "If an account exists, a reset email has been sent" },
        { status: 200 }
      );
    }

    // Invalidate any existing reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // TODO: Integrate with email service (e.g., Resend, SendGrid, Nodemailer)
    // For now, log the reset link so it can be used in development
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    console.log(`Password reset link for ${user.email}: ${resetLink}`);

    return NextResponse.json(
      { message: "If an account exists, a reset email has been sent" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

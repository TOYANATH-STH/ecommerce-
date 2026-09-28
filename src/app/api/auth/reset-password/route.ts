import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided" });
    }

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: "Invalid token" });
    }

    if (new Date() > resetToken.expires) {
      // Clean up expired token
      await db.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json({ valid: false, error: "Token has expired" });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Reset password validation error:", error);
    return NextResponse.json({ valid: false, error: "Internal server error" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordCheck = resetPasswordSchema.safeParse({
      password,
      confirmPassword: password,
    });

    if (!passwordCheck.success) {
      return NextResponse.json(
        { error: passwordCheck.error.errors[0].message },
        { status: 400 }
      );
    }

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expires) {
      await db.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json(
        { error: "Token has expired. Please request a new reset link." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

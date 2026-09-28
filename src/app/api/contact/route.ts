import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // TODO: Integrate with email service (e.g., Resend, SendGrid, Nodemailer)
    // For now, log the submission so it can be reviewed
    console.log("Contact form submission:", {
      ...validatedData,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Message sent successfully. We will get back to you soon!" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

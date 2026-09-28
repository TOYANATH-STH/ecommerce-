import { NextResponse } from "next/server";
import { handleEsewaFailure } from "@/lib/esewa";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const transactionId = searchParams.get("transactionId");

    if (orderId && transactionId) {
      await handleEsewaFailure(orderId, transactionId);
    }

    return NextResponse.redirect(
      new URL(`/payment/failed?orderId=${orderId || ""}`, request.url)
    );
  } catch (error) {
    console.error("eSewa failure handler error:", error);
    return NextResponse.redirect(
      new URL("/payment/failed?error=server_error", request.url)
    );
  }
}

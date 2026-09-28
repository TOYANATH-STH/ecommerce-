import { NextResponse } from "next/server";
import { handleEsewaSuccess } from "@/lib/esewa";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const transactionId = searchParams.get("transactionId");
    const refId = searchParams.get("refId") || searchParams.get("referenceId");

    if (!orderId || !transactionId) {
      return NextResponse.redirect(
        new URL("/payment/failed?error=missing_params", request.url)
      );
    }

    const result = await handleEsewaSuccess(orderId, transactionId, refId || "");

    if (result.success) {
      return NextResponse.redirect(
        new URL(`/order-success?orderId=${orderId}`, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/payment/failed?orderId=${orderId}&error=${encodeURIComponent(result.message)}`, request.url)
      );
    }
  } catch (error) {
    console.error("eSewa success handler error:", error);
    return NextResponse.redirect(
      new URL("/payment/failed?error=server_error", request.url)
    );
  }
}

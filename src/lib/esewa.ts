import crypto from "crypto";
import { db } from "./db";
import { generateTransactionId } from "./utils";

const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "";
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_VERIFY_URL =
  process.env.ESEWA_VERIFY_URL ||
  "https://rc-epay.esewa.com.np/api/epay/transaction/status/";
const ESEWA_ENVIRONMENT = process.env.ESEWA_ENVIRONMENT || "sandbox";

export interface EsewaPaymentParams {
  orderId: string;
  amount: number;
  taxAmount?: number;
  productDeliveryCharge?: number;
  productServiceCharge?: number;
  totalAmount: number;
  productCode?: string;
  merchantId?: string;
  secretKey?: string;
  paymentUrl?: string;
  successUrl: string;
  failureUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface EsewaVerificationParams {
  productCode: string;
  transactionId: string;
  totalAmount: number;
}

export interface EsewaVerificationResponse {
  status: string;
  code: string;
  message: string;
  transactionId: string;
  orderId: string;
  amount: number;
  refId?: string;
}

export function generateEsewaSignature(
  totalAmount: number,
  transactionId: string,
  productCode: string = ESEWA_PRODUCT_CODE,
  secretKey: string = ESEWA_SECRET_KEY
): string {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionId},product_code=${productCode}`;
  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
}

export function createEsewaPaymentForm(params: EsewaPaymentParams) {
  const {
    orderId,
    amount,
    taxAmount = 0,
    productDeliveryCharge = 0,
    productServiceCharge = 0,
    totalAmount,
    productCode = ESEWA_PRODUCT_CODE,
    merchantId = ESEWA_MERCHANT_ID,
    secretKey = ESEWA_SECRET_KEY,
    paymentUrl = ESEWA_PAYMENT_URL,
    successUrl,
    failureUrl,
    customerName,
    customerEmail,
    customerPhone,
  } = params;

  const signature = generateEsewaSignature(
    totalAmount,
    orderId,
    productCode,
    secretKey
  );

  const formData = {
    amount: amount.toString(),
    tax_amount: taxAmount.toString(),
    total_amount: totalAmount.toString(),
    transaction_uuid: orderId,
    product_code: productCode,
    product_service_charge: productServiceCharge.toString(),
    product_delivery_charge: productDeliveryCharge.toString(),
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature,
    // Customer info
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
  };

  return {
    url: paymentUrl,
    method: "POST",
    formData,
  };
}

export async function verifyEsewaPayment(
  params: EsewaVerificationParams
): Promise<EsewaVerificationResponse> {
  const { productCode, transactionId, totalAmount } = params;

  try {
    const response = await fetch(
      `${ESEWA_VERIFY_URL}?product_code=${productCode}&transaction_uuid=${transactionId}&total_amount=${totalAmount}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ESEWA_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`eSewa verification failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: data.status || "UNKNOWN",
      code: data.code || "",
      message: data.message || "",
      transactionId: data.transaction_uuid || transactionId,
      orderId: data.order_id || "",
      amount: parseFloat(data.total_amount) || totalAmount,
      refId: data.ref_id || undefined,
    };
  } catch (error) {
    console.error("eSewa verification error:", error);
    throw new Error("Failed to verify payment with eSewa");
  }
}

export async function initiateEsewaPayment(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      address: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    throw new Error("Order is already paid");
  }

  const transactionId = generateTransactionId();

  // Update order with transaction ID
  await db.order.update({
    where: { id: orderId },
    data: { transactionId },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Calculate amounts according to eSewa specification:
  // total_amount = amount + tax_amount + product_service_charge + product_delivery_charge
  const amount = order.subtotal - order.couponDiscount; // Product amount after coupon discount
  const taxAmount = 0;
  const productServiceCharge = 0;
  const productDeliveryCharge = order.deliveryCharge;
  const totalAmount = amount + taxAmount + productServiceCharge + productDeliveryCharge;

  const paymentForm = createEsewaPaymentForm({
    orderId: transactionId,
    amount: amount,
    taxAmount: taxAmount,
    productDeliveryCharge: productDeliveryCharge,
    productServiceCharge: productServiceCharge,
    totalAmount: totalAmount,
    successUrl: `${appUrl}/api/payment/esewa/success?orderId=${orderId}&transactionId=${transactionId}`,
    failureUrl: `${appUrl}/api/payment/esewa/failure?orderId=${orderId}&transactionId=${transactionId}`,
    customerName: order.user.name,
    customerEmail: order.user.email,
    customerPhone: order.address.phone,
  });

  return paymentForm;
}

export async function handleEsewaSuccess(
  orderId: string,
  transactionId: string,
  refId: string
) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    return { success: true, message: "Payment already processed" };
  }

  // Verify the payment with eSewa
  const verification = await verifyEsewaPayment({
    productCode: ESEWA_PRODUCT_CODE,
    transactionId,
    totalAmount: order.total,
  });

  if (verification.status === "COMPLETE") {
    // Update payment status
    await db.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { orderId },
        create: {
          orderId,
          amount: order.total,
          method: "ESEWA",
          status: "PAID",
          transactionId,
          esewaRefId: refId,
          paidAt: new Date(),
        },
        update: {
          status: "PAID",
          transactionId,
          esewaRefId: refId,
          paidAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
        },
      });

      // Update product stock
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }
    });

    return { success: true, message: "Payment verified successfully" };
  }

  return { success: false, message: "Payment verification failed" };
}

export async function handleEsewaFailure(
  orderId: string,
  transactionId: string
) {
  await db.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amount: 0,
        method: "ESEWA",
        status: "FAILED",
        transactionId,
        failureReason: "Payment failed or cancelled by user",
      },
      update: {
        status: "FAILED",
        transactionId,
        failureReason: "Payment failed or cancelled by user",
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "FAILED",
      },
    });
  });

  return { success: false, message: "Payment failed" };
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber, getDeliveryCharge, calculateDiscount } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customerInfo, address, paymentMethod, couponCode, notes } = body;

    // Validate required fields
    if (!customerInfo?.fullName || !customerInfo?.phone || !customerInfo?.email) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 }
      );
    }

    if (!address?.province || !address?.district || !address?.municipality || !address?.tole) {
      return NextResponse.json(
        { error: "Complete delivery address is required" },
        { status: 400 }
      );
    }

    // Get cart items from request (sent from client)
    const cartItems = body.cartItems || [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals on server side (NEVER trust client amounts)
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || null,
      });
    }

    // Calculate coupon discount
    let couponDiscount = 0;
    let couponId = null;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.startsAt && now <= coupon.expiresAt) {
          if (subtotal >= coupon.minOrderAmount) {
            couponDiscount = calculateDiscount(
              subtotal,
              coupon.discountType,
              coupon.discountValue,
              coupon.maxDiscount
            );
            couponId = coupon.id;
            appliedCouponCode = coupon.code;

            // Increment usage count
            await db.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }
    }

    // Calculate delivery charge
    const deliveryCharge = getDeliveryCharge(address.district);

    // Calculate total
    const total = subtotal - couponDiscount + deliveryCharge;

    // Create or get address
    let addressRecord = await db.address.findFirst({
      where: {
        userId: session.user.id,
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        province: address.province,
        district: address.district,
        municipality: address.municipality,
        wardNumber: address.wardNumber,
        tole: address.tole,
      },
    });

    if (!addressRecord) {
      addressRecord = await db.address.create({
        data: {
          userId: session.user.id,
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          email: customerInfo.email,
          province: address.province,
          district: address.district,
          municipality: address.municipality,
          wardNumber: address.wardNumber,
          tole: address.tole,
          houseNumber: address.houseNumber || null,
          landmark: address.landmark || null,
          deliveryInstructions: address.deliveryInstructions || null,
        },
      });
    }

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId: addressRecord.id,
        subtotal,
        discount: couponDiscount,
        deliveryCharge,
        total,
        couponId,
        couponCode: appliedCouponCode,
        couponDiscount,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        notes: notes || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    // Create payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        method: paymentMethod,
        status: "PENDING",
      },
    });

    // If eSewa, generate payment form
    if (paymentMethod === "ESEWA") {
      const { initiateEsewaPayment } = await import("@/lib/esewa");
      const paymentForm = await initiateEsewaPayment(order.id);

      return NextResponse.json({
        order,
        paymentUrl: paymentForm.url,
        formData: paymentForm.formData,
      });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where: any = { userId: session.user.id };

    if (status) {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          items: {
            include: { product: { include: { images: true } } },
          },
          address: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import NextAuth from "next-auth";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const token = req.auth;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!token || token.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*", "/wishlist/:path*", "/checkout/:path*"],
};

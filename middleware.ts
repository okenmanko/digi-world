import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/catalog",
  "/cart",
  "/checkout",
  "/favorites",
  "/compare",
  "/profile",
  "/product",
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const auth = req.cookies.get("tg_auth");

  if (!auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/catalog/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/favorites/:path*",
    "/compare/:path*",
    "/profile/:path*",
    "/product/:path*",
  ],
};
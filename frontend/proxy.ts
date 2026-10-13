import { NextRequest, NextResponse } from "next/server";

// Routes that require an authenticated user
const PROTECTED_ROUTES = ["/dashboard", "/upload", "/my-sheets", "/settings"];

// Routes that should redirect to /dashboard when already logged in
const AUTH_ROUTES = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (isAuthRoute && token) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on these paths only (skip static assets, api routes, etc.)
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/my-sheets/:path*",
    "/settings/:path*",
    "/login",
  ],
};

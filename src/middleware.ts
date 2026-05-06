import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")||pathname.startsWith("/activate") || pathname.startsWith("/forget-password")||pathname.startsWith("/reset-password");

  if (token&&role) {
    // If authenticated and trying to access login/register, redirect to home
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If NOT authenticated and NOT on an auth page, redirect to login
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|firebase-messaging-sw.js|.*\\.svg|.*\\.png).*)",
  ],
};

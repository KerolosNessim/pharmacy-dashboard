import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Server Actions / RSC fetches must not be redirected — that causes "unexpected response" errors. */
function isInternalNextRequest(request: NextRequest) {
  return (
    request.method === "POST" ||
    request.headers.get("RSC") === "1" ||
    request.headers.has("Next-Action") ||
    request.headers.has("next-action") ||
    request.headers.has("Next-Router-State-Tree")
  );
}

export function middleware(request: NextRequest) {
  if (isInternalNextRequest(request)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/activate") ||
    pathname.startsWith("/forget-password") ||
    pathname.startsWith("/reset-password");

  if (token && role) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (!isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|firebase-messaging-sw.js|.*\\.svg|.*\\.png).*)",
  ],
};

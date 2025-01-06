// src/app/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude /character and its subpaths from the catch-all
  if (pathname.startsWith("/character")) {
    return NextResponse.next();
  }

  // Apply catch-all behavior to other routes if necessary
  // For example, redirect to a client-only app
  // return NextResponse.rewrite(new URL('/[[...slug]]', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
};

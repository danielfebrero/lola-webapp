// src/app/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /character and its subpaths to be handled normally (SSR)
  if (pathname.startsWith("/character")) {
    return NextResponse.next();
  }

  // Prevent rewriting if already in catch-all to avoid infinite loop
  if (pathname.startsWith("/[[...slug]]")) {
    return NextResponse.next();
  }

  // Rewrite all other routes to the catch-all [[...slug]] route
  // Example: /about → /[[...slug]]/about
  //          /blog/post-1 → /[[...slug]]/blog/post-1
  return NextResponse.rewrite(new URL(`/[[...slug]]${pathname}`, request.url));
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
};

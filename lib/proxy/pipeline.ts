import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAuthenticated } from "@/lib/auth/guard";
import { applySecurityHeaders } from "@/lib/proxy/secure_header"; 

const PROTECTED_ROUTES = [
  "/",
  "/products/cost-management",
  "/products/ingredients",
  "/products/packaging",
  "/products/finished-goods",
  "/orders",
  "/agents",
  "/promotions",
  "/users",
  "/departments",
  "/permission-groups",
  "/authorization",
];

export async function dispatchRoutePipeline(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 200 });
    return applySecurityHeaders(request, preflightResponse);
  }

  const pathname = request.nextUrl.pathname;
  let response: NextResponse;

  // Routing & Auth
  if (pathname === "/login" && request.method === "POST") {
    response = NextResponse.rewrite(new URL("/api/login", request.nextUrl));
  } else if (protectedRoute(pathname, PROTECTED_ROUTES)) {
    response = await ensureAuthenticated(request);
  } else {
    response = NextResponse.next();
  }

  return applySecurityHeaders(request, response);
}

function protectedRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}
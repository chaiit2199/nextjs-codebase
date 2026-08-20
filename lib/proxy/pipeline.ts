import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAuthenticated } from "@/lib/auth/guard";
import { applySecurityHeaders } from "@/lib/proxy/secure_header";
import { MENU } from "@/lib/dashboard/navbar";

const PROTECTED_ROUTES = MENU.flatMap((item) => [
  item.href, ...(item.children?.map((child) => child.href) ?? [])]).filter((href): href is string => Boolean(href));

export async function dispatchRoutePipeline(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 200 });
    return applySecurityHeaders(request, preflightResponse);
  }

  const pathname = request.nextUrl.pathname;
  let response: NextResponse;

  // Routing & Auth
  if (pathname === "/login" && request.method === "POST") {
    response = NextResponse.rewrite(new URL("/api/login", request.url));
  } else if (protectedRoute(pathname, PROTECTED_ROUTES)) {
    response = ensureAuthenticated(request);
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
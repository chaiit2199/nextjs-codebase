import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAuthenticated, redirectIfAuthenticated } from "@/lib/auth/authenticate";

const AUTHENTICATED_ROUTES = ["/admin", "/post"];
const GUEST_ROUTES = ["/login"];

export async function dispatchRoutePipeline(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" && request.method === "POST") {
    return NextResponse.rewrite(new URL("/api/login", request.url));
  }

  if (matchRoute(pathname, GUEST_ROUTES)) {
    return redirectIfAuthenticated(request);
  }

  if (matchRoute(pathname, AUTHENTICATED_ROUTES)) {
    return ensureAuthenticated(request);
  }

  return NextResponse.next();
}

function matchRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}

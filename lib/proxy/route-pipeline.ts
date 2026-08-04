// lib/proxy/route-pipeline.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAuthenticated } from "@/lib/auth/authenticate";

const AUTHENTICATED_ROUTES = ["/admin", "/post"];

export async function dispatchRoutePipeline(request: NextRequest) {

  const pathname = request.nextUrl.pathname;

  if (protectedRoute(pathname, AUTHENTICATED_ROUTES)) {
    return await ensureAuthenticated(request);
  }

  return NextResponse.next();
} 

function protectedRoute(pathname: string, routes: readonly string[]) : boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}
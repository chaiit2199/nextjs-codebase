import { NextRequest, NextResponse } from "next/server";

import { SESSION_KEY, SESSION_COOKIE_OPTIONS, decodeSession } from "@/lib/auth/session";

export function getBaseUrl(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";

  return `${protocol}://${host}`;
}

export function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", getBaseUrl(request)), 303);

  response.cookies.delete({
    name: SESSION_KEY,
    path: SESSION_COOKIE_OPTIONS.path,
  });

  return response;
}

export function ensureAuthenticated(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_KEY)?.value);

  if (!session.access_token || !session.refresh_token) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

import { NextRequest, NextResponse } from "next/server";

import { isAccessExpired, refreshSession } from "@/lib/auth/refresh";
import {
  SESSION_KEY,
  SESSION_COOKIE_OPTIONS,
  decodeSession,
  encodeSession,
} from "@/lib/auth/session";

export function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);

  response.cookies.delete({
    name: SESSION_KEY,
    path: SESSION_COOKIE_OPTIONS.path,
  });

  return response;
}

async function nextWithSession(session: Awaited<ReturnType<typeof decodeSession>>) {
  const response = NextResponse.next();
  response.cookies.set(SESSION_KEY, await encodeSession(session), SESSION_COOKIE_OPTIONS);
  return response;
}

export async function ensureAuthenticated(request: NextRequest) {
  const session = await decodeSession(request.cookies.get(SESSION_KEY)?.value);

  if (!session.refresh_token) {
    return redirectToLogin(request);
  }

  if (!session.access_token || isAccessExpired(session)) {
    const refreshed = await refreshSession(session.refresh_token);
    if (!refreshed) {
      return redirectToLogin(request);
    }

    return nextWithSession(refreshed);
  }

  return NextResponse.next();
}

import { NextRequest, NextResponse } from "next/server";

import { SESSION_KEY, SESSION_COOKIE_OPTIONS, decodeSession } from "@/lib/auth/session";


export function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);

  response.cookies.delete({
    name: SESSION_KEY,
    path: SESSION_COOKIE_OPTIONS.path,
  });

  return response;
}

export async function ensureAuthenticated(request: NextRequest) {
  const session = await decodeSession(request.cookies.get(SESSION_KEY)?.value);

  if (!session.access_token || !session.refresh_token) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

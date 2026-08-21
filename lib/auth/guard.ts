import { NextRequest, NextResponse } from "next/server";

import { SESSION_KEY, SESSION_COOKIE_OPTIONS, decodeSession } from "@/lib/auth/session";


export function redirectToLogin() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL), 303);

  response.cookies.delete({
    name: SESSION_KEY,
    path: SESSION_COOKIE_OPTIONS.path,
  });

  return response;
}

export function ensureAuthenticated(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_KEY)?.value);

  if (!session.access_token || !session.refresh_token) {
    return redirectToLogin();
  }

  return NextResponse.next();
}

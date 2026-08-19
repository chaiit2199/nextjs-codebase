import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/http/client";

import { SESSION_KEY, SESSION_COOKIE_OPTIONS, encodeSession } from "@/lib/auth/session";
import { redirectToLogin } from "@/lib/auth/guard";

type AuthTokens = {
  data: {
    access_token: string;
    refresh_token: string;
  };
};

export async function login(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  try {
    const payload = await client.post<AuthTokens>("/api/v1/auth/login", { username, password });
    const response = NextResponse.redirect(new URL("/", request.url), 303);

    response.cookies.set(
      SESSION_KEY,
      encodeSession({
        access_token: payload.data.access_token,
        refresh_token: payload.data.refresh_token,
      }),
      SESSION_COOKIE_OPTIONS,
    );

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export async function logout(request: NextRequest) {
  return redirectToLogin(request);
}

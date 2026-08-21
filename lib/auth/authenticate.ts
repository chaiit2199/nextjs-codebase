import { NextRequest, NextResponse } from "next/server";
import { client, HttpError, type AuthTokenResponse } from "@/lib/http/client";

import { SESSION_KEY, SESSION_COOKIE_OPTIONS, encodeSession } from "@/lib/auth/session";
import { getBaseUrl, redirectToLogin } from "@/lib/auth/guard";
import { withFlash } from "@/lib/flash/cookie";

export async function login(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return withFlash(
      NextResponse.redirect(new URL("/login", baseUrl), 303),
      "error",
      "Thiếu tên đăng nhập hoặc mật khẩu",
    );
  }

  try {
    const payload = await client.post<AuthTokenResponse>("/api/v1/auth/login", { username, password });
    const response = NextResponse.redirect(new URL("/", baseUrl), 303);

    response.cookies.set(
      SESSION_KEY,
      encodeSession({
        access_token: payload.data.access_token,
        refresh_token: payload.data.refresh_token,
      }),
      SESSION_COOKIE_OPTIONS,
    );

    return withFlash(response, "success", "Đăng nhập thành công", 2000);
  } catch (error) {
    const message =
      error instanceof HttpError && error.status === 401
        ? "Tài khoản hoặc mật khẩu không chính xác"
        : "Không thể đăng nhập";

    return withFlash(
      NextResponse.redirect(new URL("/login", baseUrl), 303),
      "error",
      message,
      2000,
    );
  }
}

export async function logout(request: NextRequest) {
  return redirectToLogin(request);
}

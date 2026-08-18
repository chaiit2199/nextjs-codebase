import { NextRequest, NextResponse } from "next/server";

import { client, HttpError } from "@/lib/http/client";

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

type Session = {
  access_token?: string;
  refresh_token?: string;
};

const section_options = {
  store: "cookie",
  key: "_next_project_key",
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
} as const;

export async function ensureAuthenticated(request: NextRequest) {
  const session = get_session(request);
  const refreshToken = session.refresh_token;
  let accessToken = session.access_token;

  if (!accessToken) {
    return clearSession(request);
  }
  
  try {
    await client.get("/api/current_user", { accessToken });
    client.setBearerToken(accessToken);
    return NextResponse.next();
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== HttpError.Unauthorized) {
      throw error;
    }

    if (!refreshToken) {
      return clearSession(request);
    }

    try {
        client.put_header("x-device-id", get_device_id(request) ?? "");
        const tokens = await client.post<AuthTokens>("/api/refresh-token", {
            refresh_token: refreshToken,
        });

        accessToken = tokens.access_token;
        await client.get("/api/current_user", { accessToken });
        client.setBearerToken(accessToken);

        const response = NextResponse.next();
        return put_session(response, tokens.refresh_token, tokens.access_token);
    } catch(error) {
        if (!(error instanceof HttpError) || error.status !== HttpError.Unauthorized) {
            throw error;
      }

      return clearSession(request);
    }
  }
}

export async function login(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  client.put_header("x-device-id", get_device_id(request) ?? "");

  try {
    const data = await client.post<AuthTokens>("/api/login", { username, password });

    const response = NextResponse.redirect(new URL("/admin", request.url), 303);

    client.setBearerToken(data.access_token);
    return put_session(response, data.refresh_token, data.access_token);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }
}

export async function logout(request: NextRequest) {
  return clearSession(request);
}

function get_session(request: NextRequest): Session {
  if (section_options.store !== "cookie") {
    return {};
  }

  const raw = request.cookies.get(section_options.key)?.value;

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Session;
  } catch {
    return {};
  }
}

function put_session(response: NextResponse, refresh_token: string, access_token: string) {
  if (section_options.store === "cookie") {
    const { store: _store, key, ...cookieOptions } = section_options;

    response.cookies.set(
      key,
      Buffer.from(JSON.stringify({ access_token, refresh_token })).toString("base64url"),
      cookieOptions,
    );
  }

  return response;
}

function clearSession(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);

  if (section_options.store === "cookie") {
    response.cookies.delete({
      name: section_options.key,
      path: section_options.path,
    });
  }

  client.clearBearerToken();
  return response;
}

function get_device_id(request: NextRequest) {
  return request.cookies.get("device_id")?.value;
}
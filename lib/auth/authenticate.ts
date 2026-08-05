import { NextRequest, NextResponse } from "next/server";

import { client, HttpError } from "@/lib/http/client";

type AuthTokens = {
    message?: string;
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

const DEVICE_COOKIE = "device_id";

export async function ensureAuthenticated(request: NextRequest) {
    const session = get_session(request);
    const refreshToken = session.refresh_token;
    let accessToken = session.access_token;
    const deviceId = get_device_id(request);

    if (!accessToken) {
        return clearSession(request);
    }

    try {
        await client.get("/api/current_user", {
            accessToken,
            headers: deviceHeaders(deviceId),
        });
        client.setBearerToken(accessToken);
        return with_device_cookie(NextResponse.next(), request, deviceId);
    } catch (error) {
        if (!(error instanceof HttpError) || error.status !== HttpError.Unauthorized) {
            throw error;
        }

        if (!refreshToken) {
            return clearSession(request);
        }

        try {
            const tokens = await client.post<AuthTokens>(
                "/api/refresh-token",
                { refresh_token: refreshToken },
                { headers: deviceHeaders(deviceId) },
            );

            accessToken = tokens.access_token;
            await client.get("/api/current_user", {
                accessToken,
                headers: deviceHeaders(deviceId),
            });
            client.setBearerToken(accessToken);

            return with_device_cookie(
                put_session(NextResponse.next(), tokens.refresh_token, tokens.access_token),
                request,
                deviceId,
            );
        } catch (refreshError) {
            if (!(refreshError instanceof HttpError) || refreshError.status !== HttpError.Unauthorized) {
                throw refreshError;
            }

            return clearSession(request);
        }
    }
}

export async function redirectIfAuthenticated(request: NextRequest) {
    const session = get_session(request);
    const accessToken = session.access_token;

    if (!accessToken) {
        return NextResponse.next();
    }

    try {
        await client.get("/api/current_user", {
            accessToken,
            headers: deviceHeaders(get_device_id(request)),
        });
        return NextResponse.redirect(new URL("/admin", request.url));
    } catch {
        return NextResponse.next();
    }
}

export async function login(request: NextRequest) {
    const formData = await request.formData();
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const deviceId = get_device_id(request);

    try {
        const data = await client.post<AuthTokens>(
            "/api/login",
            { username, password },
            { headers: deviceHeaders(deviceId) },
        );
        const response = NextResponse.redirect(new URL("/admin", request.url), 303);

        client.setBearerToken(data.access_token);
        return with_device_cookie(
            put_session(response, data.refresh_token, data.access_token),
            request,
            deviceId,
        );
    } catch {
        return clearSession(request);
    }
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
    const session: Session = { access_token, refresh_token };

    if (section_options.store === "cookie") {
        const { store: _store, key, ...cookieOptions } = section_options;

        response.cookies.set(
            key,
            Buffer.from(JSON.stringify(session)).toString("base64url"),
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
    return request.cookies.get(DEVICE_COOKIE)?.value ?? crypto.randomUUID();
}

function deviceHeaders(deviceId: string) {
    return { "x-device-id": deviceId };
}

function with_device_cookie(response: NextResponse, request: NextRequest, deviceId: string) {
    if (!request.cookies.get(DEVICE_COOKIE)?.value) {
        response.cookies.set(DEVICE_COOKIE, deviceId, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    return response;
}

import { NextRequest, NextResponse } from "next/server";
import { client , HttpError } from "@/lib/http/client";

import {
    SESSION_KEY,
    SESSION_COOKIE_OPTIONS,
    encodeSession,
    decodeSession,
} from "@/lib/auth/session";

type AuthTokens = {
    data: {
        access_token: string;
        refresh_token: string;
    };
};

type UserInfo = {
    data: {
        user: {
            code: string;
            id: number;
            status: number;
            address: string;
            username: string;
            phone: string;
            full_name: string;
        }; 
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
        const response = NextResponse.redirect(new URL("/admin", request.url), 303);

        response.cookies.set(
            SESSION_KEY,
            encodeSession({access_token: payload.data.access_token, refresh_token: payload.data.refresh_token}),
            SESSION_COOKIE_OPTIONS,
        );

        return response;
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export async function logout(request: NextRequest) {
    return clearSession(request);
}

function clearSession(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/login", request.url), 303);

    response.cookies.delete({
        name: SESSION_KEY,
        path: SESSION_COOKIE_OPTIONS.path,
    });

    return response;
} 

export async function ensureAuthenticated(request: NextRequest) {
    const session = decodeSession(request.cookies.get(SESSION_KEY)?.value);
    
    if (!session.refresh_token || !session.access_token) {
        return clearSession(request);
    }
    
    try {
        await client.get<UserInfo>("/api/v1/me", {
            accessToken: session.access_token,
        });

        return NextResponse.next();
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
            return clearSession(request);
        }
        
        throw error;
    }
}
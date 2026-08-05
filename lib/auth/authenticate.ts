import { NextRequest, NextResponse } from "next/server";

import { client } from "@/lib/http/client";

type LoginResponse = {
    message: string;
    access_token: string;
    refresh_token: string;
};

const SESSION_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
} as const;

export async function ensureAuthenticated(request: NextRequest) {
  console.log(request, "ensureAuthenticated");
  if (false) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export async function login(request: NextRequest) {
    const formData = await request.formData();
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
  
    try {
        const data = await client.post<LoginResponse>("/api/login", { username, password });
    
        const response = NextResponse.redirect(new URL("/", request.url), 303);
    
        response.cookies.set("access_token", data.access_token, SESSION_OPTIONS);
        response.cookies.set("refresh_token", data.refresh_token, SESSION_OPTIONS);
    
        return response;
    } catch {
        
        return NextResponse.redirect(new URL("/login", request.url), 303);
    }
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_IFRAME = parseList(process.env.ALLOWED_IFRAME);
const ALLOWED_CORS_ORIGINS = parseList(process.env.ALLOWED_CORS_ORIGINS);

export function applySecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const requestOrigin = request.headers.get("origin");
  const parentOrigin = getOrigin(request.headers.get("referer"));

  if (ALLOWED_IFRAME.includes("*")) {
    response.headers.set("Content-Security-Policy", "frame-ancestors *;");
  } else if (parentOrigin && isAllowedHost(parentOrigin, ALLOWED_IFRAME)) {
    response.headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${parentOrigin};`
    );
  } else if (ALLOWED_IFRAME.length > 0) {
    response.headers.set("Content-Security-Policy", "frame-ancestors 'self';");
  } else {
    response.headers.set("X-Frame-Options", "DENY");
  }

  if (ALLOWED_CORS_ORIGINS.includes("*")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else if (requestOrigin && isAllowedHost(requestOrigin, ALLOWED_CORS_ORIGINS)) {
    response.headers.set("Access-Control-Allow-Origin", requestOrigin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function getOrigin(url: string | null): string | null {
  if (!url) return null;

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function isAllowedHost(origin: string, allowed: string[]): boolean {
  let hostname = origin;

  try {
    hostname = new URL(origin).hostname;
  } catch {
    hostname = origin;
  }

  return allowed.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

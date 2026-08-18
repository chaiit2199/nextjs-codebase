import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_IFRAME = parseList(process.env.ALLOWED_IFRAME);
const ALLOWED_CORS_ORIGINS = parseList(process.env.ALLOWED_CORS_ORIGINS);

export function applySecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const requestOrigin = request.headers.get("origin");
  const frameAncestors = toFrameAncestorSources(ALLOWED_IFRAME);

  if (frameAncestors.includes("*")) {
    response.headers.set("Content-Security-Policy", "frame-ancestors *;");
  } else if (frameAncestors.length > 0) {
    response.headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${frameAncestors.join(" ")};`
    );
  } else {
    response.headers.set("X-Frame-Options", "DENY");
  }

  if (ALLOWED_CORS_ORIGINS.includes("*")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else if (requestOrigin && isAllowedOrigin(requestOrigin, ALLOWED_CORS_ORIGINS)) {
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

function toFrameAncestorSources(domains: string[]): string[] {
  const sources: string[] = [];

  for (const domain of domains) {
    if (domain === "localhost" || domain === "127.0.0.1") {
      sources.push(
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://localhost:*",
        "https://127.0.0.1:*"
      );
      continue;
    }

    sources.push(domain);
  }

  return [...new Set(sources)];
}

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  let hostname = origin;

  try {
    hostname = new URL(origin).hostname;
  } catch {
    hostname = origin;
  }

  return allowed.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

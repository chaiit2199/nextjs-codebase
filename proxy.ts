import type { NextRequest } from "next/server";

import { dispatchRoutePipeline } from "@/lib/proxy/route-pipeline";

export function proxy(request: NextRequest) {
  console.log("Proxy:", request.nextUrl.pathname);

  return dispatchRoutePipeline(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
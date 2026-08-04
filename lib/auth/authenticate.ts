import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function ensureAuthenticated(request: NextRequest) {
  if (false) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
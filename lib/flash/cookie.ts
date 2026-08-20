import { NextResponse } from "next/server";

import {
  FLASH_COOKIE,
  FLASH_COOKIE_OPTIONS,
  createFlashPayload,
  encodeFlash,
  type FlashKind,
} from "@/lib/flash/flash";

export function withFlash(
  response: NextResponse,
  kind: FlashKind,
  message: string,
  duration?: number | null,
) {
  response.cookies.set(
    FLASH_COOKIE,
    encodeFlash(createFlashPayload(kind, message, duration)),
    FLASH_COOKIE_OPTIONS,
  );

  return response;
}

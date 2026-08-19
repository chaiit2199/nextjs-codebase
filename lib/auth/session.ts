import "server-only";

export const SESSION_KEY = "_next_project_key";

export const SESSION_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
} as const;

export type Session = {
  access_token?: string;
  refresh_token?: string;
};

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

export function decodeSession(raw: string | undefined): Session {
  if (!raw) return {};

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Session;
  } catch {
    return {};
  }
}

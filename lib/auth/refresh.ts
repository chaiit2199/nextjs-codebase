import axios from "axios";

import type { AuthTokenResponse } from "@/lib/auth/tokens";
import type { Session } from "@/lib/auth/session";

const REFRESH_BUFFER_MS = 60_000;

export function sessionFromAuthData(data: AuthTokenResponse["data"]): Session {
  const expiresIn = data.expires_in ?? 3600;

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    access_expires_at: Date.now() + expiresIn * 1000,
  };
}

export function isAccessExpired(session: Session): boolean {
  if (!session.access_token) return true;
  if (!session.access_expires_at) return true;
  return Date.now() >= session.access_expires_at - REFRESH_BUFFER_MS;
}

export async function refreshSession(refreshToken: string): Promise<Session | null> {
  const apiUrl = process.env.BASE_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await axios.post<AuthTokenResponse>(
      `${apiUrl}/api/v1/auth/refresh-token`,
      { refresh_token: refreshToken },
      {
        timeout: 5_000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    const data = response.data?.data;
    if (!data?.access_token) return null;

    return sessionFromAuthData({
      ...data,
      refresh_token: data.refresh_token ?? refreshToken,
    });
  } catch {
    return null;
  }
}

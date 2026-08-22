import "server-only";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

import { refreshSession } from "@/lib/auth/refresh";
import {
  SESSION_KEY,
  encodeSession,
  decodeSession,
  sessionCookieOptions,
  type Session,
} from "@/lib/auth/session";

export type { AuthTokenData, AuthTokenResponse } from "@/lib/auth/tokens";

export type HttpRequestOptions = Omit<AxiosRequestConfig, "url" | "method" | "data"> & {
  accessToken?: string;
};

const AUTH_SKIP_REFRESH = ["/api/v1/auth/login", "/api/v1/auth/refresh-token"];

function isAuthSkipRefresh(url?: string) {
  return AUTH_SKIP_REFRESH.some((path) => url?.includes(path));
}

export class HttpError extends Error {
  static readonly Unauthorized = 401;

  constructor(
    message: string,
    public readonly status?: number,
    public readonly data?: unknown,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class Client {
  private readonly instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }

  private async readSession(): Promise<Session> {
    try {
      const cookieStore = await cookies();
      return await decodeSession(cookieStore.get(SESSION_KEY)?.value);
    } catch {
      return {};
    }
  }

  private async writeSession(session: Session): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      cookieStore.set(
        SESSION_KEY,
        await encodeSession(session),
        sessionCookieOptions(process.env.NODE_ENV === "production"),
      );
      return true;
    } catch {
      // Server Components cannot mutate cookies — proxy persists refreshed tokens.
      return false;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const session = await this.readSession();
    const refreshToken = session.refresh_token;

    if (!refreshToken) return null;

    const tokens = await refreshSession(refreshToken);
    if (!tokens) return null;

    await this.writeSession(tokens);
    return tokens.access_token ?? null;
  }

  private async request<TResponse, TBody = unknown>(
    method: AxiosRequestConfig["method"],
    url: string,
    data?: TBody,
    options: HttpRequestOptions = {},
    isRetry = false,
  ): Promise<TResponse> {
    const { accessToken: explicitToken, headers, ...requestConfig } = options;

    const skipAuthHeader = isAuthSkipRefresh(typeof url === "string" ? url : undefined);
    const token = skipAuthHeader
      ? undefined
      : (explicitToken ?? (await this.readSession()).access_token);

    try {
      const response = await this.instance.request<TResponse>({
        ...requestConfig,
        method,
        url,
        data,
        headers: {
          ...headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      const httpError = toHttpError(error);

      if (
        !isRetry &&
        httpError.status === HttpError.Unauthorized &&
        !skipAuthHeader
      ) {
        const newAccessToken = await this.refreshAccessToken();

        if (newAccessToken) {
          return this.request<TResponse, TBody>(
            method,
            url,
            data,
            { ...options, accessToken: newAccessToken },
            true,
          );
        }
      }

      throw httpError;
    }
  }

  get<TResponse>(url: string, options?: HttpRequestOptions) {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  post<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions) {
    return this.request<TResponse, TBody>("POST", url, body, options);
  }

  put<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions) {
    return this.request<TResponse, TBody>("PUT", url, body, options);
  }

  patch<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions) {
    return this.request<TResponse, TBody>("PATCH", url, body, options);
  }

  delete<TResponse = void>(url: string, options?: HttpRequestOptions) {
    return this.request<TResponse>("DELETE", url, undefined, options);
  }
}

function toHttpError(error: unknown): HttpError {
  if (!axios.isAxiosError(error)) {
    return new HttpError(error instanceof Error ? error.message : "Unknown HTTP error");
  }

  const responseData = error.response?.data;
  const message =
    extractServerMessage(responseData) || error.message || "HTTP request failed";

  return new HttpError(message, error.response?.status, responseData, error.code);
}

function extractServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const body = data as Record<string, unknown>;
  const nested = body.data;
  const nestedRecord =
    nested && typeof nested === "object" ? (nested as Record<string, unknown>) : undefined;

  return (
    readMessage(body.message) ||
    readMessage(body.error) ||
    readMessage(nestedRecord?.message) ||
    readMessage(nestedRecord?.error)
  );
}

function readMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const joined = value.filter((item) => typeof item === "string").join(", ");
    return joined || undefined;
  }
  if (value && typeof value === "object" && "message" in value) {
    return readMessage((value as { message: unknown }).message);
  }
  return undefined;
}

const apiUrl = process.env.BASE_API_URL;

export const client = new Client({
  baseURL: apiUrl,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
});

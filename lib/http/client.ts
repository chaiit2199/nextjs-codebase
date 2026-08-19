import "server-only";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

import {
  SESSION_KEY,
  SESSION_COOKIE_OPTIONS,
  encodeSession,
  decodeSession,
  type Session,
} from "@/lib/auth/session";

export type HttpRequestOptions = Omit<AxiosRequestConfig, "url" | "method" | "data"> & {
  accessToken?: string;
};

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

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
      return decodeSession(cookieStore.get(SESSION_KEY)?.value);
    } catch {
      return {};
    }
  }

  private async writeSession(session: Session): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_KEY, encodeSession(session), SESSION_COOKIE_OPTIONS);
    } catch {
      // Server Components / Middleware không được phép ghi cookie
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const session = await this.readSession();

    if (!session.refresh_token) return null;

    try {
      const response = await axios.post<AuthTokens>(
        `${this.instance.defaults.baseURL}/api/refresh-token`,
        { refresh_token: session.refresh_token },
        { timeout: 5_000 },
      );

      const tokens = response.data;

      await this.writeSession({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });

      return tokens.access_token;
    } catch {
      return null;
    }
  }

  private async request<TResponse, TBody = unknown>(
    method: AxiosRequestConfig["method"],
    url: string,
    data?: TBody,
    options: HttpRequestOptions = {},
    isRetry = false,
  ): Promise<TResponse> {
    const { accessToken: explicitToken, headers, ...requestConfig } = options;

    const token = explicitToken ?? (await this.readSession()).access_token;

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

      if (!isRetry && httpError.status === HttpError.Unauthorized) {
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
  let serverMessage: string | undefined;

  if (responseData && typeof responseData === "object") {
    if ("message" in responseData && responseData.message) {
      serverMessage = Array.isArray(responseData.message)
        ? responseData.message.join(", ")
        : String(responseData.message);
    } else if ("error" in responseData && typeof responseData.error === "string") {
      serverMessage = responseData.error;
    }
  }

  const message = serverMessage || error.message || "HTTP request failed";

  return new HttpError(message, error.response?.status, responseData, error.code);
}

const apiUrl = process.env.BASE_API_URL;

if (!apiUrl && process.env.NODE_ENV === "production") {
  console.warn("BASE_API_URL is not defined in environment variables");
}

export const client = new Client({
  baseURL: apiUrl,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

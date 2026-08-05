import "server-only";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export type HttpRequestOptions = Omit<AxiosRequestConfig, "url" | "method" | "data"> & {
  accessToken?: string;
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
    }
}

export class Client {
    private readonly instance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }

    put_header(key: string, value: string): void {
        this.instance.defaults.headers.common[key] = value;
    }

    setBearerToken(token: string): void {
        this.put_header("Authorization", `Bearer ${token}`);
    }

    clearBearerToken(): void {
        delete this.instance.defaults.headers.common["Authorization"];
    }

    private async request<TResponse, TBody = unknown>(
        method: AxiosRequestConfig["method"], 
        url: string, data?: TBody, 
        options: HttpRequestOptions = {}): Promise<TResponse> {

        const { accessToken, headers, ...requestConfig } = options;

        try {
        const response = await this.instance.request<TResponse>({
            ...requestConfig,
            method,
            url,
            data,
            headers: {
            ...headers,
            // Nếu có truyền accessToken riêng trong options thì sẽ ghi đè header mặc định
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
        });

        return response.data;
        } catch (error) {
            
        throw toHttpError(error);
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
    const serverMessage =
        responseData && typeof responseData === "object" && "message" in responseData
        ? String(responseData.message)
        : undefined;

    const message = serverMessage || error.message || "HTTP request failed";

    return new HttpError(message, error.response?.status, responseData, error.code);
}

const apiUrl = process.env.PHOENIX_API_URL ?? "http://localhost:4000";

export const client = new Client({
    baseURL: apiUrl,
    timeout: 10_000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
import "server-only";

/**
 * HTTP debug log — chỉ chạy khi `npm run dev` (NODE_ENV=development).
 * Production luôn tắt, kể cả khi set DEBUG_HTTP_LOG=1.
 * Trong dev, set DEBUG_HTTP_LOG=0 để tắt tạm.
 */
const enabled =
  process.env.NODE_ENV === "development" && process.env.DEBUG_HTTP_LOG !== "0";

export function isHttpDebugEnabled() {
  return enabled;
}

/** Gọi hàm trả về sau khi request xong, truyền status HTTP. */
export function startHttpDebugLog(method: string, url: string) {
  if (!enabled) {
    return (_status: number | string) => {};
  }

  const started = performance.now();

  return (status: number | string) => {
    const ms = Math.round(performance.now() - started);
    console.debug(`[debug] ${method} ${url} ${status} ${ms}ms`);
  };
}

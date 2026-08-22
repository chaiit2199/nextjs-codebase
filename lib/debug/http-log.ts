import "server-only";

/** Bật log HTTP phía server (terminal). Set DEBUG_HTTP_LOG=1 trong env. */
const enabled = process.env.DEBUG_HTTP_LOG === "1";

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

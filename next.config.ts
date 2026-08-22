import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  sassOptions: {
    silenceDeprecations: ["import", "legacy-js-api"],
  },

  // DEV ONLY
  allowedDevOrigins: ["10.161.68.41"],

  // PROD — whitelist origin cho Server Actions
  experimental: {
    serverActions: {
      allowedOrigins: ["yourdomain.com", "www.yourdomain.com"],
    },
  },
};

export default nextConfig;

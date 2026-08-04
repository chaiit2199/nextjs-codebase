import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",

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

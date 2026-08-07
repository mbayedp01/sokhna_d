import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Le projet est autonome : on ancre le tracing ici (évite de remonter aux lockfiles parents).
  outputFileTracingRoot: import.meta.dirname,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;

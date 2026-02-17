import type { NextConfig } from "next";

/**
 * Next.js configuration for the Institutional Guidance Graph.
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js
 *
 * Performance notes:
 * - reactStrictMode: catches side-effect bugs during development
 * - poweredByHeader: disabled to reduce response size and avoid fingerprinting
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 'standalone' output is only for the Docker image (see apps/web/Dockerfile).
  // On Vercel it makes the builder use Next's own file-tracing instead of
  // Vercel's monorepo-aware bundling, which drops required files from the
  // deployed function and crashes it at request time (FUNCTION_INVOCATION_FAILED).
  output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;

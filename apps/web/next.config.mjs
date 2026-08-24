/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @ilp/core is a local ESM workspace package; let Next transpile it.
  transpilePackages: ['@ilp/core'],
  // Type errors still fail the build (see `npm run typecheck`); ESLint is optional here.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

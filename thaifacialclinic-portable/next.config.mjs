/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic rendering (was: output: "export") — leads, auth, AI replies require server compute.
  images: { unoptimized: true },
  trailingSlash: true,
  typedRoutes: false,
};

export default nextConfig;

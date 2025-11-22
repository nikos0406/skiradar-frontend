/** @type {import("next").NextConfig} */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

const nextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

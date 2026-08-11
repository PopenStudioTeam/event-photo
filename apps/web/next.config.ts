import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/how-it-works",
        destination: "/for",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

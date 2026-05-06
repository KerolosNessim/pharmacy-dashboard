import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",

      },
      {
        protocol: "https",
        hostname: "pharmacy.subcodeco.com",
      },
      {
        protocol: "https",
        hostname: "mepharmacies.com",
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;

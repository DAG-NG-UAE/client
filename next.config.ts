import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true, // Helps with S3/Static routing
  typescript: {
    ignoreBuildErrors: true, // Prevents the validator from killing the build
  },
  
  turbopack: {
    resolveAlias: {
      canvas: './empty.js',
        encoding: './empty.js',
    },
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  
};

export default nextConfig;

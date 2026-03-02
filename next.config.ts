import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './empty.js',
        encoding: './empty.js',
    },
  },
  
};

export default nextConfig;

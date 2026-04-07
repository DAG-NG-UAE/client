/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // Helps with S3/Static routing
  typescript: {
    ignoreBuildErrors: true, // Prevents the validator from killing the build
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
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

module.exports = nextConfig;

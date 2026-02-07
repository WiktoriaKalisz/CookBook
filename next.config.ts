import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'hls.js': require.resolve('hls.js/dist/hls.js'),
    };
    return config;
  },
};

export default nextConfig;

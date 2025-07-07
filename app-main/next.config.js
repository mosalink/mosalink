const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        "bufferutil",
        "utf-8-validate",
        "supports-color",
      ];
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      "utf-8-validate": false,
      "supports-color": false,
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
});

module.exports = nextConfig;

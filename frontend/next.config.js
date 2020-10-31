var withPWA = require("next-pwa");
var cacheConfig = require("./components/utils/cacheConfig");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    runtimeCaching: cacheConfig,
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    iconSizes: [],
    domains: [
      process.env.NEXT_PUBLIC_API_URL.match(/http?s?:\/\/([^:]+)(\:\d+)?$/i)[1],
    ],
    loader: "default",
  },
});

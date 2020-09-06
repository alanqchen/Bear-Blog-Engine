var withPWA = require("next-pwa");
var cacheConfig = require("./components/utils/cacheConfig");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    runtimeCaching: cacheConfig,
  },
});

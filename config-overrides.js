const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Fallback for 'net' and 'tls' modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "net": false,
      "tls": false,
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
    };
    return config;
  }
);
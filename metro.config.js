const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle import warnings
config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver.assetExts || []), 'lottie'],
  extraNodeModules: {
    // Add fallbacks for problematic modules
    crypto: require.resolve('react-native-crypto'),
    stream: require.resolve('readable-stream'),
    buffer: require.resolve('buffer'),
  },
};

module.exports = config; 
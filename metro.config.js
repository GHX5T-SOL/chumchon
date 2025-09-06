const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver.assetExts || []), 'lottie'],
  extraNodeModules: {
    crypto: require.resolve('react-native-crypto'),
    stream: require.resolve('readable-stream'),
    buffer: require.resolve('buffer'),
  },
};

module.exports = config;
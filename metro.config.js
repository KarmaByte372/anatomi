// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D anatomi ağları (assets/anatomy/*.bin) uygulamaya varlık olarak paketlenir
config.resolver.assetExts.push('bin');

module.exports = config;

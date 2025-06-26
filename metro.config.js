// filepath: c:\Users\Hp\Desktop\proiectlicenta\HobbyConnect\metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  url: require.resolve('react-native-url-polyfill'),
};

module.exports = config;
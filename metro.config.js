const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure public path for GitHub Pages
config.transformer = {
  ...config.transformer,
  publicPath: '/Pflanzkalender/',
};

module.exports = config;

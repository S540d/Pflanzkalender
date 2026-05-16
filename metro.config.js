const { getDefaultConfig } = require('expo/metro-config');

// The GitHub Pages base path is handled by experiments.baseUrl in app.config.js,
// which Expo Router uses for both asset URLs and client-side route resolution.
module.exports = getDefaultConfig(__dirname);

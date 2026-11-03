// Dynamic Expo config. The static values (incl. version) stay in app.json so
// CI version-consistency checks (require('./app.json').expo.version) keep working.
// This layer adds Expo Router config and the GitHub Pages base path.
const baseUrl = '/Pflanzkalender';

module.exports = ({ config }) => ({
  ...config,
  scheme: 'pflanzkalender',
  plugins: [...(config.plugins ?? []), 'expo-router', 'expo-status-bar'],
  web: {
    ...config.web,
    output: 'single',
  },
  experiments: {
    ...config.experiments,
    baseUrl,
  },
});

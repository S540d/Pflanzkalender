// Dynamic Expo config. The static values (incl. version) stay in app.json so
// CI version-consistency checks (require('./app.json').expo.version) keep working.
// This layer adds Expo Router config and the GitHub Pages base path, switching
// to the testing subpath when TESTING=true (matches scripts/add-service-worker.js).
const isTesting = process.env.TESTING === 'true';
const baseUrl = isTesting ? '/Pflanzkalender-testing' : '/Pflanzkalender';

module.exports = ({ config }) => ({
  ...config,
  scheme: 'pflanzkalender',
  plugins: [...(config.plugins ?? []), 'expo-router'],
  web: {
    ...config.web,
    output: 'single',
  },
  experiments: {
    ...config.experiments,
    baseUrl,
  },
});

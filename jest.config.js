/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // jest-expo preset already sets the correct transformIgnorePatterns.
  // We extend it to also include firebase and react-native-svg.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|react-native-svg|firebase))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
  moduleNameMapper: {
    'react-native-svg': '<rootDir>/__mocks__/react-native-svg.js',
    '@react-native-async-storage/async-storage':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  setupFiles: [],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/services/firebase.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testTimeout: 10000,
};
